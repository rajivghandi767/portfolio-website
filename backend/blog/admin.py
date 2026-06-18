from django.contrib import admin
from blog.models import Category, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "publish_date", "created_on", "order")
    list_editable = ("status", "order")
    list_filter = ("status", "publish_date")
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}
