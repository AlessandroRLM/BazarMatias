from django.test import TestCase
from inventory.models import Product, Supplier, Supply, Shrinkage

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
            unit="unidades"
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