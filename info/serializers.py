from rest_framework import serializers
from .models import Bio, LinkedIn, TwitterX


class BioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bio
        fields = ["body"]


class LinkedInSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedIn
        fields = ["url"]


class TwitterXSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwitterX
        fields = ["url"]
