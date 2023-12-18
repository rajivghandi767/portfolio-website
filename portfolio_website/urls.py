from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path("", include('info.urls')),
    path("", include('projects.urls')),
    path("", include('blog.urls')),
    path("", include('wallet.urls')),
]
