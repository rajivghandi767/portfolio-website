from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from info import views

urlpatterns = [
    path('info/bio/', views.BioListApiView.as_view()),
    path('info/linkedIn/', views.LinkedInListApiView.as_view()),
    path('info/twitterX/', views.TwitterXListApiView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
