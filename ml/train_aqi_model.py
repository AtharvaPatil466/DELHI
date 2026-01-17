import glob
import pandas as pd
import json
import os
import re
from xgboost import XGBRegressor
import numpy as np

print("🔹 Loading Excel files...")

# Get absolute paths relative to the script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "data")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output")

files = glob.glob(os.path.join(DATA_DIR, "*.xlsx"))
dfs = []

# Month mapping
MONTH_MAP = {
    'january': 1, 'february': 2, 'march': 3, 'april': 4,
    'may': 5, 'june': 6, 'july': 7, 'august': 8,
    'september': 9, 'october': 10, 'november': 11, 'december': 12
}

if not files:
    print("❌ No Excel files found in data/ folder!")
    exit(1)

for file in files:
    print(f"Processing {file}")
    # Extract year from filename (e.g., ..._2022_...)
    year_match = re.search(r'202[0-9]', file)
    year = int(year_match.group()) if year_match else 2025
    
    try:
        df_raw = pd.read_excel(file)
    except Exception as e:
        print(f"⚠️ Error reading {file}: {e}")
        continue
    
    # Clean column names
    df_raw.columns = [str(c).lower().strip() for c in df_raw.columns]
    
    # Filter for valid day rows (1-31) and stop before summary rows
    if 'day' in df_raw.columns:
        df_raw['day'] = pd.to_numeric(df_raw['day'], errors='coerce')
        df_raw = df_raw.dropna(subset=['day'])
        df_raw['day'] = df_raw['day'].astype(int)
    else:
        print(f"⚠️ 'Day' column missing in {file}. Skipping.")
        continue

    # Identify month columns
    month_cols = [c for c in df_raw.columns if c in MONTH_MAP]
    
    # Melt the dataframe: Day | Month | AQI
    df_melted = df_raw.melt(id_vars=['day'], value_vars=month_cols, 
                             var_name='month_name', value_name='aqi')
    
    # Convert month name to number
    df_melted['month'] = df_melted['month_name'].map(MONTH_MAP)
    
    # Create date column
    def create_date(row):
        try:
            return pd.to_datetime(f"{year}-{row['month']}-{row['day']}")
        except:
            return pd.NaT

    df_melted['date'] = df_melted.apply(create_date, axis=1)
    
    # Cleanup
    df_processed = df_melted.dropna(subset=['date', 'aqi'])
    df_processed = df_processed[['date', 'aqi']]
    
    dfs.append(df_processed)

if not dfs:
    print("❌ No valid data extracted from files!")
    exit(1)

df = pd.concat(dfs, ignore_index=True)
df = df.sort_values("date")

print("🔹 Total records:", len(df))

# Convert AQI to numeric and interpolate missing values
df["aqi"] = pd.to_numeric(df["aqi"], errors='coerce')
df["aqi"] = df["aqi"].interpolate()
df = df.dropna()

# ----------------------
# Feature Engineering
# ----------------------
print("🔹 Creating features...")

df["aqi_lag1"] = df["aqi"].shift(1)
df["aqi_lag2"] = df["aqi"].shift(2)
df["aqi_lag3"] = df["aqi"].shift(3)

df["month_feat"] = df["date"].dt.month
df["dayofweek"] = df["date"].dt.dayofweek

df = df.dropna()

X = df[["aqi_lag1", "aqi_lag2", "aqi_lag3", "month_feat", "dayofweek"]]
y = df["aqi"]

# ----------------------
# Train Model
# ----------------------
print("🔹 Training ML model...")

model = XGBRegressor(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    objective="reg:squarederror"
)

model.fit(X, y)

print("✅ Model trained successfully.")

# ----------------------
# Forecast Next 7 Days
# ----------------------
print("🔹 Generating forecast...")

last = df.iloc[-1:].copy()
now_date = df["date"].iloc[-1]
forecast_results = []

for i in range(1, 8):
    pred = float(model.predict(last[X.columns])[0])
    future_date = now_date + pd.Timedelta(days=i)
    
    forecast_results.append({
        "date": future_date.strftime("%Y-%m-%d"),
        "aqi": round(pred, 2)
    })

    # Update last row for next prediction
    new_data = {
        "aqi_lag1": [pred],
        "aqi_lag2": [last["aqi_lag1"].iloc[0]],
        "aqi_lag3": [last["aqi_lag2"].iloc[0]],
        "month_feat": [future_date.month],
        "dayofweek": [future_date.dayofweek]
    }
    last = pd.DataFrame(new_data)

# ----------------------
# Save Output
# ----------------------
output = {
    "model": "XGBoost Regression",
    "data_source": "CPCB AQI (Excel Pivoted Format)",
    "forecast_days": 7,
    "aqi_forecast": forecast_results
}

os.makedirs(OUTPUT_DIR, exist_ok=True)
output_path = os.path.join(OUTPUT_DIR, "aqi_forecast.json")

with open(output_path, "w") as f:
    json.dump(output, f, indent=2)

print("🎉 Forecast saved to output/aqi_forecast.json")
