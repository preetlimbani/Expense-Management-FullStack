from django.contrib import admin
from .models import Category, Expense, ScheduleExpense, MonthBudget, Subscription, Plan
# Register your models here.
class ExpenseShow(admin.ModelAdmin):
    list_display = ("id","user","amount","title","category","description","date","is_schedule")
admin.site.register(Category)
admin.site.register(Expense, ExpenseShow)
admin.site.register(ScheduleExpense)
admin.site.register(MonthBudget)
admin.site.register(Subscription)
admin.site.register(Plan)