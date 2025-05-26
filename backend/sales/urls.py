from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet, 
    SaleViewSet, 
    QuoteViewSet, 
    ReturnViewSet, 
    WorkOrderViewSet,
)
from .dashboard_views import DashboardViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'quotes', QuoteViewSet, basename='quote')
router.register(r'returns', ReturnViewSet, basename='return')
router.register(r'work-orders', WorkOrderViewSet, basename='workorder')
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
    path('document-counter/', SaleViewSet.as_view({'get': 'document_counter'}), name='document-counter'),
    path('sales/<str:pk>/cambiar-estado/', SaleViewSet.as_view({'patch': 'cambiar_estado'}), name='cambiar-estado'),
]