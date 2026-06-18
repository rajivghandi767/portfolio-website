from django.apps import AppConfig


class InfoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "info"

    def ready(self):
        try:
            from config.cleanup import setup_cleanup_signals

            setup_cleanup_signals()
        except ImportError:
            pass
