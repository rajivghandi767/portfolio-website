import os
from django.core.exceptions import ValidationError


def validate_pdf(file):
    """
    Validates uploaded files to ensure they are PDFs and meet size requirements.
    This function checks both the file extension and size to maintain quality control
    without relying on external libraries.

    Args:
        file: The uploaded file object from the form/request

    Raises:
        ValidationError: If the file isn't a PDF or exceeds size limits
    """
    # Check file extension
    valid_extensions = ['.pdf', '.PDF']
    ext = os.path.splitext(file.name)[1]

    if ext not in valid_extensions:
        raise ValidationError('Invalid file format. Please upload a PDF file.')

    # Check file size (5MB limit)
    max_size = 5 * 1024 * 1024  # 5MB in bytes
    if file.size > max_size:
        raise ValidationError('File size must be under 5MB.')

    # Additional check: ensure file is not empty
    if file.size == 0:
        raise ValidationError('The uploaded file is empty.')
