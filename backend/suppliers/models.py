from django.db import models
from django.core.validators import MinValueValidator


class Supplier(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    rut = models.CharField(max_length=13, unique=True)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class BuyOrderDetail(models.Model):
    product = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.PositiveIntegerField()


class BuyOrder(models.Model):
    class StatusBuyOrder(models.TextChoices):
        REJECTED = 'RE', 'Rechazado'
        PENDING = 'PE', 'Pendiente'
        APROVED = 'AP', 'Aprobado'
        
    status = models.CharField(
        max_length=2,
        choices=StatusBuyOrder.choices,
        default=StatusBuyOrder.PENDING,
        verbose_name='Status Buy Order'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    supplier = models.CharField(max_length=100)
    details = models.ManyToManyField(BuyOrderDetail)
    net_amount = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name='Net Amount'
    )
    iva = models.PositiveIntegerField(verbose_name='IVA')
    total_amount = models.PositiveIntegerField(verbose_name='Total Amount')
