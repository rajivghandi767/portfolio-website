from django.contrib import admin
from .models import Info
from .models import Resume


class InfoAdmin(admin.ModelAdmin):
    pass


class ResumeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Info, InfoAdmin)
admin.site.register(Resume, ResumeAdmin)
