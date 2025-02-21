import os
from celery import Celery


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'antivirus_api.settings')

app = Celery('antivirus_api')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
