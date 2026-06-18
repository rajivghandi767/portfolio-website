import os
import io
from datetime import date
from django.core.files.base import ContentFile
from PIL import Image

# Dynamically inherit from GoogleCloudStorage in production, FileSystemStorage locally
if os.getenv('GCS_CREDENTIALS'):
    from storages.backends.gcloud import GoogleCloudStorage
    BaseStorage = GoogleCloudStorage
else:
    from django.core.files.storage import FileSystemStorage
    BaseStorage = FileSystemStorage

class WebPOptimizedStorage(BaseStorage):
    """
    Automatically intercepts image uploads, converts them to WebP,
    and forwards them to the underlying storage backend.
    """
    def _save(self, name, content):
        # Only process known image extensions
        ext = os.path.splitext(name)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png']:
            try:
                # Load image into memory with Pillow
                img = Image.open(content)
                
                # Prepare output buffer
                output = io.BytesIO()
                
                # Handle PNG with transparency
                if ext == '.png' and (img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)):
                    img.save(output, format='WEBP', quality=85, lossless=True)
                else:
                    # Convert standard JPEGs/PNGs to RGB if needed
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    img.save(output, format='WEBP', quality=85)
                
                # Seek buffer back to start
                output.seek(0)
                
                # Replace the original content with the WebP binary
                content = ContentFile(output.read())
                
                # Replace the filename extension with .webp
                name = os.path.splitext(name)[0] + '.webp'
            except Exception as e:
                # If Pillow fails for any reason, safely fall back to the original image
                pass
                
        return super()._save(name, content)


class CKEditor5Storage(WebPOptimizedStorage):
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
