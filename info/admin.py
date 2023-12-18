from django.contrib import admin
from .models import Bio, GitHub, LinkedIn, TwitterX


class BioAdmin(admin.ModelAdmin):
    pass


class GitHubAdmin(admin.ModelAdmin):
    pass


class LinkedInAdmin(admin.ModelAdmin):
    pass


class TwitterXAdmin(admin.ModelAdmin):
    pass


admin.site.register(Bio, BioAdmin)
admin.site.register(GitHub, GitHubAdmin)
admin.site.register(LinkedIn, LinkedInAdmin)
admin.site.register(TwitterX, TwitterXAdmin)
