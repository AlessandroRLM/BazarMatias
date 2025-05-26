from django.test import TestCase
from rest_framework.test import APIClient
from users.models import User
from rest_framework import status
from django.urls import reverse

def generar_rut_valido(base_numero):
    rut = str(base_numero)
    reversed_digits = map(int, reversed(rut))
    factors = [2, 3, 4, 5, 6, 7]
    total = sum(d * factors[i % len(factors)] for i, d in enumerate(reversed_digits))
    remainder = 11 - (total % 11)
    if remainder == 11:
        dv = '0'
    elif remainder == 10:
        dv = 'K'
    else:
        dv = str(remainder)
    return f"{rut}-{dv}"

class ReportPDFViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="admin@example.com",
            password="testpass123",
            national_id=generar_rut_valido(12345678),
            position="Administrador",
            first_name="Admin",
            last_name="User"
        )
        self.client.force_authenticate(user=self.user)

    def test_user_report_pdf_authenticated(self):
        url = reverse('user-report-pdf')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_inventory_report_pdf_authenticated(self):
        url = reverse('inventory-report-pdf')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_supplier_report_pdf_authenticated(self):
        url = reverse('supplier-report-pdf')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_sales_report_pdf_authenticated(self):
        url = reverse('sales-report-pdf')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_reports_unauthenticated(self):
        self.client.logout()
        url_names = [
            'user-report-pdf',
            'inventory-report-pdf',
            'supplier-report-pdf',
            'sales-report-pdf',
        ]
        
        for name in url_names:
            url = reverse(name)
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_full_url_paths(self):
        url_mappings = {
            'user-report-pdf': '/api/reports/users/',
            'inventory-report-pdf': '/api/reports/inventory/',
            'supplier-report-pdf': '/api/reports/suppliers/',
            'sales-report-pdf': '/api/reports/sales/',
        }
        
        for name, expected_path in url_mappings.items():
            self.assertEqual(reverse(name), expected_path)