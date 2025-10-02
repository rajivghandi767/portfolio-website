from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    technology = models.CharField(max_length=50)
    repo = models.URLField(("Link to Repo"))
    deployed_url = models.URLField(("Link to Deployed App"), blank=True)
    thumbnail = models.ImageField(
        upload_to='project_thumbnails/', blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Set the display order of projects"
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title
