from __future__ import annotations

from typing import Optional

from rest_framework import serializers
from rest_framework.request import Request

from .models import Card


class CardSerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = [
            "id",
            "card_name",
            "description",
            "annual_fee",
            "referral_link",
            "image_url",
            "image_width",
            "image_height",
            "order",
        ]

    def get_image_url(self, obj: Card) -> Optional[str]:
        if obj.image and hasattr(obj.image, "url"):
            request: Optional[Request] = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
