from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Category, Post, Comment
from .serializers import CategorySerializer, PostSerializer, CommentSerializer


@method_decorator(cache_page(settings.CACHE_TTL), name='dispatch')
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Serves blog category definitions.
    
    Wrapped with cache_page to intercept the Django dispatch cycle and serve responses
    directly from Redis, drastically reducing DB load for public read-only traffic.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@method_decorator(cache_page(settings.CACHE_TTL), name='dispatch')
class PostViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Serves blog posts and their metadata.
    
    Wrapped with cache_page to serve serialized post data directly from memory.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@method_decorator(cache_page(60 * 5), name='dispatch')
class CommentViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'head', 'options']
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
