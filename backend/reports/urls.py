from django.urls import path
from .views import UserReportPDFView, InventoryReportPDFView, SupplierReportPDFView

urlpatterns = [
    path('users/', UserReportPDFView.as_view(), name='user-report-pdf'),
    path('inventory/', InventoryReportPDFView.as_view(), name='inventory-report-pdf'),
    path('suppliers/', SupplierReportPDFView.as_view(), name='supplier-report-pdf'),
]
