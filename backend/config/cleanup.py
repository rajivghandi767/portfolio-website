from django.db.models.signals import pre_save, post_delete
from django.db.models import FileField
from django.core.files.storage import default_storage


def _delete_file(file_name):
    try:
        if file_name and default_storage.exists(file_name):
            default_storage.delete(file_name)
    except Exception:
        pass


def setup_cleanup_signals():
    """
    Dynamically attaches pre_save and post_delete signals to all models
    that have FileField or ImageField.

    pre_save: Deletes the old file from GCS if the field is cleared or a new file is uploaded.
    post_delete: Deletes the file from GCS if the model instance is deleted.
    """
    from django.apps import apps

    for model in apps.get_models():
        file_fields = [f for f in model._meta.fields if isinstance(f, FileField)]
        if not file_fields:
            continue

        def delete_old_file_on_save(sender, instance, **kwargs):
            if not instance.pk:
                return

            try:
                old_instance = sender.objects.get(pk=instance.pk)
            except sender.DoesNotExist:
                return

            for field in file_fields:
                old_file = getattr(old_instance, field.name)
                new_file = getattr(instance, field.name)

                if old_file and old_file != new_file:
                    _delete_file(old_file.name)

        def delete_file_on_delete(sender, instance, **kwargs):
            for field in file_fields:
                file_field = getattr(instance, field.name)
                if file_field:
                    _delete_file(file_field.name)

        # Connect signals
        pre_save.connect(
            delete_old_file_on_save,
            sender=model,
            dispatch_uid=f"{model.__name__}_cleanup_pre_save",
        )
        post_delete.connect(
            delete_file_on_delete,
            sender=model,
            dispatch_uid=f"{model.__name__}_cleanup_post_delete",
        )
