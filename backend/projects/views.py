from __future__ import annotations

from typing import Optional

from django.db.models import Q, QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

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
