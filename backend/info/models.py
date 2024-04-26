from django.db import models


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
