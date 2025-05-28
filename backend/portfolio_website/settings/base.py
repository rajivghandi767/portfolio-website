from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# ============================================================================
# SECURITY SETTINGS
# ============================================================================
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False  # Will be overridden in local.py if needed

# ============================================================================
# APPLICATION DEFINITION
# ============================================================================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'corsheaders',

    # Local apps
    'info',
    'projects',
    'blog',
    'wallet',
    'contacts',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ============================================================================
# REST FRAMEWORK CONFIGURATION
# ============================================================================
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny'
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}

# ============================================================================
# URL CONFIGURATION
# ============================================================================
ROOT_URLCONF = 'portfolio_website.urls'

# ============================================================================
# TEMPLATE CONFIGURATION
# ============================================================================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ============================================================================
# WSGI CONFIGURATION
# ============================================================================
WSGI_APPLICATION = 'portfolio_website.wsgi.application'

# # ============================================================================
# # DATABASE CONFIGURATION
# # ============================================================================
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.environ.get('POSTGRESQL_DB'),
#         'USER': os.environ.get('POSTGRESQL_USER'),
#         'PASSWORD': os.environ.get('POSTGRESQL_PASSWORD'),
#         'HOST': os.environ.get('POSTGRESQL_HOST'),
#         'PORT': os.environ.get('POSTGRESQL_PORT', '5432'),
#         'OPTIONS': {
#             'connect_timeout': 60,
#         },
#     }
# }

# ============================================================================
# PASSWORD VALIDATION
# ============================================================================
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# ============================================================================
# INTERNATIONALIZATION
# ============================================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ============================================================================
# STATIC FILES CONFIGURATION
# ============================================================================
STATIC_URL = '/static/'
STATIC_ROOT = '/home/backend/django/staticfiles'

# ============================================================================
# MEDIA FILES CONFIGURATION
# ============================================================================
MEDIA_URL = '/media/'
MEDIA_ROOT = '/home/backend/django/mediafiles'

# ============================================================================
# DEFAULT PRIMARY KEY FIELD TYPE
# ============================================================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================================================================
# EMAIL CONFIGURATION
# ============================================================================
# Primary email settings using Resend API
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
DEFAULT_FROM_EMAIL = os.environ.get(
    'DEFAULT_FROM_EMAIL', 'contact@rajivwallace.com')
CONTACT_EMAIL = os.environ.get('CONTACT_EMAIL')

# Email subject prefix for identification
EMAIL_SUBJECT_PREFIX = '[Portfolio Contact] '
SERVER_EMAIL = f'server@{os.environ.get("ALLOWED_HOSTS", "rajivwallace.com").split(",")[0]}'

# ============================================================================
# NOTIFICATION CONFIGURATION
# ============================================================================
# Discord webhook for instant notifications
DISCORD_WEBHOOK_URL = os.environ.get('DISCORD_WEBHOOK_URL')

# ============================================================================
# LOGGING CONFIGURATION
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
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'django.log',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'contacts': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console', 'file'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

# # ============================================================================
# # CORS CONFIGURATION
# # ============================================================================
# # Basic CORS settings - will be overridden in production.py
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]

# CORS_ALLOW_CREDENTIALS = True

# # ============================================================================
# # CSRF CONFIGURATION
# # ============================================================================
# CSRF_TRUSTED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]

# # ============================================================================
# # SECURITY HEADERS (Basic - Enhanced in production.py)
# # ============================================================================
# X_FRAME_OPTIONS = 'SAMEORIGIN'
