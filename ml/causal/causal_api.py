
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from causal_inference import CausalEngine
import uvicorn
import os

app = FastAPI(title="Delhi Pollution Causal API")

# Initialize Engine
# In production, we'd cache this or run it periodically
engine = None

def get_engine():
    global engine
    if engine is None:
        # Ensure we are in the right directory to find sample_data.csv
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        engine = CausalEngine()
    return engine

class InterventionRequest(BaseModel):
    fire_reduction_percent: float

@app.get("/causal/fire-impact")
async def get_fire_impact():
    try:
        results = get_engine().run_inference()
        return {
            "intervention": "eliminate_all_fires",
            "current_avg_aqi": results["current_avg_aqi"],
            "counterfactual_aqi": results["counterfactual_aqi"],
            "ate": -results["total_impact"],
            "confidence_interval": [-results["confidence_interval"][1], -results["confidence_interval"][0]],
            "confidence_level": results["confidence_level"],
            "p_value": results["p_value"],
            "interpretation": f"Eliminating crop fires would causally reduce average AQI by {results['total_impact']} points."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/causal/custom-intervention")
async def post_intervention(request: InterventionRequest):
    try:
        results = get_engine().run_inference()
        reduction_factor = request.fire_reduction_percent / 100.0
        impact = results["total_impact"] * reduction_factor
        
        return {
            "reduction_percent": request.fire_reduction_percent,
            "aqi_reduction": round(impact, 1),
            "new_predicted_aqi": round(results["current_avg_aqi"] - impact, 1),
            "confidence_interval": [
                round(-results["confidence_interval"][1] * reduction_factor, 1),
                round(-results["confidence_interval"][0] * reduction_factor, 1)
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/causal/confounders")
async def get_confounders():
    return {"controlled_variables": ["wind_speed", "wind_direction", "temperature_c", "humidity_percent", "day_of_week", "traffic_density"]}

@app.get("/causal/refutation-tests")
async def get_refutation():
    results = get_engine().run_inference()
    return results["refutation_tests"]

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
