from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Project
from .serializers import ProjectSerializer

@method_decorator(cache_page(settings.CACHE_TTL), name="dispatch")
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Ordering is applied here (before any slicing) because DRF's filter backends run
        after get_queryset() returns. Slicing a queryset before ordering raises a Django
        TypeError, so we must call .order_by() first, then apply the limit slice last.
        """
        queryset = Project.objects.order_by('order')

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
                return queryset[:int(limit)]
            except ValueError:
                pass

        return queryset
