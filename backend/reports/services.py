from django.db.models import Count, Sum, F
from users.models import User, UserActivity
from inventory.models import Product, Supply, Shrinkage
from suppliers.models import Supplier, BuyOrder, ReturnSupplier

def get_user_report_data():
    users = User.objects.all()
    total_users = users.count()
    active_users = users.filter(is_active=True).count()
    staff_users = users.filter(is_staff=True).count()

    recent_activity = UserActivity.objects.select_related('user').order_by('-timestamp')[:10]

    recent_activity_list = [{
        'user__username': activity.user.username,
        'action': activity.get_action_type_display(),
        'timestamp': activity.timestamp,
    } for activity in recent_activity]

    return {
        'total_users': total_users,
        'active_users': active_users,
        'staff_users': staff_users,
        'bar_y_total': 180 - total_users,
        'bar_y_active': 180 - active_users,
        'bar_y_staff': 180 - staff_users,
        'recent_activity': recent_activity_list,
    }


def get_inventory_report_data():
    products = Product.objects.all()
    supplies = Supply.objects.all()
    shrinkages = Shrinkage.objects.all()

    low_stock_products = products.filter(stock__lt=F('min_stock')).count()
    low_stock_supplies = supplies.filter(stock__lt=F('min_stock')).count()

    total_products = products.count()
    total_supplies = supplies.count()
    total_shrinkages = shrinkages.count()
    total = total_products + total_supplies + total_shrinkages

    # Evitar división por cero
    scale = 180
    h1 = (total_products / total * scale) if total > 0 else 0
    h2 = (total_supplies / total * scale) if total > 0 else 0
    h3 = (total_shrinkages / total * scale) if total > 0 else 0

    # Calculo posición y para las barras (altura svg - altura barra)
    y1 = scale - h1
    y2 = scale - h2
    y3 = scale - h3

    return {
        'total_products': total_products,
        'total_supplies': total_supplies,
        'total_shrinkages': total_shrinkages,
        'low_stock_products': low_stock_products,
        'low_stock_supplies': low_stock_supplies,
        'bar_data': [
            {'label': 'Productos', 'height': h1, 'y': y1, 'color': '#694ED6', 'x': 40},
            {'label': 'Insumos', 'height': h2, 'y': y2, 'color': '#17C964', 'x': 100},
            {'label': 'Mermas', 'height': h3, 'y': y3, 'color': '#F31260', 'x': 160},
        ]
    }


def get_supplier_report_data():
    total_suppliers = Supplier.objects.count()
    pending_returns = ReturnSupplier.objects.filter(status='Pendiente').count()
    completed_returns = ReturnSupplier.objects.filter(status='Completado').count()
    total_orders = BuyOrder.objects.count()

    # Obtener cantidades por código de estado (PE, RE, AP)
    orders_by_status_qs = BuyOrder.objects.values('status').annotate(count=Count('id'))

    # Convertir códigos a texto legible usando get_FOO_display
    code_to_label = dict(BuyOrder.StatusBuyOrder.choices)
    orders_by_status = {
        code_to_label.get(entry['status'], entry['status']): entry['count']
        for entry in orders_by_status_qs
    }

    positions = {status: 20 + i * 60 for i, status in enumerate(orders_by_status.keys())}

    bar_data = []
    for status, count in orders_by_status.items():
        x = positions.get(status, 0)
        height = count * 10
        y = 180 - height
        bar_data.append({
            'label': status,
            'count': count,
            'height': height,
            'x': x,
            'y': y,
        })

    return {
        'total_suppliers': total_suppliers,
        'pending_returns': pending_returns,
        'completed_returns': completed_returns,
        'total_orders': total_orders,
        'orders_by_status': orders_by_status,
        'positions': positions,
        'bar_data': bar_data,
    }

def get_sales_report_data():
    try:
        from sales.models import Sale
        
        # Obtener datos básicos de ventas
        total_sales = Sale.objects.count()
        total_amount = Sale.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        average_sale = total_amount / total_sales if total_sales > 0 else 0
        
        # Tipos de documento
        invoices = Sale.objects.filter(document_type='F').count()
        receipts = Sale.objects.filter(document_type='B').count()
        
        # Métodos de pago (ajustado para trabajar sin el modelo PaymentMethod)
        payment_methods_data = Sale.objects.values('payment_method').annotate(
            count=Count('id'),
            amount=Sum('total_amount')
        ).order_by('-amount')
        
        total_payments = sum(method['amount'] for method in payment_methods_data) or 1
        payment_methods = []
        for method in payment_methods_data:
            percentage = (method['amount'] / total_payments) * 100
            payment_methods.append({
                'name': method['payment_method'],
                'count': method['count'],
                'amount': method['amount'],
                'percentage': round(percentage, 1)
            })
        
        # Ventas recientes
        recent_sales = Sale.objects.select_related('client').order_by('-created_at')[:10]
        
        # Datos para gráficos
        sales_by_type = [
            {
                'label': 'Facturas',
                'count': invoices,
                'height': invoices * 2,
                'y': 180 - (invoices * 2),
                'x': 40,
                'color': '#694ED6'
            },
            {
                'label': 'Boletas',
                'count': receipts,
                'height': receipts * 2,
                'y': 180 - (receipts * 2),
                'x': 120,
                'color': '#17C964'
            }
        ]
        
        return {
            'total_sales': total_sales,
            'total_amount': total_amount,
            'average_sale': average_sale,
            'invoices': invoices,
            'receipts': receipts,
            'payment_methods': payment_methods,
            'recent_sales': recent_sales,
            'sales_by_type': sales_by_type
        }
        
    except Exception as e:
        print(f"Error generando reporte de ventas: {e}")
        # Datos de prueba para desarrollo
        return {
            'total_sales': 0,
            'total_amount': 0,
            'average_sale': 0,
            'invoices': 0,
            'receipts': 0,
            'payment_methods': [],
            'recent_sales': [],
            'sales_by_type': []
        }