from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    technology = models.CharField(max_length=50)
    repo = models.URLField(("Link to Repo"))
    deployed_url = models.URLField(("Link to Deployed App"), blank=True)
    thumbnail = models.ImageField(
        upload_to='project_thumbnails/', blank=True, null=True)
    emoji = models.CharField(max_length=10, blank=True, help_text="Emoji icon for project switcher")
    color = models.CharField(max_length=100, blank=True, help_text="Tailwind color classes for project switcher")
    order = models.PositiveIntegerField(
        default=0, help_text="Set the display order of projects"
    )
    tags = models.ManyToManyField(Tag, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
