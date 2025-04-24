from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price_clp = models.FloatField()
    stock = models.IntegerField()
    category = models.CharField(max_length=100)

    def __str__(self):
        return self.name