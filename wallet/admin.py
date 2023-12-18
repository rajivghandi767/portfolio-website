from django.contrib import admin
from wallet.models import Card


class WalletAdmin(admin.ModelAdmin):
    pass


admin.site.register(Card, WalletAdmin)
