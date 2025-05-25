from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, SaleViewSet, QuoteViewSet, ReturnViewSet, WorkOrderViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'quotes', QuoteViewSet, basename='quote')
router.register(r'returns', ReturnViewSet, basename='return')
router.register(r'work-orders', WorkOrderViewSet, basename='workorder')

urlpatterns = [
    path('', include(router.urls)),
]