# views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from users.pagination import CustomPagination
from .serializers import ClientSerializer, SaleSerializer
from .models import Client, Sale, DocumentCounter

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
                {"error": f"Error creando venta: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return Response(
            self.get_serializer(client).data,
            status=status.HTTP_201_CREATED
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