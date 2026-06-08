from django.contrib import admin
from projects.models import Project, Tag


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'technology', 'order')
    list_editable = ('order',)
    filter_horizontal = ('tags',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
