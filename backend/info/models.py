import os
import logging
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from .validators import validate_pdf, validate_image

logger = logging.getLogger(__name__)


def profile_photo_upload_path(instance, filename):
    """Generate upload path for profile photos"""
    # Clean filename to prevent issues
    name, ext = os.path.splitext(filename)
    safe_name = "".join(c for c in name if c.isalnum()
                        or c in (' ', '-', '_')).rstrip()
    safe_filename = f"{safe_name}{ext.lower()}"
    return f'info/photos/{safe_filename}'


def resume_upload_path(instance, filename):
    """Generate upload path for resume files with timestamp"""
    # Clean filename and add timestamp for uniqueness
    name, ext = os.path.splitext(filename)
    safe_name = "".join(c for c in name if c.isalnum()
                        or c in (' ', '-', '_')).rstrip()
    timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
    safe_filename = f"{safe_name}_{timestamp}{ext.lower()}"
    return f'resumes/{safe_filename}'


class Info(models.Model):
    """
    User profile information model
    Stores basic profile data including photo, bio, and social links
    """
    profile_photo = models.ImageField(
        upload_to=profile_photo_upload_path,
        blank=True,
        null=True,
        validators=[validate_image],
        help_text="Profile photo (JPG, PNG, GIF, or WebP, max 10MB)"
    )
    greeting = models.CharField(
        max_length=100,
        default="Hello!",
        help_text="Greeting message displayed on the homepage"
    )
    bio = models.TextField(
        help_text="Biography or description text"
    )
    github = models.URLField(
        blank=True,
        null=True,
        help_text="GitHub profile URL (optional)"
    )
    linkedIn = models.URLField(
        blank=True,
        null=True,
        help_text="LinkedIn profile URL (optional)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profile Information"
        verbose_name_plural = "Profile Information"
        ordering = ['-updated_at']

    def __str__(self):
        return f"Profile - {self.greeting}"

    def clean(self):
        """Additional model validation"""
        super().clean()

        # Validate URLs if provided
        if self.github and not self.github.startswith(('http://', 'https://')):
            raise ValidationError({
                'github': 'GitHub URL must start with http:// or https://'
            })

        if self.linkedIn and not self.linkedIn.startswith(('http://', 'https://')):
            raise ValidationError({
                'linkedIn': 'LinkedIn URL must start with http:// or https://'
            })

        # Validate bio length
        if len(self.bio) < 10:
            raise ValidationError({
                'bio': 'Bio must be at least 10 characters long.'
            })

    def save(self, *args, **kwargs):
        """Enhanced save method with logging"""
        is_new = self.pk is None

        try:
            # Validate before saving
            self.full_clean()

            super().save(*args, **kwargs)

            action = "created" if is_new else "updated"
            logger.info(f"Info object {action}: {self.greeting}")

        except Exception as e:
            logger.error(f"Error saving Info object: {str(e)}", exc_info=True)
            raise

    @property
    def has_profile_photo(self):
        """Check if profile photo exists and is accessible"""
        if self.profile_photo:
            try:
                return bool(self.profile_photo.url)
            except:
                return False
        return False

    @property
    def profile_photo_url(self):
        """Get profile photo URL safely"""
        if self.has_profile_photo:
            try:
                return self.profile_photo.url
            except:
                return None
        return None


class Resume(models.Model):
    """
    Resume file model
    Stores PDF resume files with validation and activation status
    """
    file = models.FileField(
        upload_to=resume_upload_path,
        validators=[validate_pdf],
        help_text='Upload a PDF file (max 5MB)'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Only one resume can be active at a time"
    )
    filename = models.CharField(
        max_length=255,
        blank=True,
        help_text="Original filename for reference"
    )
    file_size = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="File size in bytes"
    )

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resume Uploads"
        ordering = ['-uploaded_at']

    def __str__(self):
        status = "ACTIVE" if self.is_active else "Inactive"
        filename = self.filename or (self.file.name.split(
            '/')[-1] if self.file else "No file")
        return f"Resume - {filename} ({status})"

    def clean(self):
        """Enhanced model validation"""
        super().clean()

        # Validate file exists
        if not self.file:
            raise ValidationError({
                'file': 'Resume file is required.'
            })

        # Additional file validation
        if self.file:
            try:
                # Check if file is accessible
                self.file.seek(0)
                self.file.read(1)
                self.file.seek(0)
            except Exception as e:
                logger.error(f"Resume file validation error: {str(e)}")
                raise ValidationError({
                    'file': f'File is not accessible: {str(e)}'
                })

    def save(self, *args, **kwargs):
        """Enhanced save method with automatic activation logic"""
        is_new = self.pk is None

        try:
            # Store metadata
            if self.file:
                self.filename = os.path.basename(self.file.name)
                try:
                    self.file_size = self.file.size
                except:
                    self.file_size = None

            # If this resume is being set as active, deactivate all others
            if self.is_active:
                Resume.objects.exclude(pk=self.pk).update(is_active=False)
                logger.info(
                    f"Deactivated other resumes for new active resume: {self.filename}")

            # Validate before saving
            self.full_clean()

            super().save(*args, **kwargs)

            action = "uploaded" if is_new else "updated"
            logger.info(
                f"Resume {action}: {self.filename} (Active: {self.is_active})")

        except Exception as e:
            logger.error(
                f"Error saving Resume object: {str(e)}", exc_info=True)
            raise

    def delete(self, *args, **kwargs):
        """Enhanced delete method with file cleanup"""
        filename = self.filename or "Unknown file"

        try:
            # Delete the physical file if it exists
            if self.file:
                try:
                    if os.path.isfile(self.file.path):
                        os.remove(self.file.path)
                        logger.info(f"Physical file deleted: {self.file.path}")
                except Exception as e:
                    logger.warning(f"Could not delete physical file: {str(e)}")

            super().delete(*args, **kwargs)
            logger.info(f"Resume deleted: {filename}")

        except Exception as e:
            logger.error(
                f"Error deleting Resume object: {str(e)}", exc_info=True)
            raise

    @property
    def file_size_display(self):
        """Human readable file size"""
        if self.file_size:
            size = self.file_size
            if size < 1024:
                return f"{size} bytes"
            elif size < 1024 * 1024:
                return f"{size / 1024:.1f} KB"
            else:
                return f"{size / (1024 * 1024):.1f} MB"
        return "Unknown size"

    @property
    def is_file_accessible(self):
        """Check if the file is accessible"""
        if self.file:
            try:
                return bool(self.file.url)
            except:
                return False
        return False

    @property
    def file_url(self):
        """Get file URL safely"""
        if self.is_file_accessible:
            try:
                return self.file.url
            except:
                return None
        return None

    @classmethod
    def get_active_resume(cls):
        """Get the currently active resume"""
        try:
            return cls.objects.filter(is_active=True).latest('uploaded_at')
        except cls.DoesNotExist:
            return None

    @classmethod
    def activate_resume(cls, resume_id):
        """Activate a specific resume and deactivate others"""
        try:
            # Deactivate all resumes
            cls.objects.update(is_active=False)

            # Activate the specified resume
            resume = cls.objects.get(pk=resume_id)
            resume.is_active = True
            resume.save()

            logger.info(f"Resume activated: {resume.filename}")
            return resume

        except cls.DoesNotExist:
            logger.error(f"Resume with ID {resume_id} not found")
            raise ValidationError(f"Resume with ID {resume_id} not found")
        except Exception as e:
            logger.error(f"Error activating resume: {str(e)}")
            raise
