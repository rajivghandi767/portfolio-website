from django.db import models


class Bio(models.Model):
    body = models.TextField()

    class Meta:
        verbose_name_plural = "bio"


class GitHub(models.Model):
    url = models.URLField()

    class Meta:
        verbose_name_plural = "GitHub"


class LinkedIn(models.Model):
    url = models.URLField()

    class Meta:
        verbose_name_plural = "LinkedIn"
