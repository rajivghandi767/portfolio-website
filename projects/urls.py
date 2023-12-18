from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from projects import views

urlpatterns = [
    path('projects/', views.ProjectListApiView.as_view()),
    path("projects/<int:pk>/", views.ProjectDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
