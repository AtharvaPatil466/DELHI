---
description: How to start the Delhi AQI Intelligence platform
---

To start all systems of the platform, you need to open three separate terminal windows/tabs and run the following components:

### 1. Start the Frontend (UI)
This starts the React dashboard.
```bash
npm run dev
```
*Access at: http://localhost:5173*

### 2. Start the Backend (Data Server)
This handles API requests and database/real-time logic.
```bash
node server/index.js
```
*Port: 5001 (usually)*

### 3. Start the AI/ML Intelligence Service
This handles the causal inference and predictive modeling.
```bash
cd ml/causal
source venv/bin/activate
python3 causal_api.py
```

### Optional: Real-time Data Feeds
If you want to run the live NASA satellite fire tracking:
```bash
python3 ml/nasa_live.py
```

**Note:** Ensure you have installed dependencies in each folder (`npm install` for JS, `pip install -r requirements.txt` for Python).
