
from django_filters.rest_framework import FilterSet, DateFromToRangeFilter
from .models import ReturnSupplier

class ReturnSupplierFilter(FilterSet):

        # Filtro por rango de fechas en timestamp
    date__range = DateFromToRangeFilter(field_name="return_date", lookup_expr="exact")


    class Meta:
        model = ReturnSupplier
        fields = {
            'supplier': ['exact'], 
            'status': ['exact'],
            'return_date': ['exact', 'year__gt', 'year__lt']
        }
