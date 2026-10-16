from __future__ import annotations

import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Card


def get_test_image(width: int = 400, height: int = 250, name: str = "card_test.jpg") -> SimpleUploadedFile:
    file = io.BytesIO()
    image = Image.new("RGB", (width, height), color="gold")
    image.save(file, format="JPEG")
    file.seek(0)
    return SimpleUploadedFile(name, file.read(), content_type="image/jpeg")


class WalletModelAndAPITests(APITestCase):
    def test_save_with_image_populates_dimensions(self) -> None:
        img = get_test_image(width=400, height=250, name="card.jpg")
        card = Card.objects.create(
            card_name="Sapphire Reserve",
            description="Premium travel card.",
            image=img,
        )
        self.assertEqual(card.image_width, 400)
        self.assertEqual(card.image_height, 250)

    def test_save_without_image_leaves_dimensions_none(self) -> None:
        card = Card.objects.create(
            card_name="Standard Card",
            description="Card without image.",
        )
        self.assertIsNone(card.image_width)
        self.assertIsNone(card.image_height)

    def test_get_card_list_api(self) -> None:
        Card.objects.create(
            card_name="Test Card",
            description="Card text.",
        )
        url = reverse("cards-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
