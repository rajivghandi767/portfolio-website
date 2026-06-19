from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Card(models.Model):
    """
    Card Model
    
    Highly educational note: This model represents a credit card in the portfolio. 
    Notice the use of `CKEditor5Field` for the description instead of a standard `TextField`. 
    This allows the admin user to input rich text (HTML) directly from the Django admin interface, 
    which is safely rendered on the frontend using `dangerouslySetInnerHTML`.
    """
    card_name = models.CharField(max_length=100)
    description = CKEditor5Field("Text", config_name="default")
    annual_fee = models.CharField(("Annual Fee"), max_length=20, blank=True)
    referral_link = models.URLField(("Referral Link"), blank=True)
    image_width = models.PositiveIntegerField(null=True, blank=True)
    image_height = models.PositiveIntegerField(null=True, blank=True)
    image = models.ImageField(
        upload_to="card_images/",
        blank=True,
        null=True,
        width_field="image_width",
        height_field="image_height",
    )
    order = models.PositiveIntegerField(
        default=0, help_text="Set the display order of cards."
    )

    class Meta:
        """
        Highly educational note: The `Meta` inner class is used in Django models to define 
        model-level metadata. Here, `ordering = ["order"]` ensures that whenever we query 
        `Card.objects.all()`, the results are automatically sorted by the `order` field 
        without needing to explicitly call `.order_by("order")`.
        """
        ordering = ["order"]

    def __str__(self):
        return self.card_name
