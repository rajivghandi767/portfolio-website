from django.contrib import admin
from .models import Info


class InfoAdmin(admin.ModelAdmin):
    pass


admin.site.register(Info, InfoAdmin)
