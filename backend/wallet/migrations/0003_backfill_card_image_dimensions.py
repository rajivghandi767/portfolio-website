from django.db import migrations


def backfill_dimensions(apps, schema_editor):
    Card = apps.get_model("wallet", "Card")
    for card in Card.objects.filter(image__isnull=False).exclude(image=""):
        if not card.image_width or not card.image_height:
            try:
                from django.core.files.images import get_image_dimensions

                dims = get_image_dimensions(card.image)
                if dims and dims[0] and dims[1]:
                    card.image_width, card.image_height = dims
                    card.save(update_fields=["image_width", "image_height"])
            except Exception:
                pass


def reverse_backfill(apps, schema_editor):
    # Dimensions remain intact on reverse migration as a safe no-op.
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("wallet", "0002_card_image_height_card_image_width_alter_card_image"),
    ]

    operations = [
        migrations.RunPython(backfill_dimensions, reverse_backfill),
    ]
