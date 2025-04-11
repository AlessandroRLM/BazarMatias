from rest_framework import viewsets, filters,permissions
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, UserActivity
from .serializers import UserSerializer, UserActivitySerializer
from .decorators import log_activity

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]  # Asegura que solo usuarios autenticados puedan acceder

    def get_serializer_context(self):
        """Pasa el request al serializador para generar URLs absolutas"""
        return {'request': self.request}

    @log_activity('CREATE', 'crear usuario')
    def create(self, request, *args, **kwargs):
        """Crea un nuevo usuario"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)
    
    @log_activity('update', 'actualizar usuario')
    def update(self, request, *args, **kwargs):
        """Actualiza un usuario existente"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @log_activity('DELETE', 'eliminar usuario')
    def destroy(self, request, *args, **kwargs):
        """Elimina un usuario"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=204)
    
    @log_activity('VIEW', 'ver usuario autenticado')
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Endpoint adicional para obtener datos del usuario autenticado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class UserActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserActivity.objects.all()
    serializer_class = UserActivitySerializer
    permission_classes = [IsAdminUser]
    filter_backends = [ filters.OrderingFilter, filters.SearchFilter]
    filterset_fields = ['user', 'action_type', 'timestamp', 'content_type']
    ordering_fields = ['timestamp', 'user', 'action_type']
    search_fields = ['description', 'user__username', 'user__email']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtro por fecha de inicio
        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(timestamp__gte=start_date)
        
        # Filtro por fecha final
        end_date = self.request.query_params.get('end_date')
        if end_date:
            queryset = queryset.filter(timestamp__lte=end_date)
        
        return queryset