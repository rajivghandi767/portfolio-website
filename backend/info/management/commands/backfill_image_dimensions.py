from __future__ import annotations

import logging
import re
from typing import Any, Union

from django.core.management.base import BaseCommand

from projects.models import Project
from blog.models import Post
from wallet.models import Card
from info.models import Info

logger = logging.getLogger(__name__)

# Concrete model types that this command works with
_ModelType = Union[type[Project], type[Post], type[Card], type[Info]]


class Command(BaseCommand):
    help = "Backfills image_width and image_height for all existing images, and fixes missing alt attributes in HTML"

    def handle(self, *args: Any, **kwargs: Any) -> None:
        models_to_check: list[tuple[_ModelType, str]] = [
            (Project, "thumbnail"),
            (Post, "image"),
            (Card, "image"),
            (Info, "profile_photo"),
        ]

        total_updated = 0

        for model, field_name in models_to_check:
            items = model.objects.all()
            for item in items:
                updated = False
                update_fields: list[str] = []

                # Fix missing alt attributes in HTML fields (body, description)
                html_fields = ["body", "description"]
                for html_field in html_fields:
                    if hasattr(item, html_field):
                        html_content = getattr(item, html_field)
                        if html_content:
                            # Add alt="" to <img> if not present
                            new_html, count = re.subn(
                                r"<img(?![^>]*\balt=)[^>]*>",
                                lambda m: m.group(0).replace(
                                    "<img", '<img alt="Embedded image"'
                                ),
                                html_content,
                                flags=re.IGNORECASE,
                            )
                            if count > 0:
                                setattr(item, html_field, new_html)
                                update_fields.append(html_field)
                                updated = True

                image_field = getattr(item, field_name)

                # Check if image exists and dimensions are missing
                if image_field and (not item.image_width or not item.image_height):  # type: ignore[attr-defined]
                    try:
                        width: int = image_field.width
                        height: int = image_field.height

                        item.image_width = width  # type: ignore[attr-defined]
                        item.image_height = height  # type: ignore[attr-defined]

                        update_fields.extend(["image_width", "image_height"])
                        updated = True
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(
                                f"Failed to read dimensions for {model.__name__} {item.pk}: {e}"
                            )
                        )

                if updated:
                    try:
                        item.save(update_fields=update_fields)
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Updated {model.__name__} {item.pk}: Fields {update_fields}"
                            )
                        )
                        total_updated += 1
                    except Exception as e:
                        self.stdout.write(
                            self.style.ERROR(
                                f"Failed to update {model.__name__} {item.pk}: {e}"
                            )
                        )

        self.stdout.write(
            self.style.SUCCESS(f"Successfully updated {total_updated} items.")
        )
