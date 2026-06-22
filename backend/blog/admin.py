from django.contrib import admin
from django.utils.html import format_html
from blog.models import Category, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "publish_date", "created_on", "order", "preview_link")
    list_editable = ("status", "order")
    list_filter = ("status", "publish_date")
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}

    def preview_link(self, obj):
        url = obj.get_absolute_url()
        return format_html('<a href="{}" target="_blank" title="Preview" style="font-size: 1.2em; text-decoration: none;">👁️</a>', url)
    preview_link.short_description = "Preview"
