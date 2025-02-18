from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from info.views import InfoViewSet, ResumeViewSet
from projects.views import ProjectViewSet
from blog.views import CategoryViewSet, PostViewSet, CommentViewSet
from wallet.views import CardViewSet
from contacts.views import ContactViewSet

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
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('', include('health_check.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
