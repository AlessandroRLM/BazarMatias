from django.test import TestCase
from inventory.models import Product, Supplier, Supply, Shrinkage, ReturnSupplier
from bson import ObjectId
from inventory.serializers import ReturnSupplierSerializer
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class SupplierModelTestCase(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Proveedor Test",
            address="Calle Falsa 123",
            phone="+56912345678",
            email="proveedor@test.com",
            rut="12345678-5",
            category="Tecnología"
        )

    def tearDown(self):
        Supplier.objects.all().delete()

    def test_supplier_creation(self):
        self.assertEqual(Supplier.objects.count(), 1)
        self.assertEqual(self.supplier.name, "Proveedor Test")
        self.assertEqual(self.supplier.rut, "12345678-5")

    def test_supplier_update(self):
        self.supplier.name = "Proveedor Editado"
        self.supplier.save()
        self.supplier.refresh_from_db()
        self.assertEqual(self.supplier.name, "Proveedor Editado")

    def test_supplier_delete(self):
        self.supplier.delete()
        self.assertEqual(Supplier.objects.count(), 0)

class ProductModelTestCase(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Proveedor Test",
            address="Calle Falsa 123",
            phone="+56912345678",
            email="proveedor@test.com",
            rut="12345678-5",
            category="Tecnología"
        )
        self.product = Product.objects.create(
            name="Producto Test",
            price_clp=10000.0,
            stock=5,
            category="Tecnología",
            supplier=str(self.supplier.id)
        )

    def tearDown(self):
        Product.objects.all().delete()
        Supplier.objects.all().delete()

    def test_product_creation(self):
        self.assertEqual(Product.objects.count(), 1)
        self.assertEqual(self.product.name, "Producto Test")
        self.assertEqual(self.product.supplier, str(self.supplier.id))

    def test_product_update(self):
        self.product.stock = 10
        self.product.save()
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 10)

    def test_product_delete(self):
        self.product.delete()
        self.assertEqual(Product.objects.count(), 0)

class SupplyModelTestCase(TestCase):
    def setUp(self):
        self.supply = Supply.objects.create(
            name="Insumo Test",
            category="Oficina",
            stock=100,
        )

    def tearDown(self):
        Supply.objects.all().delete()

    def test_supply_creation(self):
        self.assertEqual(Supply.objects.count(), 1)
        self.assertEqual(self.supply.name, "Insumo Test")
        self.assertEqual(self.supply.stock, 100)

    def test_supply_update(self):
        self.supply.stock = 50
        self.supply.save()
        self.supply.refresh_from_db()
        self.assertEqual(self.supply.stock, 50)

    def test_supply_delete(self):
        self.supply.delete()
        self.assertEqual(Supply.objects.count(), 0)

class ShrinkageModelTestCase(TestCase):
    def setUp(self):
        self.shrinkage = Shrinkage.objects.create(
            product="Producto Merma",
            price=500.0,
            quantity=3,
            category="daño",
            observation="Roto en bodega"
        )

    def tearDown(self):
        Shrinkage.objects.all().delete()

    def test_shrinkage_creation(self):
        self.assertEqual(Shrinkage.objects.count(), 1)
        self.assertEqual(self.shrinkage.product, "Producto Merma")
        self.assertEqual(self.shrinkage.quantity, 3)

    def test_shrinkage_update(self):
        self.shrinkage.quantity = 10
        self.shrinkage.save()
        self.shrinkage.refresh_from_db()
        self.assertEqual(self.shrinkage.quantity, 10)

    def test_shrinkage_delete(self):
        self.shrinkage.delete()
        self.assertEqual(Shrinkage.objects.count(), 0)

class ReturnSupplierModelTestCase(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Proveedor Test",
            address="Calle Falsa 123",
            phone="+56912345678",
            email="proveedor@test.com",
            rut="12345678-5",
            category="Tecnología"
        )
        self.product = Product.objects.create(
            name="Producto Test",
            price_clp=10000.0,
            stock=5,
            category="Tecnología",
            supplier=str(self.supplier.id)
        )
        self.return_supplier = ReturnSupplier.objects.create(
            supplier=self.supplier,
            product=self.product,
            quantity=10,
            product_condition="Nuevo",
            reason="Devolución por error",
            purchase_number="12345",
            purchase_date="2025-05-01",
            return_date="2025-05-05",
            status="Pendiente"
        )

    def tearDown(self):
        ReturnSupplier.objects.all().delete()
        Product.objects.all().delete()
        Supplier.objects.all().delete()

    def test_return_supplier_creation(self):
        self.assertEqual(ReturnSupplier.objects.count(), 1)
        self.assertEqual(self.return_supplier.quantity, 10)
        self.assertEqual(self.return_supplier.status, "Pendiente")

class ReturnSupplierSerializerTestCase(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Proveedor Test",
            address="Calle Falsa 123",
            phone="+56912345678",
            email="proveedor@test.com",
            rut="12345678-5",
            category="Tecnología"
        )
        self.product = Product.objects.create(
            name="Producto Test",
            price_clp=10000.0,
            stock=5,
            category="Tecnología",
            supplier=str(self.supplier.id)
        )
        self.return_supplier_data = {
            "supplier": self.supplier.id,
            "product": self.product.id,
            "quantity": 10,
            "product_condition": "Nuevo",
            "reason": "Devolución por error",
            "purchase_number": "12345",
            "purchase_date": "2025-05-01",
            "return_date": "2025-05-05",
            "status": "Pendiente"
        }

    def test_return_supplier_serializer_valid(self):
        serializer = ReturnSupplierSerializer(data=self.return_supplier_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["quantity"], 10)

    def test_return_supplier_serializer_invalid(self):
        invalid_data = self.return_supplier_data.copy()
        invalid_data["quantity"] = -5
        serializer = ReturnSupplierSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("quantity", serializer.errors)

class ReturnSupplierViewSetTestCase(APITestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Proveedor Test",
            address="Calle Falsa 123",
            phone="+56912345678",
            email="proveedor@test.com",
            rut="12345678-5",
            category="Tecnología"
        )
        self.product = Product.objects.create(
            name="Producto Test",
            price_clp=10000.0,
            stock=5,
            category="Tecnología",
            supplier=str(self.supplier.id)
        )
        self.return_supplier = ReturnSupplier.objects.create(
            supplier=self.supplier,
            product=self.product,
            quantity=10,
            product_condition="Nuevo",
            reason="Devolución por error",
            purchase_number="12345",
            purchase_date="2025-05-01",
            return_date="2025-05-05",
            status="Pendiente"
        )
        self.list_url = reverse("return-list")

    def test_return_supplier_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_return_supplier_create(self):
        data = {
            "supplier": str(self.supplier.id),
            "product": str(self.product.id),
            "quantity": 5,
            "product_condition": "Usado",
            "reason": "Devolución por defecto",
            "purchase_number": "54321",
            "purchase_date": "2025-05-02",
            "return_date": "2025-05-06",
            "status": "Pendiente"
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReturnSupplier.objects.count(), 2)

    def test_return_supplier_update(self):
        detail_url = reverse("return-detail", args=[str(self.return_supplier.id)])
        data = {"status": "Resuelto"}
        response = self.client.patch(detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.return_supplier.refresh_from_db()
        self.assertEqual(self.return_supplier.status, "Resuelto")

    def test_return_supplier_delete(self):
        detail_url = reverse("return-detail", args=[str(self.return_supplier.id)])
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ReturnSupplier.objects.count(), 0)