# Generated by Django 5.0 on 2024-04-26 21:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_alter_project_link_if_deployed'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='image',
            new_name='thumbnail',
        ),
    ]
