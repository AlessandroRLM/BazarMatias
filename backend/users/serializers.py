from rest_framework import serializers
from .models import User
import re

class UserSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()
    formatted_national_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            # No se incluye `national_id` para el frontend
            'formatted_national_id',
            'email',
            'position',
            'profile_picture',
            'profile_picture_url'
        ]
        read_only_fields = ['formatted_national_id']

    def get_profile_picture_url(self, obj):
        """Retorna la URL completa de la imagen si existe"""
        if obj.profile_picture:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.profile_picture.url)
        return None

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
