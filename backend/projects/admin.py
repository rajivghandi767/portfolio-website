from django.contrib import admin
from projects.models import Project, Tag


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "is_visible",
        "is_visible_switcher",
        "order",
        "switcher_order",
    )
    list_editable = ("is_visible", "is_visible_switcher", "order", "switcher_order")
    filter_horizontal = ("tags",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
