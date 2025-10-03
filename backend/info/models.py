import logging
from django.db import models
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)


class Info(models.Model):
    site_header = models.CharField(
        max_length=100,
        default="Portfolio Website",
        help_text="Site Header - Full Name, Site Title, etc.")
    professional_title = models.CharField(
        max_length=100,
        default="Software Developer",
        help_text="Professional Title (displayed under Site Header)")
    profile_photo = models.ImageField(
        upload_to='profile_photos/', blank=True, null=True)
    greeting = models.CharField(
        max_length=100,
        default="Hello!",
        help_text="Homepage Greeting"
    )
    bio = models.TextField(
        help_text="Bio"
    )
    github = models.URLField(
        blank=True,
        null=True,
        help_text="GitHub Profile URL (optional)"
    )
    linkedin = models.URLField(
        blank=True,
        null=True,
        help_text="Linkedin Profile URL (optional)"
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
        super().clean()
        if self.github and not self.github.startswith(('http://', 'https://')):
            raise ValidationError({
                'github': 'GitHub URL must start with http:// or https://'
            })
        if self.linkedin and not self.linkedin.startswith(('http://', 'https://')):
            raise ValidationError({
                'linkedin': 'Linkedin URL must start with http:// or https://'
            })
        if len(self.bio) < 10:
            raise ValidationError({
                'bio': 'Bio must be at least 10 characters long.'
            })

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        try:
            self.full_clean()
            super().save(*args, **kwargs)
            action = "created" if is_new else "updated"
            logger.info(f"Info object {action}: {self.greeting}")
        except Exception as e:
            logger.error(f"Error saving Info object: {str(e)}", exc_info=True)
            raise

    @property
    def has_profile_photo(self):
        return bool(self.profile_photo)

    @property
    def profile_photo_url(self):
        if self.profile_photo:
            try:
                return self.profile_photo.url
            except:
                return None
        return None


class Resume(models.Model):
    file = models.FileField(upload_to='resumes/', blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Only one resume can be active at a time"
    )

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resume Uploads"
        ordering = ['-uploaded_at']

    def __str__(self):
        status = "ACTIVE" if self.is_active else "Inactive"
        if self.file:
            return f"Resume - {self.file.name} ({status})"
        return f"Resume - (No file) ({status})"

    def clean(self):
        super().clean()
        if not self.file:
            raise ValidationError({'file': 'Resume file is required.'})

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        try:
            if self.is_active:
                Resume.objects.exclude(pk=self.pk).update(is_active=False)
                logger.info(
                    f"Deactivated other resumes for new active resume: {self.file.name if self.file else 'N/A'}")
            self.full_clean()
            super().save(*args, **kwargs)
            action = "uploaded" if is_new else "updated"
            logger.info(
                f"Resume {action}: {self.file.name if self.file else 'N/A'} (Active: {self.is_active})")
        except Exception as e:
            logger.error(
                f"Error saving Resume object: {str(e)}", exc_info=True)
            raise

    def delete(self, *args, **kwargs):
        filename = self.file.name if self.file else "Unknown file"
        try:
            super().delete(*args, **kwargs)
            logger.info(f"Resume deleted: {filename}")
        except Exception as e:
            logger.error(
                f"Error deleting Resume object: {str(e)}", exc_info=True)
            raise

    @property
    def file_size_display(self):
        if self.file and self.file.size:
            size = self.file.size
            if size < 1024:
                return f"{size} bytes"
            elif size < 1024 * 1024:
                return f"{size / 1024:.1f} KB"
            else:
                return f"{size / (1024 * 1024):.1f} MB"
        return "Unknown size"

    @property
    def is_file_accessible(self):
        return bool(self.file)

    @property
    def file_url(self):
        if self.file:
            try:
                return self.file.url
            except:
                return None
        return None

    @classmethod
    def get_active_resume(cls):
        try:
            return cls.objects.filter(is_active=True).latest('uploaded_at')
        except cls.DoesNotExist:
            return None

    @classmethod
    def activate_resume(cls, resume_id):
        try:
            cls.objects.update(is_active=False)
            resume = cls.objects.get(pk=resume_id)
            resume.is_active = True
            resume.save()
            logger.info(
                f"Resume activated: {resume.file.name if resume.file else 'N/A'}")
            return resume
        except cls.DoesNotExist:
            logger.error(f"Resume with ID {resume_id} not found")
            raise ValidationError(f"Resume with ID {resume_id} not found")
        except Exception as e:
            logger.error(f"Error activating resume: {str(e)}")
            raise
