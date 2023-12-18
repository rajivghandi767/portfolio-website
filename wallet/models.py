from django.db import models


class Card(models.Model):
    card_name = models.CharField(max_length=100)
    description = models.TextField()
    referral_link = models.URLField(("Referral Link"))
    image = models.FileField(upload_to="wallet_images/", blank=True)
