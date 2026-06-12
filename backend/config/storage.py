import os
from datetime import date

from django.core.files.storage import default_storage


class CKEditor5Storage(default_storage.__class__):
    """
    Custom storage backend for django-ckeditor-5 image uploads.

    By default, django-ckeditor_5 calls fs.save(f.name, f) with no path
    prefix, which causes files to land at the GCS bucket root.

    This class overrides _save() to organise uploads under:
        blog_images/YYYY/MM/<filename>

    Wired in via the CKEDITOR_5_FILE_STORAGE setting so it only applies
    to CKEditor5 uploads and does not affect other model file fields
    (post_images/, profile_photos/, resumes/, etc.).
    """

    def _save(self, name, content):
        today = date.today()
        folder = f"blog_images/{today.year}/{today.month:02d}"
        name = os.path.join(folder, os.path.basename(name))
        return super()._save(name, content)
