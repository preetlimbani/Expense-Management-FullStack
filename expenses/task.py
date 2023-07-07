import datetime
from django.core.mail import send_mail
from django.contrib.auth.models import User
from celery import shared_task
from .models import ScheduleExpense, Expense, MonthBudget
from django.db.models import Sum
from .utils import send_notification_email

today = datetime.date.today()


@shared_task(name="schedule_expense")
def add_expense_task(Schedule_id):
    schedule_expense = ScheduleExpense.objects.get(id=Schedule_id)
    expense = Expense.objects.create(
        user=schedule_expense.user,
        amount=schedule_expense.amount,
        title=schedule_expense.title,
        description=schedule_expense.description,
        category=schedule_expense.category,
        date=today,
        is_schedule=True
    )
    expense.save()

    # Send email notification

    update_url = f'http://127.0.0.1:8000/expenses/{expense.id}'
    user = User.objects.get(id=schedule_expense.user.id)
    user_mail = user.email
    send_mail(
        f'Expense for {schedule_expense.title} added',
        'Your expenses schedule for today is added.'
        f'To update or delete Your Expense use this link {update_url}',
        'theblankscreen01@gmail.com',
        [user_mail],
        fail_silently=False,
    )


@shared_task(name="budget_alert")
def daily_budget_alert():
    day_one_of_month = today.replace(day=1).strftime('%Y-%m-%d')
    current_date = datetime.datetime.today().strftime('%Y-%m-%d')
    users = User.objects.all()
    for user in users:
        budgets = MonthBudget.objects.filter(user=user)
        expenses = []
        for budget in budgets:
            output = Expense.objects.values("category__name").annotate(amounts=Sum("amount")).filter(
                date__range=[day_one_of_month, current_date], user=user, category=budget.category)
            if output:
                expenses.append(output)
        send_notification_email(user.email, expenses, budgets)
