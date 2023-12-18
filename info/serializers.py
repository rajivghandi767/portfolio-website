from rest_framework import serializers
from .models import Bio, GitHub, LinkedIn, TwitterX


class BioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bio
        fields = ["id", "body"]


class GitHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = GitHub
        fields = ["url"]


class LinkedInSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedIn
        fields = ["url"]


class TwitterXSerializer(serializers.ModelSerializer):
    class Meta:
        model = TwitterX
        fields = ["url"]
