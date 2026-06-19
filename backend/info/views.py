from __future__ import annotations

import html
import logging
from typing import Any, Union

from django.http import FileResponse, HttpRequest, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request

from .models import Info, Resume
from .serializers import InfoSerializer, ResumeSerializer, ResumeListSerializer

logger = logging.getLogger(__name__)


@method_decorator(cache_page(settings.CACHE_TTL), name="dispatch")
class InfoViewSet(viewsets.ReadOnlyModelViewSet):  # type: ignore[type-arg]
    queryset = Info.objects.all()
    serializer_class = InfoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@method_decorator(cache_page(settings.CACHE_TTL), name="dispatch")
class ResumeViewSet(viewsets.ReadOnlyModelViewSet):  # type: ignore[type-arg]
    queryset = Resume.objects.all().order_by("-uploaded_at")
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self) -> type:
        if self.action == "list":
            return ResumeListSerializer
        return ResumeSerializer

    def _serve_file(
        self, request: Request, as_attachment: bool
    ) -> Union[FileResponse, Response]:
        try:
            resume = Resume.get_active_resume()
            if not resume or not resume.is_file_accessible:
                logger.warning(
                    f"File serve failed: No active/accessible resume. Attachment: {as_attachment}"
                )
                return Response(
                    {"error": "No active resume is available."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            try:
                file_handle = resume.file.open("rb")

                response: FileResponse = FileResponse(
                    file_handle,
                    content_type="application/pdf",
                    as_attachment=as_attachment,
                )

                filename: str = resume.download_filename
                if as_attachment:
                    response["Content-Disposition"] = (
                        f'attachment; filename="{filename}"'
                    )
                    response["Content-Length"] = resume.file.size
                else:
                    response["Content-Disposition"] = f'inline; filename="{filename}"'

                logger.info(
                    f"Resume served. Attachment: {as_attachment}, File: {resume.file.name}"
                )
                return response

            except FileNotFoundError:
                logger.error(
                    f"File not found on storage for resume ID {resume.pk}: {resume.file.name}"
                )
                return Response(
                    {
                        "error": "The resume file is missing from the server. Please upload it again."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            except Exception as e:
                logger.error(
                    f"Error serving file for resume ID {resume.pk}: {str(e)}",
                    exc_info=True,
                )
                return Response(
                    {"error": "An error occurred while accessing the file handle."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        except Exception as e:
            logger.error(
                f"Unexpected error preparing to serve file. Attachment: {as_attachment}. Error: {str(e)}",
                exc_info=True,
            )
            return Response(
                {"error": "An unexpected error occurred while preparing the file."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def view(self, request: Request) -> Union[FileResponse, Response]:
        return self._serve_file(request, as_attachment=False)

    @action(detail=False, methods=["get"])
    def download(self, request: Request) -> Union[FileResponse, Response]:
        return self._serve_file(request, as_attachment=True)

    @action(detail=False, methods=["get"])
    def status(self, request: Request) -> Response:
        try:
            total_resumes: int = Resume.objects.count()
            active_resume = Resume.get_active_resume()

            status_info: dict[str, Any] = {
                "total_resumes": total_resumes,
                "active_resumes": 1 if active_resume else 0,
                "has_active_resume": bool(active_resume),
            }

            if active_resume:
                status_info.update(
                    {
                        "active_resume_id": active_resume.pk,
                        "active_resume_filename": active_resume.file.name
                        if active_resume.file
                        else None,
                        "active_resume_uploaded_at": active_resume.uploaded_at,
                        "active_resume_size": active_resume.file_size_display,
                        "file_accessible": active_resume.is_file_accessible,
                    }
                )

            return Response(status_info, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error getting resume status: {str(e)}", exc_info=True)
            return Response(
                {"error": "Failed to retrieve resume status"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def seo_home_page(request: HttpRequest) -> HttpResponse:
    info = Info.objects.first()

    # og:title — mapped from info.site_header and info.professional_title
    site_header: str = info.site_header if info else "Rajiv Wallace"
    professional_title: str = info.professional_title if info else "Software Developer"
    title = f"{site_header} | {professional_title}"

    # og:description — mapped from info.bio
    bio: str = info.bio if info and info.bio else "Software Developer Portfolio"
    description: str = bio[:160]

    # og:image — mapped from info.profile_photo (GCS returns an absolute URL)
    image_url = ""
    if info and info.profile_photo:
        image_url = request.build_absolute_uri(info.profile_photo.url)

    # Canonical URL — always the public frontend domain
    canonical_url = f"{settings.SITE_URL}/"

    # Escape all dynamic content before embedding in HTML attributes
    safe_title = html.escape(title)
    safe_site_name = html.escape(site_header)
    safe_description = html.escape(description)
    safe_image_url = html.escape(image_url)
    safe_canonical_url = html.escape(canonical_url)

    response_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{safe_title}</title>
    <meta name="description" content="{safe_description}" />

    <!-- Open Graph -->
    <meta property="og:type"         content="website" />
    <meta property="og:url"          content="{safe_canonical_url}" />
    <meta property="og:site_name"    content="{safe_site_name}" />
    <meta property="og:locale"       content="en_US" />
    <meta property="og:title"        content="{safe_title}" />
    <meta property="og:description"  content="{safe_description}" />
    <meta property="og:image"        content="{safe_image_url}" />
    <meta property="og:image:alt"    content="{safe_site_name}" />
    <meta property="og:image:width"  content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content="{safe_title}" />
    <meta name="twitter:description" content="{safe_description}" />
    <meta name="twitter:image"       content="{safe_image_url}" />
    <meta name="twitter:image:alt"   content="{safe_site_name}" />
</head>
<body>
    <h1>{safe_title}</h1>
    <p>{safe_description}</p>
</body>
</html>"""
    return HttpResponse(response_html)
