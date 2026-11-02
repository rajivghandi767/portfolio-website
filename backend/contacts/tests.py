from __future__ import annotations

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from config.constants import MAX_CONTACT_MESSAGE_LENGTH
from .models import Contact


class ContactAPITests(APITestCase):
    def setUp(self) -> None:
        self.url = reverse("contact-list")

    def test_create_contact_submission(self) -> None:
        payload = {
            "name": "Ada Lovelace",
            "email": "ada@example.com",
            "message": "Hello from the Analytical Engine!",
            "is_read": True,
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")

        contact = Contact.objects.get(email="ada@example.com")
        self.assertEqual(contact.name, "Ada Lovelace")
        self.assertFalse(contact.is_read)

    def test_get_contact_list_disallowed(self) -> None:
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_contact_message_max_length_enforced(self) -> None:
        payload = {
            "name": "Ada Lovelace",
            "email": "ada@example.com",
            "message": "x" * (MAX_CONTACT_MESSAGE_LENGTH + 1),
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
