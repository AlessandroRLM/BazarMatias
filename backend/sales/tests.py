from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from users.models import User
from inventory.models import Product
from sales.models import Client, Sale, SaleDetail, Return, WorkOrder, Quote, QuoteDetail
from datetime import date, timedelta
import re
from bson import ObjectId
import json

# Función para generar un RUT válido con dígito verificador
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

class ClientTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="admin@example.com",
            password="testpass123",
            national_id=generar_rut_valido(12345678),
            position="Administrador"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_client(self):
        url = reverse('client-list')
        data = {
            "national_id": generar_rut_valido(87654321),
            "first_name": "Juan",
            "last_name": "Pérez",
            "email": "juan@example.com",
            "phone_number": "912345678"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Client.objects.count(), 1)
        self.assertEqual(Client.objects.first().first_name, "Juan")

    def test_invalid_rut(self):
        url = reverse('client-list')
        data = {
            "national_id": "12345678-0",  # DV incorrecto
            "first_name": "Juan",
            "last_name": "Pérez"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('error' in response.data or 'national_id' in response.data)

class SaleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="vendedor@example.com",
            password="testpass123",
            national_id=generar_rut_valido(12345678),
            position="Vendedor"
        )
        self.client.force_authenticate(user=self.user)

        self.client_instance = Client.objects.create(
            national_id=generar_rut_valido(87654321),
            first_name="Cliente",
            last_name="Test"
        )

        self.product = Product.objects.create(
            name="Producto Test",
            stock=10,
            price_clp=1000,
            iva=True,
            min_stock=5
        )

    def test_create_sale(self):
        url = reverse('sale-list')
        data = {
            "document_type": "BOL",
            "client": str(self.client_instance.id),
            "details": [{
                "product": str(self.product.id),
                "quantity": 2,
                "unit_price": 1000
            }],
            "payment_method": "EF"

        }
        response = self.client.post(
            url, 
            json.dumps(data), 
            content_type='application/json'
        )
        print(response.data)  # Para debug
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Sale.objects.count(), 1)

class QuoteTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="vendedor@example.com",
            password="testpass123",
            national_id=generar_rut_valido(12345678),
            position="Vendedor"
        )
        self.client.force_authenticate(user=self.user)

        self.client_instance = Client.objects.create(
            national_id=generar_rut_valido(87654321),
            first_name="Cliente",
            last_name="Test"
        )

        self.product = Product.objects.create(
            name="Producto Test",
            stock=10,
            price_clp=1000,
            iva=True,
            min_stock=5
        )

    def test_create_quote(self):
        url = reverse('quote-list')
        data = {
            "client": str(self.client_instance.id),
            "details": [{
                "product": str(self.product.id),
                "quantity": 3,
                "unit_price": 1000
            }],
            "total": 3000
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Quote.objects.count(), 1)

class ReturnTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="testpass123",
            national_id=generar_rut_valido(12345678),
            position="Vendedor"
        )
        self.client.force_authenticate(user=self.user)

        self.client_instance = Client.objects.create(
            national_id=generar_rut_valido(87654321),
            first_name="Juan",
            last_name="Pérez",
            email="cliente@example.com",
            phone_number="123456789"
        )

        self.product = Product.objects.create(
            name="Producto Test",
            stock=10,
            price_clp=1000,
            iva=True,
            min_stock=5,
            category="General",
            supplier="Proveedor X"
        )

        self.sale = Sale.objects.create(
            client=self.client_instance,
            document_type="BOL",
            folio=1,
            net_amount=4202,
            iva=798,
            total_amount=5000,
            payment_method="EF"
        )

        self.sale_detail = SaleDetail.objects.create(
            product=self.product,
            quantity=5,
            unit_price=1000
        )
        self.sale.details.add(self.sale_detail)

        self.return_data = {
            "client": str(self.client_instance.id),
            "sale": str(self.sale.id),
            "product": str(self.product.id),
            "quantity": 2,
            "reason": "Producto defectuoso"
        }

    def test_create_return(self):
        response = self.client.post(
            reverse('return-list'), 
            json.dumps(self.return_data), 
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Return.objects.count(), 1)
        self.assertEqual(Return.objects.first().quantity, 2)

    def test_invalid_return_quantity(self):
        invalid_data = self.return_data.copy()
        invalid_data["quantity"] = 10  # Excede lo vendido
        response = self.client.post(
            reverse('return-list'), 
            json.dumps(invalid_data), 
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('quantity', response.data)

    def test_delete_return(self):
        return_obj = Return.objects.create(
            client=self.client_instance,
            sale=self.sale,
            product=self.product,
            quantity=2,
            reason="Producto defectuoso"
        )
        delete_url = reverse('return-detail', args=[return_obj.id])
        delete_response = self.client.delete(delete_url)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Return.objects.count(), 0)

class WorkOrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email="trabajador@example.com",
            password="pass1234",
            national_id=generar_rut_valido(23456789),
            position="Técnico"
        )
        self.client.force_authenticate(user=self.user)

        self.work_order_data = {
            "numero_orden": "OT-001",
            "trabajador": str(self.user.id),
            "tipo_tarea": "Revisión de sistema",
            "descripcion": "Se debe revisar el sistema de ventilación.",
            "prioridad": "media",
            "plazo": str(date.today() + timedelta(days=7)),
            "status": "pendiente"
        }

    def test_create_work_order(self):
        response = self.client.post(
            reverse('workorder-list'), 
            json.dumps(self.work_order_data), 
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(WorkOrder.objects.count(), 1)
        self.assertEqual(WorkOrder.objects.first().tipo_tarea, "Revisión de sistema")

    def test_list_work_orders(self):
        WorkOrder.objects.create(
            numero_orden="OT12345",
            trabajador=self.user,
            tipo_tarea="Revisión de sistema",
            descripcion="Se debe revisar el sistema de ventilación.",
            prioridad="media",
            plazo=date.today() + timedelta(days=7),
            status="pendiente"
        )
        response = self.client.get(reverse('workorder-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data.get('results', [])), 1)

    def test_update_work_order(self):
        work_order = WorkOrder.objects.create(
            numero_orden="OT12346",
            trabajador=self.user,
            tipo_tarea="Revisión de sistema",
            descripcion="Se debe revisar el sistema de ventilación.",
            prioridad="media",
            plazo=date.today() + timedelta(days=7),
            status="pendiente"
        )
        update_url = reverse('workorder-detail', args=[work_order.id])
        updated_data = {
            "numero_orden": "OT12346",
            "trabajador": str(self.user.id),
            "tipo_tarea": work_order.tipo_tarea,
            "descripcion": work_order.descripcion,
            "prioridad": work_order.prioridad,
            "plazo": str(work_order.plazo),
            "status": "en_proceso"
        }
        response = self.client.put(
            update_url, 
            json.dumps(updated_data), 
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        work_order.refresh_from_db()
        self.assertEqual(work_order.status, "en_proceso")