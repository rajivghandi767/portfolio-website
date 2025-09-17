import os
import logging
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.conf import settings

logger = logging.getLogger(__name__)


def validate_pdf(file):
    """
    Validate that the uploaded file is a PDF and meets size requirements
    Enhanced with comprehensive error handling and logging
    """
    try:
        # Log validation attempt
        logger.info(
            f"Starting PDF validation for: {getattr(file, 'name', 'unknown')} - Size: {getattr(file, 'size', 'unknown')} bytes")

        # Check if file object has required attributes
        if not hasattr(file, 'size') or not hasattr(file, 'name'):
            logger.error(
                "File object missing required attributes (size or name)")
            raise ValidationError(
                _('Invalid file object. Please try uploading again.'),
                code='invalid_file_object'
            )

        # Check for empty file
        if file.size == 0:
            logger.warning("Empty file uploaded")
            raise ValidationError(
                _('File is empty. Please select a valid PDF file.'),
                code='empty_file'
            )

        # Check file size (5MB limit to match Django settings)
        max_size = 5 * 1024 * 1024  # 5MB
        if file.size > max_size:
            size_mb = file.size / (1024 * 1024)
            logger.warning(f"File too large: {size_mb:.2f}MB (max: 5MB)")
            raise ValidationError(
                _('File too large. Size should not exceed 5MB. Current size: {:.1f}MB').format(
                    size_mb),
                code='file_too_large'
            )

        # Check filename exists
        if not file.name:
            logger.error("File has no name")
            raise ValidationError(
                _('File must have a valid filename.'),
                code='no_filename'
            )

        # Check file extension
        name, ext = os.path.splitext(file.name)
        ext = ext.lower()

        if ext != '.pdf':
            logger.warning(f"Invalid extension: '{ext}' for file: {file.name}")
            raise ValidationError(
                _('File must be a PDF. Current file type: {}').format(
                    ext or 'unknown'),
                code='invalid_extension'
            )

        # Validate file content - PDF signature check
        try:
            # Store current position to restore later
            original_position = 0
            if hasattr(file, 'tell'):
                try:
                    original_position = file.tell()
                except (OSError, IOError):
                    # If we can't get position, start from 0
                    original_position = 0

            # Reset to beginning to read PDF header
            file.seek(0)

            # Read first 4 bytes to check PDF signature
            header = file.read(4)

            if len(header) < 4:
                logger.error(f"File too small: only {len(header)} bytes read")
                raise ValidationError(
                    _('File is too small or corrupted. Please select a valid PDF file.'),
                    code='file_too_small'
                )

            if header != b'%PDF':
                logger.warning(
                    f"Invalid PDF signature. Expected b'%PDF', got: {header}")
                raise ValidationError(
                    _('File is not a valid PDF. The file header indicates this is not a PDF file.'),
                    code='invalid_pdf_signature'
                )

            # Additional PDF validation - check for PDF version
            file.seek(0)
            first_line = file.read(8)  # Read a bit more to get version
            if not first_line.startswith(b'%PDF-1.'):
                logger.warning(f"Unusual PDF version or format: {first_line}")
                # This is a warning, not an error - some PDFs might still be valid

            # Reset file pointer to original position
            try:
                file.seek(original_position)
            except (OSError, IOError):
                # If seek fails, just go to beginning
                file.seek(0)

            logger.info(f"PDF validation successful for: {file.name}")

        except (OSError, IOError) as e:
            logger.error(f"File I/O error during PDF validation: {str(e)}")
            raise ValidationError(
                _('Unable to read file contents. The file may be corrupted. Please try again.'),
                code='file_read_error'
            )

    except AttributeError as e:
        logger.error(f"File attribute error during validation: {str(e)}")
        raise ValidationError(
            _('Invalid file format. Please ensure you are uploading a valid file.'),
            code='invalid_file_attributes'
        )
    except ValidationError:
        # Re-raise ValidationErrors as-is (these are expected)
        raise
    except Exception as e:
        # Log unexpected errors with full traceback for debugging
        logger.error(
            f"Unexpected error during PDF validation: {str(e)}", exc_info=True)

        raise ValidationError(
            _('File validation failed due to an unexpected error. Please try uploading again.'),
            code='validation_error'
        )


def validate_image(file):
    """
    Validate uploaded image files for profile photos and project images
    """
    try:
        logger.info(
            f"Starting image validation for: {getattr(file, 'name', 'unknown')} - Size: {getattr(file, 'size', 'unknown')} bytes")

        # Check basic file attributes
        if not hasattr(file, 'size') or not hasattr(file, 'name'):
            raise ValidationError(
                _('Invalid image file. Please try uploading again.'),
                code='invalid_file_object'
            )

        # Check file size (10MB limit for images)
        max_size = 10 * 1024 * 1024  # 10MB
        if file.size > max_size:
            size_mb = file.size / (1024 * 1024)
            logger.warning(f"Image too large: {size_mb:.2f}MB (max: 10MB)")
            raise ValidationError(
                _('Image too large. Size should not exceed 10MB. Current size: {:.1f}MB').format(
                    size_mb),
                code='file_too_large'
            )

        # Check for valid image extensions
        if not file.name:
            raise ValidationError(
                _('Image must have a valid filename.'),
                code='no_filename'
            )

        name, ext = os.path.splitext(file.name)
        ext = ext.lower()
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']

        if ext not in valid_extensions:
            logger.warning(
                f"Invalid image extension: '{ext}' for file: {file.name}")
            raise ValidationError(
                _('Image must be JPG, PNG, GIF, or WebP. Current file type: {}').format(
                    ext or 'unknown'),
                code='invalid_extension'
            )

        logger.info(f"Image validation successful for: {file.name}")

    except ValidationError:
        raise
    except Exception as e:
        logger.error(
            f"Unexpected error during image validation: {str(e)}", exc_info=True)
        raise ValidationError(
            _('Image validation failed. Please try uploading again.'),
            code='validation_error'
        )
