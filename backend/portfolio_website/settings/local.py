from .base import *

DEBUG = True

# SQLite

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# PostgreSQL

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'portfolio-db',
        'USER': os.environ.get('POSTGRESQL_USER'),
        'PASSWORD': os.environ.get('POSTGRESQL_PASSWORD'),
        'PORT': '5432',
        'HOST': 'db.rajivwallace.com'
    }
}
