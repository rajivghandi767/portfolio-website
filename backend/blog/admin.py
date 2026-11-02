from __future__ import annotations

from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import SafeString
from blog.models import Category, Post


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    pass


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):  # type: ignore[type-arg]
    list_display = ("title", "status", "publish_date", "created_on", "order", "preview_link")
    list_editable = ("status", "order")
    list_filter = ("status", "publish_date")
    search_fields = ("title", "body")
    prepopulated_fields = {"slug": ("title",)}

    @admin.display(description="Preview")
    def preview_link(self, obj: Post) -> SafeString:
        url = obj.get_absolute_url()
        return format_html(
            '<a href="{}" target="_blank" title="Preview" style="font-size: 1.2em; text-decoration: none;">👁️</a>',
            url,
        )

