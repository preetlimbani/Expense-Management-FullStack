from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializer import (ExpenseSerializer, MonthBudgetSerializer, MonthlyReportSerializer, YearlyReportSerializer,
                         CustomReportSerializer, ScheduleSerializer, PlanSerializer)
from .models import Expense, MonthBudget, ScheduleExpense, Plan, Subscription, Category
from .permissions import IsOwner, Subscriber
import calendar
import json
from django.db.models.functions import ExtractMonth, TruncWeek, TruncDate
from django.db.models import Sum
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from .utils import crontab_update, date_range
from datetime import datetime
import stripe
from django.http import JsonResponse
from .pagination import ExpensePagination
from rest_framework import status
from rest_framework import filters

todays_date = datetime.today()


# Create your views here.
def ExpenseUpdateLoadView(request, id):
    """Takes request and loads template for update Expense

    Args:
        request : user request 
        id (int): Expense ID

    Returns:
        template : loads template for update expense
        context (dict): This will return ID
    """
    return render(request, "expenses/update_expense.html", context={'id': id})


def MonthExpenseUpdateLoadView(request, id):
    """Takes request and loads template for update Month Budget

    Args:
        request : user request 
        id (int): budget ID

    Returns:
        template : return template for update expense
        context (dict): This will return ID
    """
    return render(request, "expenses/update_month_expense.html", context={'id': id})


def ScheduleExpenseLoadView(request):
    """Takes request and loads template for Schedule Expense

    Args:
        request : user request
    Returns:
        template: return template for Schedule Expense
    """
    return render(request, "expenses/list_schedule_expense.html")


def index(request):
    """Takes request and loads template for Home page

    Args:
        request : user request
    Returns:
        template: return template for Home page
    """
    return render(request, "index.html")


def MonthBudgetLoadView(request):
    """Takes request and loads template for Monthly Budget

    Args:
        request : user request
    Returns:
        template: return template for Monthly Budget
    """
    return render(request, "expenses/list_month_expense.html")


def AddExpenseLoadView(request):
    """Takes request and loads template for Add expense

    Args:
        request : user request
    Returns:
        template: return template for Add expense
    """
    return render(request, "expenses/add_expense.html")


def AddMonthExpenseLoadview(request):
    """Takes request and loads template for Add month budget

    Args:
        request : user request
    Returns:
        template: return template for Add month budget
    """
    return render(request, "expenses/add_month_expense.html")


def AddScheduleExpenseLoadview(request):
    """Takes request and loads template for Add schedule Expense

    Args:
        request : user request
    Returns:
        template: return template for Add schedule Expense
    """
    return render(request, "expenses/add_schedule_expense.html")


def UpdateScheduleExpenseLoadview(request, id):
    """Takes request and loads template for Update schedule expense 

    Args:
        request : user request 
        id (int): Expense ID

    Returns:
        template : loads template for Update schedule expense
        context (dict): This will return ID
    """
    return render(request, "expenses/update_schedule_expense.html", context={'id': id})


def ExpenseReportLoadView(request):
    """Takes request and loads template for Expense report(version 1)

    Args:
        request : user request
    Returns:
        template: return template for Expense report(version 1)
    """
    return render(request, "expenses/report_expense.html")


def ExpenseReportLoadView1(request):
    """Takes request and loads template for Expense report(version 2)

    Args:
        request : user request
    Returns:
        template: return template for Expense report(version 2)
    """
    return render(request, "expenses/report_expense1.html")


def PlansLoadView(request):
    """Takes request and loads template for Subscription Plans

    Args:
        request : user request
    Returns:
        template: return template for subscriptuon Plans
    """
    return render(request, "subscription/plans.html")


def PaymentLoadView(request, id):
    """Takes request and loads template for Paymetn Page

    Args:
        request : user request
    Returns:
        template: return template for Paymetn Page
    """
    return render(request, "subscription/payment.html")


# Create your views here.


class ExpenseListCreateView(ListCreateAPIView):
    """ 
    get:
    Return a list of all the expenses of the user.

    post:
    Create a new expense For the user.
    """
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    pagination_class = ExpensePagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'category__name']

    def perform_create(self, serializer):
        category = self.request.data.get('category')
        category = Category.objects.get(id=category)
        serializer.save(user=self.request.user, category=category)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-date')


class ExpenseRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):

    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = "id"

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class MonthBudgetListView(ListCreateAPIView):
    serializer_class = MonthBudgetSerializer
    queryset = MonthBudget.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        category = self.request.data.get('category')
        category = Category.objects.get(id=category)
        serializer.save(user=self.request.user, category=category)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class MonthBudgetDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = MonthBudgetSerializer
    queryset = MonthBudget.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = "id"

    def perform_create(self, serializer):
        category = self.request.data.get('category')
        category = Category.objects.get(id=category)
        serializer.save(user=self.request.user, category=category)
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class MonthlyExpenseReportView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        month = request.data.get('month')
        day_one_of_month = str(todays_date.year) + "-" + str(month) + "-01"
        res = calendar.monthrange(todays_date.year, int(month))
        day = res[1]
        last_day_of_month = str(todays_date.year) + "-" + str(month) + "-" + str(day)
        expense = Expense.objects.filter(user=request.user, date__range=[day_one_of_month, last_day_of_month])
        serializer = ExpenseSerializer(expense, many=True)
        return Response(serializer.data, status=200)


class YearlyExpenseReportView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        year = request.data.get('year')
        day_one_of_year = str(year) + "-01-01"
        last_day_of_year = str(year) + "-12-31"
        expense = Expense.objects.filter(user=request.user, date__range=[day_one_of_year, last_day_of_year])
        serializer = ExpenseSerializer(expense, many=True)
        return Response(serializer.data, status=200)


class CustomExpenseReportView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        total_days = date_range(start_date, end_date)
        expense = Expense.objects.filter(user=request.user, date__range=[start_date, end_date])
        serializer = ExpenseSerializer(expense, many=True)
        data = json.dumps({"serializer": serializer.data, "total_days": total_days})
        return Response(data, status=200)


