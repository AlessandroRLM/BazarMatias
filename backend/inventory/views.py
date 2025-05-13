from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFilter
from .models import Product, Supplier, Supply, Shrinkage, ReturnSupplier
from django.db import models
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
from rest_framework.views import APIView

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

    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock_products(self, request):
        low_stock = Product.objects.filter(stock__lt=models.F('min_stock'))
        page = self.paginate_queryset(low_stock)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(low_stock, many=True)
        return Response(serializer.data)

class SupplyViewSet(viewsets.ModelViewSet):
    queryset = Supply.objects.all()
    serializer_class = SupplySerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'category', 'stock']
    ordering = ['name']

    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock_supplies(self, request):
        low_stock = Supply.objects.filter(stock__lt=models.F('min_stock'))
        page = self.paginate_queryset(low_stock)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(low_stock, many=True)
        return Response(serializer.data)

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

# -----------------------
# Metricas para Dashboard inventario
# -----------------------

class InventoryMetricsAPIView(APIView):

    def get(self, request):
        amount_products = Product.objects.count()
        amount_supplies = Supply.objects.count()
        amount_shrinkages = Shrinkage.objects.count()
        low_stock_products = Product.objects.filter(stock__lt=models.F('min_stock'))

        # Mermas recientes (últimos 5 registros)
        recent_shrinkages = Shrinkage.objects.order_by('-id')[:5]
        recent_shrinkages_serialized = [
            {
                "product_name": s.product,
                "quantity": s.quantity,
                "reason": s.observation,
                "created_at": s.created_at.isoformat() if s.created_at else None
            } for s in recent_shrinkages
        ]

        # Datos para gráfico
        low_stock_chart_data = [
            {
                "product": p.name,
                "stock": p.stock
            } for p in low_stock_products[:10]
        ]

        return Response({
            "amount_products": amount_products,
            "amount_supplies": amount_supplies,
            "amount_shrinkages": amount_shrinkages,
            "low_stock_products_count": low_stock_products.count(),
            "recent_shrinkages": recent_shrinkages_serialized,
            "low_stock_chart_data": low_stock_chart_data
        })
