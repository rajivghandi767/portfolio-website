from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from wallet import views

urlpatterns = [
    path('wallet/', views.CardListApiView.as_view()),
    path("wallet/<int:pk>/", views.CardDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
