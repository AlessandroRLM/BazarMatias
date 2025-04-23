from rest_framework import serializers
from django.contrib.auth import authenticate
from pymongo.errors import DuplicateKeyError
from django.db import IntegrityError
from bson import ObjectId
from .models import User, UserActivity
import re
from django.utils.crypto import get_random_string

class ObjectIdField(serializers.Field):
    """Campo personalizado para manejar ObjectId de MongoDB."""
    def to_representation(self, value):
        if isinstance(value, ObjectId):
            return str(value)  # Convierte ObjectId a string
        return value

    def to_internal_value(self, data):
        try:
            return ObjectId(data)  # Convierte string a ObjectId
        except:
            raise serializers.ValidationError("Invalid ObjectId")


class UserSerializer(serializers.ModelSerializer):
    formatted_national_id = serializers.SerializerMethodField()
    id = ObjectIdField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'national_id',
            'formatted_national_id',
            'email',
            'position',
            'is_staff',
            'is_active'
        ]
        read_only_fields = ['formatted_national_id', 'is_staff', 'is_active']

    def to_representation(self, instance):
        """Convertir ObjectId a string en la representación"""
        data = super().to_representation(instance)
        if isinstance(instance.id, ObjectId):
            data['id'] = str(instance.id)
        return data


    def get_formatted_national_id(self, obj):
        """Formatea el RUT con puntos: 12345678-K → 12.345.678-K"""
        try:
            rut_body, dv = obj.national_id.split('-')
            rut_body = rut_body[::-1]
            chunks = [rut_body[i:i+3] for i in range(0, len(rut_body), 3)]
            formatted_body = '.'.join(chunk[::-1] for chunk in chunks)[::-1]
            return f"{formatted_body}-{dv}"
        except Exception:
            return obj.national_id  # fallback si hay problema

    def validate(self, attrs):
        """
        Hook general de validación para poder limpiar y validar `national_id`
        aunque no esté en los fields visibles del serializer.
        """
        national_id = self.initial_data.get("national_id")
        if national_id:
            attrs["national_id"] = self.validate_national_id(national_id)
        return attrs

    def validate_national_id(self, value):
        """
        Limpia, valida y normaliza el RUT chileno.
        """
        value = value.replace('.', '').replace(' ', '').upper()

        if '-' not in value and len(value) > 1:
            value = f"{value[:-1]}-{value[-1]}"

        rut_pattern = re.compile(r'^(\d{1,8})-([\dkK])$')
        match = rut_pattern.match(value)
        if not match:
            raise serializers.ValidationError("El RUT debe tener el formato 12345678-K.")

        rut_body, dv = match.groups()
        expected_dv = self.calculate_verification_digit(rut_body)
        if dv.upper() != expected_dv:
            raise serializers.ValidationError("Dígito verificador incorrecto para el RUT.")

        return f"{rut_body}-{expected_dv}"

    @staticmethod
    def calculate_verification_digit(rut):
        """
        Calcula el dígito verificador de un RUT chileno.
        """
        reversed_digits = map(int, reversed(rut))
        factors = [2, 3, 4, 5, 6, 7]
        total = sum(d * factors[i % len(factors)] for i, d in enumerate(reversed_digits))
        remainder = 11 - (total % 11)
        if remainder == 11:
            return '0'
        elif remainder == 10:
            return 'K'
        else:
            return str(remainder)

    def create(self, validated_data):
        try:
            # Verifica si el RUT ya existe en la base de datos
            if User.objects.filter(national_id=validated_data.get('national_id')).exists():
                raise serializers.ValidationError({
                    'national_id': ['Este RUT ya está registrado en el sistema.']
                })
                
            random_password = get_random_string(length=12)
            user = User.objects.create_user(
                username=validated_data['first_name'] + validated_data['last_name'],
                email=validated_data.get('email', ''),
                password=random_password,
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                national_id=validated_data.get('national_id', ''),
                position=validated_data.get('position', ''),
                #is_staff=validated_data.get('is_staff', False),
                #is_active=validated_data.get('is_active', True),
            )
            return user
            
        except (DuplicateKeyError, IntegrityError) as e:
            if 'national_id' in str(e):
                raise serializers.ValidationError({
                    'national_id': ['Este RUT ya está registrado en el sistema.']
                })
            raise serializers.ValidationError({
                'non_field_errors': ['Error al crear el usuario en la base de datos.']
            })


class UserActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    id = ObjectIdField(read_only=True)
    object_id = ObjectIdField(read_only=True)

    class Meta:
        model = UserActivity
        fields = ['id', 'user', 'action_type', 'description', 
                  'content_type', 'object_id', 'data', 
                  'ip_address', 'user_agent', 'date', 'time','timestamp'] 

class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['confirmPassword']:
            raise serializers.ValidationError("Las contraseñas no coinciden.")
        if len(data['password']) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return data