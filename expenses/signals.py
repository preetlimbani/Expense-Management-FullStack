from django.db.models.signals import post_save
from django.dispatch import receiver
from django_celery_beat.models import PeriodicTask
from .models import ScheduleExpense, Plan
import json
from .utils import crontab_schedule, one_off_set
from dotenv import load_dotenv
import os
import stripe
load_dotenv()

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


@receiver(post_save, sender=ScheduleExpense)
def create_or_update_periodic_task(sender, instance, created, **kwargs):
    if created:
        setup_task(instance)


def setup_task(instance, **kwargs):
    task = PeriodicTask.objects.create(
        name=instance.id,
        task='schedule_expense',
        crontab=crontab_schedule(instance),
        args=json.dumps([instance.id]),
        start_time=instance.start_date,
        one_off=one_off_set(instance.frequency)

    )
    task.save()



@receiver(post_save, sender=Plan)
def create_plan(sender, instance, created, **kwargs):
    if created:
        product = stripe.Product.create(name=instance.name)
        if instance.recurring_frequency == "once":
            price = stripe.Price.create(
                unit_amount=instance.price,
                currency="inr",
                product=product.id,
            )
        else:
            price = stripe.Price.create(
                    unit_amount=instance.price,
                    currency="inr",
                    recurring={"interval": instance.recurring_frequency},
                    product=product.id,
                    )
        instance.plan_id=product.id
        instance.price_id=price.id
        post_save.disconnect(create_plan, sender=Plan)
        instance.save(update_fields=['plan_id', 'price_id'])
        post_save.connect(create_plan, sender=Plan)

