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


class BuyOrder(models.Model):
    class StatusBuyOrder(models.TextChoices):
        REJECTED = 'RE', 'Rechazado'
        PENDING = 'PE', 'Pendiente'
        APPROVED = 'AP', 'Aprobado'

    status = models.CharField(
        max_length=2,
        choices=StatusBuyOrder.choices,
        default=StatusBuyOrder.PENDING,
        verbose_name='Status Buy Order'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    supplier = models.CharField(max_length=100)
    net_amount = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name='Net Amount'
    )
    iva = models.PositiveIntegerField(verbose_name='IVA')
    total_amount = models.PositiveIntegerField(verbose_name='Total Amount')


class BuyOrderDetail(models.Model):
    product = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.PositiveIntegerField()
    buy_order = models.ForeignKey(
        BuyOrder, on_delete=models.CASCADE, related_name='details')


class ReturnSupplierDetail(models.Model):
    product = models.ForeignKey("inventory.Product", on_delete=models.CASCADE)
    return_supplier = models.ForeignKey(
        "ReturnSupplier", on_delete=models.CASCADE, related_name='details')

    quantity = models.PositiveIntegerField()
    quantity_received = models.PositiveIntegerField(
        default=0,
        verbose_name="Cantidad Recibida por Proveedor"
    )
    unit_price = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Precio Unitario"
    )

    @property
    def total_amount(self):
        """Monto total del item (cantidad * precio unitario)"""
        if self.unit_price:
            return self.quantity * self.unit_price
        return 0

    @property
    def is_fully_received(self):
        """Verifica si el proveedor ha recibido toda la cantidad"""
        return self.quantity_received >= self.quantity


class ReturnSupplier(models.Model):
    class StatusReturnSupplier(models.TextChoices):
        REJECTED = 'RE', 'Rechazada'
        PENDING = 'PE', 'Pendiente'
        APPROVED = 'AP', 'Aprobado'

    status = models.CharField(
        max_length=2,
        choices=StatusReturnSupplier.choices,
        default=StatusReturnSupplier.PENDING
    )

    supplier = models.ForeignKey("Supplier", on_delete=models.CASCADE)
    purchase_number = models.CharField(max_length=50)
    purchase_date = models.DateField()
    reason = models.TextField()
    return_date = models.DateField()

    @property
    def total_items(self):
        """Cantidad total de items en el retorno"""
        return self.details.aggregate(
            total=models.Sum('quantity')
        )['total'] or 0

    @property
    def total_products(self):
        """Cantidad total de productos diferentes"""
        return self.details.count()

    def __str__(self):
        return f"{self.id} - {self.supplier.name}"
