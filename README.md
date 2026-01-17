# Delhi NCR Pollution Intelligence Platform

A high-fidelity spatial intelligence platform for monitoring and simulating air pollution in Delhi NCR.

## 🚀 Quick Start

### 1. Frontend Development
To start the interactive bento-dashboard:
```bash
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

### 2. Simulation Engines (Python)
The project uses several simulation engines to drive live data. First, ensure dependencies are installed in the virtual environment:
```bash
# Activate .venv and install (done automatically by the agent)
./.venv/bin/python -m pip install pandas requests xgboost scikit-learn
```

#### NASA Live Satellite Feed
To fetch real-time MODIS fire data for Punjab/Haryana:
```bash
./.venv/bin/python ml/nasa_live.py
```
This updates `src/data/live_fires.json` which the 3D Map consumes.

#### Vision AI Traffic Engine
To simulate vehicular emissions based on real Delhi hotspots:
```bash
./.venv/bin/python ml/traffic_engine.py
```

#### ML Forecast Training
To retrain the XGBoost model on the latest data:
```bash
./.venv/bin/python ml/train_aqi_model.py
```

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Framer Motion, Recharts, Leaflet (Spatial Maps).
- **Backend/Sim**: Python 3.x, XGBoost, NASA FIRMS API.
- **Design**: Sci-fi glassmorphism, Dark mode optimized.
