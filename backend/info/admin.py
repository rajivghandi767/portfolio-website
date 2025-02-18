from django.contrib import admin
from .models import Info
from .models import Resume


@admin.register(Info)
class InfoAdmin(admin.ModelAdmin):
    pass


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['id', 'uploaded_at', 'is_active']
    list_filter = ['is_active']

    def save_model(self, request, obj, form, change):
        if obj.is_active:
            # Deactivate all other resumes
            Resume.objects.exclude(pk=obj.pk).update(is_active=False)
        super().save_model(request, obj, form, change)
