import html
import re

from django.db.models import Q
from django.http import HttpResponse, Http404
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Category, Post
from .serializers import CategorySerializer, PostSerializer
from info.models import Info


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

    # Image URL: GCS returns an absolute URL; build_absolute_uri is a no-op for absolute URLs
    image_url = ""
    if post.image:
        image_url = request.build_absolute_uri(post.image.url)

    # Canonical URL — always resolves to the public frontend domain, never the API subdomain
    post_slug = post.slug or str(post.pk)
    canonical_url = f"{settings.SITE_URL}/blog/{post_slug}/"

    # Strip HTML tags from CKEditor body (stored as HTML) to produce a plain-text excerpt
    plain_body = re.sub(r'<[^>]+>', '', post.body)
    plain_body = re.sub(r'\s+', ' ', plain_body).strip()
    description = plain_body[:160] if plain_body else post.title

    # article:author — Post model has no author field; pull name from Info.site_header
    info = Info.objects.first()
    author_name = info.site_header if info else "Rajiv Wallace"

    # Escape all dynamic content before embedding in HTML attributes
    safe_title = html.escape(post.title)
    safe_description = html.escape(description)
    safe_image_url = html.escape(image_url)
    safe_canonical_url = html.escape(canonical_url)
    safe_author = html.escape(author_name)

    # Build optional article timestamp / category tags from actual model fields:
    # post.publish_date, post.last_modified, post.categories (M2M -> Category.name)
    optional_tags = []
    if post.publish_date:
        optional_tags.append(
            f'    <meta property="article:published_time" content="{html.escape(post.publish_date.isoformat())}" />'
        )
    if post.last_modified:
        optional_tags.append(
            f'    <meta property="article:modified_time"  content="{html.escape(post.last_modified.isoformat())}" />'
        )
    for category in post.categories.all():
        optional_tags.append(
            f'    <meta property="article:section" content="{html.escape(category.name)}" />'
        )
    optional_tags_html = "\n".join(optional_tags)

    response_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{safe_title}</title>
    <meta name="description" content="{safe_description}" />

    <!-- Open Graph -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="{safe_canonical_url}" />
    <meta property="og:site_name" content="{safe_author}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="{safe_title}" />
    <meta property="og:description" content="{safe_description}" />
    <meta property="og:image" content="{safe_image_url}" />
    <meta property="og:image:alt" content="{safe_title}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Article metadata (post.publish_date, post.last_modified, post.categories) -->
    <meta property="article:author" content="{safe_author}" />
{optional_tags_html}

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{safe_title}" />
    <meta name="twitter:description" content="{safe_description}" />
    <meta name="twitter:image" content="{safe_image_url}" />
    <meta name="twitter:image:alt" content="{safe_title}" />
</head>
<body>
    <h1>{safe_title}</h1>
    <p>{safe_description}</p>
</body>
</html>"""
    return HttpResponse(response_html)
