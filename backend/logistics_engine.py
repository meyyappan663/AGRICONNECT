"""
Logistics & Inventory Engine for HackDude-Logistics
Handles:
1. Real-time warehouse inventory tracking & shortage detection.
2. Route optimization using Haversine distance matrix + Nearest Neighbor heuristic.
3. Live Weather integration via Open-Meteo.
"""

import math
import requests
from typing import List, Dict, Any

WAREHOUSES = [
    {
        "id": "WH-TRICHY",
        "name": "Trichy Central Apex Warehouse",
        "district": "Tiruchirappalli",
        "lat": 10.7905,
        "lng": 78.7047,
        "is_central_hub": True,
        "inventory": {
            "seeds_kg": 45000,
            "urea_kg": 180000,
            "dap_kg": 95000,
            "potash_kg": 65000,
            "pesticides_l": 8200
        },
        "max_capacity_kg": 500000
    },
    {
        "id": "WH-THANJAVUR",
        "name": "Cauvery Delta Farmers Depot",
        "district": "Thanjavur",
        "lat": 10.7870,
        "lng": 79.1378,
        "is_central_hub": False,
        "inventory": {
            "seeds_kg": 12000,
            "urea_kg": 35000,  # under heavy demand
            "dap_kg": 18000,
            "potash_kg": 14000,
            "pesticides_l": 1600
        },
        "max_capacity_kg": 150000
    },
    {
        "id": "WH-TIRUVARUR",
        "name": "Tiruvarur Agro Supply Center",
        "district": "Tiruvarur",
        "lat": 10.7725,
        "lng": 79.6365,
        "is_central_hub": False,
        "inventory": {
            "seeds_kg": 6500,
            "urea_kg": 14000,  # Critical shortage
            "dap_kg": 8500,
            "potash_kg": 6200,
            "pesticides_l": 750
        },
        "max_capacity_kg": 100000
    },
    {
        "id": "WH-NAGAI",
        "name": "Nagapattinam Coastal Agro Hub",
        "district": "Nagapattinam",
        "lat": 10.7656,
        "lng": 79.8424,
        "is_central_hub": False,
        "inventory": {
            "seeds_kg": 7800,
            "urea_kg": 22000,
            "dap_kg": 11000,
            "potash_kg": 8500,
            "pesticides_l": 950
        },
        "max_capacity_kg": 100000
    },
    {
        "id": "WH-KARUR",
        "name": "Karur Industrial & Agro Store",
        "district": "Karur",
        "lat": 10.9601,
        "lng": 78.0766,
        "is_central_hub": False,
        "inventory": {
            "seeds_kg": 9200,
            "urea_kg": 28000,
            "dap_kg": 14500,
            "potash_kg": 11000,
            "pesticides_l": 1100
        },
        "max_capacity_kg": 120000
    },
    {
        "id": "WH-PUDUKKOTTAI",
        "name": "Pudukkottai Regional Depot",
        "district": "Pudukkottai",
        "lat": 10.3833,
        "lng": 78.8001,
        "is_central_hub": False,
        "inventory": {
            "seeds_kg": 8400,
            "urea_kg": 19500,  # Shortage
            "dap_kg": 10500,
            "potash_kg": 7800,
            "pesticides_l": 890
        },
        "max_capacity_kg": 100000
    },
    {
        "id": "WH-PERAMBALUR",
        "name": "Perambalur Maize & Cotton Depot",
        "district": "Perambalur",
        "lat": 11.2333,
        "lng": 78.8833,
        "is_central_hub": False,
        "inventory": {
            "seeds_kg": 11000,
            "urea_kg": 32000,
            "dap_kg": 16000,
            "potash_kg": 12500,
            "pesticides_l": 1400
        },
        "max_capacity_kg": 120000
    }
]

def haversine_km(lat1, lon1, lat2, lon2):
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def evaluate_inventory_shortages(predicted_demand_by_district: Dict[str, Dict[str, float]]) -> List[Dict[str, Any]]:
    """Compares current inventory against projected demand and identifies shortages."""
    evaluations = []
    
    for wh in WAREHOUSES:
        dist = wh["district"]
        pred = predicted_demand_by_district.get(dist, {
            "seed_demand_kg": 10000,
            "urea_demand_kg": 35000,
            "dap_demand_kg": 16000,
            "potash_demand_kg": 12000,
            "pesticide_demand_l": 1200
        })
        
        inv = wh["inventory"]
        
        # Calculate shortage deficits
        seed_deficit = max(0, round(pred["seed_demand_kg"] - inv["seeds_kg"], 1))
        urea_deficit = max(0, round(pred["urea_demand_kg"] - inv["urea_kg"], 1))
        dap_deficit = max(0, round(pred["dap_demand_kg"] - inv["dap_kg"], 1))
        potash_deficit = max(0, round(pred["potash_demand_kg"] - inv["potash_kg"], 1))
        pesticide_deficit = max(0, round(pred["pesticide_demand_l"] - inv["pesticides_l"], 1))
        
        total_deficit_kg = seed_deficit + urea_deficit + dap_deficit + potash_deficit
        
        status = "Healthy"
        if urea_deficit > 10000 or total_deficit_kg > 20000:
            status = "CRITICAL_SHORTAGE"
        elif total_deficit_kg > 5000:
            status = "WARNING_DEFICIT"
            
        evaluations.append({
            "warehouse_id": wh["id"],
            "name": wh["name"],
            "district": dist,
            "lat": wh["lat"],
            "lng": wh["lng"],
            "status": status,
            "current_inventory": inv,
            "projected_demand": pred,
            "deficits": {
                "seeds_kg": seed_deficit,
                "urea_kg": urea_deficit,
                "dap_kg": dap_deficit,
                "potash_kg": potash_deficit,
                "pesticides_l": pesticide_deficit,
                "total_deficit_kg": total_deficit_kg
            },
            "urgency_score": 100 if status == "CRITICAL_SHORTAGE" else (50 if status == "WARNING_DEFICIT" else 10)
        })
        
    return sorted(evaluations, key=lambda x: x["urgency_score"], reverse=True)

