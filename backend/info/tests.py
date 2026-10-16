from __future__ import annotations

import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Info


def get_test_image(width: int = 120, height: int = 80, name: str = "test.jpg") -> SimpleUploadedFile:
    file = io.BytesIO()
    image = Image.new("RGB", (width, height), color="blue")
    image.save(file, format="JPEG")
    file.seek(0)
    return SimpleUploadedFile(name, file.read(), content_type="image/jpeg")


class InfoModelAndAPITests(APITestCase):
    def test_save_with_image_populates_dimensions(self) -> None:
        photo = get_test_image(width=150, height=200, name="profile.jpg")
        info = Info.objects.create(
            site_header="My Portfolio",
            professional_title="Engineer",
            greeting="Hello World",
            bio="Software engineer bio description here.",
            profile_photo=photo,
        )
        self.assertEqual(info.image_width, 150)
        self.assertEqual(info.image_height, 200)

    def test_save_without_image_leaves_dimensions_none(self) -> None:
        info = Info.objects.create(
            site_header="My Portfolio",
            professional_title="Engineer",
            greeting="Hello World",
            bio="Software engineer bio description here.",
        )
        self.assertIsNone(info.image_width)
        self.assertIsNone(info.image_height)

    def test_get_info_list_api(self) -> None:
        Info.objects.create(
            site_header="My Portfolio",
            professional_title="Engineer",
            greeting="Hello World",
            bio="Software engineer bio description here.",
        )
        url = reverse("info-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
