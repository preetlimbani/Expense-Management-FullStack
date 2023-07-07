# Generated by Django 4.1.7 on 2023-06-05 04:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("expenses", "0004_rename_payment_id_subscription_payment_method_id_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscription",
            name="plan",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to="expenses.plan",
            ),
        ),
    ]