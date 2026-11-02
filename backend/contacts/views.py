from __future__ import annotations

import logging
from typing import Any

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import Contact
from .serializers import ContactSerializer

logger = logging.getLogger(__name__)


class ContactViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):  # type: ignore[type-arg]
    http_method_names = ["post", "options"]
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "contact"

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

