from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, SupplyViewSet,
    ShrinkageViewSet,
    InventoryMetricsAPIView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'supplies', SupplyViewSet, basename='supply')
router.register(r'shrinkages', ShrinkageViewSet, basename='shrinkage')

urlpatterns = [
    path('', include(router.urls)),
    path('metrics/', InventoryMetricsAPIView.as_view(), name='inventory-metrics'),
]
