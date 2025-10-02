from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):

    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ["id", "title", "description", "technology",
                  "repo", "deployed_url", "thumbnail_url", "order"]

    def get_thumbnail_url(self, obj):
        if obj.thumbnail and hasattr(obj.thumbnail, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
