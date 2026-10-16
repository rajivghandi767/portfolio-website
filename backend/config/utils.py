import socket
from contextlib import closing


def is_service_available(host: str, port: int, timeout: int = 1) -> bool:
    """
    Executes a socket connection test to verify if downstream services
    (like Postgres or Redis) are actively accepting connections.
    """
    if not host or not port:
        return False
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.settimeout(timeout)
        try:
            return sock.connect_ex((host, int(port))) == 0
        except (socket.gaierror, TypeError):
            return False


def ensure_image_dimensions(
    instance: object,
    image_field_name: str,
    width_attr: str = "image_width",
    height_attr: str = "image_height",
) -> None:
    """
    Safely inspects an image file to guarantee that image_width and image_height
    are populated before persisting to the database, preventing subsequent remote
    storage downloads during model initialization.
    """
    file = getattr(instance, image_field_name, None)
    if not file:
        return

    current_w = getattr(instance, width_attr, None)
    current_h = getattr(instance, height_attr, None)
    if current_w and current_h:
        return

    try:
        from django.core.files.images import get_image_dimensions

        dims = get_image_dimensions(file)
        if dims and dims[0] and dims[1]:
            setattr(instance, width_attr, dims[0])
            setattr(instance, height_attr, dims[1])
    except Exception:
        pass

