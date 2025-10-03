from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Card(models.Model):
    card_name = models.CharField(max_length=100)
    description = CKEditor5Field('Text', config_name='default')
    annual_fee = models.CharField(("Annual Fee"), max_length=20, blank=True)
    referral_link = models.URLField(("Referral Link"), blank=True)
    image = models.ImageField(upload_to='card_images/', blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Set the display order of cards.")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.card_name
