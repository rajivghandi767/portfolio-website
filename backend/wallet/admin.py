from django.contrib import admin
from wallet.models import Card


@admin.register(Card)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('card_name', 'annual_fee', 'order')
    list_editable = ('order',)
