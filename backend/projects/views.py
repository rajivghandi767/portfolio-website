from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Project
from .serializers import ProjectSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='dispatch')
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.filter(Q(is_visible=True) | Q(is_visible_switcher=True))
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
