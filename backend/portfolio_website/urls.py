from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods


from info.views import InfoViewSet, ResumeViewSet
from projects.views import ProjectViewSet
from blog.views import CategoryViewSet, PostViewSet, CommentViewSet
from wallet.views import CardViewSet
from contacts.views import ContactViewSet

from health_check.views import health_detailed, health_simple
from rest_framework.routers import DefaultRouter


@require_http_methods(["GET"])
def api_root(request):
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
            "health_detailed": f"{base_url}health/detailed/"
        }
    })


router = DefaultRouter()

router.register('info', InfoViewSet)
router.register('resume', ResumeViewSet)
router.register('projects', ProjectViewSet)
router.register('category', CategoryViewSet)
router.register('post', PostViewSet)
router.register('comment', CommentViewSet)
router.register('cards', CardViewSet)
router.register('contact', ContactViewSet)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('health/', health_simple, name='health_simple'),
    path('health/detailed/', health_detailed, name='health_detailed'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
