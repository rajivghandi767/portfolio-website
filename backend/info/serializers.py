from rest_framework import serializers
from .models import Bio, GitHub, LinkedIn


class BioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bio
        fields = ["id", "body"]


class GitHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = GitHub
        fields = ["id", "url"]


class LinkedInSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedIn
        fields = ["id", "url"]
