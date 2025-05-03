from django.test import TestCase
from inventory.models import Product, Supplier

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
            supplier=self.supplier
        )

    def tearDown(self):
        Product.objects.all().delete()
        Supplier.objects.all().delete()

    def test_product_creation(self):
        self.assertEqual(Product.objects.count(), 1)
        self.assertEqual(self.product.name, "Producto Test")
        self.assertEqual(self.product.supplier, self.supplier)

    def test_product_update(self):
        self.product.stock = 10
        self.product.save()
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 10)

    def test_product_delete(self):
        self.product.delete()
        self.assertEqual(Product.objects.count(), 0)