from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Supply, Shrinkage
from .serializers import ProductSerializer, SupplySerializer, ShrinkageSerializer
from users.pagination import CustomPagination

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