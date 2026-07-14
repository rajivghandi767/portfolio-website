from django.db import migrations

def update_bio(apps, schema_editor):
    Info = apps.get_model('info', 'Info')
    for info in Info.objects.all():
        if "Self-taught Software Engineer based in NYC" in info.bio:
            info.bio = info.bio.replace(
                "Aviation nerd, Chelsea FC supporter",
                "Aviation nerd, Formula One fan, Chelsea FC supporter"
            )
            info.save()

def reverse_bio(apps, schema_editor):
    Info = apps.get_model('info', 'Info')
    for info in Info.objects.all():
        if "Formula One fan" in info.bio:
            info.bio = info.bio.replace(
                "Aviation nerd, Formula One fan, Chelsea FC supporter",
                "Aviation nerd, Chelsea FC supporter"
            )
            info.save()

class Migration(migrations.Migration):

    dependencies = [
        ('info', '0006_info_image_height_info_image_width_and_more'),
    ]

    operations = [
        migrations.RunPython(update_bio, reverse_bio),
    ]
