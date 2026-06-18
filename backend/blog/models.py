from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field


class Category(models.Model):
    name = models.CharField(max_length=30)

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Post(models.Model):
    STATUS_CHOICES = (
        ("draft", "Draft"),
        ("published", "Published"),
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    body = CKEditor5Field("Text", config_name="default")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="draft")
    publish_date = models.DateTimeField(default=timezone.now)
    created_on = models.DateTimeField(auto_now_add=True)
    last_modified = models.DateTimeField(auto_now=True)
    image_width = models.PositiveIntegerField(null=True, blank=True)
    image_height = models.PositiveIntegerField(null=True, blank=True)
    image = models.ImageField(
        upload_to="post_images/",
        blank=True,
        null=True,
        width_field="image_width",
        height_field="image_height",
    )
    categories = models.ManyToManyField("Category", related_name="posts")
    order = models.PositiveIntegerField(
        default=0,
        help_text="Manually set order for blog posts. Default is newest first.",
    )

    class Meta:
        ordering = ["-order", "-publish_date"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        from django.conf import settings
        from django.core.signing import TimestampSigner
        from django.utils import timezone

        # True if it's a draft OR if it's published but scheduled for the future
        is_preview = self.status == "draft" or (
            self.status == "published"
            and self.publish_date
            and self.publish_date > timezone.now()
        )

        if is_preview:
            signer = TimestampSigner()
            token = signer.sign(self.slug or str(self.pk))
            path = f"/blog/preview/{self.slug}?token={token}"
        else:
            path = f"/blog/{self.slug}"

        return f"{settings.SITE_URL.rstrip('/')}{path}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
