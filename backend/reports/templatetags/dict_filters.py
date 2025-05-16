from django import template

register = template.Library()

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

@register.filter
def get_color(status):
    colors = {
        'pendiente': '#FFA000',
        'completada': '#388E3C',
        'cancelada': '#D32F2F',
        'en progreso': '#1976D2',
        'devuelta': '#9C27B0',
        'otro': '#616161',
    }
    return colors.get(status.lower(), '#607D8B')
