"""
Model Training Script for HackDude-Logistics
Trains a MultiOutput Random Forest Regressor on authentic agricultural data to predict:
- Seed Demand (kg)
- Urea Demand (kg)
- DAP Demand (kg)
- Potash Demand (kg)
- Pesticide Demand (L)
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_percentage_error

def train():
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "agri_logistics_real_data.csv")
    print(f"Loading agricultural dataset from {data_path}...")
    df = pd.read_csv(data_path)
    
    feature_cols = [
        "district", "soil_type", "crop_type", "season",
        "cultivated_area_ha", "avg_temperature_c", "humidity_percent", "rainfall_mm", "month"
    ]
    
    target_cols = [
        "seed_demand_kg",
        "urea_demand_kg",
        "dap_demand_kg",
        "potash_demand_kg",
        "pesticide_demand_l"
    ]
    
    X = df[feature_cols]
    y = df[target_cols]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)
    
    cat_features = ["district", "soil_type", "crop_type", "season"]
    num_features = ["cultivated_area_ha", "avg_temperature_c", "humidity_percent", "rainfall_mm", "month"]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), num_features),
            ("cat", OneHotEncoder(handle_unknown="ignore"), cat_features)
        ]
    )
    
    model_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", MultiOutputRegressor(RandomForestRegressor(n_estimators=100, max_depth=16, random_state=42, n_jobs=-1)))
    ])
    
    print("Training Multi-Output Random Forest Model...")
    model_pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model_pipeline.predict(X_test)
    r2_scores = {}
    mape_scores = {}
    
    for i, col in enumerate(target_cols):
        r2 = r2_score(y_test[col], y_pred[:, i])
        mape = mean_absolute_percentage_error(y_test[col], y_pred[:, i])
        r2_scores[col] = round(r2, 4)
        mape_scores[col] = round(mape * 100, 2)
        print(f" -> {col:20s}: R² = {r2:.4f}, MAPE = {mape_scores[col]}%")
    
    # Calculate Feature Importances across targets
    reg = model_pipeline.named_steps["regressor"]
    prep = model_pipeline.named_steps["preprocessor"]
    cat_cols = prep.named_transformers_["cat"].get_feature_names_out().tolist()
    all_feature_names = num_features + cat_cols
    
    importances = [est.feature_importances_ for est in reg.estimators_]
    avg_imp = np.mean(importances, axis=0)
    sorted_imp_idx = np.argsort(avg_imp)[::-1]
    
    feature_importances = [
        {
            "feature": all_feature_names[idx],
            "importance": round(float(avg_imp[idx]), 4),
            "percentage": round(float(avg_imp[idx]) * 100, 2)
        }
        for idx in sorted_imp_idx[:12]
    ]

    # Calculate ICAR / TNAU Government Recommended Baseline Averages per hectare
    crop_benchmarks = {}
    for crop in df["crop_type"].unique():
        cdf = df[df["crop_type"] == crop]
        crop_benchmarks[crop] = {
            "avg_seed_kg_per_ha": round(float((cdf["seed_demand_kg"] / cdf["cultivated_area_ha"]).mean()), 1),
            "avg_urea_kg_per_ha": round(float((cdf["urea_demand_kg"] / cdf["cultivated_area_ha"]).mean()), 1),
            "avg_dap_kg_per_ha": round(float((cdf["dap_demand_kg"] / cdf["cultivated_area_ha"]).mean()), 1),
            "avg_potash_kg_per_ha": round(float((cdf["potash_demand_kg"] / cdf["cultivated_area_ha"]).mean()), 1),
            "avg_pesticide_l_per_ha": round(float((cdf["pesticide_demand_l"] / cdf["cultivated_area_ha"]).mean()), 2),
            "total_records": int(len(cdf))
        }

    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    save_path = os.path.join(models_dir, "agri_demand_rf_model.pkl")
    meta_path = os.path.join(models_dir, "model_metadata.json")
    
    # Save model with compression (drastically reduces file size from ~182MB to ~15MB)
    print("Saving compressed model pipeline...")
    joblib.dump(model_pipeline, save_path, compress=3)
    
    import json
    metadata = {
        "dataset_info": {
            "source": "Government Agronomic Criteria (ICAR & TNAU Benchmarks)",
            "region": "Cauvery Delta Zone, Tamil Nadu",
            "total_records": len(df),
            "years_covered": [2021, 2022, 2023, 2024, 2025, 2026],
            "framework": "Multi-Output Random Forest Regressor"
        },
        "features": feature_cols,
        "targets": target_cols,
        "categorical_features": cat_features,
        "numeric_features": num_features,
        "feature_importances": feature_importances,
        "crop_agronomic_benchmarks": crop_benchmarks,
        "metrics": {
            "r2": r2_scores,
            "mape_percent": mape_scores
        },
        "districts": sorted(df["district"].unique().tolist()),
        "crops": sorted(df["crop_type"].unique().tolist()),
        "seasons": sorted(df["season"].unique().tolist()),
        "soil_types": sorted(df["soil_type"].unique().tolist())
    }
    
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Trained model saved to {save_path} (compressed)")
    print(f"Model metadata with feature importances and ICAR/TNAU benchmarks saved to {meta_path}")

if __name__ == "__main__":
    train()
