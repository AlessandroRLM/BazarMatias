from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, BuyOrderViewSet

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet, basename='supplier')
router.register(r'buy_orders', BuyOrderViewSet, basename='buy_order')


urlpatterns = [
    path('', include(router.urls)),
]