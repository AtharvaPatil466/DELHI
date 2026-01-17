# FILE: DELHI/ml/traffic_engine.py
import datetime
import random
import json

class TrafficEmissionSimulator:
    def __init__(self):
        # Emission factors (g/km) per vehicle type (approximate Delhi standards)
        self.EMISSION_FACTORS = {
            'Two_Wheeler': {'PM2.5': 0.05, 'NOx': 0.1, 'CO': 1.0},
            'Car':         {'PM2.5': 0.08, 'NOx': 0.2, 'CO': 1.5},
            'Bus':         {'PM2.5': 0.80, 'NOx': 6.5, 'CO': 3.0},
            'Truck':       {'PM2.5': 1.10, 'NOx': 8.0, 'CO': 4.0}
        }
        
        # Key Delhi Hotspots
        self.LOCATIONS = {
            'ITO Junction': {'lat': 28.62, 'lon': 77.24, 'base_load': 1.2},
            'Anand Vihar':  {'lat': 28.64, 'lon': 77.31, 'base_load': 1.5},
            'Dhaula Kuan':  {'lat': 28.59, 'lon': 77.16, 'base_load': 1.0},
            'Cyber Hub':    {'lat': 28.49, 'lon': 77.08, 'base_load': 1.1}
        }

    def get_traffic_multiplier(self, hour, is_weekend):
        """Returns traffic density (0.0 - 1.0) based on rush hours."""
        if is_weekend:
            if 11 <= hour <= 21: return 0.7
            return 0.3
        else:
            if 8 <= hour <= 11: return 1.0  # Morning Rush
            if 17 <= hour <= 20: return 0.95 # Evening Rush
            return 0.5

    def generate_snapshot(self):
        """Generates a real-time JSON snapshot for the frontend."""
        now = datetime.datetime.now()
        is_weekend = now.weekday() >= 5
        multiplier = self.get_traffic_multiplier(now.hour, is_weekend)
        
        snapshot = []
        for loc, data in self.LOCATIONS.items():
            # Add stochastic variance (random noise) for realism
            noise = random.uniform(0.85, 1.15)
            load = data['base_load'] * multiplier * noise
            
            # Vehicle Mix Calculation
            vehicles = {
                'Two_Wheeler': int(1500 * load),
                'Car': int(1200 * load),
                'Bus': int(50 * load),
                'Truck': int(30 * load)
            }
            
            # Emission Physics
            pm25 = sum(vehicles[v] * self.EMISSION_FACTORS[v]['PM2.5'] for v in vehicles)
            
            snapshot.append({
                "location": loc,
                "coordinates": [data['lat'], data['lon']],
                "traffic_index": int(load * 100),
                "vehicle_count": sum(vehicles.values()),
                "pm25_contribution": round(pm25, 2),
                "status": "Severe" if load > 1.2 else ("High" if load > 0.8 else "Moderate")
            })
            
        return snapshot

# For testing directly in terminal
if __name__ == "__main__":
    sim = TrafficEmissionSimulator()
    print(json.dumps(sim.generate_snapshot(), indent=2))