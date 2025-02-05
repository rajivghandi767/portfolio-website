# contacts/views.py
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_permissions(self):
        """
        Allow anyone to create a contact,
        but require authentication for other actions
        """
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Send email notification
        try:
            send_mail(
                subject=f"New Contact Form Submission from {
                    serializer.validated_data['name']}",
                message=f"""
                Name: {serializer.validated_data['name']}
                Email: {serializer.validated_data['email']}

                Message:
                {serializer.validated_data['message']}
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )
        except Exception as e:
            # Log the error but don't prevent the contact from being saved
            print(f"Error sending email: {str(e)}")

        return Response({
            'status': 'success',
            'message': 'Your message has been sent successfully!'
        })
