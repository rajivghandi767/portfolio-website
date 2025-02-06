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

        # Save the contact submission to your database
        contact = self.perform_create(serializer)

        try:
            # Send notification email to you
            admin_message = f"""
            New contact form submission:

            Name: {serializer.validated_data['name']}
            Email: {serializer.validated_data['email']}

            Message:
            {serializer.validated_data['message']}

            This message was sent through your Portfolio Website contact form.
            """

            send_mail(
                subject=f"New Contact from {
                    serializer.validated_data['name']}",
                message=admin_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )

            # Send confirmation email to the sender
            user_message = f"""
            Hi {serializer.validated_data['name']},

            Thank you for reaching out! I've received your message and will get back to you soon.

            Best Regards,

            Rajiv Wallace
            """

            send_mail(
                subject="Thank you for your message",
                message=user_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[serializer.validated_data['email']],
                fail_silently=False,
            )

        except Exception as e:
            # Log the error but don't prevent the submission from being saved
            print(f"Error sending email: {str(e)}")
            # In production, you might want to use proper logging:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error sending email: {str(e)}")

        return Response({
            'status': 'success',
            'message': 'Your message has been sent successfully!'
        })
