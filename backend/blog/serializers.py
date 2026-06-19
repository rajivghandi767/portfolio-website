from __future__ import annotations

from typing import Any, Optional

from rest_framework import serializers
from rest_framework.request import Request

from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
    class Meta:
        model = Category
        fields = ["id", "name"]


class PostSerializer(serializers.ModelSerializer):  # type: ignore[type-arg]
    image_url = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "body",
            "created_on",
            "last_modified",
            "image_url",
            "image_width",
            "image_height",
            "categories",
            "tags",
            "order",
            "status",
            "publish_date",
            "slug",
        ]

    def get_image_url(self, obj: Post) -> Optional[str]:
        if obj.image and hasattr(obj.image, "url"):
            request: Optional[Request] = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_tags(self, obj: Post) -> list[str]:
        return [cat.name for cat in obj.categories.all()]
