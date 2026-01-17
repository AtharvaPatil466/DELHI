# FILE: DELHI/ml/fire_engine.py
import random
import json
import datetime

class SatelliteFireDetector:
    def __init__(self):
        # Bounding Box for Punjab/Haryana (Stubble Burning Zone)
        self.LAT_RANGE = (29.5, 31.5)
        self.LON_RANGE = (74.0, 76.5)
        
    def detect_active_fires(self):
        """
        Simulates NASA VIIRS/MODIS satellite data.
        Returns a list of active fire hotspots with intensity.
        """
        # Generate 40-60 active fires (typical for winter season)
        fire_count = random.randint(40, 60)
        fires = []
        
        for _ in range(fire_count):
            # Generate coordinate within the "Burning Belt"
            lat = random.uniform(self.LAT_RANGE[0], self.LAT_RANGE[1])
            lon = random.uniform(self.LON_RANGE[0], self.LON_RANGE[1])
            
            # Fire Radiative Power (MW) - Intensity
            frp = random.uniform(10.5, 150.0) 
            
            # Confidence Level
            confidence = random.choice(['nominal', 'high'])
            
            fires.append({
                "latitude": round(lat, 4),
                "longitude": round(lon, 4),
                "brightness": round(random.uniform(300, 380), 1), # Kelvin
                "frp": round(frp, 1), # Fire Radiative Power
                "acquisition_time": datetime.datetime.now().isoformat(),
                "confidence": confidence,
                "satellite": "NASA-VIIRS"
            })
            
        return fires

    def get_smoke_forecast(self, fires):
        """
        Calculates simple smoke drift based on Wind Direction (NW to SE).
        """
        # Delhi Coordinates
        DELHI_LAT, DELHI_LON = 28.61, 77.20
        
        drift_warnings = []
        total_impact = 0
        
        for fire in fires:
            # Simple distance weight
            dist_lat = abs(fire['latitude'] - DELHI_LAT)
            dist_lon = abs(fire['longitude'] - DELHI_LON)
            
            # If fire is Northwest of Delhi (Winter pattern)
            if fire['latitude'] > DELHI_LAT and fire['longitude'] < DELHI_LON:
                impact = (fire['frp'] / (dist_lat + dist_lon)) * 0.5
                total_impact += impact

        return {
            "total_fires": len(fires),
            "smoke_drift_risk": "Severe" if total_impact > 50 else "Moderate",
            "estimated_pm25_contribution": round(total_impact, 2)
        }

if __name__ == "__main__":
    detector = SatelliteFireDetector()
    fires = detector.detect_active_fires()
    print(json.dumps(detector.get_smoke_forecast(fires), indent=2))