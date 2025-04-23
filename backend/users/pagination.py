from django.core.paginator import EmptyPage, PageNotAnInteger
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size = 10  # Valor por defecto
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        self.page_size = self.get_page_size(request)
        if not self.page_size:
            return None  # Si no se especifica el tamaño de página, no se pagina.
        paginator = self.django_paginator_class(queryset, self.page_size)
        page_number = request.query_params.get(self.page_query_param, 1)
        try:
            self.page = paginator.page(page_number)
        except (EmptyPage, PageNotAnInteger):
            # Si el número de página es inválido o no hay resultados, evitamos la excepción.
            self.page = None
            return []
        self.request = request
        return list(self.page)

    def get_paginated_response(self, data):
        if not self.page:
            # Devolvemos una respuesta estructurada para el caso de que no haya datos.
            return Response({
                'info': {
                    'count': 0,
                    'current_page': 1,
                    'pages': 0,
                    'next': None,
                    'previous': None,
                },
                'results': []
            })

        next_page = self.page.next_page_number() if self.page.has_next() else None
        previous_page = self.page.previous_page_number() if self.page.has_previous() else None
        return Response({
            'info': {
                'count': self.page.paginator.count,
                'current_page': self.page.number,
                'pages': self.page.paginator.num_pages,
                'next': next_page,
                'previous': previous_page,
            },
            'results': data
        })
