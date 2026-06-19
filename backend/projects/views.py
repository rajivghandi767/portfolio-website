from __future__ import annotations

from typing import Optional

from django.db.models import Q, QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from django.http import HttpResponseRedirect, Http404, HttpRequest
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from typing import Any

from .models import Project
from .serializers import ProjectSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name="dispatch")
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):  # type: ignore[type-arg]
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self) -> QuerySet[Project]:
        """
        Ordering is applied here (before any slicing) because DRF's filter backends run
        after get_queryset() returns. Slicing a queryset before ordering raises a Django
        TypeError, so we must call .order_by() first, then apply the limit slice last.
        """
        queryset: QuerySet[Project] = Project.objects.order_by('order')

        is_visible: Optional[str] = self.request.query_params.get("is_visible")
        get_all: Optional[str] = self.request.query_params.get("all")

        if is_visible == "true":
            queryset = queryset.filter(is_visible=True)
        elif get_all == "true":
            queryset = queryset.filter(Q(is_visible=True) | Q(is_visible_switcher=True))
        else:
            queryset = queryset.filter(is_visible_switcher=True)

        limit: Optional[str] = self.request.query_params.get("limit")
        if limit:
            try:
                return queryset[:int(limit)]
            except ValueError:
                pass

        return queryset

    def get_object(self) -> Project:
        queryset: QuerySet[Project] = self.get_queryset()
        lookup_url_kwarg: str = self.lookup_url_kwarg or self.lookup_field
        lookup: Any = self.kwargs.get(lookup_url_kwarg)

        from django.shortcuts import get_object_or_404
        try:
            lookup_int = int(lookup)
            obj: Project = get_object_or_404(queryset, Q(pk=lookup_int) | Q(slug=lookup))
        except ValueError:
            obj = get_object_or_404(queryset, slug=lookup)

        self.check_object_permissions(self.request, obj)
        return obj

    @action(detail=True, methods=["get"], url_path="og-image")
    def og_image(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponseRedirect:
        """
        Returns an HTTP 302 Redirect to the actual project thumbnail image URL.
        Useful for dynamic og:image meta tags in decoupled frontend apps.
        """
        project: Project = self.get_object()
        if not project.thumbnail:
            raise Http404("This project has no thumbnail image.")
        
        # Build absolute URL in case it's a relative media URL (like in local development)
        image_url = request.build_absolute_uri(project.thumbnail.url)
        return HttpResponseRedirect(image_url)
