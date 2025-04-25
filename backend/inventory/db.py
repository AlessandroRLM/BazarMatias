from pymongo import MongoClient
from django.conf import settings
import os

# Usar la URI de conexión desde las variables de entorno
MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://admin:admin@mongodb:27017/bazar_matias_db?authSource=admin')

client = MongoClient(MONGO_URI)
db = client[os.getenv('MONGO_DB', 'bazar_matias_db')]

products_collection = db["products"]
suppliers_collection = db["suppliers"]