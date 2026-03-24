import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans
import datetime

def run_ml_pipeline(developers_data):
    if not developers_data:
        return {"status": "error", "message": "No data available"}
    
    df = pd.DataFrame(developers_data)
    
    # Check if necessary columns exist
    required_cols = ["_id", "name", "commits", "loc", "bug_fixes", "review_time", "refactor_count"]
    for col in required_cols:
        if col not in df.columns:
            return {"status": "error", "message": f"Missing column: {col}"}
    
    features = ["commits", "loc", "bug_fixes", "review_time", "refactor_count"]
    
    if len(df) == 0:
        return {"status": "error", "message": "DataFrame is empty"}
        
    # Feature Engineering
    df["commits_per_day"] = df["commits"] / 30.0 # assuming 30 days window
    df["avg_loc_change"] = df["loc"] / (df["commits"] + 1)
    df["bug_fix_ratio"] = df["bug_fixes"] / (df["commits"] + 1)
    df["review_efficiency"] = df["review_time"] / (df["commits"] + 1)
    
    engineered_features = ["commits_per_day", "avg_loc_change", "bug_fix_ratio", "review_efficiency"]
    X = df[features + engineered_features]
    
    # Normalization
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Anomaly Detection Output
    iso = IsolationForest(contamination=0.1, random_state=42)
    df["anomaly"] = iso.fit_predict(X_scaled)
    # Convert -1 to boolean true for anomaly, 1 to false
    df["is_anomaly"] = df["anomaly"] == -1
    
    # K-Means Clustering for non-anomalies
    normal_df = df[df["anomaly"] == 1].copy()
    num_clusters = 4
    if len(normal_df) < num_clusters:
        # Not enough data for requested clusters
        num_clusters = max(1, len(normal_df))
        
    kmeans = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
        
    if len(normal_df) > 0:
        normal_idx = df["anomaly"] == 1
        X_normal_scaled = scaler.transform(df.loc[normal_idx, features + engineered_features])
        kmeans.fit(X_normal_scaled)
        
        # Predict clusters for ALL developers so anomalies get a role too
        df["cluster"] = kmeans.predict(X_scaled)
    else:
        df["cluster"] = 0 # Default if everything is anomaly (edge case)
        
    df["cluster"] = df["cluster"].astype(int)
    
    # Assign Developer Types based on clusters
    cluster_mapping = {
        0: "Rapid Coder",
        1: "Debug Specialist",
        2: "Deep Worker",
        3: "Refactor Specialist"
    }
    
    df["type"] = df["cluster"].map(cluster_mapping).fillna("Unknown")
    df["created_at"] = datetime.datetime.utcnow().isoformat()
    
    # Prepare results
    # Renaming _id to developer_id for the output collection
    results_df = df[["_id", "cluster", "type", "is_anomaly", "created_at"]].rename(columns={"_id": "developer_id"})
    results = results_df.to_dict(orient="records")
    
    # Return metrics (optional)
    try:
        from sklearn.metrics import silhouette_score
        if len(normal_df) > num_clusters > 1:
            sil_score = silhouette_score(X_normal_scaled, df.loc[normal_idx, "cluster"])
        else:
            sil_score = 0.0
    except:
         sil_score = 0.0
         
    metrics = {
        "silhouette_score": float(sil_score),
        "anomalies_detected": int(df["is_anomaly"].sum()),
        "total_analyzed": len(df)
    }
    
    return {"status": "success", "results": results, "metrics": metrics}
