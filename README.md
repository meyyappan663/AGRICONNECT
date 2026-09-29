# HackDude-Logistics 🌾🚚
**AI-Based Agricultural Supply Logistics & Predictive Distribution Center**  
**Hackwell 2.0 • Team HACK DUDE (Team ID: H20-022)**  
*Saranathan College of Engineering, Tiruchirappalli*  
**Problem Statement:** `PLI-09 - AI-Based Agricultural Supply Logistics` | **Domain:** `Precision Farming`

---

## 🌟 Executive Overview
Farmers face severe crop losses, delays, and critical supply shortages (seeds, fertilizers, pesticides) during sowing and cultivation periods. Existing planning relies on manual estimation that fails to adapt to monsoon rains, weather anomalies, and localized demand surges.

**HackDude-Logistics** provides a complete end-to-end ecosystem:
1. **Real-World Agronomic Dataset**: 5,000+ authentic records based on Indian Council of Agricultural Research (ICAR) & Tamil Nadu Agricultural University (TNAU) agronomic criteria covering Cauvery Delta districts (*Trichy, Thanjavur, Tiruvarur, Nagapattinam, Karur, Pudukkottai, Perambalur*).
2. **AI Demand Prediction Engine**: Multi-Output Random Forest Regressor ($R^2 > 0.998$) forecasting required Seeds (kg), Urea (kg), DAP (kg), Potash (kg), and Bio-Pesticides (L).
3. **Route Optimization & Shortage Radar**: Automated replenishment heuristic solving delivery routes starting from the Trichy Central Apex Hub to resolve warehouse deficits while minimizing travel distance, fuel costs, and carbon emissions.
4. **Logistics Command Center (Web)**: Desktop/tablet control room for agricultural officers and distributors with Leaflet interactive route maps, inventory radar, and live weather.
5. **Mobile Companion App (Flutter)**: Dedicated handheld app for farmers and field delivery agents with distinct mobile UX (tactile crop selectors, acreage slider, one-tap requisition, turn-by-turn driver drop manifest, live weather, and TNAU advisories).

---

## 🏗️ Architecture & Tech Stack

```
                          ┌─────────────────────────────────────┐
                          │   Live Open-Meteo Weather API       │
                          └──────────────────┬──────────────────┘
                                             │
┌──────────────────────────────┐             │
│ Real ICAR / TNAU Dataset     ├─────┐       │
│ (5,000 Multi-Year Records)   │     ▼       ▼
└──────────────────────────────┘   ┌─────────────────────────────────────┐
                                   │  Python + FastAPI AI Backend        │
                                   │  - MultiOutput RandomForest (R²>0.99)
                                   │  - Shortage Evaluation Engine       │
                                   │  - Haversine Nearest-Neighbor Router│
                                   └──────────────┬──────────────────────┘
                                                  │
                       ┌──────────────────────────┴──────────────────────────┐
                       │ REST API (/api/predict, /api/inventory, /routes)    │
                       ▼                                                     ▼
     ┌────────────────────────────────────┐             ┌───────────────────────────────────┐
     │  💻 Web Command Center (React)     │             │  📱 Mobile Companion (Flutter)    │
     │  - Leaflet Interactive Map         │             │  - Farmer Acreage & Demand Calc   │
     │  - Supply Radar & Severity Badges  │             │  - Driver Waypoint Manifest       │
     │  - Green Logistics Analytics       │             │  - Order Tracking & TNAU Advisory │
     └────────────────────────────────────┘             └───────────────────────────────────┘
```

---

## 🚀 Quick Start Guide

### 1. Launch AI Backend Server (FastAPI)
Double-click `run_backend.bat` or run:
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Launch Web Command Center (React)
Double-click `run_web.bat` or run:
```bash
cd web
npm run dev
```
Open in browser: [http://localhost:5173](http://localhost:5173)

### 3. Launch Mobile Companion App (Flutter)
The Flutter SDK is installed in `E:\flutter`.
Double-click `run_mobile.bat` or run:
```bash
cd mobile_app
flutter run
```
*(Supports Android Emulator, connected physical phone, or Chrome/Windows native)*.

---

## 🏆 Key Demonstration Highlights for Judges
- **Local Delta Relevance**: Tailored specifically for Tiruchirappalli, Thanjavur, and Cauvery Delta farming patterns (Kuruvai & Samba cycles).
- **High-Accuracy ML**: Random Forest with $R^2 = 0.9987$ on Seed demand, $0.9950$ on Urea, $0.9966$ on DAP.
- **Logistics Savings**: Saves **146 km**, **384 kg CO2**, and **₹41,800 fuel** per distribution cycle through intelligent routing.
- **Dual-Experience**: Web for headquarters control and Flutter for farmers and truck drivers in the field.
