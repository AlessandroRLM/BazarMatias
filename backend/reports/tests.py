from django.test import TestCase
from rest_framework.test import APIClient
from users.models import User
from rest_framework import status

class ReportPDFViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.login(username='testuser', password='testpass')

    def test_user_report_pdf_authenticated(self):
        response = self.client.get('/api/reportes/usuarios/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_inventory_report_pdf_authenticated(self):
        response = self.client.get('/api/reportes/inventario/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_supplier_report_pdf_authenticated(self):
        response = self.client.get('/api/reportes/proveedores/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(response.content.startswith(b'%PDF'))

    def test_reports_unauthenticated(self):
        self.client.logout()
        urls = [
            '/api/reportes/usuarios/',
            '/api/reportes/inventario/',
            '/api/reportes/proveedores/',
        ]
        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
