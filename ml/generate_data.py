import csv
import random
from datetime import datetime, timedelta

# Configuration
AREAS = [
    {"id": "anand-vihar", "name": "Anand Vihar", "base_aqi": 340},
    {"id": "rk-puram", "name": "R.K. Puram", "base_aqi": 210},
    {"id": "dwarka", "name": "Dwarka", "base_aqi": 180},
    {"id": "ota-delhi", "name": "ITO", "base_aqi": 280},
    {"id": "lodhi-road", "name": "Lodhi Road", "base_aqi": 150},
    {"id": "narela", "name": "Narela", "base_aqi": 220},
    {"id": "punjabi-bagh", "name": "Punjabi Bagh", "base_aqi": 260},
    {"id": "mundka", "name": "Mundka", "base_aqi": 310}
]

def generate_aqi_data(days=30):
    start_date = datetime.now() - timedelta(days=days)
    data = []
    
    for day in range(days * 24):
        current_time = start_date + timedelta(hours=day)
        hour = current_time.hour
        is_weekend = current_time.weekday() >= 5
        
        for area in AREAS:
            # Multipliers
            time_mult = 1.0
            if 8 <= hour <= 10: time_mult = 1.3  # Morning rush
            elif 18 <= hour <= 21: time_mult = 1.4  # Evening rush
            elif 23 <= hour or hour <= 4: time_mult = 0.7  # Night dip
            
            weekend_mult = 0.85 if is_weekend else 1.0
            noise = random.uniform(0.9, 1.1)
            
            aqi = int(area["base_aqi"] * time_mult * weekend_mult * noise)
            
            # Environmental factors
            temp = 25 + 10 * random.uniform(-1, 1) if 10 <= hour <= 17 else 15 + 5 * random.uniform(-1, 1)
            humidity = 40 + 20 * random.uniform(-1, 1) if 10 <= hour <= 17 else 70 + 10 * random.uniform(-1, 1)
            traffic = 20 + 70 * (time_mult - 0.7) / 0.7
            
            data.append({
                "timestamp": current_time.isoformat(),
                "area_id": area["id"],
                "area_name": area["name"],
                "aqi": aqi,
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "traffic_index": int(traffic)
            })
            
    return data

def save_to_csv(data, filename="ml/data/cpcb_aqi.csv"):
    keys = data[0].keys()
    with open(filename, 'w', newline='') as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)

if __name__ == "__main__":
    print("Generating synthetic AQI data...")
    data = generate_aqi_data(30)
    save_to_csv(data)
    print(f"Successfully saved {len(data)} rows to ml/data/cpcb_aqi.csv")
