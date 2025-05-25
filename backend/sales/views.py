from rest_framework import viewsets, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from users.pagination import CustomPagination
from .serializers import ClientSerializer, SaleSerializer, QuoteSerializer, ReturnSerializer, WorkOrderSerializer
from .models import Client, Sale, DocumentCounter, Quote, Return, WorkOrder

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    pagination_class = CustomPagination
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            client = Client.objects.create(**serializer.validated_data)
        except Exception as e:
            return Response(
                {"error": f"Error creando cliente: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return Response(
            self.get_serializer(client).data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save()
        except Exception as e:
            return Response(
                {"error": f"Error actualizando cliente: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
    
class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().select_related('client')
    serializer_class = SaleSerializer
    pagination_class = CustomPagination    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            sale = serializer.save()
            return Response(
                self.get_serializer(sale).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    @action(detail=False, methods=['GET'])
    def document_counter(self, request):
        document_type = request.query_params.get('document_type')
        if document_type not in ['FAC', 'BOL']:
            return Response(
                {"error": "Tipo de documento inválido. Use 'FAC' o 'BOL'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            next_folio = DocumentCounter.get_next(document_type)
            return Response({"next_folio": next_folio})
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )  

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    pagination_class = CustomPagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            quote = serializer.save()
        except Exception as e:
            return Response(
                {"error": f"Error creando cotización: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            self.get_serializer(quote).data,
            status=status.HTTP_201_CREATED
        )

class ReturnViewSet(viewsets.ModelViewSet):
    queryset = Return.objects.all()
    serializer_class = ReturnSerializer
    pagination_class = CustomPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sale__folio', 'product__name']
    search_fields = ['reason', 'product__name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderSerializer
    pagination_class = CustomPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['trabajador__national_id', 'status']
    search_fields = ['descripcion', 'trabajador__first_name', 'trabajador__last_name']
    ordering_fields = ['created_at', 'plazo']
    ordering = ['-created_at']