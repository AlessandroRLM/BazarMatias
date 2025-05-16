from django.db.models import Count, F
from users.models import User, UserActivity
from inventory.models import Product, Supply, ReturnSupplier, Shrinkage
from suppliers.models import Supplier, BuyOrder

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