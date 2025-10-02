from rest_framework import serializers
from .models import Card


class CardSerializer(serializers.ModelSerializer):

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = ["id", "card_name", "description",
                  "annual_fee", "referral_link", "image_url", "order"]

    def get_image_url(self, obj):
        if obj.image and hasattr(obj.image, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
