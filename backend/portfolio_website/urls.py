from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.cache import cache_control
from django.utils.decorators import method_decorator
from rest_framework.routers import DefaultRouter

# Import viewsets
from info.views import InfoViewSet, ResumeViewSet
from projects.views import ProjectViewSet
from blog.views import CategoryViewSet, PostViewSet, CommentViewSet
from wallet.views import CardViewSet
from contacts.views import ContactViewSet

# Import health check views
from health_check.views import health_detailed, health_simple


@require_http_methods(["GET"])
@cache_control(max_age=300)  # Cache for 5 minutes
def api_root(request):
    """
    API root endpoint with comprehensive endpoint listing
    """
    base_url = request.build_absolute_uri('/')

    return JsonResponse({
        "message": "Portfolio API",
        "status": "running",
        "version": "1.0",
        "documentation": f"{base_url}api/",
        "endpoints": {
            "admin": f"{base_url}admin/",
            "api": f"{base_url}api/",
            "auth": f"{base_url}api-auth/",
            "health": f"{base_url}health/",
            "health_detailed": f"{base_url}health/detailed/",

            # Main API endpoints
            "info": f"{base_url}api/info/",
            "projects": f"{base_url}api/projects/",
            "blog_posts": f"{base_url}api/post/",
            "blog_categories": f"{base_url}api/category/",
            "cards": f"{base_url}api/cards/",
            "contact": f"{base_url}api/contact/",

            # Resume endpoints
            "resume_list": f"{base_url}api/resume/",
            "resume_view": f"{base_url}api/resume/view/",
            "resume_download": f"{base_url}api/resume/download/",
            "resume_status": f"{base_url}api/resume/status/",
        },
        "media_url": settings.MEDIA_URL,
        "static_url": settings.STATIC_URL,
    })


# Configure Django REST Framework router
router = DefaultRouter()

# Register viewsets with explicit basename for better URL naming
router.register('info', InfoViewSet, basename='info')
router.register('resume', ResumeViewSet, basename='resume')
router.register('projects', ProjectViewSet, basename='projects')
router.register('category', CategoryViewSet, basename='category')
router.register('post', PostViewSet, basename='post')
router.register('comment', CommentViewSet, basename='comment')
router.register('cards', CardViewSet, basename='cards')
router.register('contact', ContactViewSet, basename='contact')

# URL patterns
urlpatterns = [
    # Root API endpoint
    path('', api_root, name='api-root'),

    # API routes (includes all the router URLs)
    path('api/', include(router.urls)),

    # Admin interface
    path('admin/', admin.site.urls),

    # DRF authentication
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # Health check endpoints
    path('health/', health_simple, name='health_simple'),
    path('health/detailed/', health_detailed, name='health_detailed'),
]

# Static and media file serving
# Note: In production, nginx should handle static files, but this provides fallback
if settings.DEBUG:
    # Development: Serve media files through Django
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
else:
    # Production: Add media URL pattern for URL resolution, but nginx will serve files
    # This is needed for Django to generate correct URLs in serializers
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

# Custom error handlers (optional, for better API error responses)
handler400 = 'your_app.views.bad_request'
handler403 = 'your_app.views.permission_denied'
handler404 = 'your_app.views.page_not_found'
handler500 = 'your_app.views.server_error'
