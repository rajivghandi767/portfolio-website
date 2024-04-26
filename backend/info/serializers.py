from rest_framework import serializers
from .models import Info


class InfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Info
        fields = ["id", "profile_photo",
                  "greeting", "bio", "github", "linkedIn"]
