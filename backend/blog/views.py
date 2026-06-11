from django.db.models import Q
from django.http import HttpResponse, Http404
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
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

    def get_queryset(self):
        return Post.objects.filter(status='published', publish_date__lte=timezone.now())

    def get_object(self):
        queryset = self.get_queryset()
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup = self.kwargs.get(lookup_url_kwarg)
        
        try:
            lookup_int = int(lookup)
            obj = get_object_or_404(queryset, Q(pk=lookup_int) | Q(slug=lookup))
        except ValueError:
            obj = get_object_or_404(queryset, slug=lookup)
            
        self.check_object_permissions(self.request, obj)
        return obj


@method_decorator(cache_page(60 * 5), name='dispatch')
class CommentViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'head', 'options']
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

def seo_blog_post(request, slug):
    try:
        try:
            lookup_int = int(slug)
            post = Post.objects.get(Q(pk=lookup_int) | Q(slug=slug), status='published')
        except ValueError:
            post = Post.objects.get(slug=slug, status='published')
            
        if post.publish_date and post.publish_date > timezone.now():
            raise Http404()
    except Post.DoesNotExist:
        raise Http404()

    # Determine absolute URL for the image
    image_url = ""
    if post.image:
        image_url = request.build_absolute_uri(post.image.url)

    # Simple HTML template for bots
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{post.title}</title>
    <meta property="og:title" content="{post.title}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="{request.build_absolute_uri()}" />
    <meta property="og:image" content="{image_url}" />
    <meta property="og:description" content="{post.title} on Rajiv Wallace Portfolio" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{post.title}" />
    <meta name="twitter:description" content="{post.title} on Rajiv Wallace Portfolio" />
    <meta name="twitter:image" content="{image_url}" />
</head>
<body>
    <h1>{post.title}</h1>
</body>
</html>"""
    return HttpResponse(html)
