from django.db import migrations


def backfill_dimensions(apps, schema_editor):
    Info = apps.get_model("info", "Info")
    for info in Info.objects.filter(profile_photo__isnull=False).exclude(profile_photo=""):
        if not info.image_width or not info.image_height:
            try:
                from django.core.files.images import get_image_dimensions

                dims = get_image_dimensions(info.profile_photo)
                if dims and dims[0] and dims[1]:
                    info.image_width, info.image_height = dims
                    info.save(update_fields=["image_width", "image_height"])
            except Exception:
                pass


def reverse_backfill(apps, schema_editor):
    # Dimensions remain intact on reverse migration as a safe no-op.
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("info", "0007_update_bio_f1"),
    ]

    operations = [
        migrations.RunPython(backfill_dimensions, reverse_backfill),
    ]
