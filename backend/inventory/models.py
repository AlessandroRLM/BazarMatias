from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=255)
    price_clp = models.FloatField()
    iva = models.BooleanField(default=True)
    stock = models.IntegerField()
    category = models.CharField(max_length=100)
    supplier = models.CharField(max_length=100)
    data = models.JSONField(null=True, blank=True)  # Campo de datos dinamicos

    def __str__(self):
        return self.name


class Supply(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Shrinkage(models.Model):
    product = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    category = models.CharField(max_length=50)
    observation = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.product
