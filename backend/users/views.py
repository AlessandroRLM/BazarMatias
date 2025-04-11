from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
from .serializers import UserSerializer
from .pagination import CustomPagination

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Asegura que solo usuarios autenticados puedan acceder

    # Filtros y búsqueda
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_staff']  # Aquí los campos para filtrar
    search_fields = ['username', 'email', 'first_name', 'last_name']  # Campos para búsqueda
    ordering_fields = ['id', 'username', 'email']
    ordering = ['id']

    def get_serializer_context(self):
        """Pasa el request al serializador para generar URLs absolutas"""
        return {'request': self.request}

    def list(self, request, *args, **kwargs):
        """Lista usuarios con paginación, búsqueda y filtros"""
        queryset = self.filter_queryset(self.get_queryset())

        paginator = CustomPagination()
        page = paginator.paginate_queryset(queryset, request, view=self)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Crea un nuevo usuario"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

    def update(self, request, *args, **kwargs):
        """Actualiza un usuario existente"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Elimina un usuario"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Endpoint adicional para obtener datos del usuario autenticado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
