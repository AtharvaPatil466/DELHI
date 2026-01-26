import glob
import pandas as pd
import json
from xgboost import XGBRegressor

print("🔹 Loading Excel files...")

files = glob.glob("data/*.xlsx")
dfs = []

for file in files:
    print(f"Reading {file}")
    df = pd.read_excel(file)
    df.columns = [c.lower().strip() for c in df.columns]

    df = df.rename(columns={
        "from date": "date",
        "date": "date",
        "aqi": "aqi"
    })

    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date", "aqi"])

    dfs.append(df[["date", "aqi"]])

df = pd.concat(dfs, ignore_index=True)
df = df.sort_values("date")

print("🔹 Total records:", len(df))

df["aqi"] = df["aqi"].interpolate()

# ----------------------
# Feature Engineering
# ----------------------
print("🔹 Creating features...")

df["aqi_lag1"] = df["aqi"].shift(1)
df["aqi_lag2"] = df["aqi"].shift(2)
df["aqi_lag3"] = df["aqi"].shift(3)

df["month"] = df["date"].dt.month
df["dayofweek"] = df["date"].dt.dayofweek

df = df.dropna()

X = df[["aqi_lag1", "aqi_lag2", "aqi_lag3", "month", "dayofweek"]]
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
forecast = []

for i in range(7):
    pred = float(model.predict(last[X.columns])[0])
    forecast.append(round(pred, 2))

    last["aqi_lag3"] = last["aqi_lag2"]
    last["aqi_lag2"] = last["aqi_lag1"]
    last["aqi_lag1"] = pred
    last["dayofweek"] = (last["dayofweek"] + 1) % 7

# ----------------------
# Save Output
# ----------------------
output = {
    "model": "XGBoost Regression",
    "data_source": "CPCB AQI (Multiple Years)",
    "forecast_days": 7,
    "aqi_forecast": forecast
}

with open("output/aqi_forecast.json", "w") as f:
    json.dump(output, f, indent=2)

print("🎉 Forecast saved to output/aqi_forecast.json")