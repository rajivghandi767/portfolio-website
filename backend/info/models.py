from django.db import models
from .validators import validate_pdf


class Info(models.Model):
    profile_photo = models.ImageField(upload_to="info/photos", blank=True)
    greeting = models.CharField(max_length=100, default="Hello!")
    bio = models.TextField()
    github = models.URLField()
    linkedIn = models.URLField()

    class Meta:
        verbose_name_plural = "info"

    def __str__(self):
        return ("Info")


class Resume(models.Model):
    file = models.FileField(
        upload_to='resumes/',
        validators=[validate_pdf],
        help_text='Upload a PDF file (max 5MB)'
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "resume Uploads"
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"Resume uploaded at {self.uploaded_at}"
