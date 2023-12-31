from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    technology = models.CharField(max_length=50)
    repo = models.URLField(("Link to Repo"))
    link_if_deployed = models.URLField("Link to Deployed App")
    image = models.FileField(upload_to="project_images/", blank=True)
