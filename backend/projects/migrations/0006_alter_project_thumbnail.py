# Generated by Django 5.1.6 on 2025-02-18 20:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_rename_link_if_deployed_project_deployed_url'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='thumbnail',
            field=models.ImageField(blank=True, upload_to='project/images/'),
        ),
    ]
