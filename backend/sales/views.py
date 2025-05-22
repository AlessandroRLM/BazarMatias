# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from users.pagination import CustomPagination
from .serializers import ClientSerializer, SaleSerializer, QuoteSerializer
from .models import Client, Sale, DocumentCounter, Quote

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
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    pagination_class = CustomPagination    

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            next_folio = DocumentCounter.get_next(
                document_type=serializer.validated_data['document_type']
            )
        except Exception as e:
            return Response(
                {"error": f"Error en secuencia: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            sale = Sale.objects.create(
                **serializer.validated_data,
                folio=next_folio
            )
        except Exception as e:
            return Response(
                {"error": f"Error creando venta: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            self.get_serializer(sale).data,
            status=status.HTTP_201_CREATED
        )

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    pagination_class = CustomPagination

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            serializer.save()
        except Exception as e:
            return Response(
                f"Error creando cotización: {str(e)}",
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            "Cotización creada correctamente",
            status=status.HTTP_201_CREATED
        )