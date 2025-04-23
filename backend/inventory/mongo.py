import os
from pymongo import MongoClient

MONGO_USERNAME = os.getenv("MONGO_USERNAME", "admin")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "admin")
MONGO_DB = os.getenv("MONGO_DB", "bazar_matias_db")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")

MONGO_URI = f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@mongo:{MONGO_PORT}/{MONGO_DB}"

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]
products_collection = db['products']