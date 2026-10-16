from django.db import migrations


def backfill_dimensions(apps, schema_editor):
    Post = apps.get_model("blog", "Post")
    for post in Post.objects.filter(image__isnull=False).exclude(image=""):
        if not post.image_width or not post.image_height:
            try:
                from django.core.files.images import get_image_dimensions

                dims = get_image_dimensions(post.image)
                if dims and dims[0] and dims[1]:
                    post.image_width, post.image_height = dims
                    post.save(update_fields=["image_width", "image_height"])
            except Exception:
                pass


def reverse_backfill(apps, schema_editor):
    # Dimensions remain intact on reverse migration as a safe no-op.
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0005_alter_post_options_post_image_height_and_more"),
    ]

    operations = [
        migrations.RunPython(backfill_dimensions, reverse_backfill),
    ]
