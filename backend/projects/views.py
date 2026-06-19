from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Project
from .serializers import ProjectSerializer


from rest_framework.filters import OrderingFilter

@method_decorator(cache_page(settings.CACHE_TTL), name="dispatch")
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering_fields = ['order']
    ordering = ['order']

    def get_queryset(self):
        """
        Educational Note: Moving filtering and slicing from the React frontend to the 
        Django backend allows the database to do the heavy lifting, saving network 
        bandwidth and preventing client-side performance bottlenecks.
        """
        queryset = Project.objects.all()
        
        is_visible = self.request.query_params.get("is_visible")
        get_all = self.request.query_params.get("all")
        
        if is_visible == "true":
            queryset = queryset.filter(is_visible=True)
        elif get_all == "true":
            queryset = queryset.filter(Q(is_visible=True) | Q(is_visible_switcher=True))
        else:
            queryset = queryset.filter(is_visible_switcher=True)
            
        limit = self.request.query_params.get("limit")
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
                
        return queryset
