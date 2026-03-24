from flask import Flask
from flask_cors import CORS
from routes import api_bp
from config import Config

def create_app():
    app = Flask(__name__)
    # Allow cross-origin requests from the React frontend explicitly
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_object(Config)
    
    # Register API routes with /api prefix
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/health', methods=['GET'])
    def health():
        return {"status": "ok", "message": "Backend is running!"}
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8000)
