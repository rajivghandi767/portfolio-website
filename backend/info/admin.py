from django.contrib import admin
from .models import Bio, GitHub, LinkedIn


class BioAdmin(admin.ModelAdmin):
    pass


class GitHubAdmin(admin.ModelAdmin):
    pass


class LinkedInAdmin(admin.ModelAdmin):
    pass


admin.site.register(Bio, BioAdmin)
admin.site.register(GitHub, GitHubAdmin)
admin.site.register(LinkedIn, LinkedInAdmin)
