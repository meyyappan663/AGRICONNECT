from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("--- Testing GET / ---")
r0 = client.get("/")
print(r0.json()["system"], "| Provenance:", r0.json().get("dataset_provenance"))

print("\n--- Testing GET /api/ml/insights ---")
r_ml = client.get("/api/ml/insights")
data_ml = r_ml.json()
print("Records:", data_ml["dataset_provenance"]["records"])
print("Top 3 Features:", data_ml["feature_importances"][:3])
print("Paddy Benchmarks:", data_ml["crop_agronomic_benchmarks"].get("Paddy (Rice)"))

print("\n--- Testing Dynamic ML GET /api/inventory ---")
r_inv = client.get("/api/inventory")
inv = r_inv.json()
print("ML Engine Status:", inv["ml_engine"])
print("Critical:", inv["critical_count"], "Warning:", inv["warning_count"], "Healthy:", inv["healthy_count"])
for w in inv["warehouses"]:
    print(f" -> {w['district']:14s}: Status={w['status']:17s} | Pred Urea={w['projected_demand']['urea_demand_kg']} kg | Deficit={w['deficits']['total_deficit_kg']} kg")

print("\n--- Testing Monsoon Surge Scenario GET /api/inventory?weather_mode=monsoon_surge ---")
r_mon = client.get("/api/inventory?weather_mode=monsoon_surge")
inv_mon = r_mon.json()
print("Monsoon Critical count:", inv_mon["critical_count"])

print("\n--- Testing Dynamic ML GET /api/routes/optimize ---")
r_opt = client.get("/api/routes/optimize")
opt = r_opt.json()
print("Stops:", opt["total_stops"], "Distance:", opt["total_distance_km"], "km | CO2 saved:", opt["sustainability_metrics"]["co2_reduction_kg"], "kg")

print("\n--- Testing POST /api/predict/batch ---")
r_batch = client.post("/api/predict/batch", json={
    "items": [
        {"district": "Thanjavur", "crop_type": "Paddy (Rice)", "season": "Kuruvai (Jun-Sep)", "cultivated_area_ha": 25.0},
        {"district": "Perambalur", "crop_type": "Maize", "season": "Kharif (Jun-Sep)", "cultivated_area_ha": 40.0}
    ]
})
print("Batch status:", r_batch.status_code, "Evaluated:", r_batch.json()["total_evaluated"])
print("All endpoints tested successfully!")
