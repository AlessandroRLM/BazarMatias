from rest_framework import viewsets, filters, status as drf_status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from users.pagination import CustomPagination
from .serializers import SupplierSerializer, BuyOrderSerializer, ReturnSupplierSerializer, ReturnSupplierListSerializer
from .models import Supplier, BuyOrder, ReturnSupplier
from .filters import ReturnSupplierFilter


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'rut', 'email', 'address']
    ordering_fields = ['name', 'rut']
    ordering = ['name']


class BuyOrderViewSet(viewsets.ModelViewSet):
    queryset = BuyOrder.objects.all()
    serializer_class = BuyOrderSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    ordering_fields = ['status', 'created_at', 'supplier__name']
    search_fields = ['supplier']

# -----------------------
# Devoluciones a proveedores
# -----------------------


class ReturnSupplierViewSet(viewsets.ModelViewSet):
    queryset = ReturnSupplier.objects.all().select_related(
        'supplier').prefetch_related('details__product')
    serializer_class = ReturnSupplierSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ReturnSupplierFilter
    search_fields = ['purchase_number', 'supplier__name']
    ordering_fields = ['return_date', 'status', 'supplier__name', 'total_products']
    ordering = ['-return_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return ReturnSupplierListSerializer
        return self.serializer_class

    @action(detail=True, methods=["patch"], url_path="resolve")
    def mark_as_resolved(self, request, pk=None):
        instance = self.get_object()
        if instance.status == "AP":
            return Response(
                {"message": "Esta devolución ya está marcada como aprovada."},
                status=drf_status.HTTP_400_BAD_REQUEST
            )
        instance.status = "AP"
        instance.save()
        return Response(
            {"message": "Devolución marcada como aprovada."},
            status=drf_status.HTTP_200_OK
        )
