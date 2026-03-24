from flask import Blueprint, request, jsonify
from database import get_db
from ml.pipeline import run_ml_pipeline

api_bp = Blueprint('api', __name__)

@api_bp.route('/developers', methods=['POST'])
def add_developer_data():
    db = get_db()
    data = request.json
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    if not isinstance(data, list):
        data = [data]
        
    if data:
        # Clear existing data to prevent DuplicateKeyError
        db.developers.delete_many({})
        db.developers.insert_many(data)
        
    return jsonify({"message": f"Successfully inserted {len(data)} records."}), 201

@api_bp.route('/analyze', methods=['POST'])
def run_analysis():
    db = get_db()
    
    # Fetch data
    developers = list(db.developers.find({}))
    if not developers:
        return jsonify({"error": "No developer data found. Please upload data first."}), 404
        
    # Run ML
    ml_output = run_ml_pipeline(developers)
    if ml_output.get("status") == "error":
        return jsonify({"error": ml_output["message"]}), 400
        
    results = ml_output["results"]
    metrics = ml_output.get("metrics", {})
    
    # Store results
    if results:
        # Clear existing analysis results
        db.analysis_results.delete_many({})
        db.analysis_results.insert_many(results)
        
    return jsonify({"message": "Analysis completed", "processed": len(results), "metrics": metrics}), 200

@api_bp.route('/results', methods=['GET'])
def get_results():
    db = get_db()
    
    # Join developers metrics with their ML analysis results
    pipeline = [
        {
            "$lookup": {
                "from": "analysis_results",
                "localField": "_id",
                "foreignField": "developer_id",
                "as": "analysis"
            }
        },
        {
            "$unwind": {
                "path": "$analysis",
                "preserveNullAndEmptyArrays": True
            }
        }
    ]
    
    combined_data = list(db.developers.aggregate(pipeline))
    
    # Convert ObjectIds to strings recursively
    import bson
    def stringify_object_ids(data):
        if isinstance(data, list):
            return [stringify_object_ids(item) for item in data]
        elif isinstance(data, dict):
            return {key: stringify_object_ids(value) for key, value in data.items()}
        elif isinstance(data, bson.objectid.ObjectId):
            return str(data)
        else:
            return data
            
    clean_data = stringify_object_ids(combined_data)
    
    return jsonify(clean_data), 200

@api_bp.route('/teams', methods=['GET'])
def get_teams():
    from database import get_db
    db = get_db()
    
    # Fetch data joined with analysis just like /results API does
    pipeline = [
        {
            "$lookup": {
                "from": "analysis_results",
                "localField": "_id",
                "foreignField": "developer_id",
                "as": "analysis"
            }
        },
        {
            "$unwind": {
                "path": "$analysis",
                "preserveNullAndEmptyArrays": True
            }
        }
    ]
    
    combined_data = list(db.developers.aggregate(pipeline))
    
    # Generate teams
    from team_builder import form_balanced_teams
    teams = form_balanced_teams(combined_data)
    
    # Save teams to MongoDB so they can be viewed directly in the database
    if teams:
        db.teams.delete_many({}) # Clear out old teams
        db.teams.insert_many(teams)
        
        # Convert MongoDB ObjectIds to strings so they can be sent as JSON
        for team in teams:
            team['_id'] = str(team['_id'])
    
    return jsonify({"teams": teams, "total_teams_formed": len(teams)}), 200
