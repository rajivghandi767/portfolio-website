from __future__ import annotations

from typing import Any, Union

import logging
from rest_framework import viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Contact
from .serializers import ContactSerializer

logger = logging.getLogger(__name__)


class ContactViewSet(viewsets.ModelViewSet):  # type: ignore[type-arg]
    http_method_names = ["get", "post", "head", "options"]
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_permissions(self) -> list[BasePermission]:
        """
        Allow anyone to create a contact,
        but require authentication for other actions
        """
        permission_classes: list[type[BasePermission]]
        if self.action == "create":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the contact submission to database
        contact: Contact = serializer.save()

        # Send notifications (Discord)
        notification_status: dict[str, bool] = contact.send_notifications()

        # Return success response with notification status
        return Response(
            {
                "status": "success",
                "message": "Your message has been sent successfully!",
                "notifications": notification_status,
            }
        )
