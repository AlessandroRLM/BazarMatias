from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Supplier, BuyOrder
from .serializers import SupplierSerializer, BuyOrderSerializer
from users.pagination import CustomPagination

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'rut', 'email', 'address']
    ordering_fields = ['name', 'rut']
    ordering = ['name']

class BuyOrderViewSet(viewsets.ModelViewSet):
    queryset = BuyOrder.objects.all()
    serializer_class = BuyOrderSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filter_fields = ['status']
    ordering_fields = ['status', 'created_at', 'supplier__name']
    search_fields = ['supplier__name', 'supplier__category']
