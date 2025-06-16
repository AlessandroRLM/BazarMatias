from rest_framework import viewsets, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.conf import settings
from weasyprint import HTML
import tempfile
import datetime
import os

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
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
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
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    serializer_class = SaleSerializer
    search_fields = ['client__first_name', 'client__last_name',
                     'client__national_id', 'client__email', 'client__phone_number']
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

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)

        try:
            serializer.is_valid(raise_exception=True)
            sale = serializer.save()
            return Response(
                self.get_serializer(sale).data,
                status=status.HTTP_200_OK
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

    @action(detail=True, methods=['patch'], url_path='cambiar-estado')
    def cambiar_estado(self, request, pk=None):
        sale = self.get_object()
        new_status = request.data.get('status')

        if new_status not in ['PA', 'PE']:
            return Response(
                {"error": "Estado inválido. Usa 'PA' o 'PE'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        sale.status = new_status
        sale.save()
        serializer = self.get_serializer(sale)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'created_at']
    search_fields = ['client__first_name', 'client__last_name',
                     'client__national_id', 'client__email', 'client__phone_number']
    ordering_fields = ['created_at', 'total', 'status']
    ordering = ['-created_at']

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
        
    @action(detail=True, methods=['post'], url_path='send-email')
    def send_email(self, request, pk=None):
        """
        Acción para enviar cotizaciones por correo electrónico a los clientes.
        """
        quote = self.get_object()
        
        try:
            # Obtener el cliente
            client = quote.client
            
            # Verificar que el cliente tenga correo electrónico
            if not client.email:
                return Response(
                    {"error": "El cliente no tiene un correo electrónico registrado"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtener los detalles de la cotización con información del producto
            quote_details = []
            for detail in quote.details.all():
                product = detail.product
                subtotal = detail.quantity * detail.unit_price
                quote_details.append({
                    'product': product,
                    'quantity': detail.quantity,
                    'unit_price': detail.unit_price,
                    'subtotal': subtotal
                })
            
            # Preparar el contexto para el template
            context = {
                'quote': quote,
                'client': client,
                'quote_details': quote_details,
                'year': datetime.datetime.now().year
            }
            
            # Renderizar el template HTML para el PDF
            pdf_template = get_template('quote_email.html')
            pdf_content = pdf_template.render(context)
            
            
            # Crear un archivo temporal para el PDF
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
                HTML(string=pdf_content).write_pdf(tmp.name)
                tmp_path = tmp.name
            
            
            subject = f'Cotización - Bazar Matias'
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = client.email
            
            content_msg = f'Hola {client.first_name} {client.last_name},\n\n'
            content_msg += 'Te enviamos nuestra cotización para tu producto.\n\n'
            content_msg += '¡Gracias por tu preferencia!\n\n'
            content_msg += 'Atentamente,\n'
            content_msg += 'Bazar Matias.'

            msg = EmailMultiAlternatives(subject, content_msg, from_email, [to_email])
            
            # Adjuntar el PDF
            with open(tmp_path, 'rb') as pdf_file:
                msg.attach(f'cotizacion_{quote.id}.pdf', pdf_file.read(), 'application/pdf')
            
            msg.send()
            
            # Eliminar el archivo temporal
            os.unlink(tmp_path)
            
            return Response(
                {"detail": f"Cotización enviada exitosamente a {client.email}"},
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": f"Error al enviar el correo: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ReturnViewSet(viewsets.ModelViewSet):
    queryset = Return.objects.all().select_related(
        'client', 'sale', 'product'
    ).order_by('-created_at')
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por estado 
        status = self.request.query_params.get('status')
        if status in ['pending', 'completed', 'refused']:
            queryset = queryset.filter(status=status)
            
        return queryset
    
    serializer_class = ReturnSerializer
    pagination_class = CustomPagination

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sale__folio', 'product__name']
    search_fields = ['reason', 'product__name']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        return_obj = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'completed', 'refused']:
            return Response(
                {"error": "Estado inválido. Usa 'pending', 'completed' o 'refused'."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return_obj.status = new_status
        return_obj.save()
        
        serializer = self.get_serializer(return_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)


class WorkOrderViewSet(viewsets.ModelViewSet):
    queryset = WorkOrder.objects.all()
    serializer_class = WorkOrderSerializer
    pagination_class = CustomPagination

    filter_backends = [DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['trabajador__national_id', 'status']
    search_fields = ['descripcion',
                     'trabajador__first_name', 'trabajador__last_name']
    ordering_fields = ['created_at', 'plazo']
    ordering = ['-created_at']


