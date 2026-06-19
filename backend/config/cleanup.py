from __future__ import annotations

from typing import Any

from django.db.models.signals import pre_save, post_delete
from django.db.models import FileField, Model
from django.core.files.storage import default_storage


def _delete_file(file_name: str) -> None:
    try:
        if file_name and default_storage.exists(file_name):
            default_storage.delete(file_name)
    except Exception:
        pass


def setup_cleanup_signals() -> None:
    """
    Dynamically attaches pre_save and post_delete signals to all models
    that have FileField or ImageField.

    pre_save: Deletes the old file from GCS if the field is cleared or a new file is uploaded.
    post_delete: Deletes the file from GCS if the model instance is deleted.
    """
    from django.apps import apps

    for model in apps.get_models():
        file_fields = [f for f in model._meta.fields if isinstance(f, FileField)]
        if not file_fields:
            continue

        def make_delete_old_file(fields: list) -> Any:
            def delete_old_file_on_save(sender: Any, instance: Any, **kwargs: Any) -> None:
                if not instance.pk:
                    return

                try:
                    old_instance = sender.objects.get(pk=instance.pk)
                except sender.DoesNotExist:
                    return

                for field in fields:
                    old_file = getattr(old_instance, field.name)
                    new_file = getattr(instance, field.name)

                    if old_file and old_file != new_file:
                        _delete_file(old_file.name)
            return delete_old_file_on_save

        def make_delete_file_on_delete(fields: list) -> Any:
            def delete_file_on_delete(sender: Any, instance: Any, **kwargs: Any) -> None:
                for field in fields:
                    file_field = getattr(instance, field.name)
                    if file_field:
                        _delete_file(file_field.name)
            return delete_file_on_delete

        # Connect signals
        pre_save.connect(
            make_delete_old_file(file_fields),
            sender=model,
            dispatch_uid=f"{model.__name__}_cleanup_pre_save",
        )
        post_delete.connect(
            make_delete_file_on_delete(file_fields),
            sender=model,
            dispatch_uid=f"{model.__name__}_cleanup_post_delete",
        )
