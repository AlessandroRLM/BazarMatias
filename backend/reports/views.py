from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .utils import render_to_pdf
from .services import (
    get_user_report_data,
    get_inventory_report_data,
    get_supplier_report_data
)

class BasePDFView(APIView):
    permission_classes = [IsAuthenticated]
    template_name = ''
    filename = ''
    get_data_function = None

    def get(self, request):
        data = self.get_data_function()
        return render_to_pdf(self.template_name, data, self.filename)

class UserReportPDFView(BasePDFView):
    template_name = 'reports/user_report.html'
    filename = 'reporte_usuarios.pdf'
    get_data_function = staticmethod(get_user_report_data)

class InventoryReportPDFView(BasePDFView):
    template_name = 'reports/inventory_report.html'
    filename = 'reporte_inventario.pdf'
    get_data_function = staticmethod(get_inventory_report_data)

class SupplierReportPDFView(BasePDFView):
    template_name = 'reports/supplier_report.html'
    filename = 'reporte_proveedores.pdf'
    get_data_function = staticmethod(get_supplier_report_data)
