from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django_celery_beat.models import PeriodicTask

# Create your models here.

class BaseModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Category(BaseModel):
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "Category"
    def __str__(self):
        return self.name


class Expense(BaseModel):
    amount = models.FloatField()
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField()
    date = models.DateField()
    is_schedule = models.BooleanField(default=False)

    class Meta:
        db_table = "Expense"

    def __str__(self):
        return "you have spent "+str(self.amount)+" on "+self.title

class MonthBudget(BaseModel):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.FloatField()

    class Meta:
        db_table = "MonthlyBudget"

class ScheduleExpense(BaseModel):
    FrequencyChoice = [
        ("once", "once"),
        ("daily", "daily"),
        ("weekly", "weekly"),
        ("monthly", "monthly")
    ]
    amount = models.FloatField(default=0)
    title = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField()
    frequency = models.CharField(max_length=50, choices=FrequencyChoice)
    start_date = models.DateTimeField()
    day_of_week = ArrayField(models.CharField(max_length=50), blank=True, null=True )

    class Meta:
        db_table = "ScheduleExpense"

FrequencyChoice = [
    ("month", "month"),
    ("year", "year"),
    ("once", "once"),
]
class Plan(BaseModel):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    recurring_frequency = models.CharField(max_length=50, choices=FrequencyChoice)
    is_recurring = models.BooleanField()
    plan_id = models.CharField(max_length=50, blank=True, null=True)
    price_id = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = "Plan"

class Subscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    customer_id = models.CharField(max_length=50, null=True)
    payment_method_id = models.CharField(max_length=50, null=True)
    subscription_id = models.CharField(max_length=50, null=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, default=3)
    status = models.CharField(max_length=50, null=True)

    class Meta:
        db_table = "Subscription"



