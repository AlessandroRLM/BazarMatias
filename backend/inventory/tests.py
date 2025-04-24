import unittest
from inventory.models import Product
from django.test import TestCase

class TestProductModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        print("✅ Configuración inicial de pruebas Django ORM")

    def setUp(self):
        self.test_product = {
            "name": "Producto prueba",
            "price_clp": 19990.0,
            "stock": 15,
            "category": "Tecnología"
        }
        Product.objects.all().delete()
        print("🧹 Tabla 'Product' limpiada")

    def test_django_crud_operations(self):
        print("\n=== 🔄 Iniciando pruebas CRUD ===")

        # 1. Crear producto
        print("\n🟢 1. Probando creación...")
        product = Product.objects.create(**self.test_product)
        self.assertIsNotNone(product.id)
        print(f"📝 Producto creado con ID: {product.id}")

        # 2. Leer producto
        print("\n🔵 2. Probando lectura...")
        found = Product.objects.get(id=product.id)
        self.assertEqual(found.name, "Producto prueba")
        print(f"🔍 Producto encontrado: {found.__dict__}")

        # 3. Actualizar producto
        print("\n🟡 3. Probando actualización...")
        found.name = "Producto actualizado"
        found.save()
        updated = Product.objects.get(id=product.id)
        self.assertEqual(updated.name, "Producto actualizado")
        print(f"🔄 Producto actualizado: {updated.__dict__}")

        # 4. Eliminar producto
        print("\n🔴 4. Probando eliminación...")
        updated.delete()
        self.assertFalse(Product.objects.filter(id=product.id).exists())
        print("🗑️ Producto eliminado correctamente")

        # 5. Verificar eliminación
        print("\n⚫ 5. Verificando eliminación...")
        should_be_none = Product.objects.filter(id=product.id).first()
        self.assertIsNone(should_be_none)
        print("✅ Eliminación verificada con éxito")

    @classmethod
    def tearDownClass(cls):
        print("🔌 Fin de pruebas Django ORM")
        super().tearDownClass()

if __name__ == '__main__':
    unittest.main()