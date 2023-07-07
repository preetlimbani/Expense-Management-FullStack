from datetime import date
import datetime
from django_celery_beat.models import CrontabSchedule
from django.core.mail import send_mail


def date_range(start_date, end_date):
    startdate = start_date.split("-")
    print(startdate)
    enddate = end_date.split("-")
    total_days = int((date(int(enddate[0]), int(enddate[1]), int(enddate[2])) - date(int(startdate[0]),
                                                                                     int(startdate[1]),
                                                                                     int(startdate[2]))).days)
    return total_days


def crontab_schedule(self):
    if self.frequency == "monthly":
        crontab = CrontabSchedule.objects.create(
            minute=self.start_date.minute,
            hour=self.start_date.hour,
            day_of_month=self.start_date.day,
            timezone="Asia/Kolkata"
        )
        crontab.save()
        return crontab

    if self.frequency == "daily":
        crontab = CrontabSchedule.objects.create(
            minute=self.start_date.minute,
            hour=self.start_date.hour,
            timezone="Asia/Kolkata"
        )
        crontab.save()
        return crontab

    if self.frequency == "once":
        crontab = CrontabSchedule.objects.create(
            minute=self.start_date.minute,
            hour=self.start_date.hour,
            day_of_month=self.start_date.day,
            month_of_year=self.start_date.month,
            timezone="Asia/Kolkata"
        )
        crontab.save()
        return crontab

    if self.frequency == "weekly":
        day_week = self.day_of_week
        day_of_week = ','.join(day_week)
        crontab = CrontabSchedule.objects.create(
            minute=self.start_date.minute,
            hour=self.start_date.hour,
            day_of_week=day_of_week,
            timezone="Asia/Kolkata"
        )
        crontab.save()
        return crontab


def crontab_update(self, instance):
    date = datetime.datetime.strptime(instance['start_date'], '%Y-%m-%dT%H:%M')
    if instance['frequency'] == "monthly":
        self.minute = date.minute
        self.hour = date.hour
        self.day_of_month = date.day
        self.timezone = "Asia/Kolkata"
        self.save()
        return

    if instance['frequency'] == "daily":
        self.minute = date.minute
        self.hour = date.hour
        self.timezone = "Asia/Kolkata"
        self.save()
        return

    if instance['frequency'] == "once":
        self.minute = date.minute
        self.hour = date.hour
        self.day_of_month = date.day
        self.month_of_year = self.start_date.month

        self.timezone = "Asia/Kolkata"
        self.save()
        return

    if instance['frequency'] == "weekly":
        day_week = instance['day_of_week']
        day_of_week = ','.join(day_week)
        self.minute = date.minute
        self.hour = date.hour
        self.day_of_week = day_of_week
        self.timezone = "Asia/Kolkata"
        self.save()
        return


def one_off_set(frequency):
    if frequency == 'once':
        return True
    else:
        return False

def send_notification_email(email, expenses, budget):
    subject = 'Remaining Amount Alert'

    message = '''
    <html>
        <body>
            <h2>Remaining Amount Alert</h2>
            <table border="1">
                <tr>
                    <th>Category</th>
                    <th>Budget Amount</th>
                    <th>Remaining Amount</th>
                </tr>
    '''
    for category, budget_amount in zip(expenses, budget):
        message += f'''
                <tr>
                    <td>{category[0]['category__name']}</td>
                    <td>{budget_amount.amount}</td>
                     <td>{budget_amount.amount - category[0]['amounts']}</td>
                </tr>
        '''

    message += '''
            </table>
        </body>
    </html>
    '''

    recipient_list = ['email']
    sender_email = 'theblankscreen01@gmail.com'
    send_mail(subject, '', sender_email, recipient_list, html_message=message)

