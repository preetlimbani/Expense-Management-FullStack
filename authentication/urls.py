from django.urls import path
from .views import (LoginView,RegistrationView,UsernameValidationView, EmailValidationView, PasswordValidationView,
                    PasswordTokenCheckAPI, RequestPasswordResetEmail,SetNewPasswordView, EmailResetLoadView, EmailTokenCheckAPI,)

urlpatterns = [
    path("register/",RegistrationView.as_view(), name = "register"),
    path("login/",LoginView.as_view(), name = "login"),
path("resetpassword/",EmailResetLoadView, name = "resetPasswordView"),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(),
         name="request-reset-email"),
    path('password-reset/<uidb64>/<token>/',
         PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset/',SetNewPasswordView.as_view(),name="password-reset"),
    path("validate-username/",UsernameValidationView.as_view()),
    path("validate-email/",EmailValidationView.as_view()),
    path("validate-password/", PasswordValidationView.as_view()),
    path('email-verification/<uidb64>/<token>/', EmailTokenCheckAPI.as_view(),
         name="email-verification"),


]