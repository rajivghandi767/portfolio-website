from __future__ import annotations

from typing import Optional

from rest_framework import serializers

from .models import Contact


class ContactSerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
    class Meta:
        model = Contact
        fields = ["id", "name", "email", "message", "created_at", "is_read"]
