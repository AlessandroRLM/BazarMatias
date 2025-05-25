import os
from django.db import models
from django.core.validators import MinValueValidator
from django.forms import ValidationError
from pymongo import MongoClient  # type: ignore
import re
from users.models import User
from inventory.models import Product


class Client(models.Model):
    national_id = models.CharField(
        max_length=12, unique=True, verbose_name="National ID")
    first_name = models.CharField(max_length=100, verbose_name='First Name')
    last_name = models.CharField(max_length=100, verbose_name='Last Name')
    email = models.EmailField(unique=True, null=True, verbose_name="Email")
    phone_number = models.CharField(
        max_length=12, null=True, verbose_name='Phone Number')

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
            old = Client.objects.get(pk=self.pk)
            if self.national_id != old.national_id:
                raise ValueError(
                    "No se puede modificar el RUT una vez creado.")
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
        total = sum(d * factors[i % len(factors)]
                    for i, d in enumerate(reversed_digits))
        remainder = 11 - (total % 11)
        if remainder == 11:
            return '0'
        elif remainder == 10:
            return 'K'
        else:
            return str(remainder)

class SaleDetail(models.Model):
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.PositiveIntegerField()
    discount = models.PositiveIntegerField(default=0)

    @property
    def net_price(self):
        if self.product.iva:
            return int(self.unit_price / 1.19)
        return self.unit_price

    @property
    def iva_amount(self):
        if self.product.iva:
            return self.unit_price - self.net_price
        return 0


class Sale(models.Model):
    class DocType(models.TextChoices):
        INVOICE = 'FAC', 'Factura'        # requiere de un cliente con rut
        RECEIPT = 'BOL', 'Boleta'

    class PaymentMethods(models.TextChoices):
        CASH = 'EF', 'Efectivo'
        CREDIT_CARD = 'TC', 'Tarjeta Crédito'
        DEBIT_CARD = 'TD', 'Tarjeta Débito'
        TRANSFER = 'TR', 'Transferencia'
        OTHER = 'OT', 'Otro'

    document_type = models.CharField(
        max_length=3,
        choices=DocType.choices,
        default=DocType.RECEIPT,
        verbose_name='Document Type'
    )
    folio = models.PositiveIntegerField(null=True, verbose_name='Folio')
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name='Created At')

    client = models.ForeignKey(
        Client,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        verbose_name='Client'
    )

    details = models.ManyToManyField(SaleDetail)

    net_amount = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name='Net Amount'
    )
    iva = models.PositiveIntegerField(verbose_name='IVA')
    total_amount = models.PositiveIntegerField(verbose_name='Total Amount')

    payment_method = models.CharField(
        max_length=2,
        choices=PaymentMethods.choices,
        default=PaymentMethods.CASH,
        verbose_name='Payment Method'
    )

    def clean(self):
        # Valida que las facturas requieren un cliente con rut
        if self.document_type == self.DocType.INVOICE and not self.client:
            raise ValidationError(
                'Las facturas deben tener un cliente asociado')


class DocumentCounter(models.Model):
    document_type = models.CharField(max_length=3, unique=True)
    next_folio = models.PositiveIntegerField(default=1)

    @classmethod
    def get_next(cls, document_type):
        # Direct MongoDB atomic operation
        MONGO_URI = os.getenv(
            'MONGODB_URI', 'mongodb://admin:admin@mongodb:27017/bazar_matias_db?authSource=admin')
        client = MongoClient(MONGO_URI)
        db = client[os.getenv('MONGO_DB', 'bazar_matias_db')]

        result = db.counters.find_one_and_update(
            {'document_type': document_type},
            {'$inc': {'next_folio': 1}},
            upsert=True,
            return_document=True
        )
        return result['next_folio']


class QuoteDetail(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit_price = models.PositiveIntegerField()
    discount = models.PositiveIntegerField(default=0)


class Quote(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    details = models.ManyToManyField(QuoteDetail)
    total = models.PositiveIntegerField()

class Return(models.Model):
    client = models.ForeignKey(Client, on_delete=models.PROTECT)
    sale = models.ForeignKey(Sale, on_delete=models.PROTECT, verbose_name='Venta Asociada')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Devolución'
        verbose_name_plural = 'Devoluciones'


class WorkOrder(models.Model):
    numero_orden = models.CharField(max_length=20, unique=True)
    trabajador = models.ForeignKey(User, on_delete=models.PROTECT, related_name='ordenes_trabajo')
    tipo_tarea = models.CharField(max_length=100)
    descripcion = models.TextField(verbose_name='Detalle del trabajo')
    prioridad = models.CharField(max_length=20, choices=[
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta')
    ], default='media')
    plazo = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('en_proceso', 'En proceso'),
        ('completada', 'Completada'),
        ('cancelada', 'Cancelada')
    ], default='pendiente')
    created_at = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = 'Orden de Trabajo'
        verbose_name_plural = 'Órdenes de Trabajo'