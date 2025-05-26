from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Sale, Quote, SaleDetail
from .serializers import DashboardStatsSerializer

class DashboardViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['GET'])
    def stats(self, request):
        """Endpoint para obtener las estadísticas principales del dashboard"""
        today = timezone.now()
        current_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        previous_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        previous_month_end = current_month_start - timedelta(days=1)
        
        # Obtener datos de ventas
        current_month_sales = Sale.objects.filter(
            created_at__gte=current_month_start
        )
        previous_month_sales = Sale.objects.filter(
            created_at__gte=previous_month_start,
            created_at__lte=previous_month_end
        )
        
        # Calcular métricas de ventas
        monthly_profit = current_month_sales.aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        previous_month_profit = previous_month_sales.aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        total_sales = current_month_sales.count()
        
        paid_sales = current_month_sales.filter(status='paid').count()
        due_sales = current_month_sales.filter(status='pending').count()
        
        # Obtener datos de cotizaciones
        current_month_quotes = Quote.objects.filter(
            created_at__gte=current_month_start
        )
        
        approved_quotes = current_month_quotes.filter(status='AP').count()
        pending_quotes = current_month_quotes.filter(status='PE').count()
        rejected_quotes = current_month_quotes.filter(status='RE').count()
        
        # Obtener clientes destacados (top 3 por monto gastado)
        top_clients = (
            Sale.objects
            .filter(created_at__gte=current_month_start)
            .select_related('client')  # Optimización
            .values('client__first_name', 'client__last_name')
            .annotate(total_spent=Sum('total_amount'))
            .order_by('-total_spent')[:3]
        )
        
        data = {
            'monthly_profit': monthly_profit,
            'previous_month_profit': previous_month_profit,
            'total_sales': total_sales,
            'paid_sales': paid_sales,
            'due_sales': due_sales,
            'approved_quotes': approved_quotes,
            'pending_quotes': pending_quotes,
            'rejected_quotes': rejected_quotes,
            'top_clients': [
                {
                    'name': f"{client['client__first_name']} {client['client__last_name']}",
                    'value': client['total_spent']
                } 
                for client in top_clients
            ]
        }
        
        serializer = DashboardStatsSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'])
    def monthly_profit(self, request):
        """Endpoint para obtener datos de ganancias mensuales"""
        today = timezone.now()
        months = []
        
        # Generar datos para los últimos 6 meses
        for i in range(5, -1, -1):
            month_start = (today.replace(day=1) - timedelta(days=30*i)).replace(
                day=1, hour=0, minute=0, second=0, microsecond=0
            )
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            # Mes actual
            current_sales = Sale.objects.filter(
                created_at__gte=month_start,
                created_at__lte=month_end
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            # Mes del año anterior
            previous_year_start = month_start - timedelta(days=365)
            previous_year_end = month_end - timedelta(days=365)
            
            previous_sales = Sale.objects.filter(
                created_at__gte=previous_year_start,
                created_at__lte=previous_year_end
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            
            months.append({
                'name': month_start.strftime('%B'),
                'value': current_sales,
                'previous_value': previous_sales
            })
        
        return Response(months)

    @action(detail=False, methods=['GET'])
    def top_products(self, request):
        """Endpoint para obtener los productos más vendidos"""
        today = timezone.now()
        current_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        top_products = (
            SaleDetail.objects
            .filter(sale__created_at__gte=current_month_start)
            .values('product__name')
            .annotate(total_sold=Sum('quantity'))
            .order_by('-total_sold')[:10]
        )
        
        total_sold = sum(item['total_sold'] for item in top_products)
        
        products = [
            {
                'name': product['product__name'],
                'value': product['total_sold'],
                'percentage': round((product['total_sold'] / total_sold) * 100) if total_sold > 0 else 0
            }
            for product in top_products
        ]
        
        return Response(products)