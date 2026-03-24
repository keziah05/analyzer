from pymongo import MongoClient
import pandas as pd
import random

# Default to localhost if you don't have Atlas running
MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "dev_analyzer"

def generate_mock_data(num_records=50):
    data = []
    types = [
        {"type": "Rapid Coder", "commits_range": (30, 80), "loc_range": (800, 2000), "bug_fixes_range": (2, 10), "review_time_range": (1, 4), "refactor_count_range": (1, 5)},
        {"type": "Debug Specialist", "commits_range": (10, 30), "loc_range": (200, 600), "bug_fixes_range": (15, 30), "review_time_range": (3, 8), "refactor_count_range": (2, 6)},
        {"type": "Deep Worker", "commits_range": (5, 15), "loc_range": (1500, 5000), "bug_fixes_range": (1, 5), "review_time_range": (5, 12), "refactor_count_range": (5, 15)},
        {"type": "Refactor Specialist", "commits_range": (15, 40), "loc_range": (500, 1500), "bug_fixes_range": (2, 8), "review_time_range": (4, 10), "refactor_count_range": (10, 25)},
        # Anomalies
        {"type": "Anomaly_Lazy", "commits_range": (1, 3), "loc_range": (10, 50), "bug_fixes_range": (0, 1), "review_time_range": (0, 1), "refactor_count_range": (0, 1)},
        {"type": "Anomaly_Overworker", "commits_range": (100, 150), "loc_range": (6000, 10000), "bug_fixes_range": (10, 20), "review_time_range": (15, 20), "refactor_count_range": (5, 10)},
    ]

    for i in range(num_records):
        dev_id = f"dev_{i+1}"
        name = f"Developer {i+1}"
        
        # 80% normal devs, 20% anomalies
        if random.random() < 0.8:
            profile = random.choice(types[:4])
        else:
            profile = random.choice(types[4:])

        record = {
            "_id": dev_id,
            "name": name,
            "commits": random.randint(*profile["commits_range"]),
            "loc": random.randint(*profile["loc_range"]),
            "bug_fixes": random.randint(*profile["bug_fixes_range"]),
            "review_time": random.randint(*profile["review_time_range"]),
            "refactor_count": random.randint(*profile["refactor_count_range"])
        }
        data.append(record)
    
    return data

def seed_database():
    try:
        print(f"Connecting to MongoDB at {MONGO_URI}...")
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Force a connection attempt
        client.admin.command('ping')
        print("Connected successfully!")
        
        db = client[DB_NAME]
        collection = db.developers
        
        # Clear existing data
        print("Clearing existing data...")
        collection.delete_many({})
        
        # Generate and insert new data
        print("Generating mock data...")
        mock_data = generate_mock_data(100)
        
        print("Inserting records into database...")
        collection.insert_many(mock_data)
        
        print(f"Successfully inserted {len(mock_data)} records into {DB_NAME}.developers!")
        
        # Also let's save a CSV copy for the frontend upload test
        df = pd.DataFrame(mock_data)
        df.to_csv("sample_developers.csv", index=False)
        print("Saved a copy as sample_developers.csv for frontend testing.")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        print("\nMake sure MongoDB is running locally, or update MONGO_URI with your Atlas connection string.")

if __name__ == "__main__":
    seed_database()
