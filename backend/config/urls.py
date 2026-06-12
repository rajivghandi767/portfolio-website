from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import cache_control
from rest_framework.routers import DefaultRouter

# Import viewsets
from info.views import (
    InfoViewSet, ResumeViewSet, seo_home_page
)
from projects.views import ProjectViewSet
from blog.views import CategoryViewSet, PostViewSet, seo_blog_post
from wallet.views import CardViewSet
from contacts.views import ContactViewSet

# Import health check views
from health_check.views import health_detailed, health_simple


# Utilizes Python decorators to wrap the view with HTTP method validation and caching logic
# before the function execution begins.
@require_http_methods(["GET"])
@cache_control(max_age=settings.CACHE_TTL)
def api_root(request):
    """
    Dynamically generates the base API URL and returns a JSON directory of available endpoints.
    """
    base_url = request.build_absolute_uri('/')

    return JsonResponse({
        "message": "Portfolio API",
        "status": "running",
        "version": "1.0",
        "api_url": f"{base_url}api/",
        "endpoints": {
            "admin": f"{base_url}admin/",
            "api": f"{base_url}api/",
            "auth": f"{base_url}api-auth/",

        }
    })


router = DefaultRouter()

# Register viewsets with explicit basename for better URL naming
router.register('info', InfoViewSet, basename='info')
router.register('resume', ResumeViewSet, basename='resume')

router.register('projects', ProjectViewSet, basename='projects')
router.register('category', CategoryViewSet, basename='category')
router.register('post', PostViewSet, basename='post')
router.register('cards', CardViewSet, basename='cards')
router.register('contact', ContactViewSet, basename='contact')

# URL patterns
urlpatterns = [
    # Root API Endpoint
    path('', api_root, name='api-root'),

    # SEO Routes for social media bots
    path('api/seo/blog/<slug:slug>/', seo_blog_post, name='seo-blog-post'),
    path('api/seo/home/', seo_home_page, name='seo-home-page'),

    # API Routes
    path('api/', include(router.urls)),

    # Admin Interface
    path('admin/', admin.site.urls),

    # DRF Authentication
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # Health Check Endpoints
    path('health/', health_simple, name='health_simple'),
    path('health/detailed/', health_detailed, name='health_detailed'),

    # Third-Party App URLs
    path('', include('django_prometheus.urls')),   # Prometheus Monitoring
    path("ckeditor5/", include('django_ckeditor_5.urls')),  # CKEditor5
]

# Static file serving fallback for development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
