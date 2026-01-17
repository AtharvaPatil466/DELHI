# FILE: DELHI/ml/nasa_live.py
import requests
import io
import json
import os
import datetime
import math

def haversine_dist(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return R * c

def fetch_live_nasa_data():
    URL = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_South_Asia_24h.csv"
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, '../src/data/fire_data.json')
    
    metadata = {
        "timestamp": datetime.datetime.now().isoformat(),
        "source": "NASA-MODIS",
        "status": "Live"
    }
    
    fire_list = []
    
    try:
        print("🛰️ Connecting to NASA FIRMS Satellite Feed...")
        response = requests.get(URL, timeout=10)
        response.raise_for_status()
        
        # Manual CSV parse since pandas might be missing
        lines = response.content.decode('utf-8').splitlines()
        header = lines[0].split(',')
        
        for line in lines[1:]:
            row = line.split(',')
            if len(row) < len(header): continue
            
            lat = float(row[0])
            lon = float(row[1])
            conf = int(row[8])
            bright = float(row[2])
            frp = float(row[12])
            
            # FILTER: Punjab & Haryana Region
            if 28.0 <= lat <= 32.5 and 73.0 <= lon <= 78.0 and conf > 70:
                fire_list.append({
                    "id": len(fire_list),
                    "position": [lat, lon],
                    "intensity": bright / 400,
                    "frp": frp,
                    "confidence": conf
                })
        
        print(f"✅ Success: Detected {len(fire_list)} live fires.")

    except Exception as e:
        print(f"⚠️ NASA Connection Failed: {e}")
        # TIER 2: CACHE FALLBACK
        if os.path.exists(output_path):
            print("📁 Switching to CACHED Data...")
            try:
                with open(output_path, 'r') as f:
                    cached_data = json.load(f)
                    metadata["status"] = "Cached"
                    metadata["timestamp"] = cached_data.get("metadata", {}).get("timestamp", metadata["timestamp"])
                    return cached_data
            except:
                pass
        
        # TIER 3: SIMULATION FALLBACK
        print("🔥 Switching to SIMULATED Data...")
        metadata["status"] = "Simulated"
        try:
            from fire_engine import SatelliteFireDetector
            detector = SatelliteFireDetector()
            sim_fires = detector.detect_active_fires()
            fire_list = [{
                "id": i,
                "position": [f['latitude'], f['longitude']],
                "intensity": f['frp'] / 150,
                "frp": f['frp'],
                "confidence": 90 if f['confidence'] == 'high' else 70
            } for i, f in enumerate(sim_fires)]
        except Exception as sim_e:
            print(f"❌ Simulation Failed: {sim_e}")
            fire_list = []

    # POST-PROCESSING: Clusters & Impact
    clusters = []
    try:
        from fire_clustering import run_clustering
        clusters = run_clustering(fire_list)
    except Exception as cl_e:
        print(f"⚠️ Clustering failed: {cl_e}")

    # Impact Logic (Delhi Centric)
    DELHI_COORDS = [28.6139, 77.2090]
    total_impact = 0
    impactful_fires = []
    
    for fire in fire_list:
        dist = haversine_dist(fire['position'], DELHI_COORDS)
        # Weight by distance and intensity
        impact = fire['frp'] / (dist + 1)
        fire['impact_score'] = round(impact, 2)
        total_impact += impact
        impactful_fires.append(fire)
    
    impactful_fires.sort(key=lambda x: x['impact_score'], reverse=True)
    
    # Final Attribution Stats
    # stubble% = min(45, (total_impact/50) + 5)
    stubble_pct = min(45, (total_impact / 50) + 5)
    
    final_data = {
        "metadata": metadata,
        "all_fires": fire_list,
        "impactful_fires": impactful_fires[:50],
        "clusters": clusters,
        "attribution": {
            "stubble_percentage": round(stubble_pct, 1),
            "severity": "Critical" if stubble_pct > 30 else "High" if stubble_pct > 20 else "Moderate",
            "total_fire_count": len(fire_list)
        }
    }

    with open(output_path, 'w') as f:
        json.dump(final_data, f, indent=2)
    
    return final_data

if __name__ == "__main__":
    fetch_live_nasa_data()