from rest_framework import permissions
from .models import Subscription, Plan



class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user




class Subscriber(permissions.BasePermission):
    message = 'You have reached the maximum limit of your plan.'
    def has_permission(self, request, view):
        user = request.user
        if Subscription.objects.filter(user=user, status="active").exists():
            return True
        else:
            return False

