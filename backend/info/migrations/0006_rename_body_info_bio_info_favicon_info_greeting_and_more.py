# Generated by Django 5.0 on 2024-04-26 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('info', '0005_info_delete_bio_delete_github_delete_linkedin'),
    ]

    operations = [
        migrations.RenameField(
            model_name='info',
            old_name='body',
            new_name='bio',
        ),
        migrations.AddField(
            model_name='info',
            name='favicon',
            field=models.FileField(blank=True, upload_to='info_images/'),
        ),
        migrations.AddField(
            model_name='info',
            name='greeting',
            field=models.CharField(default='Hello!', max_length=100),
        ),
        migrations.AddField(
            model_name='info',
            name='profile_photo',
            field=models.FileField(blank=True, upload_to='info_images/'),
        ),
    ]
