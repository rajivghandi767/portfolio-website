from django.contrib import admin
from projects.models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'technology', 'order')
    list_editable = ('order',)
