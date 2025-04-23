import os
import unittest
from pymongo import MongoClient
import json
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class TestMongoDBOperations(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Configuración de conexión a MongoDB
        cls.mongo_uri = os.getenv("MONGODB_URI", "mongodb://admin:admin@mongodb:27017/bazar_matias_db?authSource=admin")
        cls.client = MongoClient(cls.mongo_uri)
        cls.db = cls.client[os.getenv("MONGO_DB", "bazar_matias_db")]
        cls.products_collection = cls.db['products']
        
        # Verificar conexión
        try:
            cls.client.admin.command('ping')
            print("✅ Conexión a MongoDB establecida correctamente")
        except Exception as e:
            print(f"❌ Error conectando a MongoDB: {e}")
            raise

    def setUp(self):
        self.test_product = {
            "name": "Producto prueba",
            "price_clp": 19990.0,
            "stock": 15,
            "category": "Tecnología"
        }
        try:
            self.products_collection.delete_many({})
            print("🧹 Colección 'products' limpiada")
        except Exception as e:
            print(f"❌ Error limpiando colección: {e}")
            raise

    def test_mongo_crud_operations(self):
        print("\n=== 🔄 Iniciando pruebas CRUD ===")
        
        # 1. Crear producto
        print("\n🟢 1. Probando creación...")
        inserted = self.products_collection.insert_one(self.test_product)
        product_id = inserted.inserted_id
        self.assertTrue(product_id)
        print(f"📝 Producto creado con ID: {product_id}")
        
        # 2. Leer producto
        print("\n🔵 2. Probando lectura...")
        found = self.products_collection.find_one({"_id": product_id})
        self.assertEqual(found["name"], "Producto prueba")
        print(f"🔍 Producto encontrado: {found}")
        
        # 3. Actualizar producto
        print("\n🟡 3. Probando actualización...")
        update_result = self.products_collection.update_one(
            {"_id": product_id},
            {"$set": {"name": "Producto actualizado"}}
        )
        self.assertEqual(update_result.modified_count, 1)
        updated = self.products_collection.find_one({"_id": product_id})
        self.assertEqual(updated["name"], "Producto actualizado")
        print(f"🔄 Producto actualizado: {updated}")
        
        # 4. Eliminar producto
        print("\n🔴 4. Probando eliminación...")
        delete_result = self.products_collection.delete_one({"_id": product_id})
        self.assertEqual(delete_result.deleted_count, 1)
        print("🗑️ Producto eliminado correctamente")
        
        # 5. Verificar eliminación
        print("\n⚫ 5. Verificando eliminación...")
        should_be_none = self.products_collection.find_one({"_id": product_id})
        self.assertIsNone(should_be_none)
        print("✅ Eliminación verificada con éxito")

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        print("🔌 Conexión a MongoDB cerrada")

if __name__ == '__main__':
    unittest.main()