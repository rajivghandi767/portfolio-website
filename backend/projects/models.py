from __future__ import annotations

from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    repo = models.URLField(("Link to Repo"))
    deployed_url = models.URLField(("Link to Deployed App"), blank=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True, null=True)
    image_width = models.PositiveIntegerField(null=True, blank=True)
    image_height = models.PositiveIntegerField(null=True, blank=True)
    thumbnail = models.ImageField(
        upload_to="project_thumbnails/",
        blank=True,
        null=True,
        width_field="image_width",
        height_field="image_height",
    )
    emoji = models.CharField(
        max_length=10, blank=True, help_text="Emoji icon for project switcher"
    )
    is_visible = models.BooleanField(
        default=True, help_text="Toggle to show or hide this project on the homepage."
    )
    order = models.PositiveIntegerField(
        default=0, help_text="Set the display order of projects on the homepage"
    )
    is_visible_switcher = models.BooleanField(
        default=True,
        help_text="Toggle to show or hide this project in the Project Switcher.",
    )
    switcher_order = models.PositiveIntegerField(
        default=0, help_text="Set the display order of projects in the Project Switcher"
    )
    tags = models.ManyToManyField(Tag, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args: object, **kwargs: object) -> None:
        from django.utils.text import slugify
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