# Using Group by functions
class MonthlyExpenseReportView1(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        month_no = request.data.get('month')
        expense = Expense.objects.annotate(month=TruncWeek('date')).values('month').filter(
            user=request.user, date__month=month_no
        ).annotate(amounts=Sum('amount')).values('month', 'amounts', 'category__name').order_by('month')

        week_expenses = []

        for item in expense:
            month_start = item['month'].replace(day=1)
            week_number = (item['month'].day - 1 + month_start.weekday()) // 7 + 1
            item['week'] = f"Week {week_number}"
            week_expenses.append(item)
        serializer = MonthlyReportSerializer(expense, many=True)
        return Response(serializer.data, status=200)


class YearlyExpenseReportView1(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        year_no = request.data.get('year')
        queryset = Expense.objects.values("category").annotate(month=ExtractMonth("date"),
                                                               amounts=Sum("amount")).filter(user=request.user, date__year=year_no)
        expense = queryset.values('category__name', 'amounts', 'month')
        serializer = YearlyReportSerializer(expense, many=True)
        return Response(serializer.data, status=200)


class CustomExpenseReportView1(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        total_days = date_range(start_date, end_date)
        if total_days >= 30:
            queryset = Expense.objects.values("category__name").annotate(month=ExtractMonth("date"),
                                                                         amounts=Sum("amount")).filter(user=request.user, date__range=[start_date, end_date])
            serializer = YearlyReportSerializer(queryset, many=True)
            return Response(serializer.data, status=200)
        elif total_days >= 8 and total_days < 30:
            queryset = z
            week_expenses = []

            for item in queryset:
                month_start = item['month'].replace(day=1)
                week_number = (item['month'].day - 1 + month_start.weekday()) // 7 + 1
                item['week'] = f"Week {week_number}"
                week_expenses.append(item)

            serializer = MonthlyReportSerializer(week_expenses, many=True)
            return Response(serializer.data, status=200)
        else:
            queryset = Expense.objects.values("category").annotate(days=TruncDate("date"),
                                                                   amounts=Sum("amount")).filter(user=request.user,
                date__range=[start_date, end_date])
            expense = queryset.values('category__name', 'amounts', 'days')
            serializer = CustomReportSerializer(expense, many=True)
            return Response(serializer.data, status=200)


class ScheduleExpenseListCreateView(ListCreateAPIView):
    serializer_class = ScheduleSerializer
    queryset = ScheduleExpense.objects.all()
    permission_classes = [IsAuthenticated, IsOwner, Subscriber]

    def perform_create(self, serializer):
        category = self.request.data.get('category')
        category = Category.objects.get(id=category)
        serializer.save(user=self.request.user, category=category)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('start_date')


class ScheduleExpenseRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ScheduleSerializer
    queryset = ScheduleExpense.objects.all()
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = "id"

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        periodictask = PeriodicTask.objects.get(name=instance.id)
        crontab = periodictask.crontab
        cron = CrontabSchedule.objects.get(id=crontab.id)
        crontab_update(cron, data)
        return super(self.__class__, self).patch(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        periodictask = PeriodicTask.objects.get(name=instance.id)
        crontab = periodictask.crontab
        CrontabSchedule.objects.get(id=crontab.id).delete()
        return super(self.__class__, self).delete(request, *args, **kwargs)


class PlanCreateListAPIView(ListCreateAPIView):
    serializer_class = PlanSerializer
    queryset = Plan.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def get_queryset(self):
        return self.queryset.filter()


class SubscriptionAPIView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        user = request.user
        payment_method_id = request.data.get('payment_method_id')
        price_id = request.data.get('price_id')

        try:
            subscriptions = Subscription.objects.filter(user=request.user)
            if not subscriptions.exists():
                customer = stripe.Customer.create(
                    name=user.username,
                    email=user.email
                )
                customer_id = customer['id']
                subscription = Subscription.objects.create(user=user, customer_id=customer.id)
            else:
                subscription = subscriptions.first()
                customer_id = subscription.customer_id
            stripe.PaymentMethod.attach(
                payment_method_id,
                customer=customer_id,
            )

            price = stripe.Price.retrieve(price_id)
            if price.type == 'one_time':
                # Create a one-time payment using PaymentIntent
                payment_intent = stripe.PaymentIntent.create(
                    amount=price.unit_amount,
                    currency=price.currency,
                    payment_method=payment_method_id,
                    customer=customer_id,
                    confirm=True,
                    off_session=True,
                )

                if payment_intent.status == 'succeeded':
                    plan = Plan.objects.get(price_id=price_id)
                    subscription.plan = plan
                    subscription.payment_method_id=payment_method_id
                    subscription.save()
                    return JsonResponse({'message': 'Payment successful'})
                else:
                    return JsonResponse({'error': 'Payment failed'}, status=400)

            elif price.type == 'recurring':
                # Create a subscription for the customer
                subscription_stripe = stripe.Subscription.create(
                    customer=customer_id,
                    items=[{'price': price_id}],
                    default_payment_method=payment_method_id
                )
                plan = Plan.objects.get(price_id=price_id)
                subscription.plan = plan
                subscription.payment_method_id = payment_method_id
                subscription.save()

                invoice = stripe.Invoice.retrieve(subscription_stripe.latest_invoice)
                if invoice.payment_intent:
                    paymentint = stripe.PaymentIntent.confirm(invoice.payment_intent)
                    client_secret = paymentint.client_secret

                    return JsonResponse({'client_secret': client_secret})
                else:
                    return JsonResponse({'error': 'Payment failed'}, status=400)

            else:
                return JsonResponse({'error': 'Payment failed'}, status=400)

        except stripe.error.StripeError as e:
            return JsonResponse({'error': str(e)}, status=400)






class WebhookView(APIView):
    def post(self, request, format=None):
        event = request.data
        if event['type'] == 'customer.subscription.created':
            subscription_id = event['data']['object']['id']
            customer_id = event['data']['object']['customer']
            subscription_status = event['data']['object']['status']

            subscription = Subscription.objects.get(customer_id=customer_id)
            subscription.subscription_id = subscription_id
            subscription.status = subscription_status
            subscription.save()

        elif event['type'] == 'customer.subscription.deleted':
            customer_id = event['data']['object']['customer']
            subscription_status = event['data']['object']['status']

            subscription = Subscription.objects.get(customer_id=customer_id)
            subscription.status = subscription_status
            subscription.save()
        elif event['type'] == 'customer.subscription.paused':
            customer_id = event['data']['object']['customer']
            subscription_status = event['data']['object']['status']

            subscription = Subscription.objects.get(customer_id=customer_id)
            subscription.status = subscription_status
            subscription.save()
        elif event['type'] == 'customer.subscription.resumed':
            customer_id = event['data']['object']['customer']
            subscription_status = event['data']['object']['status']

            subscription = Subscription.objects.get(customer_id=customer_id)
            subscription.status = subscription_status
            subscription.save()
        elif event['type'] == 'customer.subscription.updated':
            customer_id = event['data']['object']['customer']
            subscription_status = event['data']['object']['status']

            subscription = Subscription.objects.get(customer_id=customer_id)
            subscription.status = subscription_status
            subscription.save()

        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']

        elif event['type'] == 'payment_intent.succeeded':
            amount_received = event['data']['object']['amount_received']
            plan = Plan.objects.filter(price=amount_received).first()
            customer_id = event['data']['object']['customer']
            subscription = Subscription.objects.filter(customer_id=customer_id,plan=plan)

            if subscription.exists():
                subscription = subscription.first()
                subscription.status = "active"
                subscription.save()
        else:
            print('Unhandled event type {}'.format(event['type']))

        return Response(status=status.HTTP_200_OK)
