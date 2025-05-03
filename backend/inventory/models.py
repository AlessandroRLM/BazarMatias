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