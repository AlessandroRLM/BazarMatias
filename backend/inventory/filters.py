import django_filters
from .models import Product
from django.db import models


class ProductFilter(django_filters.FilterSet):

    # Filtro personalizado para productos con stock bajo (usando el método)
    below_min_stock = django_filters.BooleanFilter(
        method='filter_below_min_stock')

    # Filtro para productos sin stock
    out_of_stock = django_filters.BooleanFilter(method='filter_out_of_stock')

    status_stock = django_filters.ChoiceFilter(
        method='filter_status_stock',
        choices=[
            ('normal', 'Stock Normal'),
            ('low', 'Stock Bajo'),
            ('out', 'Sin Stock'),
        ]
    )

    class Meta:
        model = Product
        fields = {
            'category': ['exact'],
        }

    def filter_status_stock(self, queryset, name, value):
        """Filtrar productos por estado de stock combinado"""
        if value == 'normal':
            # Stock normal: stock >= min_stock y stock > 0
            return queryset.filter(
                stock__gte=models.F('min_stock'),
                stock__gt=0
            )
        elif value == 'low':
            # Stock bajo: stock < min_stock pero stock > 0
            return queryset.filter(
                stock__lt=models.F('min_stock'),
                stock__gt=0
            )
        elif value == 'out':
            # Sin stock: stock = 0
            return queryset.filter(stock=0)
        return queryset
