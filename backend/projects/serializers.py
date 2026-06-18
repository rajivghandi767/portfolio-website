from rest_framework import serializers
from .models import Project, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class ProjectSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "description",
            "repo",
            "deployed_url",
            "thumbnail_url",
            "image_width",
            "image_height",
            "emoji",
            "order",
            "switcher_order",
            "is_visible",
            "is_visible_switcher",
            "tags",
        )

    def get_thumbnail_url(self, obj):
        if obj.thumbnail and hasattr(obj.thumbnail, "url"):
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
