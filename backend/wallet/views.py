from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Card
from .serializers import CardSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name="dispatch")
class CardViewSet(viewsets.ReadOnlyModelViewSet):
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
