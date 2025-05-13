from django.db import models
from django_mongodb_backend.fields import ObjectIdField

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    rut = models.CharField(max_length=13, unique=True)
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    price_clp = models.FloatField()
    stock = models.IntegerField()
    min_stock = models.IntegerField(default=0)
    category = models.CharField(max_length=100)
    supplier = models.CharField(max_length=24, null=True, blank=True)

    def __str__(self):
        return self.name
    
    def is_below_min_stock(self):
        return self.stock < self.min_stock

class Supply(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    stock = models.PositiveIntegerField(default=0)
    min_stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    def is_below_min_stock(self):
        return self.stock < self.min_stock

class Shrinkage(models.Model):
    product = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    category = models.CharField(max_length=50)
    observation = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product

class ReturnSupplier(models.Model):
    supplier = models.ForeignKey("Supplier", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    product_condition = models.CharField(max_length=100)
    reason = models.TextField()
    purchase_number = models.CharField(max_length=50)
    purchase_date = models.DateField()
    return_date = models.DateField()
    status = models.CharField(max_length=50, default="Pendiente")

    def __str__(self):
        return f"{self.product.name} - {self.supplier.name} ({self.return_date})"