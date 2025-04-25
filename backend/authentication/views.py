from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth import login
from .serializers import LoginSerializer
from knox import views as kv
from django.utils import timezone
from datetime import timedelta
from .models import FailedLoginAttempt


class LoginApiView(kv.LoginView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    MAX_ATTEMPTS = 5
    BLOCK_TIME_MINUTES = 15

    def post(self, request, format=None):
        email = request.data.get('email', '').lower()
        ip = request.META.get('REMOTE_ADDR')

        attempt, _ = FailedLoginAttempt.objects.get_or_create(email=email, ip_address=ip)

        if attempt.is_blocked:
            if attempt.blocked_until and timezone.now() < attempt.blocked_until:
                remaining_seconds = int((attempt.blocked_until - timezone.now()).total_seconds())
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
                blocked_seconds = int((attempt.blocked_until - timezone.now()).total_seconds())
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
