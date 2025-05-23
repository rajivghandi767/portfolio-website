from .base import *

DEBUG = False

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')

# CORS/CSRF Settings
CORS_ALLOWED_ORIGINS = os.getenv(
    'CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SECURE = True  # Use a secure cookie for CSRF
CSRF_TRUSTED_ORIGINS = os.getenv(
    'CSRF_TRUSTED_ORIGINS', '').split(',')  # Trust your domain
CSRF_USE_SESSIONS = True  # Store CSRF tokens in sessions instead of cookies

# Session Settings
SESSION_ENGINE = "django.contrib.sessions.backends.db"
# Cookie Security
SESSION_COOKIE_SECURE = True  # Use a secure cookie for sessions
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_DOMAIN = 'rajivwallace.com'
SESSION_COOKIE_HTTPONLY = True  # Prevent JavaScript access to the session cookie
SESSION_COOKIE_AGE = 86400  # 24 hours
SESSION_SAVE_EVERY_REQUEST = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# # Referrer Policy
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

# HTTPS Settings
SECURE_SSL_REDIRECT = True  # Redirect all HTTP to HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO',
                           'https')  # For reverse proxies

# Enable HTTP Strict Transport Security (1 year)
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True  # Include subdomains in HSTS
SECURE_HSTS_PRELOAD = True  # Preload the HSTS policy
SECURE_BROWSER_XSS_FILTER = True  # Enable XSS filtering
SECURE_CONTENT_TYPE_NOSNIFF = True  # Prevent browsers from MIME-type sniffing

# X-Frame Options
X_FRAME_OPTIONS = "DENY"  # Prevent the site from being embedded in an iframe

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/home/backend/django/logs/errors.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

# Email Settings

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
