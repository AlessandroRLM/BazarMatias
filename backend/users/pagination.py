from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 10  # Valor por defecto
    page_size_query_param = 'page_size'  # Para que el frontend defina el tamaño
    max_page_size = 100  # Límite

    def get_paginated_response(self, data):
        next_page = self.page.next_page_number() if self.page.has_next() else None
        previous_page = self.page.previous_page_number() if self.page.has_previous() else None
        return Response({
            'info': {
                'current_page': self.page.number,
                'pages': self.page.paginator.num_pages,
                'next': next_page,
                'previous': previous_page,
            },
            'results': data
        })
