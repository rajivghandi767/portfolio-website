from django.contrib import admin
from django.urls import path, include

from info.views import InfoViewSet
from projects.views import ProjectViewSet
from blog.views import CategoryViewSet, PostViewSet, CommentViewSet
from wallet.views import CardViewSet

from rest_framework import routers

router = routers.DefaultRouter()
router.register('info', InfoViewSet)

router.register('projects', ProjectViewSet)

router.register('category', CategoryViewSet)
router.register('post', PostViewSet)
router.register('comment', CommentViewSet)

router.register('cards', CardViewSet)


urlpatterns = [
    # path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('', include('health_check.urls'))
]

urlpatterns += router.urls
