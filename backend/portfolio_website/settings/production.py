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

CSRF_COOKIE_SECURE = True  # Use secure cookies for CSRF
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in os.getenv(
    'CSRF_TRUSTED_ORIGINS', '').split(',') if origin.strip()]

CSRF_USE_SESSIONS = False
CSRF_COOKIE_HTTPONLY = False  # Allow JavaScript access for AJAX requests
CSRF_COOKIE_SAMESITE = 'Lax'  # Balance security with functionality

# ============================================================================
# SESSION CONFIGURATION
# ============================================================================
SESSION_ENGINE = "django.contrib.sessions.backends.db"
SESSION_COOKIE_SECURE = True  # Use secure cookies for sessions
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_DOMAIN = 'rajivwallace.com'  # Allow subdomain access
SESSION_COOKIE_HTTPONLY = True  # Prevent JavaScript access
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_SAVE_EVERY_REQUEST = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# ============================================================================
# HTTPS SECURITY SETTINGS
# ============================================================================
SECURE_SSL_REDIRECT = True  # Redirect all HTTP to HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO',
                           'https')  # For reverse proxies

# HTTP Strict Transport Security (HSTS)
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Additional security headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# Frame options
# Allow iframes from same origin (for resume viewer)
X_FRAME_OPTIONS = "SAMEORIGIN"

# ============================================================================
# STATIC & MEDIA FILES FOR PRODUCTION
# ============================================================================
STATIC_URL = '/static/'
STATIC_ROOT = '/home/backend/django/staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = '/home/backend/django/mediafiles'

# ============================================================================
# EMAIL CONFIGURATION FOR PRODUCTION
# ============================================================================


# ============================================================================
# NOTIFICATION SETTINGS FOR PRODUCTION
# ============================================================================
# Discord webhook
DISCORD_WEBHOOK_URL = os.getenv('DISCORD_WEBHOOK_URL')

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
            'connect_timeout': 60,
            'sslmode': 'prefer',  # Use SSL if available
        },
        'CONN_MAX_AGE': 60,  # Connection pooling
    }
}

# ============================================================================
# CACHING CONFIGURATION (Optional - for better performance)
# ============================================================================
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'portfolio-cache',
        'TIMEOUT': 300,  # 5 minutes
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}

# ============================================================================
# PRODUCTION LOGGING CONFIGURATION
# ============================================================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {asctime} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/home/backend/django/logs/portfolio.log',
            'formatter': 'verbose',
        },
        'error_file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/home/backend/django/logs/errors.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['error_file', 'console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['error_file', 'console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'contacts': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
        'info': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
        'projects': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
        'blog': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
        'wallet': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ============================================================================
# PERFORMANCE OPTIMIZATIONS
# ============================================================================
# Database connection pooling
CONN_MAX_AGE = 60

# Optimize file uploads
FILE_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 5242880  # 5MB

# ============================================================================
# DJANGO ADMIN CUSTOMIZATION
# ============================================================================
# Allow custom admin URL for security
ADMIN_URL = os.getenv('ADMIN_URL', 'admin/')

# ============================================================================
# REST FRAMEWORK PRODUCTION SETTINGS
# ============================================================================
REST_FRAMEWORK.update({
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'contact': '5/hour',  # Limit contact form submissions
    }
})

# ============================================================================
# HEALTH CHECK CONFIGURATION
# ============================================================================
# Simple health check endpoint settings
HEALTH_CHECK_ENABLED = True
