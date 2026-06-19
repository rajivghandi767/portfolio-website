from __future__ import annotations

from typing import Any

from django.core.management.base import BaseCommand

from wallet.models import Card


class Command(BaseCommand):
    help = "Seeds initial portfolio data including credit cards."

    def handle(self, *args: Any, **kwargs: Any) -> None:
        self.stdout.write("Seeding wallet (credit cards) data...")

        cards_data: list[dict[str, Any]] = [
            {
                "card_name": "Chase Sapphire Preferred",
                "description": "<p>A great starter travel card with valuable points.</p>",
                "annual_fee": "$95",
                "referral_link": "https://creditcards.chase.com/refer-a-friend",
                "order": 1,
            },
            {
                "card_name": "American Express Gold",
                "description": "<p>Excellent for dining and groceries.</p>",
                "annual_fee": "$250",
                "referral_link": "https://americanexpress.com/en-us/referral",
                "order": 2,
            },
            {
                "card_name": "Capital One Venture X",
                "description": "<p>Premium travel benefits with a reasonable fee.</p>",
                "annual_fee": "$395",
                "referral_link": "https://capitalone.com/referral",
                "order": 3,
            },
        ]

        for data in cards_data:
            obj, created = Card.objects.get_or_create(
                card_name=data["card_name"],
                defaults={
                    "description": data["description"],
                    "annual_fee": data["annual_fee"],
                    "referral_link": data["referral_link"],
                    "order": data["order"],
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created card: {obj.card_name}"))
            else:
                self.stdout.write(f"Card already exists: {obj.card_name}")

        self.stdout.write(self.style.SUCCESS("Successfully seeded portfolio data."))
