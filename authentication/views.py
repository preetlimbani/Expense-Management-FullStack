from django.shortcuts import render, redirect, reverse
from django.contrib.auth.models import User
import json
from django.http import JsonResponse
from validate_email import validate_email
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.generics import GenericAPIView
from .serializer import CreateUserSerializer, ResetPasswordRequestEmailSerializer, SetNewPasswordSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator, default_token_generator
from .utils import Util
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.encoding import smart_str, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site

# Create your views here.
def EmailResetLoadView(request):
    return render(request, "authentication/email_reset.html")


class RegistrationView(APIView):
    def get(self, request):
        return render(request, "authentication/register.html")

    def post(self, request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            email = request.data.get('email')
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
                token = default_token_generator.make_token(user)
                encoded_token = urlsafe_base64_encode(smart_bytes(token))
                current_site = get_current_site(
                    request=request).domain
                relativeLink = reverse(
                    'email-verification', kwargs={'uidb64': uidb64, 'token': encoded_token})

                absurl = 'http://' + current_site + relativeLink
                email_body = 'Hello, \n Use link below to Verify your account  \n' + \
                             absurl
                data = {'email_body': email_body, 'to_email': user.email,
                        'email_subject': 'Email Verification'}
                Util.send_email(data)
                return Response({'success': 'We have sent you a link to reset your password'})
            return Response({"Fail": "Enter Proper Data"})


class LoginView(APIView):
    def get(self, request):
        return render(request, "authentication/login.html")

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = User.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class RequestPasswordResetEmail(GenericAPIView):
    serializer_class = ResetPasswordRequestEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            encoded_token = urlsafe_base64_encode(smart_bytes(token))
            current_site = get_current_site(
                request=request).domain
            relativeLink = reverse(
                'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': encoded_token})

            absurl = 'http://' + current_site + relativeLink
            email_body = 'Hello, \n Use link below to reset your password  \n' + \
                         absurl
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your passsword'}
            Util.send_email(data)
            return Response({'success': 'We have sent you a link to reset your password'})
        return Response({'email_error': 'Email not found'})


class PasswordTokenCheckAPI(GenericAPIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'authentication/password_reset.html'
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):
        id = smart_str(urlsafe_base64_decode(uidb64))
        decoded_token = smart_str(urlsafe_base64_decode(token))
        user = User.objects.get(id=id)
        if not PasswordResetTokenGenerator().check_token(user, decoded_token):
            return Response(headers={"error": "Token is not valid Please request new token"})
        return Response(headers={"Success": "Verified", "uidb64": uidb64, "token": token})


class EmailTokenCheckAPI(GenericAPIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'authentication/email_verfied.html'
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):
        id = smart_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(id=id)
        decoded_token = smart_str(urlsafe_base64_decode(token))
        if user.is_active:
            return Response(headers={"Success": "Already Verified"})
        if not default_token_generator.check_token(user, decoded_token):
            return Response(headers={"error": "Token is not valid Please request new token"})
        if not user.is_active:
            user.is_active = True
            user.save()

            return Response(headers={"Success": "Verified"})

        return Response(headers={"error": "Token is not valid Please request new token"})


class SetNewPasswordView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def patch(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)

        serializer.is_valid(raise_exception=True)
        return Response({'Message': 'password reset successfully'})


class PasswordValidationView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        password1 = data['password']
        password2 = data['password2']
        if password1 != password2:
            return JsonResponse({'password_error': 'password should be same'})
        return JsonResponse({'password_valid': True})


class EmailValidationView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        email = data['email']
        if not validate_email(email):
            return JsonResponse({'email_error': 'email should be valid'})
        if User.objects.filter(email=email).exists():
            return JsonResponse({'email_error': 'email is already in use'})
        return JsonResponse({'email_valid': True})


class UsernameValidationView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        username = data['username']
        if not str(username).isalnum():
            return JsonResponse({'username_error': 'Username should only contain alphanumeric value'})
        if User.objects.filter(username=username).exists():
            return JsonResponse({'username_error': 'username is already in use'})
        return JsonResponse({'username_valid': True})
