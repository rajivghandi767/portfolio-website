from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ["id", "card_name", "description",
                  "annual_fee", "referral_link", "image"]
