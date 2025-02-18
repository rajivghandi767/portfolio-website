from django.contrib import admin
from wallet.models import Card


@admin.register(Card)
class WalletAdmin(admin.ModelAdmin):
    pass
