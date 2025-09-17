from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse
from django.contrib import messages
from django.http import HttpResponseRedirect
import logging
from .models import Info, Resume

logger = logging.getLogger(__name__)


@admin.register(Info)
class InfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'greeting', 'profile_photo_preview',
                    'has_github', 'has_linkedin', 'bio_preview')
    list_display_links = ('id', 'greeting')
    list_filter = ('greeting',)
    search_fields = ('greeting', 'bio')

    fieldsets = (
        ('Basic Information', {
            'fields': ('profile_photo', 'greeting', 'bio'),
            'description': 'Core profile information displayed on the website'
        }),
        ('Social Links', {
            'fields': ('github', 'linkedIn'),
            'description': 'Social media and professional profile links'
        }),
    )

    readonly_fields = ('profile_photo_preview',)

    def profile_photo_preview(self, obj):
        """Display small preview of profile photo"""
        if obj.profile_photo:
            try:
                return format_html(
                    '<img src="{}" width="50" height="50" style="border-radius: 50%; object-fit: cover;" title="{}"/>',
                    obj.profile_photo.url,
                    obj.profile_photo.name
                )
            except:
                return format_html('<span style="color: red;">Error loading image</span>')
        return format_html('<span style="color: #666;">No photo</span>')
    profile_photo_preview.short_description = 'Photo Preview'

    def has_github(self, obj):
        return bool(obj.github)
    has_github.boolean = True
    has_github.short_description = 'GitHub'

    def has_linkedin(self, obj):
        return bool(obj.linkedIn)
    has_linkedin.boolean = True
    has_linkedin.short_description = 'LinkedIn'

    def bio_preview(self, obj):
        """Show truncated bio"""
        if obj.bio:
            if len(obj.bio) > 100:
                return f"{obj.bio[:100]}..."
            return obj.bio
        return "No bio"
    bio_preview.short_description = 'Bio (Preview)'

    def save_model(self, request, obj, form, change):
        """Enhanced save with better error handling"""
        try:
            super().save_model(request, obj, form, change)
            action = "updated" if change else "created"
            self.message_user(
                request,
                f"Profile information {action} successfully.",
                messages.SUCCESS
            )
            logger.info(
                f"Info object {action} by user {request.user.username}")
        except Exception as e:
            logger.error(f"Error saving Info object: {str(e)}", exc_info=True)
            self.message_user(
                request,
                f"Error saving profile information: {str(e)}",
                messages.ERROR
            )
            raise


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'filename_display',
        'file_size_display',
        'uploaded_at',
        'is_active',
        'status_indicator',
        'action_links'
    )
    list_display_links = ('id', 'filename_display')
    list_filter = ('is_active', 'uploaded_at')
    ordering = ('-uploaded_at',)
    date_hierarchy = 'uploaded_at'

    readonly_fields = (
        'uploaded_at',
        'file_size_display',
        'file_info_display',
        'download_test_link'
    )

    fieldsets = (
        ('File Upload', {
            'fields': ('file', 'is_active'),
            'description': 'Upload a PDF resume file. Only one resume can be active at a time.'
        }),
        ('File Information', {
            'fields': ('uploaded_at', 'file_size_display', 'file_info_display', 'download_test_link'),
            'classes': ('collapse',),
            'description': 'Detailed information about the uploaded file'
        }),
    )

    def filename_display(self, obj):
        """Display clean filename"""
        if obj.file:
            filename = obj.file.name.split('/')[-1]
            if len(filename) > 30:
                return f"{filename[:27]}..."
            return filename
        return format_html('<span style="color: #999;">No file</span>')
    filename_display.short_description = 'Filename'

    def file_size_display(self, obj):
        """Display formatted file size"""
        if obj.file:
            try:
                size = obj.file.size
                if size < 1024:
                    return f"{size} bytes"
                elif size < 1024 * 1024:
                    return f"{size / 1024:.1f} KB"
                else:
                    return f"{size / (1024 * 1024):.1f} MB"
            except Exception as e:
                logger.warning(
                    f"Error getting file size for resume {obj.id}: {str(e)}")
                return format_html('<span style="color: orange;">Size unknown</span>')
        return format_html('<span style="color: #999;">No file</span>')
    file_size_display.short_description = 'File Size'

    def file_info_display(self, obj):
        """Display detailed file information"""
        if obj.file:
            try:
                info_html = f"""
                <div style="font-family: monospace; font-size: 11px;">
                    <strong>Full Path:</strong> {obj.file.name}<br>
                    <strong>URL:</strong> <a href="{obj.file.url}" target="_blank">{obj.file.url}</a><br>
                    <strong>Size:</strong> {obj.file.size:,} bytes
                </div>
                """
                return format_html(info_html)
            except Exception as e:
                return format_html(
                    '<span style="color: red;">Error: {}</span>',
                    str(e)
                )
        return format_html('<span style="color: #999;">No file uploaded</span>')
    file_info_display.short_description = 'File Details'

    def download_test_link(self, obj):
        """Test download link"""
        if obj.file:
            try:
                return format_html(
                    '<a href="{}" target="_blank" style="color: green;">Test Download</a>',
                    obj.file.url
                )
            except:
                return format_html('<span style="color: red;">Download not available</span>')
        return format_html('<span style="color: #999;">No file</span>')
    download_test_link.short_description = 'Test Download'

    def status_indicator(self, obj):
        """Visual status indicator"""
        if obj.is_active:
            return format_html(
                '<span style="color: green; font-weight: bold;">● ACTIVE</span>'
            )
        else:
            return format_html(
                '<span style="color: #999;">○ Inactive</span>'
            )
    status_indicator.short_description = 'Status'

    def action_links(self, obj):
        """Action buttons for each resume"""
        if obj.file:
            view_url = f"/api/resume/view/"
            download_url = f"/api/resume/download/" if obj.is_active else "#"

            links_html = f"""
            <div style="white-space: nowrap;">
                <a href="{view_url}" target="_blank" style="margin-right: 10px; color: blue;">View API</a>
                <a href="{download_url}" target="_blank" style="color: green;">Download API</a>
            </div>
            """
            return format_html(links_html)
        return format_html('<span style="color: #999;">No actions</span>')
    action_links.short_description = 'API Links'

    def save_model(self, request, obj, form, change):
        """Enhanced save with error handling and automatic activation"""
        try:
            # If this resume is being set as active, deactivate others
            if obj.is_active:
                Resume.objects.exclude(pk=obj.pk).update(is_active=False)
                logger.info(
                    f"Deactivated other resumes, activating resume {obj.pk}")

            super().save_model(request, obj, form, change)

            action = "updated" if change else "uploaded"
            file_info = f"'{obj.file.name}'" if obj.file else "without file"

            self.message_user(
                request,
                f"Resume {action} successfully: {file_info}",
                messages.SUCCESS
            )

            if obj.is_active:
                self.message_user(
                    request,
                    "This resume is now active and will be served by the API.",
                    messages.INFO
                )

            logger.info(
                f"Resume {action} by user {request.user.username}: {file_info}")

        except Exception as e:
            logger.error(
                f"Error saving Resume object: {str(e)}", exc_info=True)
            self.message_user(
                request,
                f"Error saving resume: {str(e)}",
                messages.ERROR
            )
            raise

    def delete_model(self, request, obj):
        """Enhanced delete with logging"""
        try:
            filename = obj.file.name if obj.file else "Unknown file"
            super().delete_model(request, obj)
            self.message_user(
                request,
                f"Resume deleted successfully: {filename}",
                messages.SUCCESS
            )
            logger.info(
                f"Resume deleted by user {request.user.username}: {filename}")
        except Exception as e:
            logger.error(
                f"Error deleting Resume object: {str(e)}", exc_info=True)
            self.message_user(
                request,
                f"Error deleting resume: {str(e)}",
                messages.ERROR
            )
            raise

    actions = ['make_active', 'make_inactive']

    def make_active(self, request, queryset):
        """Admin action to activate selected resume"""
        if queryset.count() != 1:
            self.message_user(
                request,
                "Please select exactly one resume to activate.",
                messages.ERROR
            )
            return

        # Deactivate all other resumes
        Resume.objects.update(is_active=False)

        # Activate the selected resume
        resume = queryset.first()
        resume.is_active = True
        resume.save()

        self.message_user(
            request,
            f"Resume '{resume.file.name}' is now active.",
            messages.SUCCESS
        )

        logger.info(
            f"Resume activated via admin action by {request.user.username}: {resume.file.name}")

    make_active.short_description = "Activate selected resume"

    def make_inactive(self, request, queryset):
        """Admin action to deactivate selected resumes"""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            f"{updated} resume(s) deactivated.",
            messages.SUCCESS
        )
        logger.info(
            f"{updated} resumes deactivated via admin action by {request.user.username}")

    make_inactive.short_description = "Deactivate selected resumes"
