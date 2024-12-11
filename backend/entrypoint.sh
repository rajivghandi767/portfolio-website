#!/bin/sh

# Exit on errors
set -e

# Ensure static and media directories exist
mkdir -p /staticfiles /mediafiles

# Run database migrations
python manage.py migrate --no-input

# Collect static files
python manage.py collectstatic --no-input --clear

# Start the main process
exec "$@"
