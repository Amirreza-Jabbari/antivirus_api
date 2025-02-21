start rabbitmq (commandprompt: $: cd C:\Program Files\RabbitMQ Server\rabbitmq_server-4.0.6\sbin   $: rabbitmq-service start)
start redis (commandprompt: redis-server)
celery -A antivirus_api worker --loglevel=info --pool=solo


python manage.py createsuperuser
python manage.py runserver
python test.py