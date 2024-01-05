from django.contrib import admin
from django.urls import path, include

from info.views import BioViewSet, GitHubViewSet, LinkedInViewSet
from projects.views import ProjectViewSet
from blog.views import CategoryViewSet, PostViewSet, CommentViewSet
from wallet.views import CardViewSet

from rest_framework import routers

router = routers.DefaultRouter()
router.register('bio', BioViewSet)
router.register('github', GitHubViewSet)
router.register('linkedin', LinkedInViewSet)

router.register('projects', ProjectViewSet)

router.register('category', CategoryViewSet)
router.register('post', PostViewSet)
router.register('comment', CommentViewSet)

router.register('cards', CardViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
]

urlpatterns += router.urls
