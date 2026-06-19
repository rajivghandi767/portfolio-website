from __future__ import annotations

from typing import Any, Optional

from rest_framework import serializers
from rest_framework.request import Request

from .models import Project, Tag


class TagSerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
    class Meta:
        model = Tag
        fields = ["id", "name"]


class ProjectSerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
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

    def get_thumbnail_url(self, obj: Project) -> Optional[str]:
        if obj.thumbnail and hasattr(obj.thumbnail, "url"):
            request: Optional[Request] = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None
