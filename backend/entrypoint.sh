#!/bin/bash
set -e

mkdir -p /django/staticfiles
chown backend:backend_group /django/staticfiles

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Run the original CMD (start Gunicorn)
exec "$@"
