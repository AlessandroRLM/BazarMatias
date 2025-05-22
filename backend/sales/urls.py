from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, SaleViewSet, QuoteViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'sales', SaleViewSet, basename='sale')
router.register(r'quotes', QuoteViewSet, basename='quote')

urlpatterns = [
    path('', include(router.urls)),
]