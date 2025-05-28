# contacts/views.py
import requests
import json
from rest_framework import viewsets
from rest_framework.response import Response
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

    def send_resend_emails(self, contact_data):
        """
        Send emails using Resend API
        Returns tuple: (admin_email_sent, user_email_sent)
        """
        resend_api_key = getattr(settings, 'RESEND_API_KEY', None)

        if not resend_api_key:
            logger.warning("Resend API key not configured")
            return False, False

        headers = {
            'Authorization': f'Bearer {resend_api_key}',
            'Content-Type': 'application/json'
        }

        admin_sent = False
        user_sent = False

        try:
            # Send notification email to you (admin)
            admin_payload = {
                "from": f"Portfolio Contact <{settings.DEFAULT_FROM_EMAIL}>",
                "to": [settings.CONTACT_EMAIL],
                "subject": f"New Contact from {contact_data['name']}",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                        🔔 New Contact Form Submission
                    </h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
                        <p><strong>👤 Name:</strong> {contact_data['name']}</p>
                        <p><strong>📧 Email:</strong> <a href="mailto:{contact_data['email']}">{contact_data['email']}</a></p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">💬 Message</h3>
                        <p style="line-height: 1.6; white-space: pre-wrap;">{contact_data['message']}</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #666; font-size: 14px;">
                        This message was sent through your Portfolio Website contact form at 
                        <a href="https://rajivwallace.com">rajivwallace.com</a>
                    </p>
                </div>
                """,
                "text": f"""
New contact form submission:

Name: {contact_data['name']}
Email: {contact_data['email']}

Message:
{contact_data['message']}

This message was sent through your Portfolio Website contact form.
                """
            }

            admin_response = requests.post(
                'https://api.resend.com/emails',
                headers=headers,
                json=admin_payload,
                timeout=10
            )

            if admin_response.status_code == 200:
                admin_sent = True
                logger.info("Admin email sent successfully via Resend")
            else:
                logger.error(
                    f"Admin email failed: {admin_response.status_code} - {admin_response.text}")

        except Exception as e:
            logger.error(f"Error sending admin email via Resend: {str(e)}")

        try:
            # Send confirmation email to the user
            user_payload = {
                "from": f"Rajiv Wallace <{settings.DEFAULT_FROM_EMAIL}>",
                "to": [contact_data['email']],
                "subject": "Thank you for your message - Rajiv Wallace",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                        Thank You for Reaching Out!
                    </h2>
                    
                    <p>Hi <strong>{contact_data['name']}</strong>,</p>
                    
                    <p style="line-height: 1.6;">
                        Thank you for reaching out through my portfolio website! I've received your message and 
                        will get back to you as soon as possible.
                    </p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #007bff; margin-top: 0;">Your Message</h3>
                        <p style="line-height: 1.6; white-space: pre-wrap; font-style: italic;">"{contact_data['message'][:200]}{'...' if len(contact_data['message']) > 200 else ''}"</p>
                    </div>
                    
                    <p style="line-height: 1.6;">
                        In the meantime, feel free to check out my latest projects and blog posts on 
                        <a href="https://rajivwallace.com" style="color: #007bff;">my website</a>.
                    </p>
                    
                    <p style="line-height: 1.6;">
                        Best regards,<br>
                        <strong>Rajiv Wallace</strong><br>
                        Software Engineer & Web Developer<br>
                        <a href="https://rajivwallace.com" style="color: #007bff;">rajivwallace.com</a>
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    
                    <p style="color: #666; font-size: 12px;">
                        This is an automated response. Please do not reply to this email.
                        If you need immediate assistance, please send a new message through the contact form.
                    </p>
                </div>
                """,
                "text": f"""
Hi {contact_data['name']},

Thank you for reaching out through my portfolio website! I've received your message and will get back to you as soon as possible.

Your message: "{contact_data['message'][:200]}{'...' if len(contact_data['message']) > 200 else ''}"

In the meantime, feel free to check out my latest projects and blog posts on my website.

Best regards,

Rajiv Wallace
Software Engineer & Web Developer
https://rajivwallace.com
                """
            }

            user_response = requests.post(
                'https://api.resend.com/emails',
                headers=headers,
                json=user_payload,
                timeout=10
            )

            if user_response.status_code == 200:
                user_sent = True
                logger.info(
                    "User confirmation email sent successfully via Resend")
            else:
                logger.error(
                    f"User email failed: {user_response.status_code} - {user_response.text}")

        except Exception as e:
            logger.error(f"Error sending user email via Resend: {str(e)}")

        return admin_sent, user_sent

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

        # Send Resend emails (non-blocking)
        admin_email_sent, user_email_sent = self.send_resend_emails(
            contact_data)

        # Return success response with notification status
        return Response({
            'status': 'success',
            'message': 'Your message has been sent successfully!',
            'notifications': {
                'discord': discord_sent,
                'admin_email': admin_email_sent,
                'user_email': user_email_sent
            }
        })
