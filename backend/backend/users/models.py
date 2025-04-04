from django.contrib.auth.models import AbstractUser
from django.db import models
import re

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
