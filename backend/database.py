from pymongo import MongoClient
from config import Config

def get_db():
    client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
    return client[Config.DB_NAME]
