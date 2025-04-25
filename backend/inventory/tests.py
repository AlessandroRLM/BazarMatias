from rest_framework.test import APITestCase
from inventory.db import products_collection, suppliers_collection
from bson import ObjectId

"""
============================
🧪 TEST DE API CON PYMONGO
============================

Estos tests verifican el comportamiento CRUD de los endpoints /api/products/ y /api/suppliers/
utilizando la base de datos MongoDB (sin Django ORM).

🚀 Para ejecutar:
python manage.py test inventory
"""

class ProductAPITestCase(APITestCase):
    def setUp(self):
        # Crear un proveedor de prueba
        self.supplier_data = {
            "name": "Proveedor test",
            "address": "Calle Falsa 123",
            "phone": "+56912345678",
            "email": "proveedor@test.com",
            "rut": "12345678-5",
            "category": "Tecnología"
        }
        self.supplier_id = suppliers_collection.insert_one(self.supplier_data).inserted_id

        # Crear un producto de prueba
        self.product_data = {
            "name": "Producto prueba API",
            "price_clp": 19990.0,
            "stock": 15,
            "category": "Tecnología",
            "supplier_id": str(self.supplier_id)
        }
        self.product_id = products_collection.insert_one(self.product_data).inserted_id
        self.url_list = '/api/inventory/products/'
        self.url_detail = f'/api/inventory/products/{str(self.product_id)}/'

    def tearDown(self):
        products_collection.delete_many({})
        suppliers_collection.delete_many({})

    def test_product_list(self):
        print("\n🔄 Probando GET /api/inventory/products/")
        response = self.client.get(self.url_list, format='json')
        print("👀 Productos obtenidos:", response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        print("✅ Listado de productos exitoso")

    def test_product_create(self):
        print("\n🟢 Probando POST /api/inventory/products/")
        new_product = {
            "name": "Nuevo producto API",
            "price_clp": 29990.0,
            "stock": 10,
            "category": "Hogar",
            "supplier_id": str(self.supplier_id)
        }
        response = self.client.post(self.url_list, new_product, format='json')
        print("➕ Producto agregado:", response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(products_collection.count_documents({}), 2)
        print("✅ Producto creado exitosamente")

    def test_product_retrieve(self):
        print("\n🔵 Probando GET /api/inventory/products/<id>/")
        response = self.client.get(self.url_detail)
        print("👀 Producto mostrado:", response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.product_data['name'])
        print("✅ Producto recuperado correctamente")

    def test_product_update(self):
        print("\n🟡 Probando PUT /api/inventory/products/<id>/")
        updated_data = {
            "name": "Producto actualizado API",
            "price_clp": 25990.0,
            "stock": 20,
            "category": "Electrónica",
            "supplier_id": str(self.supplier_id)
        }
        response = self.client.put(self.url_detail, updated_data, format='json')
        print("✏️ Producto editado:", response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], updated_data["name"])
        print("✅ Producto actualizado exitosamente")

    def test_product_delete(self):
        print("\n🔴 Probando DELETE /api/inventory/products/<id>/")
        response = self.client.delete(self.url_detail)
        print("🗑️ Producto borrado, status:", response.status_code)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(products_collection.count_documents({}), 0)
        print("✅ Producto eliminado correctamente")


class SupplierAPITestCase(APITestCase):
    def setUp(self):
        self.supplier_data = {
            "name": "Proveedor prueba API",
            "address": "Calle API 123",
            "phone": "+56987654321",
            "email": "proveedor@api.com",
            "rut": "60.810.000-7",  # RUT válido conocido
            "category": "Tecnología"
        }
        self.supplier_id = suppliers_collection.insert_one({
            **self.supplier_data,
            "rut": "60.810.000-7"
        }).inserted_id
        self.url_list = '/api/inventory/suppliers/'
        self.url_detail = f'/api/inventory/suppliers/{str(self.supplier_id)}/'

    def tearDown(self):
        suppliers_collection.delete_many({})

    def test_supplier_list(self):
        print("\n🔄 Probando GET /api/inventory/suppliers/")
        response = self.client.get(self.url_list)
        print("👀 Proveedores obtenidos:", response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        print("✅ Listado de proveedores exitoso")

    def test_supplier_create(self):
        print("\n🟢 Probando POST /api/inventory/suppliers/")
        new_supplier = {
            "name": "Nuevo proveedor API",
            "address": "Nueva Dirección 456",
            "phone": "+56911223344",
            "email": "nuevo@proveedor.com",
            "rut": "11.111.111-1",  # RUT válido conocido (11111111-1)
            "category": "Hogar"
        }
        response = self.client.post(self.url_list, new_supplier, format='json')
        print("➕ Proveedor agregado:", response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(suppliers_collection.count_documents({}), 2)
        print("✅ Proveedor creado exitosamente")

    def test_rut_format_conversion(self):
        """Verifica que el serializer acepte RUTs con puntos pero los convierta"""
        print("\n🔤 Probando conversión de formato de RUT en POST /api/inventory/suppliers/")
        supplier_data = {
            "name": "Proveedor formato mixto",
            "address": "Calle Test 123",
            "phone": "+56987654321",
            "email": "formato@test.com",
            "rut": "12.345.678-5",  # RUT válido conocido (12345678-5)
            "category": "Test"
        }
        response = self.client.post(self.url_list, supplier_data, format='json')
        print("📝 Respuesta del servidor:", response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['rut'], "12345678-5")  # Verifica la conversión
        print("✅ Conversión de RUT exitosa")

    def test_supplier_retrieve(self):
        print("\n🔵 Probando GET /api/inventory/suppliers/<id>/")
        response = self.client.get(self.url_detail)
        print("👀 Proveedor mostrado:", response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], self.supplier_data['name'])
        print("✅ Proveedor recuperado correctamente")

    def test_supplier_update(self):
        print("\n🟡 Probando PUT /api/inventory/suppliers/<id>/")
        updated_data = {
            "name": "Proveedor actualizado API",
            "address": "Dirección Actualizada 789",
            "phone": "+56955667788",
            "email": "actualizado@proveedor.com",
            "rut": "12.345.678-5",  # Válido (ejemplo real: 12345678-5)
            "category": "Electrónica"
        }
        response = self.client.put(self.url_detail, updated_data, format='json')
        print("✏️ Proveedor editado:", response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], updated_data["name"])
        print("✅ Proveedor actualizado exitosamente")

    def test_supplier_delete(self):
        print("\n🔴 Probando DELETE /api/inventory/suppliers/<id>/")
        response = self.client.delete(self.url_detail)
        print("🗑️ Proveedor borrado, status:", response.status_code)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(suppliers_collection.count_documents({}), 0)
        print("✅ Proveedor eliminado correctamente")