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
    category = models.CharField(max_length=100)
    supplier = models.CharField(max_length=24, null=True, blank=True)

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