def optimize_distribution_route(shortage_list: List[Dict[str, Any]], vehicle_capacity_kg=25000) -> Dict[str, Any]:
    """
    Optimizes multi-stop distribution path starting from Central Apex Hub (Trichy)
    to replenish critical and warning warehouses using Nearest-Neighbor heuristic.
    """
    hub = [w for w in WAREHOUSES if w["is_central_hub"]][0]
    
    # Filter stops needing replenishment
    stops_to_visit = [s for s in shortage_list if s["deficits"]["total_deficit_kg"] > 0]
    
    # If all healthy, include all non-central depots for regular re-supply cycle
    if not stops_to_visit:
        stops_to_visit = [s for s in shortage_list if s["warehouse_id"] != hub["id"]]
        
    route = [{
        "step": 1,
        "warehouse_id": hub["id"],
        "name": hub["name"],
        "lat": hub["lat"],
        "lng": hub["lng"],
        "action": "LOAD_SUPPLIES",
        "distance_from_prev_km": 0.0
    }]
    
    unvisited = stops_to_visit.copy()
    current_lat, current_lng = hub["lat"], hub["lng"]
    total_km = 0.0
    total_delivered_kg = 0.0
    
    step_num = 2
    while unvisited:
        # Find nearest unvisited depot
        unvisited.sort(key=lambda item: haversine_km(current_lat, current_lng, item["lat"], item["lng"]))
        nearest = unvisited.pop(0)
        
        dist_km = haversine_km(current_lat, current_lng, nearest["lat"], nearest["lng"])
        total_km += dist_km
        current_lat, current_lng = nearest["lat"], nearest["lng"]
        
        delivered_kg = min(vehicle_capacity_kg - total_delivered_kg, nearest["deficits"]["total_deficit_kg"])
        total_delivered_kg += delivered_kg
        
        route.append({
            "step": step_num,
            "warehouse_id": nearest["warehouse_id"],
            "name": nearest["name"],
            "district": nearest["district"],
            "lat": nearest["lat"],
            "lng": nearest["lng"],
            "status": nearest["status"],
            "action": f"UNLOAD_{int(delivered_kg)}_KG",
            "supplies_to_drop": nearest["deficits"],
            "distance_from_prev_km": dist_km
        })
        step_num += 1
        
    # Return to Central Hub to complete cycle
    return_dist = haversine_km(current_lat, current_lng, hub["lat"], hub["lng"])
    total_km += return_dist
    route.append({
        "step": step_num,
        "warehouse_id": hub["id"],
        "name": f"{hub['name']} (Depot Return)",
        "lat": hub["lat"],
        "lng": hub["lng"],
        "action": "RETURN_AND_STANDBY",
        "distance_from_prev_km": return_dist
    })
    
    # Calculate savings metrics
    naive_point_to_point_km = sum(haversine_km(hub["lat"], hub["lng"], s["lat"], s["lng"]) * 2 for s in stops_to_visit)
    saved_km = max(0, round(naive_point_to_point_km - total_km, 1))
    co2_saved_kg = round(saved_km * 0.85, 1)  # average diesel truck emits ~0.85 kg CO2/km
    fuel_saved_inr = round(saved_km * 0.28 * 95, 0) # 0.28 L/km @ 95 INR/L
    
    return {
        "vehicle_type": "16-Tonne Agri Logistics Carrier",
        "vehicle_capacity_kg": vehicle_capacity_kg,
        "total_stops": len(route),
        "total_distance_km": round(total_km, 1),
        "estimated_duration_hours": round(total_km / 42.0 + (len(stops_to_visit) * 0.75), 1),
        "optimized_route_steps": route,
        "sustainability_metrics": {
            "unoptimized_distance_km": round(naive_point_to_point_km, 1),
            "distance_saved_km": saved_km,
            "fuel_saved_inr": fuel_saved_inr,
            "co2_reduction_kg": co2_saved_kg
        }
    }

import time

_WEATHER_CACHE = {}

def get_live_weather(lat: float, lng: float) -> Dict[str, Any]:
    """Fetches real-time weather from Open-Meteo with in-memory TTL caching."""
    cache_key = (round(lat, 2), round(lng, 2))
    now = time.time()
    if cache_key in _WEATHER_CACHE:
        cached_data, timestamp = _WEATHER_CACHE[cache_key]
        if now - timestamp < 300:  # 5 minutes cache
            return cached_data

    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
    try:
        res = requests.get(url, timeout=3)
        if res.status_code == 200:
            data = res.json()
            curr = data.get("current", {})
            result = {
                "temperature_c": curr.get("temperature_2m", 29.5),
                "humidity_percent": curr.get("relative_humidity_2m", 68.0),
                "precipitation_mm": curr.get("precipitation", 0.0),
                "wind_speed_kmh": curr.get("wind_speed_10m", 12.0),
                "weather_code": curr.get("weather_code", 1),
                "is_live": True
            }
            _WEATHER_CACHE[cache_key] = (result, now)
            return result
    except Exception:
        pass
        
    # Reliable agricultural fallback
    fallback = {
        "temperature_c": 30.2,
        "humidity_percent": 65.0,
        "precipitation_mm": 0.0,
        "wind_speed_kmh": 11.5,
        "weather_code": 1,
        "is_live": False
    }
    _WEATHER_CACHE[cache_key] = (fallback, now)
    return fallback
