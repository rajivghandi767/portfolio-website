# contacts/views.py
import requests
import json
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.conf import settings
from .models import Contact
from .serializers import ContactSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
import logging

logger = logging.getLogger(__name__)


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

    def send_discord_notification(self, contact_data):
        """
        Send notification to Discord via webhook
        """
        webhook_url = getattr(settings, 'DISCORD_WEBHOOK_URL', None)

        if not webhook_url:
            logger.warning("Discord webhook URL not configured")
            return False

        try:
            # Create rich embed for Discord
            embed = {
                "title": "🔔 New Contact Form Submission",
                "color": 0x00ff00,  # Green color
                "fields": [
                    {
                        "name": "👤 Name",
                        "value": contact_data['name'],
                        "inline": True
                    },
                    {
                        "name": "📧 Email",
                        "value": contact_data['email'],
                        "inline": True
                    },
                    {
                        "name": "💬 Message",
                        "value": contact_data['message'][:1000] + ("..." if len(contact_data['message']) > 1000 else ""),
                        "inline": False
                    }
                ],
                "footer": {
                    "text": "Portfolio Website Contact Form"
                },
                "timestamp": contact_data.get('created_at', '').isoformat() if contact_data.get('created_at') else None
            }

            payload = {
                "username": "Portfolio Bot",
                # Optional: Add a bot avatar
                "avatar_url": "https://rajivwallace.com/static/images/bot-avatar.png",
                "embeds": [embed]
            }

            response = requests.post(
                webhook_url,
                json=payload,
                timeout=10
            )

            if response.status_code == 204:
                logger.info("Discord notification sent successfully")
                return True
            else:
                logger.error(
                    f"Discord webhook failed with status {response.status_code}: {response.text}")
                return False

        except requests.RequestException as e:
            logger.error(f"Error sending Discord notification: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error in Discord notification: {str(e)}")
            return False

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the contact submission to database
        contact = serializer.save()

        # Prepare contact data for notifications
        contact_data = {
            'name': serializer.validated_data['name'],
            'email': serializer.validated_data['email'],
            'message': serializer.validated_data['message'],
            'created_at': contact.created_at
        }

        # Send Discord notification (non-blocking)
        discord_sent = self.send_discord_notification(contact_data)

        # Send email notifications
        email_sent = True
        try:
            # Send notification email to you
            admin_message = f"""
            New contact form submission:

            Name: {contact_data['name']}
            Email: {contact_data['email']}

            Message:
            {contact_data['message']}

            This message was sent through your Portfolio Website contact form.
            Discord notification: {'✅ Sent' if discord_sent else '❌ Failed'}
            """

            send_mail(
                subject=f"New Contact from {contact_data['name']}",
                message=admin_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_EMAIL],
                fail_silently=False,
            )

            # Send confirmation email to the sender
            user_message = f"""
            Hi {contact_data['name']},

            Thank you for reaching out! I've received your message and will get back to you soon.

            Best Regards,

            Rajiv Wallace
            """

            send_mail(
                subject="Thank you for your message",
                message=user_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[contact_data['email']],
                fail_silently=False,
            )

        except Exception as e:
            email_sent = False
            logger.error(f"Error sending email: {str(e)}")

        # Return success response with notification status
        return Response({
            'status': 'success',
            'message': 'Your message has been sent successfully!',
            'notifications': {
                'email': email_sent,
                'discord': discord_sent
            }
        })
