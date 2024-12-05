#!/bin/bash

# Exit on any error
set -e

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Run the default command (e.g., gunicorn)
exec "$@"
