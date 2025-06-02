from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.log import logging
from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import User

logger = logging.getLogger(__name__)

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError('Correo y contraseña son requeridos.')
        
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError('El correo no existe.')    
        
        user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError('Correo y/o contraseña son incorrectos')

        attrs['user'] = user

        return attrs

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('El correo no existe.')
        return value

class ResetPasswordConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)
    confirm_password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        if new_password != confirm_password:
            raise serializers.ValidationError('Las contraseñas no coinciden.')

        try:
            uid = urlsafe_base64_decode(attrs.get('uid')).decode('utf-8')
            user = User.objects.get(id=uid)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
            raise serializers.ValidationError('El enlace de restablecimiento de contraseña no es válido.' + str(e))
        
        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, attrs.get('token')):
            raise serializers.ValidationError('El enlace de restablecimiento de contraseña no es válido.')

        attrs['user'] = user
        return attrs

