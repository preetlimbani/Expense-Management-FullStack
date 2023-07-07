# Generated by Django 4.1.7 on 2023-06-02 11:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("django_celery_beat", "0018_improve_crontab_helptext"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("expenses", "0002_alter_monthbudget_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="scheduleexpense",
            name="periodic_task",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="django_celery_beat.periodictask",
            ),
        ),
        migrations.AlterField(
            model_name="scheduleexpense",
            name="category",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="expenses.category"
            ),
        ),
        migrations.CreateModel(
            name="Subscription",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("customer_id", models.CharField(max_length=50, null=True)),
                ("payment_id", models.CharField(max_length=50, null=True)),
                ("subscription_id", models.CharField(max_length=50, null=True)),
                ("status", models.CharField(max_length=50, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "Subscription",
            },
        ),
        migrations.CreateModel(
            name="Plan",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=100)),
                ("price", models.IntegerField()),
                (
                    "recurring_frequency",
                    models.CharField(
                        choices=[
                            ("monthly", "monthly"),
                            ("annually", "annually"),
                            ("once", "once"),
                        ],
                        max_length=50,
                    ),
                ),
                ("is_recurring", models.BooleanField()),
                ("plan_id", models.CharField(max_length=50, null=True)),
                ("price_id", models.CharField(max_length=50, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "Plan",
            },
        ),
    ]