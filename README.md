# Developer Productivity Pattern Analyzer

The full-stack application (React Frontend + Flask Backend + Machine Learning) has been successfully generated. 

Due to access restrictions on your local PowerShell environment, the dependencies could not be automatically installed and started. Please follow these manual steps to run and verify the application.

## Prerequisites
1. **Python 3.8+**
2. **Node.js 18+**
3. **MongoDB** instances running locally on `mongodb://localhost:27017` (or change `MONGO_URI` in `backend/config.py` to point to Atlas).

## Step 1: Initialize the Backend & Seed Data

Open a terminal (Command Prompt or PowerShell) and navigate to the backend folder:
```cmd
cd C:\Users\akshi\.gemini\antigravity\scratch\dev-productivity-analyzer\backend
```

Create a virtual environment and install requirements:
```cmd
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Seed the MongoDB database and generate a test dataset:
```cmd
python seed_db.py
```
*Note: This creates `sample_developers.csv` in the backend folder, which you can use for testing the frontend upload page.*

Start the backend API Server:
```cmd
python app.py
```
*(Leave this terminal running. The backend runs on port 8000).*

## Step 2: Initialize the Frontend

Open a **new** terminal and navigate to the frontend folder:
```cmd
cd C:\Users\akshi\.gemini\antigravity\scratch\dev-productivity-analyzer\frontend
```

Install React dependencies and start the Vite dev server:
```cmd
npm install
npm run dev
```
*(The frontend runs on port 3000).*

## Step 3: Verify the Application

1. Open your browser and navigate to `http://localhost:3000`.
2. Admire the rich, modern landing page with tailored CSS animations.
3. Click "Get Started" to navigate to the **Upload Data** page.
4. Upload the `sample_developers.csv` file that was generated in the backend directory.
5. Click **Run Production Analysis**.
6. After processing, you will be redirected to the **Dashboard**.
7. Validate that the Machine Learning Output (K-Means Clustering Distribution & Isolation Forest Anomalies) are dynamically visualized on the charts and detailed in the DataTable!
