from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
import os


class Info(models.Model):
    profile_photo = models.ImageField(upload_to="info_images/", blank=True)
    greeting = models.CharField(max_length=100, default="Hello!")
    bio = models.TextField()
    github = models.URLField()
    linkedIn = models.URLField()

    class Meta:
        verbose_name_plural = "info"

    def __str__(self):
        return ("Info")


def validate_pdf(file):
    """
    Validates uploaded files to ensure they are PDFs and meet size requirements.
    This function checks both the file extension and size to maintain quality control
    without relying on external libraries.

    Args:
        file: The uploaded file object from the form/request

    Raises:
        ValidationError: If the file isn't a PDF or exceeds size limits
    """
    # Check file extension
    valid_extensions = ['.pdf', '.PDF']
    ext = os.path.splitext(file.name)[1]

    if ext not in valid_extensions:
        raise ValidationError('Invalid file format. Please upload a PDF file.')

    # Check file size (5MB limit)
    max_size = 5 * 1024 * 1024  # 5MB in bytes
    if file.size > max_size:
        raise ValidationError('File size must be under 5MB.')

    # Additional check: ensure file is not empty
    if file.size == 0:
        raise ValidationError('The uploaded file is empty.')


class Resume(models.Model):
    """
    Model to manage resume uploads with version control and active status tracking.
    Ensures proper file validation and maintains a history of resume versions.
    """
    title = models.CharField(
        max_length=100,
        help_text="A descriptive title for this version of your resume"
    )

    file = models.FileField(
        upload_to='resumes/%Y/%m/',  # Organizes files by year/month
        validators=[validate_pdf],
        help_text="Upload your resume in PDF format (max 5MB)"
    )

    is_active = models.BooleanField(
        default=True,
        help_text="Only one resume can be active at a time"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    version = models.PositiveIntegerField(
        default=1,
        help_text="Version number of this resume"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Resume"
        verbose_name_plural = "Resume"

    def __str__(self):
        """
        Provides a readable string representation of the resume,
        including its title, version, and active status.
        """
        status = "Active" if self.is_active else "Inactive"
        return f"{self.title} (v{self.version}) - {status}"

    def clean(self):
        """
        Performs model-level validation to ensure business rules are followed,
        particularly that only one resume can be active at a time.
        """
        if self.is_active:
            active_resumes = Resume.objects.exclude(
                id=self.id).filter(is_active=True)
            if active_resumes.exists():
                raise ValidationError({
                    'is_active': 'Another resume is already active. Please deactivate it first.'
                })

    def save(self, *args, **kwargs):
        """
        Custom save method that handles version numbering and ensures
        only one resume is active at a time.
        """
        # If this is a new resume, set its version number
        if not self.pk:
            latest_resume = Resume.objects.order_by('-version').first()
            self.version = (latest_resume.version + 1) if latest_resume else 1

        # If this resume is being made active, deactivate all others
        if self.is_active:
            Resume.objects.filter(is_active=True).exclude(id=self.id).update(
                is_active=False
            )

        super().save(*args, **kwargs)
