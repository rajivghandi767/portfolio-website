from django.db import models


class Card(models.Model):
    card_name = models.CharField(max_length=100)
    description = models.TextField()
    annual_fee = models.CharField(("Annual Fee"), max_length=20, blank=True)
    referral_link = models.URLField(("Referral Link"), blank=True)
    image = models.ImageField(upload_to="wallet_images/", blank=True)

    def __str__(self):
        return self.card_name
