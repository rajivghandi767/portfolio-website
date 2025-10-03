from django.contrib import admin
from django.utils.html import format_html
from django.contrib import messages
import logging
from .models import Info, Resume

logger = logging.getLogger(__name__)


@admin.register(Info)
class InfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'site_header', 'professional_title', 'greeting',
                    'profile_photo_preview', 'has_github', 'has_linkedin', 'bio_preview')
    list_display_links = ('id', 'site_header')
    list_filter = ('greeting',)
    search_fields = ('greeting', 'bio')
    readonly_fields = ('profile_photo_preview',)

    def profile_photo_preview(self, obj):
        if obj.profile_photo:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%; object-fit: cover;" title="{}"/>',
                obj.profile_photo.url,
                obj.profile_photo.name
            )
        return "No photo"
    profile_photo_preview.short_description = 'Photo'

    def has_github(self, obj): return bool(obj.github)
    has_github.boolean = True

    def has_linkedin(self, obj): return bool(obj.linkedin)
    has_linkedin.boolean = True

    def bio_preview(self, obj): return f"{obj.bio[:100]}..." if len(
        obj.bio) > 100 else obj.bio
    bio_preview.short_description = 'Bio'


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id', 'filename_display', 'file_size_display',
                    'uploaded_at', 'is_active', 'status_indicator')
    list_display_links = ('id', 'filename_display')
    list_filter = ('is_active', 'uploaded_at')
    ordering = ('-uploaded_at',)
    date_hierarchy = 'uploaded_at'
    readonly_fields = ('uploaded_at', 'file_size_display', 'file_info_display')
    actions = ['make_active', 'make_inactive']

    fieldsets = (
        ('File Upload', {
            'fields': ('file', 'is_active'),
            'description': 'Upload a PDF resume file. Only one resume can be active at a time.'
        }),
        ('File Information', {
            'fields': ('uploaded_at', 'file_size_display', 'file_info_display'),
            'classes': ('collapse',),
        }),
    )

    def filename_display(self, obj):
        if obj.file:
            return obj.file.name
        return format_html('<span style="color: #999;">No file attached</span>')
    filename_display.short_description = 'Filename'

    def file_info_display(self, obj):
        if obj.file:
            try:
                return format_html(
                    '<div style="font-family: monospace; font-size: 11px;">'
                    '<strong>Original Filename:</strong> {}<br>'
                    '<strong>URL:</strong> <a href="{}" target="_blank">{}</a><br>'
                    '<strong>Size:</strong> {:,} bytes'
                    '</div>',
                    obj.file.name, obj.file.url, obj.file.url, obj.file.size
                )
            except Exception as e:
                return format_html('<span style="color: red;">Error: {}</span>', str(e))
        return "No file uploaded"
    file_info_display.short_description = 'File Details'

    def status_indicator(self, obj):
        color = "green" if obj.is_active else "#999"
        text = "ACTIVE" if obj.is_active else "Inactive"
        return format_html('<span style="color: {}; font-weight: bold;">● {}</span>', color, text)
    status_indicator.short_description = 'Status'

    def save_model(self, request, obj, form, change):
        try:
            if obj.is_active:
                Resume.objects.exclude(pk=obj.pk).update(is_active=False)
                logger.info(
                    f"Deactivated other resumes, activating resume {obj.pk}")
            super().save_model(request, obj, form, change)
            self.message_user(
                request, "Resume saved successfully.", messages.SUCCESS)
        except Exception as e:
            logger.error(
                f"Error saving Resume object: {str(e)}", exc_info=True)
            self.message_user(
                request, f"Error saving resume: {str(e)}", messages.ERROR)
            raise

    def make_active(self, request, queryset):
        if queryset.count() != 1:
            self.message_user(
                request, "Please select exactly one resume to activate.", messages.ERROR)
            return

        resume = queryset.first()
        Resume.objects.exclude(pk=resume.pk).update(is_active=False)
        resume.is_active = True
        resume.save()
        self.message_user(
            request, f"Resume '{resume.file.name}' is now active.", messages.SUCCESS)
        logger.info(
            f"Resume activated via admin action: {resume.file.name}")
    make_active.short_description = "Activate selected resume"

    def make_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(
            request, f"{updated} resume(s) deactivated.", messages.SUCCESS)
    make_inactive.short_description = "Deactivate selected resumes"
