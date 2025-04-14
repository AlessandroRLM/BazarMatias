from rest_framework import serializers
from django.contrib.auth import authenticate
from users.models import User

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