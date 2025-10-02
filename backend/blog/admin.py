from django.contrib import admin
from django.utils.safestring import mark_safe
from django.urls import reverse
from blog.models import Category, Comment, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_on', 'order')
    list_editable = ('order',)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
