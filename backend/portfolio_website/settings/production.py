
from .base import *
import os

# ============================================================================
# PRODUCTION SECURITY SETTINGS
# ============================================================================
DEBUG = False

# Production hosts
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# ============================================================================
# CORS/CSRF SETTINGS FOR PRODUCTION
# ============================================================================
CORS_ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv(
    'CORS_ALLOWED_ORIGINS', '').split(',') if origin.strip()]
CORS_ALLOW_CREDENTIALS = True

# CSRF settings for subdomain setup
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in os.getenv(
    'CSRF_TRUSTED_ORIGINS', '').split(',') if origin.strip()]
CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript access for AJAX
CSRF_COOKIE_SAMESITE = 'Lax'

# ============================================================================
# SESSION CONFIGURATION
# ============================================================================
SESSION_ENGINE = "django.contrib.sessions.backends.db"
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_SAVE_EVERY_REQUEST = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# ============================================================================
# HTTPS SECURITY SETTINGS (Adjusted for NPM/Cloudflare)
# ============================================================================
# NPM/Cloudflare handles SSL termination
SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Basic security headers (Cloudflare may override some)
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# Frame options - allow for resume viewer
X_FRAME_OPTIONS = "SAMEORIGIN"

# ============================================================================
# STATIC & MEDIA FILES FOR PRODUCTION
# ============================================================================
STATIC_URL = 'https://portfolio-api.rajivwallace.com/static/'
MEDIA_URL = 'https://portfolio-api.rajivwallace.com/media/'

STATIC_ROOT = '/home/backend/django/staticfiles'
MEDIA_ROOT = '/home/backend/django/mediafiles'

# ============================================================================
# DATABASE CONFIGURATION FOR PRODUCTION
# ============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRESQL_DB'),
        'USER': os.getenv('POSTGRESQL_USER'),
        'PASSWORD': os.getenv('POSTGRESQL_PASSWORD'),
        'HOST': os.getenv('POSTGRESQL_HOST'),
        'PORT': os.getenv('POSTGRESQL_PORT'),
        'OPTIONS': {
            'connect_timeout': 30,  # Reduced for Pi 4B
            'sslmode': 'prefer',
        },
        'CONN_MAX_AGE': 60,  # Connection pooling
    }
}

# ============================================================================
# SIMPLIFIED LOGGING CONFIGURATION
# ============================================================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            'format': '{levelname} {asctime} {name} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/home/backend/django/logs/portfolio.log',
            'formatter': 'simple',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/home/backend/django/logs/errors.log',
            'formatter': 'simple',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['error_file'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

# ============================================================================
# PERFORMANCE OPTIMIZATIONS FOR PI 4B
# ============================================================================
# Optimize file uploads for Pi
FILE_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5MB (reduced for Pi)
DATA_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5MB

# ============================================================================
# SIMPLIFIED REST FRAMEWORK SETTINGS
# ============================================================================
REST_FRAMEWORK.update({
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '1000/hour',  # More reasonable for portfolio
        'contact': '20/hour',  # Contact form limit
    }
})

# ============================================================================
# OPTIONAL SETTINGS
# ============================================================================
# Discord webhook for contact notifications
DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')

# Custom admin URL for security
ADMIN_URL = os.getenv('ADMIN_URL', 'admin/')

# Health check
HEALTH_CHECK_ENABLED = True
