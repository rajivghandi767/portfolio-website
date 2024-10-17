from .base import *

DEBUG = False

# PostgreSQL

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'portfolio-db',
        'USER': os.environ.get('POSTGRESQL_USER'),
        'PASSWORD': os.environ.get('POSTGRESQL_PASSWORD'),
        'PORT': '5432',
        'HOST': 'portfolio-db'
    }
}

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(' ')
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(' ')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'
