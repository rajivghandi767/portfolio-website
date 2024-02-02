from django.db import models


class Info(models.Model):
    body = models.TextField()
    github= models.URLField()
    linkedIn = models.URLField()

    class Meta:
        verbose_name_plural = "info"

