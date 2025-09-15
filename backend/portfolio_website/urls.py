from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from info.views import InfoViewSet, ResumeViewSet
from projects.views import ProjectViewSet
from blog.views import CategoryViewSet, PostViewSet, CommentViewSet
from wallet.views import CardViewSet
from contacts.views import ContactViewSet

from health_check.views import health_detailed, health_simple
from rest_framework.routers import DefaultRouter

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
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('health/', health_simple, name='health_simple'),
    path('health/detailed/', health_detailed, name='health_detailed'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
