from .base import *
import os

# ============================================================================
# PRODUCTION SECURITY SETTINGS
# ============================================================================
DEBUG = False
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# ============================================================================
# CSRF SETTINGS FOR PRODUCTION
# ============================================================================
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in os.getenv(
    'CSRF_TRUSTED_ORIGINS', '').split(',') if origin.strip()]
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'

# ============================================================================
# CACHING CONFIGURATION FOR PRODUCTION
# ============================================================================
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.getenv("REDIS_URL"),
    }
}

# ============================================================================
# SESSION CONFIGURATION
# ============================================================================
SESSION_ENGINE = "django.contrib.sessions.backends.cache"
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_SAVE_EVERY_REQUEST = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# ============================================================================
# HTTPS SECURITY SETTINGS (Adjusted for NPM/Cloudflare)
# ============================================================================
# Disabled internal SSL redirects to prevent infinite loops, as SSL termination
# is handled upstream by Cloudflare and Nginx Proxy Manager.
SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# ============================================================================
# STATIC & MEDIA FILES FOR PRODUCTION
# ============================================================================
# Static paths mapped to the internal Docker container volumes for asset serving.
STATIC_URL = '/static/'
STATIC_ROOT = '/home/backend/django/staticfiles'

# Media handled via GCS when configured
if os.getenv('GCS_CREDENTIALS'):
    STORAGES = {
        "default": {
            "BACKEND": "storages.backends.gcloud.GoogleCloudStorage",
        },
        "staticfiles": {
            "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        },
    }
    GS_BUCKET_NAME = os.getenv('GS_BUCKET_NAME')
    
    # Load GCS credentials from environment variable (JSON string or file path)
    gcs_creds = os.getenv('GCS_CREDENTIALS')
    import json
    from google.oauth2 import service_account
    
    try:
        creds_dict = json.loads(gcs_creds, strict=False)
        GS_CREDENTIALS = service_account.Credentials.from_service_account_info(creds_dict)
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Failed to parse GCS_CREDENTIALS: {e}")
        raise ValueError(f"Could not parse GCS_CREDENTIALS from environment. Error: {e}")
else:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = '/home/backend/django/mediafiles'
    os.makedirs(MEDIA_ROOT, exist_ok=True)

# Ensure static directories exist
os.makedirs(STATIC_ROOT, exist_ok=True)

# ============================================================================
# DATABASE CONFIGURATION FOR PRODUCTION
# ============================================================================
# Utilizing the Prometheus wrapper for PostgreSQL to expose query execution metrics
# to the /metrics endpoint for Grafana visualization.
DATABASES = {
    'default': {
        'ENGINE': 'django_prometheus.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST'),
        'PORT': os.getenv('POSTGRES_PORT'),
        'OPTIONS': {
            'connect_timeout': 30,
            'sslmode': 'prefer',
        },
        'CONN_MAX_AGE': 60,
    }
}
# ============================================================================
# FILE UPLOAD SETTINGS
# ============================================================================
# Increased to handle 5MB files + Django overhead
FILE_UPLOAD_MAX_MEMORY_SIZE = 6 * 1024 * 1024  # 6MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 6 * 1024 * 1024  # 6MB
FILE_UPLOAD_PERMISSIONS = 0o644
FILE_UPLOAD_DIRECTORY_PERMISSIONS = 0o755

# ============================================================================
# ENHANCED LOGGING CONFIGURATION
# ============================================================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'info': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'projects': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'blog': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'wallet': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'contacts': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ============================================================================
# REST FRAMEWORK SETTINGS FOR PRODUCTION
# ============================================================================
REST_FRAMEWORK.update({
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'contact': '20/hour',
    },

    'DEFAULT_PAGINATION_CLASS': None,
})

# ============================================================================
# OPTIONAL SETTINGS
# ============================================================================
DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')
ADMIN_URL = os.getenv('ADMIN_URL')
HEALTH_CHECK_ENABLED = True

# ============================================================================
# PROMETHEUS MONITORING CONFIGURATION
# ============================================================================
PROMETHEUS_EXPORT_MIGRATIONS = False
PROMETHEUS_LATENCY_BUCKETS = (
    0.008, 0.016, 0.032, 0.064, 0.128, 0.256, 0.512, 1.024, 2.048, 4.096, 8.192, 16.384, float('inf')
)
