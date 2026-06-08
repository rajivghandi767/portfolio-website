from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Card
from .serializers import CardSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='dispatch')
class CardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
