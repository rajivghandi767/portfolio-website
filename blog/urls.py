from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from blog import views

urlpatterns = [
    path('blog/category', views.CategoryListApiView.as_view()),
    path('blog/post', views.PostListApiView.as_view()),
    path('blog/post/<int:pk>/', views.PostDetail.as_view()),
    path('blog/comment', views.CommentListApiView.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
