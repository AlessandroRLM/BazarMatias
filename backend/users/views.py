from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import login
from .filters import UserActivityFilter
import django_filters.rest_framework
from django_filters import UnknownFieldBehavior
from .models import User, UserActivity
from .serializers import UserSerializer, UserActivitySerializer, ChangePasswordSerializer
from .decorators import log_activity
from .pagination import CustomPagination
from rest_framework import status


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)  # Cambiar a IsAdmin cuando se implemente autenticación
    lookup_field = 'national_id'

    # Filtros y búsqueda
    filter_backends = [ filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_staff']  # Aquí los campos para filtrar
    search_fields = ['username', 'email', 'first_name', 'last_name']  # Campos para búsqueda
    ordering_fields = ['id', 'username', 'email']
    ordering = ['id']

    def get_serializer_context(self):
        """Pasa el request al serializador para generar URLs absolutas"""
        return {'request': self.request}

    @log_activity('VIEW', 'Ver lista de usuario')
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

    @log_activity('CREATE', 'Crear usuario')
    def create(self, request, *args, **kwargs):
        """Crea un nuevo usuario"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)
    
    @log_activity('update', 'Actualizar usuario')
    def update(self, request, *args, **kwargs):
        """Actualiza un usuario existente"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @log_activity('DELETE', 'Eliminar usuario')
    def destroy(self, request, *args, **kwargs):
        """Elimina un usuario"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)
    
    @log_activity('VIEW', 'Ver usuario autenticado')
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Endpoint adicional para obtener datos del usuario autenticado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @log_activity('update', 'Actualizar usuario')
    @action(detail=False, methods=['post'], url_path='change-password', permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data['password'])
        user.save()
        return Response({"detail": "Contraseña cambiada con éxito."}, status=status.HTTP_200_OK)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = (permissions.IsAdminUser,) #cambiar a IsAdmin cuando se implemente autenticación
    pagination_class = CustomPagination
    
    # Filtros y búsqueda
    filter_backends = [ django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = UserActivityFilter
    unknown_field_behavior = UnknownFieldBehavior.WARN
    ordering_fields = ['timestamp', 'user', 'action_type',]
    search_fields = ['description', 'user__first_name', 'user__last_name', 'data__status_type']
    
