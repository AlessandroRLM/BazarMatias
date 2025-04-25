from bson import ObjectId
from rest_framework import serializers
from django.core.validators import MinValueValidator, RegexValidator
import re

class ObjectIdField(serializers.CharField):
    """Campo personalizado para manejar ObjectId como string"""
    def to_internal_value(self, data):
        if not ObjectId.is_valid(data):
            raise serializers.ValidationError("ID inválido")
        return str(data)

    def to_representation(self, value):
        return str(value)

class ProductSerializer(serializers.Serializer):
    id = ObjectIdField(read_only=True)
    name = serializers.CharField(
        max_length=255,
        validators=[RegexValidator(
            regex='^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$',
            message='Solo se permiten letras, números y espacios'
        )]
    )
    price_clp = serializers.FloatField(
        min_value=0,
        validators=[MinValueValidator(0.01, "El precio debe ser mayor a 0")]
    )
    stock = serializers.IntegerField(
        min_value=0,
        validators=[MinValueValidator(0, "El stock no puede ser negativo")]
    )
    category = serializers.CharField(
        max_length=100,
        validators=[RegexValidator(
            regex='^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
            message='Solo se permiten letras y espacios'
        )]
    )
    supplier_id = ObjectIdField(
        required=True,
        help_text="ID del proveedor asociado a este producto"
    )

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        return value

    def validate(self, data):
        # Validación combinada precio/stock
        if data['price_clp'] > 1000000 and data['stock'] > 1000:
            raise serializers.ValidationError("Productos muy caros no pueden tener tanto stock")
        
        # Validación de categoría
        if len(data['category'].strip()) < 2:
            raise serializers.ValidationError("La categoría debe tener al menos 2 caracteres")
        
        return data

class SupplierSerializer(serializers.Serializer):
    id = ObjectIdField(read_only=True)
    name = serializers.CharField(
        max_length=255,
        validators=[RegexValidator(
            regex='^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]+$',
            message='Solo se permiten letras, números y espacios'
        )]
    )
    address = serializers.CharField(
        max_length=255,
        validators=[RegexValidator(
            regex='^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ,.#-]+$',
            message='Dirección contiene caracteres no permitidos'
        )]
    )
    phone = serializers.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=r'^\+?[0-9]{9,15}$',
            message="Formato de teléfono inválido. Ejemplo: +56912345678"
        )]
    )
    email = serializers.EmailField()
    rut = serializers.CharField(
        max_length=13,  # Aumentado para RUTs con puntos
        validators=[RegexValidator(
            regex=r'^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]{1}$',
            message="Formato de RUT inválido. Ejemplo: 12.345.678-9 o 12345678-9"
        )]
    )
    category = serializers.CharField(
        max_length=100,
        validators=[RegexValidator(
            regex='^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$',
            message='Solo se permiten letras y espacios'
        )]
    )

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        return value

    def validate_rut(self, value):
        # Limpiar el RUT
        rut = value.replace('.', '').replace(' ', '').upper()
        
        # Verificar formato básico
        if '-' not in rut:
            raise serializers.ValidationError("El RUT debe contener un guión")
            
        cuerpo, dv = rut.split('-')
        
        # Validar que el cuerpo sean solo números
        if not cuerpo.isdigit():
            raise serializers.ValidationError("La parte antes del guión debe contener solo números")
        
        # Asegurar que el DV sea válido (dígito o K)
        if not (dv.isdigit() or dv == 'K'):
            raise serializers.ValidationError("Dígito verificador inválido")
        
        # Calcular dígito verificador esperado
        cuerpo = cuerpo.zfill(8)  # Asegurar 8 dígitos
        multiplicadores = [2, 3, 4, 5, 6, 7, 2, 3]  # Serie fija usada en Chile
        
        suma = 0
        for i in range(8):
            suma += int(cuerpo[7 - i]) * multiplicadores[i]
        
        resto = suma % 11
        calculated_dv = 11 - resto
        if calculated_dv == 10:
            calculated_dv = 'K'
        elif calculated_dv == 11:
            calculated_dv = '0'
        else:
            calculated_dv = str(calculated_dv)
        
        # Comparar con el DV proporcionado
        if str(calculated_dv) != dv:
            raise serializers.ValidationError("Dígito verificador inválido")
        
        # Devolver el RUT formateado sin puntos pero con guión
        return f"{int(cuerpo)}-{dv}"

    def validate_phone(self, value):
        value = value.strip()
        if not value.startswith('+56'):
            raise serializers.ValidationError("El teléfono debe comenzar con +56")
        if len(value) not in (11, 12):
            raise serializers.ValidationError("El teléfono debe tener 11 o 12 caracteres incluyendo el +56")
        return value

    def validate_address(self, value):
        value = value.strip()
        if len(value) < 5:
            raise serializers.ValidationError("La dirección debe tener al menos 5 caracteres")
        return value

    def validate_category(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("La categoría debe tener al menos 2 caracteres")
        return value