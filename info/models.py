from django.db import models


class Bio(models.Model):
    body = models.TextField()

    class Meta:
        verbose_name_plural = "bio"


class LinkedIn(models.Model):
    url = models.URLField()

    class Meta:
        verbose_name_plural = "linkedIn"


class TwitterX(models.Model):
    url = models.URLField()

    class Meta:
        verbose_name_plural = "twitter"
