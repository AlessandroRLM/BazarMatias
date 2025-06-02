from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import get_template, render_to_string
from django.contrib.auth import login
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta
from knox import views as kv


from .serializers import LoginSerializer, ResetPasswordSerializer, ResetPasswordConfirmSerializer
from .models import FailedLoginAttempt
from users.models import User


class LoginApiView(kv.LoginView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    MAX_ATTEMPTS = 5
    BLOCK_TIME_MINUTES = 15

    def post(self, request, format=None):
        email = request.data.get('email', '').lower()
        ip = request.META.get('REMOTE_ADDR')

        attempt, _ = FailedLoginAttempt.objects.get_or_create(
            email=email, ip_address=ip)

        if attempt.is_blocked:
            if attempt.blocked_until and timezone.now() < attempt.blocked_until:
                remaining_seconds = int(
                    (attempt.blocked_until - timezone.now()).total_seconds())
                return Response({
                    'detail': 'Demasiados intentos fallidos. Intenta más tarde.',
                    'blocked': True,
                    'blocked_until': attempt.blocked_until,
                    'blocked_seconds': remaining_seconds,
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)
            else:
                attempt.is_blocked = False
                attempt.attempts = 0
                attempt.save()

        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            attempt.attempts += 1
            if attempt.attempts >= self.MAX_ATTEMPTS:
                attempt.is_blocked = True
                attempt.blocked_until = timezone.now() + timedelta(minutes=self.BLOCK_TIME_MINUTES)
            attempt.save()
            remaining = max(0, self.MAX_ATTEMPTS - attempt.attempts)
            blocked_seconds = None
            if attempt.is_blocked and attempt.blocked_until:
                blocked_seconds = int(
                    (attempt.blocked_until - timezone.now()).total_seconds())
            return Response({
                'detail': f'Credenciales incorrectas. Intentos restantes: {remaining}',
                'attempts': attempt.attempts,
                'remaining': remaining,
                'blocked': attempt.is_blocked,
                'blocked_until': attempt.blocked_until,
                'blocked_seconds': blocked_seconds,
            }, status=status.HTTP_400_BAD_REQUEST)

        # Login exitoso, limpiar intentos
        attempt.attempts = 0
        attempt.is_blocked = False
        attempt.blocked_until = None
        attempt.save()

        user = serializer.validated_data['user']
        login(request, user)
        response = super().post(request, format=None)
        return Response(response.data, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            token_generator = PasswordResetTokenGenerator()
            token = token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_link = f'127.0.0.1:3000/confirmar-contrasena/{uid}/{token}/'

            subject = 'Restablecimiento de contraseña'
            
            template = get_template('reset_password_email.html')
            content = template.render({
                'user': user,
                'reset_link': reset_link
            })

            msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, [email])

            msg.attach_alternative(content, "text/html")            

            try:
                msg.send()
            except Exception as e:
                return Response({'detail': f'Error al enviar el correo: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'detail': f'Correo de restablecimiento enviado.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            new_password = serializer.validated_data['new_password']

            user.set_password(new_password)
            user.save()

            return Response({'detail': 'Contraseña restablecida exitosamente.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
