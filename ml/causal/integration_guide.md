
# 🚀 Delhi Pollution Causal Intelligence: Implementation Guide

This guide explains how to run the causal inference backend and connect it to your hackathon platform.

## 1. Setup Environment (macOS/Linux)

Since macOS manages its Python environment strictly (PEP 668), we must use a virtual environment.

```bash
# Navigate to the causal directory
cd ml/causal

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 2. Running the Causal API
With the virtual environment activated:

```bash
python3 causal_api.py
```

The API will run on `http://localhost:8000`.

**Main Endpoints:**
- `GET /causal/fire-impact`: Returns the main causal ATE (Average Treatment Effect) estimate.
- `POST /causal/custom-intervention`: Simulate a specific fire reduction percentage.
- `GET /causal/refutation-tests`: Verify the statistical validity of the claims.

## 3. How the Causal Model Works
Unlike simple correlation, our DoWhy model uses a **Directed Acyclic Graph (DAG)** to explicitly control for confounders:
- **Treatment**: Crop Fire Count
- **Outcome**: Delhi AQI
- **Confounders**: Wind Speed/Direction, Temperature, Humidity, Day of Week, Traffic.

We use **Propensity Score Matching** to find "counterfactual" days—comparing days with high fires to days with low fires that have *identical* weather conditions. This isolates the causal effect of the smoke.

## 4. Frontend Integration
The `CausalInferencePanel.jsx` is already integrated into the **Source Analysis** tab.

**Data Flow:**
- The component currently uses a high-fidelity simulation for the hackathon demo.
- To connect to the live FastAPI, update the `useEffect` in `CausalInferencePanel.jsx` to fetch from `http://localhost:8000/causal/fire-impact`.

## 5. Troubleshooting
- **Data Not Found**: If `sample_data.csv` is missing, the engine will auto-generate 2 years of synthetic data.
- **Graphviz Errors**: If you get a "graphviz not found" error, install it via Homebrew: `brew install graphviz`.
