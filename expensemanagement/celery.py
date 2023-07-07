import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE","expensemanagement.settings")
app = Celery("expensemanagement")
app.config_from_object("django.conf.settings", namespace="CELERY")
app.autodiscover_tasks()

# Celery Beat Configuration
# app.conf.beat_schedule = {
#     'add_expense_task': {
#         'task': 'schedule_expense',
#         'schedule': 60.0,
#     },
# }