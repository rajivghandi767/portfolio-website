from __future__ import annotations

from rest_framework import serializers

from config.constants import MAX_CONTACT_MESSAGE_LENGTH
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
    message = serializers.CharField(max_length=MAX_CONTACT_MESSAGE_LENGTH)

    class Meta:
        model = Contact
        fields = ["id", "name", "email", "message", "created_at", "is_read"]
        read_only_fields = ["id", "created_at", "is_read"]

