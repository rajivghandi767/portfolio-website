# contacts/serializers.py
from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at', 'is_read']
