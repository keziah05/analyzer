import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Use localhost as default if MONGO_URI is not provided
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    DB_NAME = os.getenv("DB_NAME", "dev_analyzer")
