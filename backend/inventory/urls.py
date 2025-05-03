from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, SupplierViewSet, SupplyViewSet, ShrinkageViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'supplies', SupplyViewSet, basename='supply')
router.register(r'shrinkages', ShrinkageViewSet, basename='shrinkage')

urlpatterns = [
    path('', include(router.urls)),
]