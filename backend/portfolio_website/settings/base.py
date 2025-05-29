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
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
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
