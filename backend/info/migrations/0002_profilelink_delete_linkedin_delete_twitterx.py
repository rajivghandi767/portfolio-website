# Generated by Django 5.0 on 2023-12-18 21:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('info', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfileLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('GitHub', models.URLField()),
                ('LinkedIn', models.URLField()),
                ('TwitterX', models.URLField()),
            ],
            options={
                'verbose_name_plural': 'Profile Links',
            },
        ),
        migrations.DeleteModel(
            name='LinkedIn',
        ),
        migrations.DeleteModel(
            name='TwitterX',
        ),
    ]
