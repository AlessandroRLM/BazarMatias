from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from .models import Product, Supplier, Supply, Shrinkage, ReturnSupplier
from .serializers import (
    ProductSerializer,
    SupplierSerializer,
    SupplySerializer,
    ShrinkageSerializer,
    ReturnSupplierSerializer
)
from users.pagination import CustomPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as drf_status

# -----------------------
# Vistas tradicionales
# -----------------------

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'rut', 'email', 'address']
    ordering_fields = ['name', 'rut']
    ordering = ['name']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'supplier']
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'price_clp', 'stock']
    ordering = ['name']

class SupplyViewSet(viewsets.ModelViewSet):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'category', 'stock']
    ordering = ['name']

class ShrinkageViewSet(viewsets.ModelViewSet):
    queryset = Shrinkage.objects.all()
    serializer_class = ShrinkageSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['product', 'category', 'observation']
    ordering_fields = ['product', 'category', 'quantity', 'price']
    ordering = ['product']

# -----------------------
# Devoluciones a proveedores
# -----------------------

class ReturnSupplierFilter(FilterSet):
    start_date = DateFilter(field_name="return_date", lookup_expr='gte')
    end_date = DateFilter(field_name="return_date", lookup_expr='lte')

    class Meta:
        model = ReturnSupplier
        fields = ['supplier', 'product', 'status', 'start_date', 'end_date']

class ReturnSupplierViewSet(viewsets.ModelViewSet):
    queryset = ReturnSupplier.objects.all()
    serializer_class = ReturnSupplierSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ReturnSupplierFilter
    search_fields = ['reason', 'purchase_number']
    ordering_fields = ['return_date', 'purchase_date', 'quantity']
    ordering = ['-return_date']

    @action(detail=True, methods=["patch"], url_path="resolve")
    def mark_as_resolved(self, request, pk=None):
        instance = self.get_object()
        if instance.status == "Resuelto":
            return Response(
                {"message": "Esta devolución ya está marcada como Resuelto."},
                status=drf_status.HTTP_400_BAD_REQUEST
            )
        instance.status = "Resuelto"
        instance.save()
        return Response(
            {"message": "Devolución marcada como Resuelto."},
            status=drf_status.HTTP_200_OK
        )
