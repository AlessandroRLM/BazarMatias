from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django_mongodb_backend.fields import ObjectIdField
from django.db import models
import re

# Modelo que representa a un usuario en el bazar
# Almacena información como nombre, correo, etc.
# El modelo hereda de AbstractUser para incluir campos adicionales
# y funcionalidades de autenticación de Django
class User(AbstractUser):
    national_id = models.CharField(max_length=12, unique=True, verbose_name="National ID")
    position = models.CharField(max_length=100, verbose_name="Position")
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return f"{self.get_full_name()} - {self.email}"

    @property
    def formatted_rut(self):
        try:
            rut_body, dv = self.national_id.split('-')
            rut_body = rut_body[::-1]
            chunks = [rut_body[i:i+3] for i in range(0, len(rut_body), 3)]
            formatted = '.'.join(chunk[::-1] for chunk in chunks)[::-1]
            return f"{formatted}-{dv}"
        except Exception:
            return self.national_id

    def save(self, *args, **kwargs):
        if self._state.adding:
            self.national_id = self.clean_national_id(self.national_id)
        else:
            # Protege contra cambios no deseados
            old = User.objects.get(pk=self.pk)
            if self.national_id != old.national_id:
                raise ValueError("No se puede modificar el RUT una vez creado.")
        super().save(*args, **kwargs)

    def clean_national_id(self, value):
        """Limpia y valida el RUT chileno"""
        value = value.replace('.', '').replace(' ', '').upper()
        if '-' not in value and len(value) > 1:
            value = f"{value[:-1]}-{value[-1]}"
        rut_pattern = re.compile(r'^(\d{1,8})-([\dkK])$')
        match = rut_pattern.match(value)
        if not match:
            raise ValueError("El RUT debe tener el formato 12345678-K.")
        rut_body, dv = match.groups()
        expected_dv = self.calculate_verification_digit(rut_body)
        if dv.upper() != expected_dv:
            raise ValueError("Dígito verificador incorrecto.")
        return f"{rut_body}-{expected_dv}"

    @staticmethod
    def calculate_verification_digit(rut):
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

User = get_user_model()

class UserActivity(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    
    # Tipo de acción realizada por el usuario, agregar más tipos si es necesario
    ACTION_TYPES = (
        ('CREATE', 'Crear'),
        ('UPDATE', 'Actualizar'),
        ('DELETE', 'Eliminar'),
        ('VIEW', 'Ver'),
        ('LOGIN', 'Iniciar sesión'),
        ('LOGOUT', 'Cerrar sesión'),
        ('OTHER', 'Otro'),
    )
    action_type = models.CharField(max_length=10, choices=ACTION_TYPES)
    
    # Descripción de la acción
    description = models.TextField()
    
    # Referencia dinámica al objeto sobre el que se realiza la acción, content_type captura el modelo y object_id el id del objeto
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = ObjectIdField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # Datos adicionales
    data = models.JSONField(null=True, blank=True)
    
    # IP y User Agent (chrome, edge, ...etc) del usuario
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Actividad de usuario'
        verbose_name_plural = 'Actividades de usuarios'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['action_type']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['content_type', 'object_id']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.action_type} - {self.timestamp}"