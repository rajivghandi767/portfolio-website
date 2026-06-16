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
        Send all relevant notifications (Discord) for this contact.
        Returns a dictionary of notification statuses.
        """
        discord_sent = self._send_discord_notification()
        
        return {
            'discord': discord_sent
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


