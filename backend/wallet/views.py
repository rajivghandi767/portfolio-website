from __future__ import annotations

from typing import Optional

from django.db.models import QuerySet
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Card
from .serializers import CardSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name="dispatch")
class CardViewSet(viewsets.ReadOnlyModelViewSet):  # type: ignore[type-arg]
    """
    CardViewSet

    Highly educational note: We use `ReadOnlyModelViewSet` here instead of a standard `ModelViewSet`
    because the frontend should only be allowed to read (GET) the card catalog. Modifying the catalog 
    (POST/PUT/DELETE) is restricted to the Django admin panel. Additionally, we wrap the `dispatch` 
    method with `cache_page` to cache the API response. This greatly improves performance and reduces 
    database hits for data that rarely changes.
    """
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self) -> QuerySet[Card]:
        queryset: QuerySet[Card] = super().get_queryset()
        limit: Optional[str] = self.request.query_params.get("limit")
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        return queryset
