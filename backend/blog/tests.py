from __future__ import annotations

import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Post


def get_test_image(width: int = 250, height: int = 180, name: str = "blog_test.jpg") -> SimpleUploadedFile:
    file = io.BytesIO()
    image = Image.new("RGB", (width, height), color="green")
    image.save(file, format="JPEG")
    file.seek(0)
    return SimpleUploadedFile(name, file.read(), content_type="image/jpeg")


class BlogModelAndAPITests(APITestCase):
    def test_save_with_image_populates_dimensions(self) -> None:
        img = get_test_image(width=300, height=150, name="cover.jpg")
        post = Post.objects.create(
            title="Optimizing Cloud Storage",
            body="Educational post content goes here.",
            image=img,
        )
        self.assertEqual(post.image_width, 300)
        self.assertEqual(post.image_height, 150)
        self.assertEqual(post.slug, "optimizing-cloud-storage")

    def test_save_without_image_leaves_dimensions_none(self) -> None:
        post = Post.objects.create(
            title="Text Only Post",
            body="Post without an image.",
        )
        self.assertIsNone(post.image_width)
        self.assertIsNone(post.image_height)

    def test_get_post_list_api(self) -> None:
        Post.objects.create(
            title="Published Post",
            body="Some text.",
            status="published",
        )
        url = reverse("post-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
