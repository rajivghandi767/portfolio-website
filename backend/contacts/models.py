import logging
import requests
from django.db import models
from django.utils import timezone
from django.conf import settings

logger = logging.getLogger(__name__)


class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.name} ({self.created_at.strftime('%Y-%m-%d')})"

    class Meta:
        ordering = ['-created_at']  # Newest messages first

    def send_notifications(self):
        """
        Send all relevant notifications (Discord, Email) for this contact.
        Returns a dictionary of notification statuses.
        """
        discord_sent = self._send_discord_notification()
        admin_email_sent, user_email_sent = self._send_resend_emails()
        
        return {
            'discord': discord_sent,
            'admin_email': admin_email_sent,
            'user_email': user_email_sent
        }

    def _get_site_url(self):
        return getattr(settings, 'SITE_URL', 'https://rajivwallace.com')

    def _send_discord_notification(self):
        webhook_url = getattr(settings, 'DISCORD_WEBHOOK_URL', None)
        if not webhook_url:
            logger.warning("Discord webhook URL not configured")
            return False

        try:
            embed = {
                "title": "🔔 New Contact Form Submission",
                "color": 0x00ff00,
                "fields": [
                    {"name": "👤 Name", "value": self.name, "inline": True},
                    {"name": "📧 Email", "value": self.email, "inline": True},
                    {
                        "name": "💬 Message", 
                        "value": self.message[:1000] + ("..." if len(self.message) > 1000 else ""), 
                        "inline": False
                    }
                ],
                "footer": {"text": "Portfolio Website Contact Form"},
                "timestamp": self.created_at.isoformat()
            }

            payload = {
                "username": "Portfolio Bot",
                "avatar_url": f"{self._get_site_url()}/static/images/bot-avatar.png",
                "embeds": [embed]
            }

            response = requests.post(webhook_url, json=payload, timeout=10)
            if response.status_code == 204:
                logger.info("Discord notification sent successfully")
                return True
            else:
                logger.error(f"Discord webhook failed with status {response.status_code}: {response.text}")
                return False

        except Exception as e:
            logger.error(f"Error sending Discord notification: {str(e)}")
            return False

    def _send_resend_emails(self):
        resend_api_key = getattr(settings, 'RESEND_API_KEY', None)
        if not resend_api_key:
            logger.warning("Resend API key not configured")
            return False, False

        headers = {
            'Authorization': f'Bearer {resend_api_key}',
            'Content-Type': 'application/json'
        }

        site_url = self._get_site_url()
        admin_sent = self._send_admin_email(headers, site_url)
        user_sent = self._send_user_email(headers, site_url)
        
        return admin_sent, user_sent

    def _send_admin_email(self, headers, site_url):
        contact_email = getattr(settings, 'CONTACT_EMAIL', None)
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@rajivwallace.com')
        
        if not contact_email:
            logger.warning("CONTACT_EMAIL not configured")
            return False

        try:
            admin_payload = {
                "from": f"Portfolio Contact <{from_email}>",
                "to": [contact_email],
                "subject": f"New Contact from {self.name}",
                "html": self._get_admin_email_html(site_url),
                "text": self._get_admin_email_text()
            }

            response = requests.post('https://api.resend.com/emails', headers=headers, json=admin_payload, timeout=10)
            if response.status_code == 200:
                logger.info("Admin email sent successfully via Resend")
                return True
            else:
                logger.error(f"Admin email failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error sending admin email via Resend: {str(e)}")
            return False

    def _send_user_email(self, headers, site_url):
        from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@rajivwallace.com')
        
        try:
            user_payload = {
                "from": f"Rajiv Wallace <{from_email}>",
                "to": [self.email],
                "subject": "Thank you for your message - Rajiv Wallace",
                "html": self._get_user_email_html(site_url),
                "text": self._get_user_email_text(site_url)
            }

            response = requests.post('https://api.resend.com/emails', headers=headers, json=user_payload, timeout=10)
            if response.status_code == 200:
                logger.info("User confirmation email sent successfully via Resend")
                return True
            else:
                logger.error(f"User email failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error sending user email via Resend: {str(e)}")
            return False

    def _get_admin_email_html(self, site_url):
        return f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                🔔 New Contact Form Submission
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
                <p><strong>👤 Name:</strong> {self.name}</p>
                <p><strong>📧 Email:</strong> <a href="mailto:{self.email}">{self.email}</a></p>
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">💬 Message</h3>
                <p style="line-height: 1.6; white-space: pre-wrap;">{self.message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
                This message was sent through your Portfolio Website contact form at 
                <a href="{site_url}">{site_url}</a>
            </p>
        </div>
        """

    def _get_admin_email_text(self):
        return f"""
New contact form submission:

Name: {self.name}
Email: {self.email}

Message:
{self.message}

This message was sent through your Portfolio Website contact form.
        """

    def _get_user_email_html(self, site_url):
        short_message = self.message[:200] + ('...' if len(self.message) > 200 else '')
        return f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                Thank You for Reaching Out!
            </h2>
            <p>Hi <strong>{self.name}</strong>,</p>
            <p style="line-height: 1.6;">
                Thank you for reaching out! I've received your message and will get back to you as soon as possible.
            </p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #007bff; margin-top: 0;">Your Message</h3>
                <p style="line-height: 1.6; white-space: pre-wrap; font-style: italic;">"{short_message}"</p>
            </div>
            <p style="line-height: 1.6;">
                In the meantime, feel free to check out my latest projects and blog posts on 
                <a href="{site_url}" style="color: #007bff;">my website</a>.
            </p>
            <p style="line-height: 1.6;">
                Best regards,<br>
                <strong>Rajiv Wallace</strong><br>
                Software Engineer & Web Developer<br>
                <a href="{site_url}" style="color: #007bff;">{site_url}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
                This is an automated response. Please do not reply to this email.
            </p>
        </div>
        """

    def _get_user_email_text(self, site_url):
        short_message = self.message[:200] + ('...' if len(self.message) > 200 else '')
        return f"""
Hi {self.name},

Thank you for reaching out! I've received your message and will get back to you as soon as possible.

Your message: "{short_message}"

In the meantime, feel free to check out my latest projects and blog posts on my website: {site_url}

Best regards,

Rajiv Wallace
Software Engineer & Web Developer
{site_url}
        """
