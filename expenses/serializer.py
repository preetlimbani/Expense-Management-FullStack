from rest_framework import serializers
from .models import Expense, Category, MonthBudget, ScheduleExpense, Plan, Subscription
from datetime import datetime
from django.db.models import Q

today = datetime.today()
day_one_of_month = today.replace(day=1).strftime('%Y-%m-%d')
current_date = datetime.today().strftime('%Y-%m-%d')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
class ExpenseSerializer(serializers.ModelSerializer):
    category =serializers.CharField(source="category.name", read_only=True)


    class Meta:
        model = Expense
        fields = ['id','amount', 'title', 'description', 'date', 'category','is_schedule']

class MonthBudgetSerializer(serializers.ModelSerializer):
    remaining = serializers.SerializerMethodField()
    spent = serializers.SerializerMethodField()
    category = serializers.CharField(source="category.name", read_only=True)
    # category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())

    class Meta:
        model = MonthBudget
        fields = ['id','amount', 'category', 'remaining', 'spent']

    def get_remaining(self,attr):
        # cat = Category.objects.get(name=attr.category)
        amounts = Expense.objects.filter(user=attr.user,category=attr.category,date__range=[day_one_of_month, current_date] )
        total = 0
        for amt in amounts:
            total += amt.amount
        remaining = attr.amount - total
        return remaining
    def get_spent(self,attr):
        amounts = Expense.objects.filter(user=attr.user,category=attr.category, date__range=[day_one_of_month, current_date])
        total = 0
        for amt in amounts:
            total += amt.amount
        return total

    def create(self, validated_data):
        # Check if a category with the same ID or name exists for the same user
        user = self.context['request'].user
        category = validated_data['category']
        if MonthBudget.objects.filter(category=category, user=user).exists():
            raise serializers.ValidationError("Category already exists for this user.")
            # Create the MonthBudget instance
        month_budget = MonthBudget.objects.create(**validated_data)
        return month_budget

class MonthlyReportSerializer(serializers.Serializer):
    amounts = serializers.FloatField()
    week = serializers.DateField()
    category__name = serializers.CharField()

class YearlyReportSerializer(serializers.Serializer):
    amounts = serializers.FloatField()
    month = serializers.IntegerField()
    category__name = serializers.CharField()

class CustomReportSerializer(serializers.Serializer):
    amounts = serializers.IntegerField()
    days = serializers.DateField()
    category__name = serializers.CharField()

class ScheduleSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name", read_only=True)
    class Meta:
        model = ScheduleExpense
        exclude = ['user',]


    def create(self, validated_data):
        user = self.context['request'].user
        plan = Plan.objects.get(id=1)

        if Subscription.objects.filter(user=user, plan=plan,status = "active").exists():
            record_count = ScheduleExpense.objects.filter(user=user).count()

            if record_count >= 10:
                raise serializers.ValidationError('You have reached the maximum limit of your plan.')

        # If the limit is not reached, create the record
        validated_data['user'] = user
        instance = super().create(validated_data)
        return instance


class PlanSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    class Meta:
        model = Plan
        exclude = ['user']



    def get_price(self, obj):
        amount = obj.price / 100
        return amount

