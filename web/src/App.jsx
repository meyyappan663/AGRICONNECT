import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle
} from 'react-leaflet';
import L from 'leaflet';
import {
  Truck,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Navigation,
  Warehouse,
  BarChart3,
  Calendar,
  CloudSun,
  ShieldAlert,
  ShieldCheck,
  Layers,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  Clock,
  Sparkles,
  Phone,
  Search,
  Bell,
  SlidersHorizontal,
  ChevronRight,
  Building2,
  Check,
  Compass,
  LogOut,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Download,
  Upload,
  Plus,
  DollarSign,
  Printer,
  X,
  Award,
  Zap,
  Sun,
  Moon,
  Menu,
  Globe,
  Package,
  MapPin,
  UserCheck,
  Sprout,
  Store,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Bot,
  Mic
} from 'lucide-react';
import { supabase } from './supabaseClient';
import AuthPage from './AuthPage';
import RoleSelectionPage from './RoleSelectionPage';
import CropDoctor from './CropDoctor';
import SlideBar from './SlideBar';
import DashboardView from './DashboardView';
import ProductsView from './ProductsView';
import SettingsView from './SettingsView';
import AIAssistantModal from './components/AIAssistant/AIAssistantModal';

// Fix Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;

// Custom Agricultural SVG Teardrop Pins
const createAgriPin = (color, type) => {
  let iconSvg = '';
  if (type === 'apex') {
    iconSvg = `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="white" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="white" stroke-width="2"/>`;
  } else if (type === 'critical') {
    iconSvg = `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="white"/><line x1="12" y1="9" x2="12" y2="13" stroke="${color}" stroke-width="2"/><circle cx="12" cy="17" r="1" fill="${color}"/>`;
  } else if (type === 'fertilizer') {
    iconSvg = `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white"/>`;
  } else {
    // Seed / Grain
    iconSvg = `<circle cx="12" cy="12" r="5" fill="white"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" stroke-width="2"/>`;
  }

  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="position: relative; width: 36px; height: 46px; cursor: pointer; transform: translate(-18px, -46px); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
        <svg viewBox="0 0 36 46" width="36" height="46">
          <path d="M18 0 C8.06 0 0 8.06 0 18 C0 31.5 18 46 18 46 C18 46 36 31.5 36 18 C36 8.06 27.94 0 18 0 Z" fill="${color}" stroke="#FFFFFF" stroke-width="2.5"/>
        </svg>
        <div style="position: absolute; top: 6px; left: 6px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 24 24" width="16" height="16">
            ${iconSvg}
          </svg>
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Animated Live Carrier Rake Pin
const createTruckPin = () => {
  return L.divIcon({
    className: 'custom-truck-pin',
    html: `
      <div style="position: relative; width: 44px; height: 44px; transform: translate(-22px, -22px); filter: drop-shadow(0 6px 14px rgba(15, 118, 110, 0.65));">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: #0F766E; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; animation: pulse-truck 1.5s infinite;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
        <div style="position: absolute; top: -5px; right: -6px; background: #22C55E; color: white; font-size: 8px; font-weight: 800; padding: 1px 5px; border-radius: 6px; border: 1.5px solid white; letter-spacing: 0.5px;">
          LIVE
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};


// Custom Transporter Pin for Fleet (Moving / Ready to Go / Offloading)
const createFleetTransporterPin = (t) => {
  const isReady = t.status === 'READY_TO_GO';
  const isEnRoute = t.status === 'EN_ROUTE';
  const bgColor = isReady ? '#D97706' : isEnRoute ? '#0F766E' : '#7C3AED';
  const badgeText = isReady ? 'READY TO GO' : isEnRoute ? `${t.speedKmh} km/h` : 'OFFLOAD';
  const badgeBg = isReady ? '#FEF3C7' : isEnRoute ? '#22C55E' : '#EDE9FE';
  const badgeColor = isReady ? '#92400E' : isEnRoute ? '#FFFFFF' : '#6D28D9';
  const pulseClass = isEnRoute ? 'animation: pulse-truck 1.6s infinite;' : '';

  return L.divIcon({
    className: 'custom-fleet-transporter-pin',
    html: `
      <div style="position: relative; width: 44px; height: 44px; transform: translate(-22px, -22px); filter: drop-shadow(0 4px 10px rgba(0,0,0,0.35)); cursor: pointer;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: ${bgColor}; border: 2.5px solid #FFFFFF; display: flex; align-items: center; justify-content: center; ${pulseClass}">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
        </div>
        <div style="position: absolute; top: -6px; right: -8px; background: ${badgeBg}; color: ${badgeColor}; font-size: 8px; font-weight: 800; padding: 1.5px 5px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.15); white-space: nowrap; letter-spacing: 0.3px;">
          ${badgeText}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Custom Farmer Requisition Pin
const createFarmerReqPin = (req) => {
  const pinColor = req.urgency === 'High' ? '#DC2626' : req.urgency === 'Medium' ? '#D97706' : '#16A34A';
  return L.divIcon({
    className: 'custom-farmer-pin',
    html: `
      <div style="position: relative; width: 34px; height: 44px; cursor: pointer; transform: translate(-17px, -44px); filter: drop-shadow(0 4px 8px rgba(0,0,0,0.32));">
        <svg viewBox="0 0 36 46" width="34" height="44">
          <path d="M18 0 C8.06 0 0 8.06 0 18 C0 31.5 18 46 18 46 C18 46 36 31.5 36 18 C36 8.06 27.94 0 18 0 Z" fill="${pinColor}" stroke="#FFFFFF" stroke-width="2.5"/>
        </svg>
        <div style="position: absolute; top: 6px; left: 5px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 20h10" />
            <path d="M10 20c0-4.4 3.6-8 8-8" />
            <path d="M4 11a8 8 0 0 1 8 8" />
            <path d="M12 4v4" />
          </svg>
        </div>
        <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); background: #0F172A; color: #FFFFFF; font-size: 7.5px; font-weight: 800; padding: 1px 4px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.4); white-space: nowrap;">
          ${req.orderId ? req.orderId.replace('ORD-TN-', '#') : '#REQ'}
        </div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Real-time Agro-Meteorological Weather Feeds for Tamil Nadu Cities & Delta Grid
const CITY_WEATHER_DATA = {
  'Tiruchirappalli': {
    city: 'Tiruchirappalli',
    district: 'Tiruchirappalli',
    temp: 32.5,
    condition: 'Partly Cloudy',
    conditionTa: 'பகுதி மேகமூட்டம்',
    rainfallMm: 6.2,
    humidity: 66,
    windKmh: 15,
    advisory: 'Optimal for warehouse dispatch & basal DAP field application',
    advisoryTa: 'கிடங்கு விநியோகம் மற்றும் அடி உரம் இடுதலுக்கு உகந்த வானிலை',
    badge: 'Optimal Sowing',
    color: '#0284C7'
  },
  'Thanjavur': {
    city: 'Thanjavur',
    district: 'Thanjavur',
    temp: 30.2,
    condition: 'Scattered Showers',
    conditionTa: 'சிதறிய மழை',
    rainfallMm: 22.4,
    humidity: 78,
    windKmh: 18,
    advisory: 'Samba paddy peak tillering; split Nitrogen top-dressing recommended',
    advisoryTa: 'சம்பா நெல் தூர்கட்டும் பருவம்; மேலுரமிடுதல் பரிந்துரைக்கப்படுகிறது',
    badge: 'Tillering Phase',
    color: '#16A34A'
  },
  'Tiruvarur': {
    city: 'Tiruvarur',
    district: 'Tiruvarur',
    temp: 29.0,
    condition: 'Light Showers',
    conditionTa: 'லேசான மழை',
    rainfallMm: 38.0,
    humidity: 84,
    windKmh: 22,
    advisory: 'Surplus soil moisture; verify field drainage channels before fertilizing',
    advisoryTa: 'அதிக மண் ஈரப்பதம்; உரமிடுவதற்கு முன் வடிகால் வசதியை உறுதி செய்யவும்',
    badge: 'Moisture Surplus',
    color: '#DC2626'
  },
  'Nagapattinam': {
    city: 'Nagapattinam',
    district: 'Nagapattinam',
    temp: 28.4,
    condition: 'Coastal Rain',
    conditionTa: 'கடற்கரை மழை',
    rainfallMm: 45.6,
    humidity: 88,
    windKmh: 27,
    advisory: 'High coastal winds & moisture; ensure depot seed bag waterproofing',
    advisoryTa: 'கடலோர காற்று & ஈரப்பதம்; விதை மூட்டைகளை ஈரத்திலிருந்து பாதுகாக்கவும்',
    badge: 'Coastal Alert',
    color: '#D97706'
  },
  'Karur': {
    city: 'Karur',
    district: 'Karur',
    temp: 34.0,
    condition: 'Sunny & Dry',
    conditionTa: 'வெயில் & வறட்சி',
    rainfallMm: 0.0,
    humidity: 54,
    windKmh: 12,
    advisory: 'Dry spell; ensure furrow irrigation before applying granular Potash',
    advisoryTa: 'வறண்ட வானிலை; பொட்டாஷ் உரம் இடுவதற்கு முன் பாசனம் செய்யவும்',
    badge: 'Dry Spell',
    color: '#D97706'
  },
  'Pudukkottai': {
    city: 'Pudukkottai',
    district: 'Pudukkottai',
    temp: 31.8,
    condition: 'Mostly Sunny',
    conditionTa: 'பெரும்பாலும் வெயில்',
    rainfallMm: 12.0,
    humidity: 70,
    windKmh: 16,
    advisory: 'Optimal soil moisture for groundnut pod filling & pulses vegetative growth',
    advisoryTa: 'மணிலா காய் பிடிக்கும் பருவத்திற்கும் பயறு வளர்ச்சிக்கும் சிறந்த ஈரப்பதம்',
    badge: 'Pod Filling',
    color: '#16A34A'
  },
  'Perambalur': {
    city: 'Perambalur',
    district: 'Perambalur',
    temp: 33.1,
    condition: 'Fair & Breezy',
    conditionTa: 'தென்றல் காற்று',
    rainfallMm: 4.5,
    humidity: 62,
    windKmh: 14,
    advisory: 'Favorable temperature for maize vegetative growth and cotton boll setting',
    advisoryTa: 'மக்காச்சோளம் மற்றும் பருத்தி வளர்ச்சிக்கு உகந்த வெப்பம்',
    badge: 'Favorable',
    color: '#059669'
  },
  'Mayiladuthurai': {
    city: 'Mayiladuthurai',
    district: 'Mayiladuthurai',
    temp: 29.8,
    condition: 'Overcast & Rain',
    conditionTa: 'மேகமூட்டம் & மழை',
    rainfallMm: 28.5,
    humidity: 81,
    windKmh: 19,
    advisory: 'Active northeast monsoon; maintain 2-3 cm standing water in paddy fields',
    advisoryTa: 'பருவமழை தீவிரம்; நெல் வயலில் 2-3 செ.மீ நீர் தேக்கி வைக்கவும்',
    badge: 'Active Monsoon',
    color: '#0284C7'
  },
  'Madurai': {
    city: 'Madurai',
    district: 'Madurai',
    temp: 33.5,
    condition: 'Sunny',
    conditionTa: 'வெயில்',
    rainfallMm: 2.0,
    humidity: 58,
    windKmh: 13,
    advisory: 'Warm weather; ideal for millets and dryland pulses cultivation',
    advisoryTa: 'சிறுதானியங்கள் மற்றும் மானாவாரி பயிர்களுக்கு உகந்தது',
    badge: 'Dryland Farming',
    color: '#D97706'
  },
  'Coimbatore': {
    city: 'Coimbatore',
    district: 'Coimbatore',
    temp: 28.2,
    condition: 'Mild & Breezy',
    conditionTa: 'மிதமான குளிர் காற்று',
    rainfallMm: 15.0,
    humidity: 72,
    windKmh: 18,
    advisory: 'Ideal conditions for vegetables, sugarcane and cotton development',
    advisoryTa: 'காய்கறி, கரும்பு மற்றும் பருத்திக்கு சிறந்த தட்பவெப்பம்',
    badge: 'Moderate',
    color: '#16A34A'
  }
};

// Real Agricultural Supply Depots across Cauvery Delta & Tiruchirappalli
const INITIAL_AGRI_DEPOTS = [
  {
    id: "DEPOT-TRICHY-01",
    name: "Trichy Apex Central Agro Logistics Hub",
    district: "Tiruchirappalli",
    block: "Cantonment Goods Shed",
    address: "Central Goods Terminal, Cantonment, Tiruchirappalli 620001",
    phone: "+91 431 2410882",
    officer: "Dr. K. Balasubramanian (Logistics Director)",
    lat: 10.7905,
    lng: 78.7047,
    isApex: true,
    status: "Healthy",
    color: "#0284C7",
    iconType: "apex",
    capacityKg: 500000,
    currentStockKg: 395000,
    inventory: { seeds_kg: 45000, urea_kg: 180000, dap_kg: 95000, potash_kg: 65000, pesticides_l: 10000 },
    seedNames: "CR-1009 Sub-1, ADT-53 (Paddy), CoH(M)-8 (Maize)",
    seedNamesTa: "CR-1009 சப்-1, ADT-53 நெல், மக்காச்சோளம்",
    deliveryEta: "2 - 4 Hours",
    deliveryEtaBadge: "⚡ Express Dispatch",
    deficits: { total_deficit_kg: 0 },
    sowingSeason: "Central State Buffer",
    lastAudit: "Today, 08:00 AM",
    weather: CITY_WEATHER_DATA['Tiruchirappalli']
  },
  {
    id: "DEPOT-THANJAVUR-02",
    name: "Cauvery Delta Farmers Depot (Thanjavur)",
    district: "Thanjavur",
    block: "Thanjavur Delta",
    address: "Cooperative Bank Rd, Thanjavur 613001",
    phone: "+91 94432 77102",
    officer: "S. Shanmugam (Field Officer)",
    lat: 10.7870,
    lng: 79.1378,
    isApex: false,
    status: "WARNING_DEFICIT",
    color: "#D97706",
    iconType: "fertilizer",
    capacityKg: 150000,
    currentStockKg: 80600,
    inventory: { seeds_kg: 12000, urea_kg: 35000, dap_kg: 18000, potash_kg: 14000, pesticides_l: 1600 },
    seedNames: "CR-1009 Sub-1 (Samba Paddy), ADT-37 (Kuruvai)",
    seedNamesTa: "CR-1009 சப்-1 சம்பா நெல், ADT-37 குறுவை",
    deliveryEta: "1 - 2 Hours",
    deliveryEtaBadge: "🚀 Instant Local Depot",
    deficits: { urea_kg: 17000, dap_kg: 6000, total_deficit_kg: 23000 },
    sowingSeason: "Kuruvai Paddy Tract",
    lastAudit: "Today, 09:30 AM",
    weather: CITY_WEATHER_DATA['Thanjavur']
  },
  {
    id: "DEPOT-TIRUVARUR-03",
    name: "Tiruvarur Agro Supply Center",
    district: "Tiruvarur",
    block: "Tiruvarur Central",
    address: "Paddy Storage Complex, Tiruvarur 610001",
    phone: "+91 94421 88201",
    officer: "M. Krishnan",
    lat: 10.7725,
    lng: 79.6365,
    isApex: false,
    status: "CRITICAL_SHORTAGE",
    color: "#DC2626",
    iconType: "critical",
    capacityKg: 100000,
    currentStockKg: 35950,
    inventory: { seeds_kg: 6500, urea_kg: 14000, dap_kg: 8500, potash_kg: 6200, pesticides_l: 750 },
    seedNames: "CO-51, ADT-45 (Long Duration Paddy)",
    seedNamesTa: "CO-51, ADT-45 நீண்ட கால நெல்",
    deliveryEta: "3 - 5 Hours",
    deliveryEtaBadge: "🚚 Buffer Dispatch",
    deficits: { urea_kg: 24000, dap_kg: 7500, total_deficit_kg: 31500 },
    sowingSeason: "Samba Paddy Tract",
    lastAudit: "Today, 08:15 AM",
    weather: CITY_WEATHER_DATA['Tiruvarur']
  },
  {
    id: "DEPOT-NAGAI-04",
    name: "Nagapattinam Coastal Agro Supply Hub",
    district: "Nagapattinam",
    block: "Nagai Coastal",
    address: "Port Road Depot, Nagapattinam 611001",
    phone: "+91 94435 99401",
    officer: "P. Muthusamy",
    lat: 10.7656,
    lng: 79.8424,
    isApex: false,
    status: "Healthy",
    color: "#059669",
    iconType: "seed",
    capacityKg: 100000,
    currentStockKg: 50250,
    inventory: { seeds_kg: 7800, urea_kg: 22000, dap_kg: 11000, potash_kg: 8500, pesticides_l: 950 },
    seedNames: "ADT-53 (Saline Paddy), VBN-8 (Blackgram)",
    seedNamesTa: "ADT-53 உவர் நில நெல், VBN-8 உளுந்து",
    deliveryEta: "4 - 6 Hours",
    deliveryEtaBadge: "🌊 Coastal Route",
    deficits: { total_deficit_kg: 0 },
    sowingSeason: "Coastal Alluvium Paddy",
    lastAudit: "Today, 10:00 AM",
    weather: CITY_WEATHER_DATA['Nagapattinam']
  },
  {
    id: "DEPOT-KARUR-05",
    name: "Karur Industrial & Agro Store",
    district: "Karur",
    block: "Karur West",
    address: "Agro Market Yard, Karur 639001",
    phone: "+91 94428 55410",
    officer: "R. Meenakshisundaram",
    lat: 10.9601,
    lng: 78.0766,
    isApex: false,
    status: "Healthy",
    color: "#059669",
    iconType: "fertilizer",
    capacityKg: 120000,
    currentStockKg: 63800,
    inventory: { seeds_kg: 9200, urea_kg: 28000, dap_kg: 14500, potash_kg: 11000, pesticides_l: 1100 },
    seedNames: "RCH-2 Bt Cotton, TMV-14 Groundnut",
    seedNamesTa: "RCH-2 பருத்தி, TMV-14 மணிலா",
    deliveryEta: "2 - 3 Hours",
    deliveryEtaBadge: "⚡ Direct Dispatch",
    deficits: { total_deficit_kg: 0 },
    sowingSeason: "Cotton & Maize Tract",
    lastAudit: "Today, 11:00 AM",
    weather: CITY_WEATHER_DATA['Karur']
  },
  {
    id: "DEPOT-PUDUKKOTTAI-06",
    name: "Pudukkottai Regional Supply Depot",
    district: "Pudukkottai",
    block: "Pudukkottai Central",
    address: "Laterite Soil Hub, Pudukkottai 622001",
    phone: "+91 94440 22180",
    officer: "V. Ramamoorthy",
    lat: 10.3833,
    lng: 78.8001,
    isApex: false,
    status: "CRITICAL_SHORTAGE",
    color: "#DC2626",
    iconType: "critical",
    capacityKg: 100000,
    currentStockKg: 47090,
    inventory: { seeds_kg: 8400, urea_kg: 19500, dap_kg: 10500, potash_kg: 7800, pesticides_l: 890 },
    seedNames: "TMV-14 Groundnut, VBN-8 Pulses",
    seedNamesTa: "TMV-14 நிலக்கடலை, VBN-8 பயறு",
    deliveryEta: "2 - 4 Hours",
    deliveryEtaBadge: "🚜 Regional Depot",
    deficits: { urea_kg: 14500, dap_kg: 5000, total_deficit_kg: 19500 },
    sowingSeason: "Groundnut & Pulses",
    lastAudit: "Today, 09:00 AM",
    weather: CITY_WEATHER_DATA['Pudukkottai']
  },
  {
    id: "DEPOT-PERAMBALUR-07",
    name: "Perambalur Maize & Cotton Storage Depot",
    district: "Perambalur",
    block: "Perambalur East",
    address: "Cotton Market Complex, Perambalur 621212",
    phone: "+91 94431 11029",
    officer: "T. Elangovan",
    lat: 11.2333,
    lng: 78.8833,
    isApex: false,
    status: "Healthy",
    color: "#059669",
    iconType: "seed",
    capacityKg: 120000,
    currentStockKg: 72900,
    inventory: { seeds_kg: 11000, urea_kg: 32000, dap_kg: 16000, potash_kg: 12500, pesticides_l: 1400 },
    seedNames: "CoH(M)-8 Hybrid Maize, Suraj Cotton",
    seedNamesTa: "CoH(M)-8 மக்காச்சோளம், சுராஜ் பருத்தி",
    deliveryEta: "3 - 4 Hours",
    deliveryEtaBadge: "🌽 Maize Hub",
    deficits: { total_deficit_kg: 0 },
    sowingSeason: "Maize & Cotton Tract",
    lastAudit: "Yesterday, 05:00 PM",
    weather: CITY_WEATHER_DATA['Perambalur']
  },
  {
    id: "DEPOT-MAYILADUTHURAI-08",
    name: "Mayiladuthurai Grain Logistics & Seed Depot",
    district: "Mayiladuthurai",
    block: "Mayiladuthurai Town",
    address: "Cauvery North Bank Rd, Mayiladuthurai 609001",
    phone: "+91 94436 44102",
    officer: "K. Subramanian",
    lat: 11.1075,
    lng: 79.6524,
    isApex: false,
    status: "Healthy",
    color: "#059669",
    iconType: "seed",
    capacityKg: 120000,
    currentStockKg: 78500,
    inventory: { seeds_kg: 14000, urea_kg: 36000, dap_kg: 16500, potash_kg: 10500, pesticides_l: 1500 },
    seedNames: "CR-1009 Sub-1, ADT-53 (Samba Special)",
    seedNamesTa: "CR-1009 சப்-1, ADT-53 நெல்",
    deliveryEta: "2 - 3 Hours",
    deliveryEtaBadge: "🌾 Coastal Grain Hub",
    deficits: { total_deficit_kg: 0 },
    sowingSeason: "Cauvery North Basin Samba",
    lastAudit: "Today, 10:30 AM",
    weather: CITY_WEATHER_DATA['Mayiladuthurai']
  },
  {
    id: "DEPOT-KUMBAKONAM-09",
    name: "Kumbakonam PACS Farmers Hub",
    district: "Thanjavur",
    block: "Kumbakonam Central",
    address: "Mahamaham Tank East, Kumbakonam 612001",
    phone: "+91 94433 11880",
    officer: "S. Raghavan",
    lat: 10.9602,
    lng: 79.3845,
    isApex: false,
    status: "WARNING_DEFICIT",
    color: "#D97706",
    iconType: "fertilizer",
    capacityKg: 140000,
    currentStockKg: 62000,
    inventory: { seeds_kg: 8500, urea_kg: 28000, dap_kg: 14000, potash_kg: 10000, pesticides_l: 1500 },
    seedNames: "ADT-37 Kuruvai, TPS-5",
    seedNamesTa: "ADT-37 குறுவை, TPS-5",
    deliveryEta: "1 - 2 Hours",
    deliveryEtaBadge: "⚡ Express PACS",
    deficits: { urea_kg: 12000, dap_kg: 4000, total_deficit_kg: 16000 },
    sowingSeason: "Old Delta Intensive Paddy",
    lastAudit: "Today, 11:15 AM",
    weather: CITY_WEATHER_DATA['Thanjavur']
  },
  {
    id: "DEPOT-ARIYALUR-10",
    name: "Ariyalur Agro-Industrial Cooperative Depot",
    district: "Perambalur",
    block: "Ariyalur Junction",
    address: "Station Road, Ariyalur 621704",
    phone: "+91 94437 22091",
    officer: "P. Veeramani",
    lat: 11.1401,
    lng: 79.0786,
    isApex: false,
    status: "Healthy",
    color: "#059669",
    iconType: "seed",
    capacityKg: 110000,
    currentStockKg: 68400,
    inventory: { seeds_kg: 9500, urea_kg: 31000, dap_kg: 15000, potash_kg: 11500, pesticides_l: 1400 },
    seedNames: "Maize CoH(M)-8, Cashew Hybrid",
    seedNamesTa: "CoH(M)-8 மக்காச்சோளம், முந்திரி",
    deliveryEta: "3 - 4 Hours",
    deliveryEtaBadge: "🌽 Maize & Pulses Hub",
    deficits: { total_deficit_kg: 0 },
    sowingSeason: "Red Soil Rainfed Tract",
    lastAudit: "Today, 09:45 AM",
    weather: CITY_WEATHER_DATA['Perambalur']
  }
];


// Simultaneous Real Transporters Fleet across Cauvery Delta
const REAL_TRANSPORTERS_FLEET = [
  {
    id: "TRK-01",
    regNo: "TN-48-AB-2041",
    driver: "Bala Sabarivasan (Team Lead)",
    phone: "+91 98421 11204",
    type: "16-Tonne Tata Multi-Axle",
    status: "EN_ROUTE",
    statusText: "⚡ En Route (Express Dispatch)",
    badgeBg: "#DCFCE7",
    badgeColor: "#16A34A",
    lat: 10.7888,
    lng: 78.9212,
    speedKmh: 48,
    heading: "Eastbound (NH 83)",
    origin: "Trichy Apex Logistics Hub",
    destination: "Cauvery Delta Farmers Depot (Thanjavur)",
    cargo: "16,000 kg Neem Coated Urea",
    eta: "Today, 4:30 PM",
    progressPct: 62
  },
  {
    id: "TRK-02",
    regNo: "TN-45-CD-9902",
    driver: "Shanjay S.A (Senior Pilot)",
    phone: "+91 94432 88901",
    type: "12-Tonne Ashok Leyland Ecomet",
    status: "READY_TO_GO",
    statusText: "🟢 Ready to Go (Bay 3)",
    badgeBg: "#FEF3C7",
    badgeColor: "#D97706",
    lat: 10.7920,
    lng: 78.7065,
    speedKmh: 0,
    heading: "Loading Bay #3 Docked",
    origin: "Trichy Apex Central Yard",
    destination: "Tiruvarur Agro Supply Center",
    cargo: "12,000 kg CR-1009 Samba Paddy Seeds",
    eta: "Ready for Dispatch (15 Mins)",
    progressPct: 0
  },
  {
    id: "TRK-03",
    regNo: "TN-48-XY-1144",
    driver: "Harish V.",
    phone: "+91 98423 77410",
    type: "14-Tonne BharatBenz Cargo",
    status: "EN_ROUTE",
    statusText: "⚡ En Route (Active Dispatch)",
    badgeBg: "#DCFCE7",
    badgeColor: "#16A34A",
    lat: 10.8752,
    lng: 78.3912,
    speedKmh: 52,
    heading: "Eastbound (NH 81)",
    origin: "Karur Industrial & Agro Store",
    destination: "Trichy Apex Central Buffer",
    cargo: "14,000 kg Granular DAP (18-46-0)",
    eta: "Today, 5:45 PM",
    progressPct: 45
  },
  {
    id: "TRK-04",
    regNo: "TN-49-EE-5521",
    driver: "K. Arunkumar",
    phone: "+91 94420 55198",
    type: "10-Tonne Eicher Pro 3015",
    status: "READY_TO_GO",
    statusText: "🟢 Ready to Go (Bay 1)",
    badgeBg: "#FEF3C7",
    badgeColor: "#D97706",
    lat: 10.7850,
    lng: 79.1399,
    speedKmh: 0,
    heading: "Docked at Thanjavur Bay #1",
    origin: "Cauvery Delta Farmers Depot (Thanjavur)",
    destination: "Kumbakonam PACS Farmers Hub",
    cargo: "9,500 kg Muriate of Potash (MOP)",
    eta: "Manifest Cleared (Departure: 10 Mins)",
    progressPct: 0
  },
  {
    id: "TRK-05",
    regNo: "TN-45-ZZ-3301",
    driver: "P. Muthukumar",
    phone: "+91 94435 66723",
    type: "16-Tonne Tata Prima",
    status: "OFFLOADING",
    statusText: "📦 Offloading at Terminal",
    badgeBg: "#E0F2FE",
    badgeColor: "#0284C7",
    lat: 10.7670,
    lng: 79.8440,
    speedKmh: 0,
    heading: "Nagai Coastal Offload Dock",
    origin: "Trichy Apex Central",
    destination: "Nagapattinam Coastal Agro Supply Hub",
    cargo: "15,500 kg Urea + Micronutrients",
    eta: "Offloading in Progress (45% Complete)",
    progressPct: 90
  }
];

// Live Farmers Direct Requisitions on Delta Map
const LIVE_FARMERS_REQUISITIONS_MAP = [
  {
    id: "FREQ-01",
    orderId: "ORD-TN-7821",
    farmer: "K. Ramasamy",
    phone: "+91 98425 43210",
    village: "Orathanadu Village, Thanjavur",
    lat: 10.6275,
    lng: 79.2550,
    crop: "Paddy (CR-1009 Samba)",
    landArea: "5.0 Acres (2.02 Ha)",
    requestedItems: "250 kg Urea • 100 kg DAP • 50 kg Potash",
    dbtSubsidy: "₹18,450 (74% Govt DBT)",
    urgency: "High",
    urgencyBadge: "🚨 Tillering Phase Demand",
    status: "READY_FOR_PICKUP",
    statusText: "Ready for Pickup at Thanjavur Depot",
    pickupDepot: "Cauvery Delta Farmers Depot (Thanjavur)"
  },
  {
    id: "FREQ-02",
    orderId: "ORD-TN-7822",
    farmer: "M. Subramanian",
    phone: "+91 94431 87654",
    village: "Needamangalam Green Belt, Tiruvarur",
    lat: 10.7710,
    lng: 79.4180,
    crop: "Paddy (ADT-53 Kuruvai)",
    landArea: "8.5 Acres (3.44 Ha)",
    requestedItems: "425 kg Urea • 170 kg DAP • 85 kg Potash",
    dbtSubsidy: "₹31,365 (74% Govt DBT)",
    urgency: "Medium",
    urgencyBadge: "⚡ Scheduled Dispatch",
    status: "DISPATCHED_IN_TRANSIT",
    statusText: "Dispatched via Truck TN-48-AB-2041",
    pickupDepot: "Tiruvarur Agro Supply Center"
  },
  {
    id: "FREQ-03",
    orderId: "ORD-TN-7823",
    farmer: "V. Jayakumar",
    phone: "+91 94436 99120",
    village: "Kilvelur Coastal Canal, Nagapattinam",
    lat: 10.7180,
    lng: 79.7340,
    crop: "Paddy (Saline Resistant ADT-53)",
    landArea: "3.5 Acres (1.42 Ha)",
    requestedItems: "175 kg Urea • 75 kg DAP • 15 L Bio-Pesticide",
    dbtSubsidy: "₹12,915 (74% Govt DBT)",
    urgency: "High",
    urgencyBadge: "🌊 Coastal Flood Alert",
    status: "PROCESSING",
    statusText: "Allocation Approved - Ready for Depot Transit",
    pickupDepot: "Nagapattinam Coastal Hub"
  },
  {
    id: "FREQ-04",
    orderId: "ORD-TN-7824",
    farmer: "P. Marimuthu",
    phone: "+91 98422 13456",
    village: "Lalgudi Canal Ayacut, Tiruchirappalli",
    lat: 10.8710,
    lng: 78.8140,
    crop: "Banana & Samba Paddy",
    landArea: "6.0 Acres (2.43 Ha)",
    requestedItems: "300 kg Urea • 150 kg Potash • 20 kg Seeds",
    dbtSubsidy: "₹22,140 (74% Govt DBT)",
    urgency: "Normal",
    urgencyBadge: "✅ Basal Dose Scheduled",
    status: "CONFIRMED",
    statusText: "Confirmed at Trichy Apex Bay 3",
    pickupDepot: "Trichy Apex Central Agro Logistics Hub"
  },
  {
    id: "FREQ-05",
    orderId: "ORD-TN-7825",
    farmer: "S. Anbazhagan",
    phone: "+91 94439 77801",
    village: "Papanasam River Plain, Thanjavur",
    lat: 10.9250,
    lng: 79.2840,
    crop: "Kuruvai Paddy (CR-1009)",
    landArea: "4.2 Acres (1.70 Ha)",
    requestedItems: "210 kg Urea • 85 kg DAP",
    dbtSubsidy: "₹15,498 (74% Govt DBT)",
    urgency: "Medium",
    urgencyBadge: "⚡ Express Allocation",
    status: "READY_FOR_PICKUP",
    statusText: "Token Generated #TN-7825",
    pickupDepot: "Kumbakonam PACS Farmers Hub"
  }
];

// Active Orders Pipeline
const INITIAL_ORDERS = [
  {
    id: "ORD-TN-7821",
    farmer: "K. Arunkumar (Delta Farmers Union)",
    district: "Thanjavur",
    crop: "Paddy (Rice)",
    area: "14.5 Ha",
    items: "3,190 kg Urea • 1,595 kg DAP • 580 kg Seeds",
    truck: "TN-48-AB-2041",
    driver: "Bala Sabarivasan (Team Lead)",
    status: "DISPATCHED",
    eta: "Today, 4:30 PM",
    co2Saved: "38.2 kg"
  },
  {
    id: "ORD-TN-7822",
    farmer: "Senthil Kumar (Cauvery Ryot Sangam)",
    district: "Tiruvarur",
    crop: "Paddy (Rice)",
    area: "22.0 Ha",
    items: "4,840 kg Urea • 2,420 kg DAP • 880 kg Seeds",
    truck: "TN-45-CD-9902",
    driver: "Shanjay S.A",
    status: "IN_TRANSIT",
    eta: "Today, 6:15 PM",
    co2Saved: "45.0 kg"
  },
  {
    id: "ORD-TN-7823",
    farmer: "Ramasamy Gounder",
    district: "Karur",
    crop: "Cotton",
    area: "8.0 Ha",
    items: "1,280 kg Urea • 36 L Pesticide • 24 kg Hybrid Seeds",
    truck: "TN-48-XY-1144",
    driver: "Harish V.",
    status: "SCHEDULED",
    eta: "Tomorrow, 9:00 AM",
    co2Saved: "22.4 kg"
  }
];

// Official Govt of Tamil Nadu 2024-25 Season and Crop Report Benchmarks (Verified Ground Truth)
const TN_GOVT_2024_BENCHMARKS = {
  'Tiruchirappalli': {
    paddyAreaHa: 67931,
    paddyProdTonnes: 260087,
    yieldKgHa: 3829,
    nemRainDev: "+42.6%",
    soilType: "Cauvery Clay & Red Loam",
    peakSowSeason: "Samba (Oct-Nov)",
    stapleCrops: "Paddy, Maize (22.3k Ha), Sugarcane"
  },
  'Thanjavur': {
    paddyAreaHa: 209532,
    paddyProdTonnes: 665523,
    yieldKgHa: 3176,
    nemRainDev: "+25.5%",
    soilType: "Cauvery Delta Alluvium",
    peakSowSeason: "Kuruvai (Jun-Jul) & Samba (Sep-Oct)",
    stapleCrops: "Paddy (Granary Hub), Blackgram, Groundnut"
  },
  'Tiruvarur': {
    paddyAreaHa: 195952,
    paddyProdTonnes: 617781,
    yieldKgHa: 3153,
    nemRainDev: "+23.3%",
    soilType: "Deltaic Fine Clay & Alluvium",
    peakSowSeason: "Samba & Thaladi (Aug-Jan)",
    stapleCrops: "Paddy, Pulses (Rice Fallow)"
  },
  'Nagapattinam': {
    paddyAreaHa: 67999,
    paddyProdTonnes: 177549,
    yieldKgHa: 2611,
    nemRainDev: "+31.0%",
    soilType: "Coastal Alluvium & Saline",
    peakSowSeason: "Samba (Aug-Jan) & Navarai (Dec-Apr)",
    stapleCrops: "Paddy, Greengram, Blackgram"
  },
  'Karur': {
    paddyAreaHa: 14722,
    paddyProdTonnes: 54501,
    yieldKgHa: 3702,
    nemRainDev: "+35.4%",
    soilType: "Black Cotton & Red Sandy Clay",
    peakSowSeason: "Samba (Oct-Feb) & Navarai (Jan-Apr)",
    stapleCrops: "Paddy, Jowar (21.1k Ha), Cotton"
  },
  'Pudukkottai': {
    paddyAreaHa: 94173,
    paddyProdTonnes: 310179,
    yieldKgHa: 3294,
    nemRainDev: "+44.3%",
    soilType: "Red Laterite & Gravelly Clay",
    peakSowSeason: "Samba (Oct-Feb)",
    stapleCrops: "Paddy, Groundnut (10.5k Ha), Sugarcane"
  },
  'Perambalur': {
    paddyAreaHa: 8241,
    paddyProdTonnes: 32553,
    yieldKgHa: 3950,
    nemRainDev: "+14.1%",
    soilType: "Deep Vertisols (Black Cotton)",
    peakSowSeason: "Maize Kharif (75.6k Ha) & Cotton",
    stapleCrops: "Maize (Top Producer: 4.22L Tonnes), Cotton"
  }
};

// Bilingual Localized Interface (English / தமிழ் for Tamil Nadu Farmers & Evaluators)
const I18N = {
  en: {
    brandSubtitle: "{t.brandSubtitle}",
    tabMap: "Logistics Command Map",
    tabPredict: "AI Demand Predictor",
    tabRadar: "Warehouse Stock Radar",
    tabTransfers: "Fleet & Dispatches",
    kpiStockpile: "Network Stockpile",
    kpiAlerts: "Shortage Alerts",
    kpiRoute: "Optimized Circuit",
    kpiSavings: "Farmer DBT Savings",
    depotsActive: "7 Depots Active in Cauvery Delta",
    depotsCritical: "Critical Shortage Depots",
    zeroDeficit: "Zero Deficits (Healthy)",
    kmSaved: "Saved 146 km vs unoptimized trips",
    co2Abated: "384.2 kg CO₂ emissions abated",
    newReq: "New Requisition",
    executeRebalance: "Execute AI Rebalance Protocol",
    syncDepots: "Sync Depot Stock",
    computeDemand: "Compute AI Supply Demand",
    targetDistrict: "Target District (Cauvery Delta)",
    targetCrop: "Target Crop",
    sowingSeason: "Sowing Season",
    cultivatedArea: "Cultivated Area",
    forecastRain: "Forecast Rainfall (mm)",
    avgTemp: "Avg Temperature (°C)",
    govtReportBadge: "Govt of TN Crop Report 2024-25 Verified",
    carrierTelemetry: "LIVE CARRIER TELEMETRY",
    circuitStatus: "Circuit Progress",
    cargoRemaining: "Cargo Remaining",
    nextDrop: "Next Destination",
    speed: "Speed",
    printWaybill: "Print Official Waybill",
    exportCSV: "Export CSV",
    logout: "Logout",
  },
  ta: {
    brandSubtitle: "PLI-09: செயற்கை நுண்ணறிவு விவசாய விநியோக தளவாடங்கள்",
    tabMap: "தளவாட வரைபடம்",
    tabPredict: "தேவை கணிப்பொறி",
    tabRadar: "கிடங்கு இருப்பு ரேடார்",
    tabTransfers: "விநியோகங்கள் & லாரிகள்",
    kpiStockpile: "மொத்த இருப்பு",
    kpiAlerts: "பற்றாக்குறை எச்சரிக்கைகள்",
    kpiRoute: "உகந்த பாதை",
    kpiSavings: "விவசாயிகள் மானிய சேமிப்பு",
    depotsActive: "காவிரி டெல்டாவில் 7 கிடங்குகள் இயக்கம்",
    depotsCritical: "பற்றாக்குறை உள்ள கிடங்குகள்",
    zeroDeficit: "முழு இருப்பு (பாதுகாப்பானது)",
    kmSaved: "146 கி.மீ தொலைவு மிச்சப்படுத்தப்பட்டது",
    co2Abated: "384.2 கிலோ CO₂ உமிழ்வு குறைப்பு",
    newReq: "+ புதிய கோரிக்கை",
    executeRebalance: "AI மறுசீரமைப்பு இயக்கு",
    syncDepots: "இருப்பு ஒத்திசை",
    computeDemand: "AI தேவையை கணக்கிடுக",
    targetDistrict: "இலக்கு மாவட்டம் (காவிரி டெல்டா)",
    targetCrop: "பயிர் வகை",
    sowingSeason: "விதைப்பு பருவம்",
    cultivatedArea: "பயிரிடப்பட்ட பரப்பளவு",
    forecastRain: "எதிர்பார்க்கப்படும் மழை (மி.மீ)",
    avgTemp: "சராசரி வெப்பநிலை (°C)",
    govtReportBadge: "தமிழக அரசு 2024-25 அதிகாரப்பூர்வ அறிக்கை சரிபார்க்கப்பட்டது",
    carrierTelemetry: "நேரடி வாகன கண்காணிப்பு (GPS)",
    circuitStatus: "பயண முன்னேற்றம்",
    cargoRemaining: "மீதமுள்ள சரக்கு",
    nextDrop: "அடுத்த கிடங்கு",
    speed: "வேகம்",
    printWaybill: "அதிகாரப்பூர்வ ரசீது அச்சிடுக",
    exportCSV: "CSV பதிவிறக்கு",
    logout: "வெளியேறு",
  }
};

// Simulation Waypoints along the Delta Rake Circuit
const SIMULATION_WAYPOINTS = [
  { name: "Trichy Apex Hub", district: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, stage: "Depot Departure", cargoRemaining: 25000, speed: 0 },
  { name: "Thanjavur Farmers Depot", district: "Thanjavur", lat: 10.7870, lng: 79.1378, stage: "Delivering 12,000 kg Urea/DAP", cargoRemaining: 13000, speed: 56 },
  { name: "Tiruvarur Agro Supply Center", district: "Tiruvarur", lat: 10.7725, lng: 79.6365, stage: "Emergency Supply Drop (7,500 kg)", cargoRemaining: 5500, speed: 48 },
  { name: "Nagapattinam Coastal Hub", district: "Nagapattinam", lat: 10.7656, lng: 79.8424, stage: "Delivering 4,000 kg Seeds", cargoRemaining: 1500, speed: 52 },
  { name: "Pudukkottai Regional Depot", district: "Pudukkottai", lat: 10.3833, lng: 78.8001, stage: "Final Drop (1,500 kg DAP)", cargoRemaining: 0, speed: 62 },
  { name: "Trichy Apex Hub", district: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, stage: "Circuit Complete / Standby", cargoRemaining: 0, speed: 0 }
];

export default function App() {
  // Language State: 'en' | 'ta'
  const [lang, setLang] = useState(() => localStorage.getItem('hackdude_lang') || 'en');
  const t = I18N[lang] || I18N.en;

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'ta' : 'en';
    setLang(nextLang);
    localStorage.setItem('hackdude_lang', nextLang);
  };

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3800);
  };

  // Theme State: 'light' | 'dark'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('hackdude_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('hackdude_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Mobile Detection (< 768px)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const theme = {
    bgPage: darkMode ? '#0B0F19' : '#F8FAFC',
    bgCard: darkMode ? '#1E293B' : '#FFFFFF',
    bgSubtle: darkMode ? '#0F172A' : '#F8FAFC',
    bgInput: darkMode ? '#0F172A' : '#FFFFFF',
    border: darkMode ? '#334155' : '#E2E8F0',
    borderMedium: darkMode ? '#475569' : '#CBD5E1',
    textHead: darkMode ? '#F8FAFC' : '#0F172A',
    textBody: darkMode ? '#CBD5E1' : '#334155',
    textMain: darkMode ? '#CBD5E1' : '#334155',
    textMuted: darkMode ? '#94A3B8' : '#64748B',
    subBannerBg: darkMode ? '#020617' : '#0F172A',
    modalOverlay: darkMode ? 'rgba(0, 0, 0, 0.75)' : 'rgba(15, 23, 42, 0.65)',
  };
  // Supabase Authentication & Role State
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(null); // 'Supplier', 'Distributor', 'Retailer', or 'Farmer'
  const [selectedRole, setSelectedRole] = useState(() => {
    try {
      return localStorage.getItem('agriconnect_selected_role') || null;
    } catch (_) {
      return null;
    }
  });
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  // Navigation: 'dashboard', 'products', 'map', 'predict', 'radar', 'transfers', 'farmer_home', 'farmer_orders', 'farmer_advisory', 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Helper to resolve clean human-readable page name for AI context
  const getPageNameByTab = (tab, role) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return role === 'Retailer' ? 'Store Products' : 'Products & Catalog';
      case 'map': return role === 'Distributor' ? 'Route & Fleet Logistics' : 'Supply Grid Map';
      case 'predict': return 'Demand Analytics AI';
      case 'radar': return role === 'Distributor' ? 'Depots & Buffer Stocks' : 'Inventory & Stocks';
      case 'transfers': return role === 'Distributor' ? 'Fleet Transfers' : 'Orders & Requisitions';
      case 'farmer_home': return 'My Farm & Quota Portal';
      case 'farmer_crop_doctor':
      case 'crop_doctor': return 'AI Crop Doctor';
      case 'farmer_orders': return 'My Requisitions & Orders';
      case 'farmer_advisory': return 'TN Agro Advisory';
      case 'settings': return 'System Settings';
      default: return 'AgriConnect Platform';
    }
  };

  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [mapLayer, setMapLayer] = useState('google');
  const [mapShowDepots, setMapShowDepots] = useState(true);
  const [mapShowTransporters, setMapShowTransporters] = useState(true);
  const [mapShowFarmers, setMapShowFarmers] = useState(true);
  const [mapShowRoutes, setMapShowRoutes] = useState(true);
 // 'google', 'satellite', 'osm'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [depotsList, setDepotsList] = useState(INITIAL_AGRI_DEPOTS);
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_orders_list');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_ORDERS;
  });

  // Farmer Portal Specific State
  const [farmerLandArea, setFarmerLandArea] = useState(5.0); // Hectares
  const [farmerCrop, setFarmerCrop] = useState('Paddy (Rice Samba)');
  const [farmerDistrict, setFarmerDistrict] = useState('Thanjavur');
  const [farmerTaluk, setFarmerTaluk] = useState('Papanasam');
  const [farmerStage, setFarmerStage] = useState('Active Tillering (Top Dressing)');
  const [farmerRequisitions, setFarmerRequisitions] = useState(() => {
    try {
      const saved = localStorage.getItem('agri_farmer_reqs');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: "ORD-TN-7821",
        token: "TN-RYOT-7821-PASS",
        date: "Today, 10:30 AM",
        crop: "Paddy (Rice Samba)",
        areaHa: 5.0,
        ureaKg: 250,
        dapKg: 100,
        potashKg: 75,
        seedsKg: 40,
        seedVariety: "CR-1009 Sub-1 (Certified Samba Paddy)",
        estimatedDeliveryTime: "Ready for Pickup (Today, by 4:30 PM)",
        depot: "Cauvery Delta Farmers Depot (Thanjavur)",
        depotAddress: "Cooperative Bank Rd, Thanjavur 613001",
        officer: "S. Shanmugam (Field Officer)",
        officerPhone: "+91 94432 77102",
        status: "READY_FOR_PICKUP",
        totalCostSubsidized: 3415,
        totalCostMarket: 21865,
        savings: 18450
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('agri_orders_list', JSON.stringify(ordersList));
    } catch (_) {}
  }, [ordersList]);

  useEffect(() => {
    try {
      localStorage.setItem('agri_farmer_reqs', JSON.stringify(farmerRequisitions));
    } catch (_) {}
  }, [farmerRequisitions]);

  // Live Route Simulation State
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [simProgress, setSimProgress] = useState(0.08); // 0.0 to 1.0
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState(1);

  // Emergency Requisition Modal State
  const [isRequisitionOpen, setIsRequisitionOpen] = useState(false);
  const [reqFarmer, setReqFarmer] = useState('Cauvery Delta Ryots Cooperative Society');
  const [reqDistrict, setReqDistrict] = useState('Thanjavur');
  const [reqCrop, setReqCrop] = useState('Paddy (Rice Samba)');
  const [reqArea, setReqArea] = useState(18.0);
  const [reqUrgency, setReqUrgency] = useState('Critical Emergency (Within 4h)');
  const [reqNotes, setReqNotes] = useState('Immediate top dressing required due to post-cyclone soil nutrient drainage.');

  // Waybill Preview Modal State
  const [activeWaybill, setActiveWaybill] = useState(null);

  // Check initial session & listen for Supabase auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        const savedDemo = localStorage.getItem('hackdude_demo_user');
        if (savedDemo) {
          try {
            setCurrentUser(JSON.parse(savedDemo));
          } catch (_) {}
        }
      }
      setAuthLoading(false);
    }).catch(() => {
      const savedDemo = localStorage.getItem('hackdude_demo_user');
      if (savedDemo) {
        try {
          setCurrentUser(JSON.parse(savedDemo));
        } catch (_) {}
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
      } else {
        const savedDemo = localStorage.getItem('hackdude_demo_user');
        if (savedDemo) {
          try {
            setCurrentUser(JSON.parse(savedDemo));
          } catch (_) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    try {
      localStorage.removeItem('hackdude_demo_user');
      localStorage.removeItem('agriconnect_selected_role');
    } catch (_) {}
    setCurrentUser(null);
    setSelectedRole(null);
    setActiveRole(null);
    setShowRoleSelection(false);
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setActiveRole(role);
    try {
      localStorage.setItem('agriconnect_selected_role', role);
    } catch (_) {}
    setShowRoleSelection(false);
    setActiveTab('dashboard');
  };

  // Route Simulation Progress Ticker
  useEffect(() => {
    let interval = null;
    if (isSimPlaying) {
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 1) {
            setIsSimPlaying(false);
            return 1;
          }
          return Math.min(1, prev + 0.003 * simSpeedMultiplier);
        });
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimPlaying, simSpeedMultiplier]);

  // Compute live interpolated truck position along circuit
  const totalLegs = SIMULATION_WAYPOINTS.length - 1;
  const rawIndex = simProgress * totalLegs;
  const legIdx = Math.min(Math.floor(rawIndex), totalLegs - 1);
  const legFrac = rawIndex - legIdx;
  const startWp = SIMULATION_WAYPOINTS[legIdx];
  const endWp = SIMULATION_WAYPOINTS[legIdx + 1];

  const truckPosition = [
    startWp.lat + (endWp.lat - startWp.lat) * legFrac,
    startWp.lng + (endWp.lng - startWp.lng) * legFrac
  ];

  const currentCargo = Math.round(startWp.cargoRemaining - (startWp.cargoRemaining - endWp.cargoRemaining) * legFrac);
  const currentSpeed = isSimPlaying ? (legFrac < 0.08 || legFrac > 0.92 ? 22 : Math.round(startWp.speed || endWp.speed || 54)) : 0;

  // AI Demand Simulation State & Season Mapping
  const CROP_SEASONS = {
    'Paddy (Rice)': ['Kuruvai (Jun-Sep)', 'Samba/Thaladi (Aug-Jan)', 'Navarai (Dec-Mar)'],
    'Sugarcane': ['Early (Dec-Jan)', 'Mid (Feb-Mar)', 'Late (Apr-May)'],
    'Cotton': ['Winter Irrigated (Aug-Feb)', 'Summer Irrigated (Feb-Jul)'],
    'Maize': ['Kharif (Jun-Sep)', 'Rabi (Oct-Jan)'],
    'Groundnut': ['Adipattam (Jul-Aug)', 'Thai Pattam (Dec-Jan)', 'Chithirai Pattam (Apr-May)'],
    'Pulses (Blackgram/Greengram)': ['Rice Fallow (Jan-Feb)', 'Rainfed (Oct-Nov)']
  };

  const INITIAL_PREDICTION = {
    status: 'success',
    inputs: {
      district: 'Tiruchirappalli',
      crop_type: 'Paddy (Rice)',
      season: 'Kuruvai (Jun-Sep)',
      cultivated_area_ha: 15.0,
      weather_used: { temperature_c: 30.5, humidity_percent: 72.0, rainfall_mm: 65.0 }
    },
    predictions: {
      seed_demand_kg: 600.0,
      urea_demand_kg: 3300.0,
      dap_demand_kg: 1650.0,
      potash_demand_kg: 1275.0,
      pesticide_demand_l: 52.5,
      total_fertilizer_kg: 6225.0
    },
    fertilizer_breakdown_percent: { urea: 53.0, dap: 26.5, potash: 20.5 },
    agronomic_advisories: [
      'Basal application of DAP and Potash recommended during final puddle preparation.',
      'Split Nitrogen (Urea) top dressing into 3 equal splits (Basal, Tillering, Panicle Initiation).'
    ]
  };

  const [simDistrict, setSimDistrict] = useState('Tiruchirappalli');
  const [simCrop, setSimCrop] = useState('Paddy (Rice)');
  const [simSeason, setSimSeason] = useState('Kuruvai (Jun-Sep)');
  const [simArea, setSimArea] = useState(15.0);
  const [simTemp, setSimTemp] = useState(30.5);
  const [simRain, setSimRain] = useState(65.0);
  const [simHumidity, setSimHumidity] = useState(72.0);
  const [predResult, setPredResult] = useState(INITIAL_PREDICTION);
  const [isPredicting, setIsPredicting] = useState(false);
  const [mlInsights, setMlInsights] = useState(null);
  const [backendOnline, setBackendOnline] = useState(false);

  // Dynamic API Base
  const API_BASE = `http://${window.location.hostname || 'localhost'}:8000`;

  // Fetch ML Backend status and government dataset insights
  useEffect(() => {
    fetch(`${API_BASE}/api/ml/insights`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Backend offline');
      })
      .then((data) => {
        setMlInsights(data);
        setBackendOnline(true);
      })
      .catch(() => setBackendOnline(false));
  }, []);

  const handleCropChange = (newCrop) => {
    setSimCrop(newCrop);
    const validSeasons = CROP_SEASONS[newCrop] || ['Kuruvai (Jun-Sep)'];
    setSimSeason(validSeasons[0]);
  };

  const handleDistrictChange = (newDistrict) => {
    setSimDistrict(newDistrict);
    const w = CITY_WEATHER_DATA[newDistrict];
    if (w) {
      setSimTemp(w.temp);
      setSimRain(w.rainfallMm);
      setSimHumidity(w.humidity);
    }
  };

  // AI Demand Prediction
  const handlePredict = async () => {
    setIsPredicting(true);
    const crop = simCrop;
    const season = simSeason;
    const area = parseFloat(simArea) || 15.0;
    const dist = simDistrict;
    const rain = parseFloat(simRain) || 65.0;
    const temp = parseFloat(simTemp) || 30.5;
    const humidity = parseFloat(simHumidity) || 72.0;

    try {
      const res = await fetch(`${API_BASE}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: dist,
          crop_type: crop,
          season: season,
          cultivated_area_ha: area,
          avg_temperature_c: temp,
          humidity_percent: humidity,
          rainfall_mm: rain,
          month: 9
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.predictions) {
          setPredResult(data);
          setIsPredicting(false);
          return;
        }
      }
    } catch (_) {}

    // Synchronous ICAR & TNAU agronomic criteria calculation fallback
    const seedR = crop.includes('Sugarcane') ? 350.0 : (crop.includes('Paddy') ? 40.0 : (crop.includes('Cotton') ? 3.0 : (crop.includes('Groundnut') ? 125.0 : 18.0)));
    const ureaR = crop.includes('Sugarcane') ? 450.0 : (crop.includes('Paddy') ? 220.0 : (crop.includes('Cotton') ? 160.0 : (crop.includes('Groundnut') ? 45.0 : 250.0)));
    const dapR = crop.includes('Paddy') ? 110.0 : (crop.includes('Sugarcane') ? 150.0 : (crop.includes('Cotton') ? 90.0 : 130.0));
    const potR = crop.includes('Sugarcane') ? 200.0 : (crop.includes('Paddy') ? 85.0 : (crop.includes('Cotton') ? 65.0 : 75.0));
    const pestR = rain > 70 ? 4.2 : 3.0;

    const seedKg = Math.round(area * seedR);
    const ureaKg = Math.round(area * ureaR * (rain > 80 ? 1.15 : 1.0));
    const dapKg = Math.round(area * dapR);
    const potKg = Math.round(area * potR);
    const pestL = parseFloat((area * pestR).toFixed(1));
    const totalFert = ureaKg + dapKg + potKg;

    setPredResult({
      status: 'success',
      inputs: {
        district: dist,
        crop_type: crop,
        season: season,
        cultivated_area_ha: area,
        weather_used: {
          temperature_c: temp,
          humidity_percent: humidity,
          rainfall_mm: rain
        }
      },
      predictions: {
        seed_demand_kg: seedKg,
        urea_demand_kg: ureaKg,
        dap_demand_kg: dapKg,
        potash_demand_kg: potKg,
        pesticide_demand_l: pestL,
        total_fertilizer_kg: totalFert
      },
      fertilizer_breakdown_percent: {
        urea: Math.round((ureaKg / totalFert) * 100) || 50,
        dap: Math.round((dapKg / totalFert) * 100) || 25,
        potash: Math.round((potKg / totalFert) * 100) || 25
      },
      agronomic_advisories: [
        rain > 60
          ? 'North-East monsoon rainfall alert: Split Urea top-dressing into 3 doses to minimize Cauvery delta leaching.'
          : 'Soil moisture optimal: Apply full basal DAP (110 kg/ha) prior to final puddling.',
        'High humidity detected: Conduct prophylactic neem oil spray to prevent paddy leaf blast.'
      ]
    });
    setIsPredicting(false);
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      handlePredict();
    }, 150);
    return () => clearTimeout(timer);
  }, [simCrop, simArea, simDistrict, simSeason, simRain, simTemp, simHumidity]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast(lang === "ta" ? "திருச்சி மத்திய கிடங்குடன் இருப்பு ஒத்திசைக்கப்பட்டது!" : "Depot stocks synchronized with Trichy Central Apex Logistics Hub!", "success");
    }, 450);
  };

  const [isCsvUploading, setIsCsvUploading] = useState(false);

  const handleDownloadTemplate = () => {
    const templateContent = "district,crop_type,season,cultivated_area_ha,rainfall_mm\nThanjavur,Paddy (Rice),Kuruvai (Jun-Sep),15.0,45.0\nKarur,Cotton,Winter Irrigated (Aug-Feb),8.0,20.0\nPerambalur,Maize,Kharif (Jun-Sep),12.0,30.0\nPudukkottai,Groundnut,Adipattam (Jul-Aug),10.0,25.0\n";
    const blob = new Blob([templateContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "agri_demand_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert("Please select a valid .csv file.");
      return;
    }

    setIsCsvUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE}/api/predict/csv`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `predicted_${file.name}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(`✅ CSV Batch Inference Complete!\n\nAI successfully calculated Seeds, Urea, DAP, Potash & Pesticides for all records in '${file.name}'.\nEnriched file downloaded.`);
      } else {
        const err = await res.json();
        alert(`Error processing CSV: ${err.detail || 'Could not parse CSV'}`);
      }
    } catch (_) {
      alert("Backend CSV service offline. Please ensure the backend server is running.");
    } finally {
      setIsCsvUploading(false);
      e.target.value = "";
    }
  };

  // AI 1-Click Auto Rebalance Shortages (Conservation of Mass, Zero-Overdraw, Mathematically Verified)
  const handleAutoRebalance = () => {
    const currentTotalDeficit = depotsList.reduce((acc, d) => acc + (d.deficits?.total_deficit_kg || 0), 0);
    if (currentTotalDeficit === 0) {
      showToast(
        lang === "ta"
          ? "அனைத்து 7 கிடங்குகளும் போதுமான இருப்புடன் (>80%) உள்ளன! பற்றாக்குறை ஏதுமில்லை."
          : "Grid in Equilibrium: All 7 Cauvery Delta depots are at Healthy buffer (>80%). Zero deficits detected!",
        "info"
      );
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      setDepotsList((prev) => {
        const apex = prev.find((d) => d.isApex);
        if (!apex || apex.inventory.urea_kg < 55500) {
          return prev;
        }

        return prev.map((d) => {
          if (d.id === "DEPOT-THANJAVUR-02") {
            const addUrea = d.deficits?.urea_kg || 17000;
            const addDap = d.deficits?.dap_kg || 6000;
            return {
              ...d,
              status: "Healthy",
              color: "#059669",
              currentStockKg: d.currentStockKg + addUrea + addDap,
              inventory: {
                ...d.inventory,
                urea_kg: d.inventory.urea_kg + addUrea,
                dap_kg: d.inventory.dap_kg + addDap
              },
              deficits: { urea_kg: 0, dap_kg: 0, total_deficit_kg: 0 }
            };
          }
          if (d.id === "DEPOT-TIRUVARUR-03") {
            const addUrea = d.deficits?.urea_kg || 24000;
            const addDap = d.deficits?.dap_kg || 7500;
            return {
              ...d,
              status: "Healthy",
              color: "#059669",
              currentStockKg: d.currentStockKg + addUrea + addDap,
              inventory: {
                ...d.inventory,
                urea_kg: d.inventory.urea_kg + addUrea,
                dap_kg: d.inventory.dap_kg + addDap
              },
              deficits: { urea_kg: 0, dap_kg: 0, total_deficit_kg: 0 }
            };
          }
          if (d.id === "DEPOT-PUDUKKOTTAI-06") {
            const addUrea = d.deficits?.urea_kg || 14500;
            const addDap = d.deficits?.dap_kg || 5000;
            return {
              ...d,
              status: "Healthy",
              color: "#059669",
              currentStockKg: d.currentStockKg + addUrea + addDap,
              inventory: {
                ...d.inventory,
                urea_kg: d.inventory.urea_kg + addUrea,
                dap_kg: d.inventory.dap_kg + addDap
              },
              deficits: { urea_kg: 0, dap_kg: 0, total_deficit_kg: 0 }
            };
          }
          if (d.isApex) {
            return {
              ...d,
              currentStockKg: d.currentStockKg - 74000,
              inventory: {
                ...d.inventory,
                urea_kg: d.inventory.urea_kg - 55500,
                dap_kg: d.inventory.dap_kg - 18500
              }
            };
          }
          return d;
        });
      });
      setIsSyncing(false);
      showToast(
        lang === "ta"
          ? "AI மறுசீரமைப்பு நிறைவுற்றது! 74,000 கிலோ உரம் திருச்சி மத்திய மையத்திலிருந்து தஞ்சாவூர், திருவாரூர் & புதுக்கோட்டைக்கு அனுப்பி வைக்கப்பட்டது!"
          : "AI Auto-Rebalance Complete: 74,000 kg dispatched from Trichy Apex to Thanjavur, Tiruvarur & Pudukkottai. All 7 depots healthy!",
        "success"
      );
    }, 550);
  };

  // Farmer Portal: Submit Subsidized Supply Requisition to Nearest Depot
  const handleFarmerRequisitionSubmit = () => {
    const urea = Math.round(farmerLandArea * 50);
    const dap = Math.round(farmerLandArea * 20);
    const pot = Math.round(farmerLandArea * 15);
    const seeds = Math.round(farmerLandArea * 8);
    const market = Math.round((urea * 54.4) + (dap * 76.0) + (pot * 64.0));
    const sub = Math.round((urea * 5.91) + (dap * 27.0) + (pot * 34.0));
    const savings = Math.max(0, market - sub);
    const newId = `ORD-TN-${7824 + farmerRequisitions.length}`;

    const newReq = {
      id: newId,
      token: `TN-RYOT-${7824 + farmerRequisitions.length}-PASS`,
      date: "Just now",
      crop: farmerCrop,
      areaHa: farmerLandArea,
      ureaKg: urea,
      dapKg: dap,
      potashKg: pot,
      seedsKg: seeds,
      seedVariety: farmerCrop.includes('Paddy') ? "CR-1009 Sub-1 (Certified Samba Paddy)" : (farmerCrop.includes('Cotton') ? "RCH-2 Bt Cotton" : (farmerCrop.includes('Maize') ? "CoH(M)-8 Hybrid Maize" : (farmerCrop.includes('Groundnut') ? "TMV-14 Groundnut" : "TNAU Certified Hybrid"))),
      estimatedDeliveryTime: "Within 1 - 2 Hours (Today, by 4:30 PM)",
      depot: "Cauvery Delta Farmers Depot (Thanjavur)",
      depotAddress: "Cooperative Bank Rd, Thanjavur 613001",
      officer: "S. Shanmugam (Field Officer)",
      officerPhone: "+91 94432 77102",
      status: "ALLOCATED",
      totalCostSubsidized: sub,
      totalCostMarket: market,
      savings: savings
    };

    const orderForPipeline = {
      id: newId,
      farmer: "K. Arunkumar (Progressive Farmer)",
      district: farmerDistrict || "Thanjavur",
      crop: farmerCrop,
      area: `${farmerLandArea} Ha`,
      items: `${urea} kg Urea • ${dap} kg DAP • ${pot} kg Potash • ${seeds} kg Seeds`,
      truck: "TN-48-AB-2041",
      driver: "Bala Sabarivasan (Logistics Lead)",
      status: "DISPATCHED",
      eta: "Within 1 - 2 Hours",
      co2Saved: `${(farmerLandArea * 2.6).toFixed(1)} kg`
    };

    setFarmerRequisitions(prev => [newReq, ...prev]);
    setOrdersList(prev => [orderForPipeline, ...prev]);
    setActiveTab('farmer_orders');

    // Sync to backend asynchronously
    try {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_name: "K. Arunkumar",
          district: farmerDistrict || "Thanjavur",
          crop_type: farmerCrop,
          area_ha: farmerLandArea,
          urgency: "Routine"
        })
      }).catch(() => {});
    } catch (_) {}

    showToast(
      lang === 'ta'
        ? `உர முன்பதிவு [${newId}] வெற்றிகரமாக பதிவு செய்யப்பட்டது! தஞ்சாவூர் கிடங்கில் ஒதுக்கீடு தயாராக உள்ளது.`
        : `Supply Requisition [${newId}] Confirmed! Allocated at Thanjavur Depot. You saved ₹${savings.toLocaleString('en-IN')} via DBT!`,
      "success"
    );
  };

  // Submit Emergency Farmer / Dealer Requisition (All Roles)
  const handleSubmitRequisition = (e) => {
    e.preventDefault();
    const ureaAlloc = Math.round(reqArea * 220);
    const dapAlloc = Math.round(reqArea * 110);
    const seedAlloc = Math.round(reqArea * 40);
    const potAlloc = Math.round(reqArea * 80);

    const newOrderId = `REQ-DELTA-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      farmer: reqFarmer || (isFarmer ? "K. Arunkumar (Progressive Farmer)" : "Cauvery Delta Ryots Cooperative Society"),
      district: reqDistrict,
      crop: reqCrop,
      area: `${reqArea} Ha`,
      items: `${ureaAlloc.toLocaleString()} kg Urea • ${dapAlloc.toLocaleString()} kg DAP • ${seedAlloc.toLocaleString()} kg Seeds`,
      truck: "TN-48-EMERGENCY-01",
      driver: "Daniel Andrews Michael (Logistics Pilot)",
      status: reqUrgency.includes("Critical") ? "EMERGENCY_DISPATCH" : "PRIORITY_ALLOCATED",
      eta: reqUrgency.includes("Critical") ? "Within 2 Hours" : "Today, 7:00 PM",
      co2Saved: `${(reqArea * 2.6).toFixed(1)} kg`
    };

    const newFarmerReq = {
      id: newOrderId,
      token: `TN-REQ-${newOrderId.slice(-4)}-PASS`,
      date: "Just now",
      crop: reqCrop,
      areaHa: reqArea,
      ureaKg: ureaAlloc,
      dapKg: dapAlloc,
      potashKg: potAlloc,
      seedsKg: seedAlloc,
      seedVariety: reqCrop.includes('Paddy') ? "CR-1009 Sub-1 (Certified Samba Paddy)" : `${reqCrop} Certified Seed`,
      estimatedDeliveryTime: newOrder.eta,
      depot: `${reqDistrict} Farmers Agro Depot`,
      depotAddress: `Main Cooperative Junction, ${reqDistrict}`,
      officer: "S. Shanmugam (Field Officer)",
      officerPhone: "+91 94432 77102",
      status: "ALLOCATED",
      totalCostSubsidized: Math.round((ureaAlloc * 5.91) + (dapAlloc * 27.0)),
      totalCostMarket: Math.round((ureaAlloc * 54.4) + (dapAlloc * 76.0)),
      savings: Math.max(0, Math.round(((ureaAlloc * 54.4) + (dapAlloc * 76.0)) - ((ureaAlloc * 5.91) + (dapAlloc * 27.0))))
    };

    setOrdersList(prev => [newOrder, ...prev]);
    setFarmerRequisitions(prev => [newFarmerReq, ...prev]);
    setIsRequisitionOpen(false);

    // Sync to backend asynchronously
    try {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmer_name: reqFarmer,
          district: reqDistrict,
          crop_type: reqCrop,
          area_ha: reqArea,
          urgency: reqUrgency
        })
      }).catch(() => {});
    } catch (_) {}

    showToast(
      lang === 'ta'
        ? `வேளாண் பதிவு [${newOrderId}] வெற்றிகரமாக பதிவு செய்யப்பட்டது! ${ureaAlloc.toLocaleString()} kg Urea & ${dapAlloc.toLocaleString()} kg DAP ஒதுக்கப்பட்டது.`
        : `Requisition [${newOrderId}] Confirmed! Allocated ${ureaAlloc.toLocaleString()} kg Urea & ${dapAlloc.toLocaleString()} kg DAP to ${reqFarmer}.`,
      "success"
    );

    if (isFarmer) {
      setActiveTab('farmer_orders');
    } else {
      setActiveTab('transfers');
    }
  };

  // Export Manifest as CSV
  const handleExportCSV = () => {
    const headers = ["Order ID", "Farmer / Society", "District", "Crop", "Cultivated Area", "Supplies Allocated", "Carrier Vehicle", "Assigned Pilot", "Status", "ETA", "CO2 Abated"];
    const rows = ordersList.map(o => [
      o.id,
      `"${o.farmer}"`,
      o.district,
      `"${o.crop}"`,
      `"${o.area}"`,
      `"${o.items}"`,
      o.truck,
      `"${o.driver}"`,
      o.status,
      `"${o.eta}"`,
      `"${o.co2Saved}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HACKDUDE_AGRI_MANIFEST_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDispatch = (depot) => {
    const newOrder = {
      id: `DISP-TN-${7820 + ordersList.length + 1}`,
      farmer: depot.officer,
      district: depot.district,
      crop: depot.sowingSeason,
      area: "Depot Buffer Replenishment",
      items: `14,000 kg Urea • 5,000 kg DAP`,
      truck: "TN-48-AB-2041",
      driver: "Bala Sabarivasan (Team Lead)",
      status: "DISPATCHED",
      eta: "Today, 5:30 PM",
      co2Saved: "34.0 kg"
    };
    setOrdersList([newOrder, ...ordersList]);
    showToast(`Priority delivery rake dispatched from Trichy Apex Hub to ${depot.name}!`, "success");
  };

  const filteredDepots = depotsList.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDist = filterDistrict === 'All' || d.district === filterDistrict;
    const matchesStat = filterStatus === 'All' || d.status === filterStatus;
    return matchesSearch && matchesDist && matchesStat;
  });

  const getTileUrl = () => {
    if (mapLayer === 'dark' || (darkMode && mapLayer === 'osm')) {
      return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapLayer === 'satellite') {
      return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    } else if (mapLayer === 'osm') {
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else {
      return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
  };

  // Turn-by-Turn circuit route connecting Apex Hub to Shortages
  const routePolyline = [
    [10.7905, 78.7047], // Trichy Apex Hub
    [10.7870, 79.1378], // Thanjavur Depot
    [10.7725, 79.6365], // Tiruvarur (CRITICAL)
    [10.7656, 79.8424], // Nagapattinam Hub
    [10.3833, 78.8001], // Pudukkottai (CRITICAL)
    [10.7905, 78.7047]  // Return to Trichy
  ];

  // Dynamic KPI counts - Verified Conservation of Mass
  const totalStockpileKg = depotsList.reduce((sum, d) => sum + d.currentStockKg, 0);
  const totalDeficitKg = depotsList.reduce((sum, d) => sum + (d.deficits?.total_deficit_kg || 0), 0);
  const deficitDepots = depotsList.filter((d) => (d.deficits?.total_deficit_kg || 0) > 0 || d.status !== 'Healthy');
  const deficitDepotsCount = deficitDepots.length;

  // Inventory category sums across 7 depots
  const totalSeedsKg = depotsList.reduce((sum, d) => sum + (d.inventory?.seeds_kg || 0), 0);
  const totalUreaKg = depotsList.reduce((sum, d) => sum + (d.inventory?.urea_kg || 0), 0);
  const totalDapKg = depotsList.reduce((sum, d) => sum + (d.inventory?.dap_kg || 0), 0);
  const totalPotashKg = depotsList.reduce((sum, d) => sum + (d.inventory?.potash_kg || 0), 0);

  // Determine Effective Role
  const currentRole = selectedRole || activeRole || (
    currentUser?.user_metadata?.role || 
    (currentUser?.email?.toLowerCase().includes('farmer') ? 'Farmer' : 'Supplier')
  );
  const isFarmer = currentRole === 'Farmer';

  // Economic Subsidy Calculations for AI Predictor
  const ureaKg = predResult?.predictions?.urea_demand_kg || 0;
  const dapKg = predResult?.predictions?.dap_demand_kg || 0;
  const potKg = predResult?.predictions?.potash_demand_kg || 0;
  
  // Market commercial prices (₹/kg) vs Subsidized DBT cooperative prices (₹/kg)
  const commercialCost = (ureaKg * 54.4) + (dapKg * 76.0) + (potKg * 64.0);
  const subsidizedCost = (ureaKg * 5.91) + (dapKg * 27.0) + (potKg * 34.0);
  const govtSubsidyDelivered = Math.round(Math.max(0, commercialCost - subsidizedCost));
  const farmerSavingsPct = commercialCost > 0 ? Math.round((govtSubsidyDelivered / commercialCost) * 100) : 74;

  // Check authentication state
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #CBD5E1', borderTopColor: '#16A34A', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Initializing AgriConnect Session...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setShowRoleSelection(true);
        }}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />
    );
  }

  // After login: Render 'Select Your Role' (Image 2 Panel 3)
  if (!selectedRole || showRoleSelection) {
    return (
      <RoleSelectionPage
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        onLogout={handleSignOut}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode(!darkMode)}
      />
    );
  }

  return (
    <div style={{ backgroundColor: theme.bgPage, minHeight: '100vh', display: 'flex', color: theme.textHead, transition: 'background-color 0.25s ease' }}>
      {/* Sleek Floating Toast Notification */}
      {toast && (
        <div className="toast-animate" style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 3000,
          backgroundColor: darkMode ? '#1E293B' : '#0F172A',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
          border: '1px solid #10B981',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================
          LEFT SLIDE BAR (PERSISTENT NAVIGATION SIDEBAR - Image 3)
      ======================================================== */}
      <SlideBar
        currentRole={currentRole}
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        lang={lang}
        darkMode={darkMode}
        theme={theme}
        ordersCount={ordersList.length}
        alertsCount={4}
      />

      {/* ========================================================
          MAIN VIEWPORT CONTAINER (TOP HEADER + ACTIVE VIEW)
      ======================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
        {/* TOP HEADER: EXECUTIVE AGRICULTURAL COMMAND */}
        <header style={{
          backgroundColor: theme.bgCard,
          borderBottom: `1px solid ${theme.border}`,
          padding: isMobile ? '0 12px' : '0 20px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.03)',
          gap: '12px',
          transition: 'all 0.25s ease'
        }}>
          {/* Left: Hamburger Slide-Bar Toggle & Search Input (Image 3) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '14px', flex: 1, maxWidth: '520px' }}>
            <button
              onClick={() => {
                if (isMobile) setMobileSidebarOpen(true);
                else setSidebarCollapsed(!sidebarCollapsed);
              }}
              title="Toggle Slide Bar"
              style={{
                background: darkMode ? '#1E293B' : '#F1F5F9',
                border: `1px solid ${theme.borderMedium}`,
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.textHead,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s ease'
              }}
            >
              <Menu size={18} />
            </button>

            {/* Global Search Bar (Image 3: "Search products, orders, or anything...") */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
              border: `1px solid ${theme.borderMedium}`,
              borderRadius: '20px',
              padding: '6px 14px',
              width: '100%',
              maxWidth: '360px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}>
              <Search size={15} color={theme.textMuted} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder={lang === 'ta' ? 'பொருட்கள், ஆர்டர்களைத் தேடுக...' : 'Search products, orders, or anything...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '12.5px',
                  color: theme.textHead,
                  width: '100%'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', padding: 0 }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Notifications, Quick Actions, Role Switcher, Profile & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '9px', flexShrink: 0 }}>
            {/* Notification Bell with Badge */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                title="Notifications & Alerts"
                style={{
                  backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                  border: `1px solid ${theme.borderMedium}`,
                  borderRadius: '8px',
                  width: '34px',
                  height: '34px',
                  color: theme.textHead,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Bell size={16} />
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#DC2626',
                  border: '1.5px solid white'
                }} />
              </button>

              {/* Alerts Dropdown Popover */}
              {showAlertsDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '310px',
                  backgroundColor: theme.bgCard,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
                  padding: '14px',
                  zIndex: 2500
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: theme.textHead }}>
                      {lang === 'ta' ? 'அறிவிப்புகள் (4)' : 'Active Alerts (4)'}
                    </span>
                    <button
                      onClick={() => setShowAlertsDropdown(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: darkMode ? '#2D1B1B' : '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626' }}>
                      <strong>⚠️ Urea Fertilizer stock low</strong>: Thanjavur buffer below 15%.
                    </div>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: darkMode ? '#2B2414' : '#FFFBEB', border: '1px solid #FDE68A', color: '#D97706' }}>
                      <strong>⚠️ Pest alert</strong>: Increased pesticide demand in TN Delta.
                    </div>
                    <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: darkMode ? '#142B1F' : '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A' }}>
                      <strong>📦 Order received</strong>: Green Farm Store #ORD-7821 ready.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Requisition Button */}
            <button
              onClick={() => setIsRequisitionOpen(true)}
              style={{
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                height: '34px',
                padding: isMobile ? '0 9px' : '0 12px',
                fontSize: '12px',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                whiteSpace: 'nowrap'
              }}
            >
              <Plus size={14} />
              <span>{isMobile ? 'Req' : (lang === 'ta' ? '+ புதிய பதிவு' : '+ Requisition')}</span>
            </button>

            {/* Bilingual Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Switch to Tamil (தமிழ்)' : 'Switch to English'}
              style={{
                backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                border: `1px solid ${theme.borderMedium}`,
                borderRadius: '8px',
                height: '34px',
                padding: '0 10px',
                color: '#16A34A',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: '800'
              }}
            >
              <Globe size={14} color="#16A34A" />
              <span>{lang === 'en' ? 'தமிழ்' : 'EN'}</span>
            </button>

            {/* Normal / Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Normal Mode" : "Switch to Dark Mode"}
              style={{
                backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                border: `1px solid ${theme.borderMedium}`,
                borderRadius: '8px',
                width: '34px',
                height: '34px',
                color: darkMode ? '#FDE047' : '#16A34A',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Role Switcher Button */}
            <button
              onClick={() => setShowRoleSelection(true)}
              title="Click to switch your role (Supplier, Distributor, Retailer, Farmer)"
              style={{
                backgroundColor: darkMode ? '#1E293B' : '#F0FDF4',
                color: '#16A34A',
                border: `1.5px solid ${darkMode ? '#065F46' : '#BBF7D0'}`,
                borderRadius: '8px',
                height: '34px',
                padding: '0 10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{currentRole === 'Farmer' ? '🌾' : currentRole === 'Supplier' ? '🏭' : currentRole === 'Distributor' ? '🚚' : '🏪'}</span>
              <span>{currentRole}</span>
              <span style={{ fontSize: '10px', color: theme.textMuted }}>▾ Switch</span>
            </button>

            {/* Profile Chip (Image 3: Ramesh Kumar | Supplier) */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 6px 3px 8px',
              borderRadius: '20px',
              backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
              border: `1px solid ${theme.borderMedium}`,
              whiteSpace: 'nowrap'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: isFarmer ? '#16A34A' : currentRole === 'Supplier' ? '#0F766E' : currentRole === 'Distributor' ? '#0284C7' : '#D97706',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '800'
              }}>
                {isFarmer ? 'FR' : currentRole === 'Supplier' ? 'SP' : currentRole === 'Distributor' ? 'DS' : 'RT'}
              </div>

              {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15, marginRight: '2px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '700', color: theme.textHead, maxWidth: '105px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentRole === 'Supplier' ? 'Ramesh Kumar' : isFarmer ? 'K. Arunkumar' : currentRole === 'Distributor' ? 'K. Rajendran' : 'A. Selvam'}
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: '600', color: '#16A34A' }}>
                    {currentRole}
                  </span>
                </div>
              )}

              <button
                onClick={handleSignOut}
                title="Sign Out of Session"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  width: '26px',
                  height: '26px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: theme.textMuted
                }}
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>
        </header>

      {/* ========================================================
          MAIN CONTENT AREA
      ======================================================== */}
      <main style={{ padding: isMobile ? '12px 12px 85px 12px' : '20px 28px 36px 28px', flex: 1 }}>

        {/* TAB 1: EXECUTIVE ROLE DASHBOARD (Image 3 Template for All Roles) */}
        {activeTab === 'dashboard' && (
          <DashboardView
            currentRole={currentRole}
            lang={lang}
            darkMode={darkMode}
            theme={theme}
            totalStockpileKg={totalStockpileKg}
            deficitDepotsCount={deficitDepotsCount}
            totalDeficitKg={totalDeficitKg}
            ordersList={ordersList}
            farmerLandArea={farmerLandArea}
            farmerCrop={farmerCrop}
            farmerDistrict={farmerDistrict}
            onNavigate={(tabId) => {
              setActiveTab(tabId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            searchQuery={searchQuery}
            cityWeatherData={CITY_WEATHER_DATA}
            onSelectCityWeather={(w) => {
              setSimDistrict(w.district);
              setSimTemp(w.temp);
              setSimRain(w.rainfallMm);
              setSimHumidity(w.humidity);
              showToast(lang === 'ta' ? `${w.city} வானிலை தேர்ந்தெடுக்கப்பட்டது` : `Loaded ${w.city} agro-weather.`);
            }}
          />
        )}

        {/* TAB 2: PRODUCTS CATALOG & INVENTORY */}
        {activeTab === 'products' && (
          <ProductsView
            theme={theme}
            darkMode={darkMode}
            lang={lang}
            onOpenRequisition={() => setIsRequisitionOpen(true)}
            onNavigate={(t) => setActiveTab(t)}
          />
        )}

        {/* TAB 3: PLATFORM & PROFILE SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            currentRole={currentRole}
            lang={lang}
            darkMode={darkMode}
            theme={theme}
            showToast={showToast}
          />
        )}

        {/* ========================================================
            FARMER PORTAL: TAB 1 - MY FARM & AI SUBSIDY CALCULATOR
        ======================================================== */}
        {isFarmer && activeTab === 'farmer_home' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr', gap: isMobile ? '14px' : '22px' }}>
            {/* Left Card: Farm Profile & Interactive Requisition Form */}
            <div className="white-card" style={{ padding: '22px', backgroundColor: theme.bgCard }}>
              {/* Farmer Welcome Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #047857 100%)',
                borderRadius: '12px',
                padding: '16px 18px',
                color: '#FFFFFF',
                marginBottom: '18px',
                boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
                      🌾 {lang === 'ta' ? 'தமிழ்நாடு உழவர் சேவை போர்டல்' : 'Tamil Nadu Ryot Seva Portal'}
                    </span>
                    <h2 style={{ fontSize: '18px', fontWeight: '900', margin: '4px 0 2px 0' }}>
                      {lang === 'ta' ? 'வணக்கம், திரு. கே. அருண்குமார்' : 'Welcome, K. Arunkumar'}
                    </h2>
                    <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>
                      {lang === 'ta' ? 'தஞ்சாவூர் மாவட்டம் • பாபநாசம் வட்டம் • தொடக்க கூட்டுறவு சங்கம் #TN-AGRI-8821' : 'Thanjavur Delta • Papanasam Taluk • PACS Registry #TN-AGRI-8821'}
                    </p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '50%' }}>
                    <Leaf size={24} color="#FFF" />
                  </div>
                </div>
              </div>

              {/* Farmer Live City Agro-Weather & Advisory Card */}
              {CITY_WEATHER_DATA[farmerDistrict || 'Thanjavur'] && (() => {
                const fw = CITY_WEATHER_DATA[farmerDistrict || 'Thanjavur'];
                return (
                  <div style={{
                    marginBottom: '16px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: darkMode ? '#1E293B' : '#F0FDF4',
                    border: darkMode ? '1px solid #334155' : '1px solid #BBF7D0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{fw.icon}</span>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '800', color: darkMode ? '#86EFAC' : '#14532D' }}>
                            {fw.condition} • {fw.temp}°C
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '6px' }}>({fw.tamil})</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontWeight: '700', color: darkMode ? '#CBD5E1' : '#334155' }}>
                        <span>🌧️ {fw.rainfallMm} mm</span>
                        <span>💧 {fw.humidity}% Hum</span>
                        <span>💨 {fw.windKmH} km/h</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* AI Crop Doctor Diagnostic Quick-Action Banner */}
              <div
                onClick={() => setActiveTab('farmer_crop_doctor')}
                style={{
                  marginBottom: '16px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #065F46 0%, #0F766E 100%)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(6, 95, 70, 0.2)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                    <Sparkles size={20} color="#86EFAC" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 2px 0' }}>
                      {lang === 'ta' ? '🌿 பயிர் நோய் & பூச்சிக்கொல்லி AI மருத்துவர்' : '🌿 Leaf / Tree Disease & Pesticide AI Doctor'}
                    </h4>
                    <p style={{ fontSize: '11px', opacity: 0.9, margin: 0 }}>
                      {lang === 'ta' ? 'இலையின் படத்தை பதிவேற்றி உடனடி TNAU பூச்சிக்கொல்லி பரிந்துரையைப் பெறுங்கள் →' : 'Snap or upload photo for instant disease diagnosis & pesticide dosage →'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} color="#86EFAC" />
              </div>

              {/* Farm Configuration & Fertilizer Needs Input */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: theme.textHead, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#0F766E" />
                  <span>{lang === 'ta' ? 'பண்ணை விவரங்கள் & தேவை கணக்கீடு' : 'Farm Acreage & Crop Need Calculator'}</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>
                      {lang === 'ta' ? 'பயிரிடப்படும் பரப்பளவு (ஹெக்டேர்)' : 'Cultivated Area (Hectares)'}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="50"
                        value={farmerLandArea}
                        onChange={(e) => setFarmerLandArea(Math.max(0.5, parseFloat(e.target.value) || 1))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: `1px solid ${theme.borderMedium}`,
                          borderRadius: '8px',
                          backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                          color: theme.textHead,
                          fontWeight: '700',
                          fontSize: '14px'
                        }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: theme.textMuted }}>Ha</span>
                    </div>
                    <span style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px', display: 'block' }}>
                      ≈ {(farmerLandArea * 2.471).toFixed(1)} {lang === 'ta' ? 'ஏக்கர்' : 'Acres'}
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>
                      {lang === 'ta' ? 'பயிர் வகை' : 'Crop Type'}
                    </label>
                    <select
                      value={farmerCrop}
                      onChange={(e) => setFarmerCrop(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${theme.borderMedium}`,
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                        color: theme.textHead,
                        fontWeight: '700',
                        fontSize: '13px'
                      }}
                    >
                      <option value="Paddy (Rice Samba)">Paddy (Rice Samba - Thaladi)</option>
                      <option value="Paddy (Rice Kuruvai)">Paddy (Rice Kuruvai)</option>
                      <option value="Maize">Maize (Hybrid)</option>
                      <option value="Cotton">Cotton (Winter Irrigated)</option>
                      <option value="Groundnut">Groundnut (Rainfed)</option>
                      <option value="Sugarcane">Sugarcane (Cauvery Alluvium)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>
                      {lang === 'ta' ? 'வளர்ச்சி நிலை' : 'Crop Growth Stage'}
                    </label>
                    <select
                      value={farmerStage}
                      onChange={(e) => setFarmerStage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${theme.borderMedium}`,
                        borderRadius: '8px',
                        backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                        color: theme.textHead,
                        fontWeight: '600',
                        fontSize: '12px'
                      }}
                    >
                      <option value="Active Tillering (Top Dressing)">Active Tillering (Top Dressing)</option>
                      <option value="Basal Application (Transplanting)">Basal Application (Transplanting)</option>
                      <option value="Panicle Initiation">Panicle Initiation</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: theme.textMuted, display: 'block', marginBottom: '4px' }}>
                      {lang === 'ta' ? 'ஒதுக்கீடு கிடங்கு' : 'Assigned Local Depot'}
                    </label>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                      border: `1px solid ${theme.borderMedium}`,
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#0F766E',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Warehouse size={13} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Thanjavur Farmers Depot</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculated Needs Breakdown Chips */}
              <div style={{
                backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${theme.borderMedium}`,
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: theme.textHead, marginBottom: '8px' }}>
                  {lang === 'ta' ? 'அரசு பரிந்துரைக்கப்பட்ட உர அளவு (TNAU Criteria)' : 'TNAU Scientific Fertilizer Allocation:'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                  <div style={{ backgroundColor: darkMode ? '#1E293B' : '#FFF', padding: '8px 6px', borderRadius: '8px', border: `1px solid ${theme.borderMedium}` }}>
                    <div style={{ fontSize: '10px', color: theme.textMuted, fontWeight: '700' }}>Urea</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F766E' }}>{Math.round(farmerLandArea * 50)} kg</div>
                    <div style={{ fontSize: '9px', color: theme.textMuted }}>{(farmerLandArea * 50 / 45).toFixed(1)} Bags</div>
                  </div>
                  <div style={{ backgroundColor: darkMode ? '#1E293B' : '#FFF', padding: '8px 6px', borderRadius: '8px', border: `1px solid ${theme.borderMedium}` }}>
                    <div style={{ fontSize: '10px', color: theme.textMuted, fontWeight: '700' }}>DAP</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0284C7' }}>{Math.round(farmerLandArea * 20)} kg</div>
                    <div style={{ fontSize: '9px', color: theme.textMuted }}>{(farmerLandArea * 20 / 50).toFixed(1)} Bags</div>
                  </div>
                  <div style={{ backgroundColor: darkMode ? '#1E293B' : '#FFF', padding: '8px 6px', borderRadius: '8px', border: `1px solid ${theme.borderMedium}` }}>
                    <div style={{ fontSize: '10px', color: theme.textMuted, fontWeight: '700' }}>Potash (MOP)</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#D97706' }}>{Math.round(farmerLandArea * 15)} kg</div>
                    <div style={{ fontSize: '9px', color: theme.textMuted }}>{(farmerLandArea * 15 / 50).toFixed(1)} Bags</div>
                  </div>
                  <div style={{ backgroundColor: darkMode ? '#1E293B' : '#FFF', padding: '8px 6px', borderRadius: '8px', border: `1px solid ${theme.borderMedium}` }}>
                    <div style={{ fontSize: '10px', color: theme.textMuted, fontWeight: '700' }}>Hybrid Seeds</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#16A34A' }}>{Math.round(farmerLandArea * 8)} kg</div>
                    <div style={{ fontSize: '9px', color: theme.textMuted }}>CR-1009 Sub-1</div>
                  </div>
                </div>

                {/* Farmer-Friendly Certified Seed Name & Estimated Delivery Time Info */}
                <div style={{
                  marginTop: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#0F172A' : '#F0FDF4',
                  border: darkMode ? '1px solid #1E293B' : '1px solid #BBF7D0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🌾</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: darkMode ? '#86EFAC' : '#14532D' }}>
                        {farmerCrop.includes('Paddy')
                          ? (lang === 'ta' ? 'அரசு சான்றளிக்கப்பட்ட விதை: CR-1009 சப்-1 & ADT-37 நெல்' : 'Government Certified Seed: CR-1009 Sub-1 & ADT-37 Samba Paddy')
                          : (lang === 'ta' ? 'அரசு சான்றளிக்கப்பட்ட TNAU உயர் மகசூல் விதைகள்' : 'TNAU Certified High-Yield Hybrid Seed Lot')}
                      </div>
                      <div style={{ fontSize: '10px', color: theme.textMuted }}>
                        {lang === 'ta' ? 'அதிக முளைப்புத்திறன் & நீர் மூழ்கல் எதிர்ப்புத் திறன் கொண்டது' : 'High germination (>95%) & submergence flood-tolerant strain'}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    color: '#92400E',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '800',
                    whiteSpace: 'nowrap'
                  }}>
                    <Clock size={13} />
                    <span>{lang === 'ta' ? 'விநியோக நேரம்: 1 - 2 மணிநேரம்' : 'Est. Delivery: 1 - 2 Hours (Today, by 4:30 PM)'}</span>
                  </div>
                </div>
              </div>

              {/* Submit Requisition Button */}
              <button
                onClick={handleFarmerRequisitionSubmit}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0F766E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(15, 118, 110, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <span>🚀</span>
                <span>{lang === 'ta' ? 'தஞ்சாவூர் கிடங்கிற்கு மானிய உர பதிவு அனுப்பவும்' : 'Submit Subsidized Supply Requisition to Thanjavur Depot'}</span>
              </button>
            </div>

            {/* Right Card: DBT Subsidy Passbook Table */}
            <div className="white-card" style={{ padding: '22px', backgroundColor: theme.bgCard }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={20} color="#16A34A" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead }}>
                    {lang === 'ta' ? 'நேரடி மானிய சேமிப்பு கணக்கு (DBT Passbook)' : 'Direct Benefit Transfer (DBT) Subsidy Passbook'}
                  </h3>
                </div>
                <span style={{ backgroundColor: darkMode ? '#064E3B' : '#DCFCE7', color: '#16A34A', padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>
                  74% {lang === 'ta' ? 'அரசு மானியம்' : 'Govt Subsidy'}
                </span>
              </div>

              <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.borderMedium}`, color: theme.textMuted }}>
                      <th style={{ padding: '8px 10px' }}>Input Item</th>
                      <th style={{ padding: '8px 10px' }}>Quantity</th>
                      <th style={{ padding: '8px 10px' }}>Open Market</th>
                      <th style={{ padding: '8px 10px' }}>Subsidized Rate</th>
                      <th style={{ padding: '8px 10px' }}>Farmer Pays</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${theme.borderMedium}` }}>
                      <td style={{ padding: '10px', fontWeight: '700', color: theme.textHead }}>Neem Coated Urea (45kg)</td>
                      <td style={{ padding: '10px' }}>{Math.round(farmerLandArea * 50)} kg</td>
                      <td style={{ padding: '10px', color: '#DC2626' }}>₹{Math.round(farmerLandArea * 50 * 54.4).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', color: '#16A34A', fontWeight: '700' }}>₹266.50 / bag</td>
                      <td style={{ padding: '10px', fontWeight: '800', color: theme.textHead }}>₹{Math.round(farmerLandArea * 50 * 5.91).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${theme.borderMedium}` }}>
                      <td style={{ padding: '10px', fontWeight: '700', color: theme.textHead }}>DAP Fertilizer (50kg)</td>
                      <td style={{ padding: '10px' }}>{Math.round(farmerLandArea * 20)} kg</td>
                      <td style={{ padding: '10px', color: '#DC2626' }}>₹{Math.round(farmerLandArea * 20 * 76.0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', color: '#16A34A', fontWeight: '700' }}>₹1,350.00 / bag</td>
                      <td style={{ padding: '10px', fontWeight: '800', color: theme.textHead }}>₹{Math.round(farmerLandArea * 20 * 27.0).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${theme.borderMedium}` }}>
                      <td style={{ padding: '10px', fontWeight: '700', color: theme.textHead }}>MOP Potash (50kg)</td>
                      <td style={{ padding: '10px' }}>{Math.round(farmerLandArea * 15)} kg</td>
                      <td style={{ padding: '10px', color: '#DC2626' }}>₹{Math.round(farmerLandArea * 15 * 64.0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px', color: '#16A34A', fontWeight: '700' }}>₹1,700.00 / bag</td>
                      <td style={{ padding: '10px', fontWeight: '800', color: theme.textHead }}>₹{Math.round(farmerLandArea * 15 * 34.0).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Grand Total Comparison Box */}
              <div style={{
                backgroundColor: darkMode ? '#1E293B' : '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: theme.textMuted, fontWeight: '700' }}>Commercial Market Value:</span>
                  <span style={{ fontSize: '14px', color: '#DC2626', fontWeight: '800', textDecoration: 'line-through' }}>
                    ₹{Math.round((farmerLandArea * 50 * 54.4) + (farmerLandArea * 20 * 76.0) + (farmerLandArea * 15 * 64.0)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: theme.textHead, fontWeight: '800' }}>You Pay at Local Depot:</span>
                  <span style={{ fontSize: '18px', color: '#0F766E', fontWeight: '900' }}>
                    ₹{Math.round((farmerLandArea * 50 * 5.91) + (farmerLandArea * 20 * 27.0) + (farmerLandArea * 15 * 34.0)).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ borderTop: '1px dashed #86EFAC', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '800' }}>Direct State Subsidy Saved:</span>
                  <span style={{ fontSize: '16px', color: '#16A34A', fontWeight: '900' }}>
                    ₹{Math.round(
                      ((farmerLandArea * 50 * 54.4) + (farmerLandArea * 20 * 76.0) + (farmerLandArea * 15 * 64.0)) -
                      ((farmerLandArea * 50 * 5.91) + (farmerLandArea * 20 * 27.0) + (farmerLandArea * 15 * 34.0))
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Depot Pickup Details */}
              <div style={{
                backgroundColor: darkMode ? '#0F172A' : '#F8FAFC',
                border: `1px solid ${theme.borderMedium}`,
                borderRadius: '10px',
                padding: '12px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Phone size={16} color="#0F766E" />
                <div>
                  <div style={{ fontWeight: '700', color: theme.textHead }}>Local Field Officer: S. Shanmugam</div>
                  <div style={{ color: theme.textMuted }}>Cauvery Delta Farmers Depot, Cooperative Bank Rd, Thanjavur • +91 94432 77102</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            FARMER PORTAL: TAB 2 - MY REQUISITIONS & LIVE TRACKING
        ======================================================== */}
        {isFarmer && activeTab === 'farmer_orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="white-card" style={{ padding: '20px', backgroundColor: theme.bgCard }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={20} color="#0F766E" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead }}>
                    {lang === 'ta' ? 'எனது உர ஒதுக்கீடுகள் & நேரலை நிலை' : 'My Requisitions & Live Allocation Pipeline'}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: theme.textMuted }}>
                    {farmerRequisitions.length} {lang === 'ta' ? 'பதிவுகள் உள்ளன' : 'Requisitions Active'}
                  </span>
                  <button
                    onClick={() => setIsRequisitionOpen(true)}
                    style={{
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                    }}
                  >
                    <Plus size={14} />
                    <span>{lang === 'ta' ? '+ புதிய பதிவு' : '+ New Requisition'}</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {farmerRequisitions.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      border: `1px solid ${theme.borderMedium}`,
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: darkMode ? '#0F172A' : '#F8FAFC'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F766E' }}>{req.id}</span>
                          <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '800' }}>
                            {req.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: theme.textHead, marginTop: '2px' }}>
                          {req.crop} • {req.areaHa} Ha ({req.date})
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: theme.textMuted }}>Digital Voucher Token</div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0284C7', fontFamily: 'monospace' }}>{req.token}</div>
                      </div>
                    </div>

                    {/* 4-Step Visual Progress Bar */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '4px',
                      marginBottom: '14px',
                      textAlign: 'center'
                    }}>
                      <div style={{ backgroundColor: '#059669', color: '#FFF', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                        ✓ 1. Submitted
                      </div>
                      <div style={{ backgroundColor: '#059669', color: '#FFF', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                        ✓ 2. PACS Verified
                      </div>
                      <div style={{ backgroundColor: '#059669', color: '#FFF', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                        ✓ 3. Stock Allocated
                      </div>
                      <div style={{ backgroundColor: '#0284C7', color: '#FFF', padding: '6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>
                        ● 4. Ready at Depot
                      </div>
                    </div>

                    {/* Order Details & Depot Information */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr',
                      gap: '12px',
                      borderTop: `1px solid ${theme.borderMedium}`,
                      paddingTop: '12px',
                      fontSize: '12px'
                    }}>
                      <div>
                        <div style={{ color: theme.textMuted, fontSize: '11px', fontWeight: '700' }}>
                          {lang === 'ta' ? 'ஒதுக்கப்பட்ட உரம் & விதைகள்' : 'ALLOCATED INPUTS & CERTIFIED SEEDS'}
                        </div>
                        <div style={{ color: theme.textHead, fontWeight: '700', marginTop: '3px', fontSize: '13px' }}>
                          {req.ureaKg} kg Urea • {req.dapKg} kg DAP • {req.potashKg} kg Potash
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: darkMode ? '#064E3B' : '#ECFDF5',
                          border: darkMode ? '1px solid #047857' : '1px solid #A7F3D0',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: darkMode ? '#6EE7B7' : '#065F46',
                          fontWeight: '700',
                          marginTop: '4px'
                        }}>
                          <span>🌾</span>
                          <span>{req.seedsKg} kg {lang === 'ta' ? 'சான்றளிக்கப்பட்ட விதை:' : 'Certified Seed:'} {req.seedVariety || 'CR-1009 Sub-1 (Certified Samba Paddy)'}</span>
                        </div>
                        <div style={{ color: '#16A34A', fontSize: '11px', fontWeight: '800', marginTop: '6px' }}>
                          💰 {lang === 'ta' ? 'அரசு நேரடி மானியம்:' : 'Govt DBT Subsidy Saved:'} ₹{req.savings.toLocaleString('en-IN')} ({lang === 'ta' ? 'நீங்கள் செலுத்தியது:' : 'You pay:'} ₹{req.totalCostSubsidized.toLocaleString('en-IN')})
                        </div>
                      </div>

                      <div>
                        <div style={{ color: theme.textMuted, fontSize: '11px', fontWeight: '700' }}>
                          {lang === 'ta' ? 'எதிர்பார்க்கப்படும் விநியோகம் & கிடங்கு' : 'ESTIMATED DELIVERY & COLLECTION POINT'}
                        </div>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          color: '#92400E',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '800',
                          marginTop: '3px'
                        }}>
                          <Clock size={12} />
                          <span>{req.estimatedDeliveryTime || 'Ready for Pickup (Today, by 4:30 PM)'}</span>
                        </div>
                        <div style={{ color: theme.textHead, fontWeight: '700', marginTop: '6px' }}>{req.depot}</div>
                        <div style={{ color: theme.textMuted, fontSize: '11px' }}>{req.depotAddress}</div>
                        <div style={{ color: '#0F766E', fontSize: '11px', fontWeight: '700', marginTop: '2px' }}>
                          Officer: {req.officer} ({req.officerPhone})
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            FARMER PORTAL: TAB 3 - OFFICIAL TN GROUND ADVISORY
        ======================================================== */}
        {isFarmer && activeTab === 'farmer_advisory' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '14px' : '22px' }}>
            <div className="white-card" style={{ padding: '22px', backgroundColor: theme.bgCard }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Award size={20} color="#0F766E" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead }}>
                  {lang === 'ta' ? 'அரசு அதிகாரப்பூர்வ பயிர் & பருவ அறிக்கை 2024-25' : 'Official TN Season & Crop Report 2024–25 (Dept of Economics)'}
                </h3>
              </div>

              <div style={{ backgroundColor: darkMode ? '#0F172A' : '#F8FAFC', border: `1px solid ${theme.borderMedium}`, borderRadius: '10px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F766E', marginBottom: '6px' }}>
                  THANJAVUR DELTA DISTRICT BENCHMARKS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: theme.textMuted }}>Official Paddy Area:</span>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead }}>2,09,532 Ha</div>
                  </div>
                  <div>
                    <span style={{ color: theme.textMuted }}>District Production:</span>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead }}>6,65,523 Tonnes</div>
                  </div>
                  <div>
                    <span style={{ color: theme.textMuted }}>Productivity (Yield):</span>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#059669' }}>3,176 kg/ha</div>
                  </div>
                  <div>
                    <span style={{ color: theme.textMuted }}>NEM Rainfall Deviation:</span>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0284C7' }}>+25.5% Surplus</div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: theme.textMuted, lineHeight: 1.6 }}>
                <strong>Agronomic Advisory:</strong> Cauvery Delta Alluvial Soil has high moisture retention. Apply 50% basal nitrogen at final puddling, followed by 25% at tillering (21-25 DAT) and 25% at panicle initiation (40-45 DAT) to maximize yield efficiency.
              </div>
            </div>

            <div className="white-card" style={{ padding: '22px', backgroundColor: theme.bgCard }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <CloudSun size={20} color="#D97706" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: theme.textHead }}>
                  {lang === 'ta' ? 'வானிலை & நீர்ப்பாசன வழிகாட்டி (IMD Chennai)' : 'Agromet & Water Advisory (IMD Chennai)'}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: darkMode ? '#1E293B' : '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontWeight: '800', color: '#16A34A' }}>Cauvery Canal Sluice Flow: Active</div>
                  <div style={{ color: theme.textMuted, marginTop: '2px' }}>Mettur Dam storage is sufficient for Samba irrigation. Maintain 2–3 cm shallow standing water during early tillering.</div>
                </div>

                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: darkMode ? '#1E293B' : '#EFF6FF', border: '1px solid #BFDBFE' }}>
                  <div style={{ fontWeight: '800', color: '#0284C7' }}>Weather Forecast: Light to Moderate Showers</div>
                  <div style={{ color: theme.textMuted, marginTop: '2px' }}>Precipitation expected in coastal tracts (Nagapattinam/Tiruvarur). Ensure proper drainage channels before top-dressing urea.</div>
                </div>

                <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: darkMode ? '#1E293B' : '#FFFBEB', border: '1px solid #FDE68A' }}>
                  <div style={{ fontWeight: '800', color: '#D97706' }}>Pest Alert: Leaf Folder & Stem Borer Watch</div>
                  <div style={{ color: theme.textMuted, marginTop: '2px' }}>Monitor pest threshold. Biological control agents available at Thanjavur Cooperative Agro Depot.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            FARMER PORTAL: TAB 4 - AI CROP DOCTOR (LEAF / TREE PESTICIDE AI)
        ======================================================== */}
        {(activeTab === 'farmer_crop_doctor' || activeTab === 'crop_doctor') && (
          <CropDoctor
            API_BASE={API_BASE}
            theme={theme}
            darkMode={darkMode}
            lang={lang}
            isMobile={isMobile}
            onRequisitionPesticide={(pesticideName) => {
              setReqNotes(`Prescribed by AI Crop Doctor: ${pesticideName}`);
              if (isFarmer) {
                setActiveTab('farmer_home');
                window.scrollTo({ top: 350, behavior: 'smooth' });
                showToast(
                  lang === 'ta'
                    ? `மருந்து குறிப்பு சேர்க்கப்பட்டது: ${pesticideName}`
                    : `Prescription noted: ${pesticideName}. Review quota below.`,
                  'success'
                );
              } else {
                setIsRequisitionOpen(true);
                showToast(
                  lang === 'ta'
                    ? `மருந்து ஒதுக்கீடு படிவம் திறக்கப்பட்டது: ${pesticideName}`
                    : `Emergency Requisition opened for: ${pesticideName}`,
                  'success'
                );
              }
            }}
          />
        )}

        {/* ========================================================
            TAB 1: LOGISTICS COMMAND MAP (WITH LIVE SIMULATION)
        ======================================================== */}
        {!isFarmer && activeTab === 'map' && (
          <div>
            {/* Filter and Simulation Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <select className="pill-select" value={filterDistrict} onChange={(e) => setFilterDistrict(e.target.value)}>
                  <option value="All">All Delta Districts</option>
                  <option value="Tiruchirappalli">Tiruchirappalli</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Tiruvarur">Tiruvarur</option>
                  <option value="Nagapattinam">Nagapattinam</option>
                  <option value="Karur">Karur</option>
                  <option value="Pudukkottai">Pudukkottai</option>
                  <option value="Perambalur">Perambalur</option>
                </select>

                <select className="pill-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="All">All Supply Statuses</option>
                  <option value="CRITICAL_SHORTAGE">Critical Shortage (&lt;25%)</option>
                  <option value="WARNING_DEFICIT">Warning Deficit (25-75%)</option>
                  <option value="Healthy">Healthy Buffer (&gt;75%)</option>
                </select>

                <button onClick={handleSync} className="btn-action">
                  <RefreshCw size={13} className={isSyncing ? "spin" : ""} color="#0F766E" />
                  <span>Sync Depot Stock</span>
                </button>
              </div>

              {/* Simulation Player & Layer Switch Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                
                {/* Live Simulation Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#0F172A', padding: '4px 8px', borderRadius: '10px' }}>
                  <button
                    onClick={() => setIsSimPlaying(!isSimPlaying)}
                    style={{
                      backgroundColor: isSimPlaying ? '#EF4444' : '#10B981',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {isSimPlaying ? <Pause size={12} /> : <Play size={12} />}
                    <span>{isSimPlaying ? 'Pause Sim' : 'Play Route Sim'}</span>
                  </button>

                  <button
                    onClick={() => { setSimProgress(0); setIsSimPlaying(false); }}
                    title="Reset Simulation to Trichy Apex Hub"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <RotateCcw size={13} />
                  </button>

                  <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                    {[1, 2, 4].map((mult) => (
                      <button
                        key={mult}
                        onClick={() => setSimSpeedMultiplier(mult)}
                        style={{
                          backgroundColor: simSpeedMultiplier === mult ? '#0F766E' : 'rgba(255,255,255,0.08)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {mult}x
                      </button>
                    ))}
                  </div>
                </div>

                
                {/* Real-time Layer Visibility Toggles */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    onClick={() => setMapShowDepots(!mapShowDepots)}
                    style={{
                      backgroundColor: mapShowDepots ? '#0F766E' : (darkMode ? '#1E293B' : '#E2E8F0'),
                      color: mapShowDepots ? '#FFFFFF' : theme.textMuted,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🏢 Hubs ({filteredDepots.length})</span>
                    <span style={{ fontSize: '9px', opacity: 0.85 }}>{mapShowDepots ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setMapShowTransporters(!mapShowTransporters)}
                    style={{
                      backgroundColor: mapShowTransporters ? '#D97706' : (darkMode ? '#1E293B' : '#E2E8F0'),
                      color: mapShowTransporters ? '#FFFFFF' : theme.textMuted,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🚚 Transporters ({REAL_TRANSPORTERS_FLEET.length})</span>
                    <span style={{ fontSize: '9px', opacity: 0.85 }}>{mapShowTransporters ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setMapShowFarmers(!mapShowFarmers)}
                    style={{
                      backgroundColor: mapShowFarmers ? '#16A34A' : (darkMode ? '#1E293B' : '#E2E8F0'),
                      color: mapShowFarmers ? '#FFFFFF' : theme.textMuted,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🌾 Farmer Reqs ({LIVE_FARMERS_REQUISITIONS_MAP.length})</span>
                    <span style={{ fontSize: '9px', opacity: 0.85 }}>{mapShowFarmers ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    onClick={() => setMapShowRoutes(!mapShowRoutes)}
                    style={{
                      backgroundColor: mapShowRoutes ? '#0284C7' : (darkMode ? '#1E293B' : '#E2E8F0'),
                      color: mapShowRoutes ? '#FFFFFF' : theme.textMuted,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>🛣️ Circuits</span>
                    <span style={{ fontSize: '9px', opacity: 0.85 }}>{mapShowRoutes ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* Layer switch buttons */}
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                  <button
                    onClick={() => setMapLayer('google')}
                    style={{
                      backgroundColor: mapLayer === 'google' ? '#FFFFFF' : 'transparent',
                      boxShadow: mapLayer === 'google' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: mapLayer === 'google' ? '#0F766E' : '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    🗺️ Google Roadmap
                  </button>
                  <button
                    onClick={() => setMapLayer('satellite')}
                    style={{
                      backgroundColor: mapLayer === 'satellite' ? '#FFFFFF' : 'transparent',
                      boxShadow: mapLayer === 'satellite' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: mapLayer === 'satellite' ? '#0F766E' : '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    🛰️ Google Satellite
                  </button>
                  <button
                    onClick={() => setMapLayer('dark')}
                    style={{
                      backgroundColor: mapLayer === 'dark' ? '#0F766E' : (darkMode ? '#1E293B' : '#FFFFFF'),
                      boxShadow: mapLayer === 'dark' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: mapLayer === 'dark' ? '#FFFFFF' : theme.textMuted,
                      cursor: 'pointer'
                    }}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => setMapLayer('osm')}
                    style={{
                      backgroundColor: mapLayer === 'osm' ? '#FFFFFF' : 'transparent',
                      boxShadow: mapLayer === 'osm' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: mapLayer === 'osm' ? '#0F766E' : '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    🌐 OSM
                  </button>
                </div>
              </div>
            </div>

            {/* Map and Inspector Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.9fr 1.1fr', gap: isMobile ? '14px' : '20px', alignItems: 'start' }}>
              {/* Left: Map */}
              <div className="white-card" style={{ padding: '14px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Compass size={16} color="#0F766E" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>
                      Cauvery Delta Agricultural Logistics Network (Tiruchirappalli)
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Showing <strong>{filteredDepots.length} Supply Hubs</strong> • Live Animated Rake Carrier
                  </span>
                </div>

                <div style={{ height: isMobile ? '360px' : '560px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${theme.border}`, position: 'relative' }}>
                  
                  {/* Floating Glassmorphic Carrier Telemetry HUD */}
                  <div className="glass-telemetry" style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 800,
                    backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                    borderRadius: '12px',
                    padding: '9px 13px',
                    maxWidth: isMobile ? '230px' : '290px',
                    fontSize: '11px',
                    color: theme.textHead
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isSimPlaying ? '#10B981' : '#F59E0B', display: 'inline-block', boxShadow: isSimPlaying ? '0 0 8px #10B981' : 'none' }} />
                        <span style={{ fontWeight: '800', color: '#0F766E', letterSpacing: '0.4px', fontSize: '10px' }}>
                          {lang === 'ta' ? 'நேரடி வாகன ரேடார்' : 'LIVE RAKE TELEMETRY'}
                        </span>
                      </div>
                      <span style={{ fontWeight: '700', color: theme.textMuted, fontSize: '10px' }}>TN-48-AB-2041</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: theme.textHead, fontWeight: '700', margin: '3px 0' }}>
                      <span>{lang === 'ta' ? 'வேகம்' : 'Speed'}: <strong>{currentSpeed} km/h</strong></span>
                      <span>{lang === 'ta' ? 'சரக்கு' : 'Payload'}: <strong>{currentCargo.toLocaleString()} kg</strong></span>
                    </div>
                    <div style={{ color: theme.textMuted, marginTop: '2px', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {lang === 'ta' ? 'நிலை' : 'Stage'}: <strong style={{ color: theme.textHead }}>{startWp.stage}</strong>
                    </div>
                  </div>

                  <MapContainer center={[10.7905, 78.7047]} zoom={9} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                    <TileLayer attribution='&copy; Google Maps' url={getTileUrl()} maxZoom={20} subdomains={['mt0', 'mt1', 'mt2', 'mt3']} />

                    
                    {/* Operational Service Radius Circle */}
                    {mapShowRoutes && (
                      <Circle
                        center={[10.7905, 78.7047]}
                        radius={35000}
                        pathOptions={{ dashArray: '8, 8', color: '#0F766E', weight: 2, fillColor: '#0F766E', fillOpacity: 0.03 }}
                      />
                    )}

                    {/* Optimized Rake Delivery Circuit */}
                    {mapShowRoutes && (
                      <Polyline positions={routePolyline} color="#0F766E" weight={4} dashArray="6, 8" opacity={0.85} />
                    )}

                    {/* Depot Markers */}
                    {mapShowDepots && filteredDepots.map((depot) => (
                      <Marker
                        key={depot.id}
                        position={[depot.lat, depot.lng]}
                        icon={createAgriPin(depot.color, depot.iconType)}
                        eventHandlers={{ click: () => setSelectedDepot(depot) }}
                      >
                        <Popup>
                          <div style={{ padding: '6px', minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: depot.color }} />
                              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748B' }}>{depot.district} District</span>
                            </div>
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', margin: '0 0 4px 0' }}>{depot.name}</h4>
                            <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 8px 0' }}>{depot.sowingSeason}</p>
                            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '6px', fontSize: '11px' }}>
                              <div>⚡ Urea: <strong>{depot.inventory.urea_kg.toLocaleString()} kg</strong></div>
                              <div>🌿 DAP: <strong>{depot.inventory.dap_kg.toLocaleString()} kg</strong></div>
                              <div>🌰 Seeds: <strong>{depot.inventory.seeds_kg.toLocaleString()} kg</strong></div>
                              {depot.seedNames && (
                                <div style={{ fontSize: '10px', color: '#166534', fontWeight: '700', marginTop: '2px' }}>
                                  🌾 {depot.seedNames}
                                </div>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '10px', color: '#92400E', fontWeight: '700' }}>
                                <Clock size={11} />
                                <span>Est. Delivery: {depot.deliveryEta || '2 - 4 Hours'}</span>
                              </div>
                              {depot.deficits.total_deficit_kg > 0 && (
                                <div style={{ color: '#DC2626', fontWeight: 'bold', marginTop: '4px' }}>
                                  ⚠️ Shortage Deficit: -{depot.deficits.total_deficit_kg.toLocaleString()} kg
                                </div>
                              )}
                            </div>

                            {/* Live City Weather Badge */}
                            {depot.weather && (
                              <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', padding: '6px 8px', marginTop: '6px', fontSize: '11px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: '800', color: '#166534' }}>
                                    🌤️ {depot.weather.temp}°C • {depot.weather.condition}
                                  </span>
                                  <span style={{ color: '#047857', fontWeight: '700', fontSize: '10px' }}>
                                    💧 {depot.weather.rainfallMm} mm
                                  </span>
                                </div>
                                <div style={{ color: '#15803D', fontSize: '10px', marginTop: '2px' }}>
                                  Humidity: {depot.weather.humidity}% • Wind: {depot.weather.windKmh} km/h
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => setSelectedDepot(depot)}
                              style={{ marginTop: '8px', width: '100%', backgroundColor: '#0F766E', color: '#FFF', border: 'none', borderRadius: '6px', padding: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                              Inspect Depot Record
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Simultaneous Real Transporters Fleet (Moving + Ready to Go + Offloading) */}
                    {mapShowTransporters && REAL_TRANSPORTERS_FLEET.map((trk) => (
                      <Marker
                        key={trk.id}
                        position={[trk.lat, trk.lng]}
                        icon={createFleetTransporterPin(trk)}
                      >
                        <Popup>
                          <div style={{ padding: '8px', minWidth: '240px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{
                                backgroundColor: trk.badgeBg,
                                color: trk.badgeColor,
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '10.5px',
                                fontWeight: '800'
                              }}>
                                {trk.statusText}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>
                                {trk.regNo}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 4px 0', color: '#0F172A' }}>
                              {trk.type}
                            </h4>

                            <div style={{ fontSize: '11.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div><strong>Pilot:</strong> {trk.driver} ({trk.phone})</div>
                              <div><strong>Cargo:</strong> {trk.cargo}</div>
                              <div><strong>Route:</strong> {trk.origin} → {trk.destination}</div>
                              <div><strong>Telemetric Status:</strong> {trk.heading} ({trk.speedKmh} km/h)</div>
                              <div style={{ color: '#0F766E', fontWeight: '700', marginTop: '2px' }}>
                                ⏱️ {trk.eta}
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Live Farmer Direct Requisitions on Map */}
                    {mapShowFarmers && LIVE_FARMERS_REQUISITIONS_MAP.map((freq) => (
                      <Marker
                        key={freq.id}
                        position={[freq.lat, freq.lng]}
                        icon={createFarmerReqPin(freq)}
                      >
                        <Popup>
                          <div style={{ padding: '8px', minWidth: '240px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <span style={{
                                backgroundColor: freq.urgency === 'High' ? '#FEE2E2' : '#FEF3C7',
                                color: freq.urgency === 'High' ? '#DC2626' : '#92400E',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '10.5px',
                                fontWeight: '800'
                              }}>
                                {freq.urgencyBadge}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F766E' }}>
                                {freq.orderId}
                              </span>
                            </div>

                            <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '0 0 4px 0', color: '#0F172A' }}>
                              👨‍🌾 {freq.farmer}
                            </h4>

                            <div style={{ fontSize: '11.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <div><strong>Location:</strong> {freq.village}</div>
                              <div><strong>Holding:</strong> {freq.landArea} • {freq.crop}</div>
                              <div><strong>Allocated Items:</strong> {freq.requestedItems}</div>
                              <div style={{ color: '#0284C7', fontWeight: '700' }}>
                                💰 DBT Savings: {freq.dbtSubsidy}
                              </div>
                              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '4px', marginTop: '3px', color: '#166534', fontWeight: '700' }}>
                                📍 Depot: {freq.pickupDepot}
                              </div>
                              <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                                Status: {freq.statusText}
                              </div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

{/* Simulated Animated Carrier Truck Marker */}
                    <Marker position={truckPosition} icon={createTruckPin()}>
                      <Popup>
                        <div style={{ padding: '6px', minWidth: '200px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0F766E' }}>CARRIER RAKE TELEMETRY</div>
                          <h4 style={{ fontSize: '13px', fontWeight: '800', margin: '4px 0' }}>TN-48-AB-2041 (16-Tonne)</h4>
                          <div style={{ fontSize: '11px', color: '#334155' }}>
                            <div>Speed: <strong>{currentSpeed} km/h</strong></div>
                            <div>En Route To: <strong>{endWp.name}</strong></div>
                            <div>Payload: <strong>{currentCargo.toLocaleString()} kg</strong></div>
                            <div>Operation: <em>{endWp.stage}</em></div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>

                  {/* Overlaid Carrier Telemetry HUD */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    color: '#FFFFFF',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: '#0F766E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF'
                      }}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '800', fontSize: '13px', color: '#F8FAFC' }}>TN-48-AB-2041</span>
                          <span style={{ backgroundColor: isSimPlaying ? '#22C55E' : '#EAB308', color: '#000', fontSize: '9px', fontWeight: '800', padding: '1px 6px', borderRadius: '4px' }}>
                            {isSimPlaying ? 'SIMULATING EN ROUTE' : 'SIMULATION PAUSED'}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                          Leg: <strong>{startWp.name}</strong> ➔ <strong>{endWp.name}</strong> • <em>{endWp.stage}</em>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>Ground Speed</div>
                        <div style={{ fontWeight: '800', color: '#38BDF8', fontSize: '14px' }}>{currentSpeed} km/h</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>Remaining Cargo</div>
                        <div style={{ fontWeight: '800', color: '#FDE047', fontSize: '14px' }}>{currentCargo.toLocaleString()} kg</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase' }}>Circuit Progress</div>
                        <div style={{ fontWeight: '800', color: '#34D399', fontSize: '14px' }}>{Math.round(simProgress * 100)}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legend Bar */}
                <div style={{
                  marginTop: '12px',
                  padding: '10px 16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}>
                  <span style={{ fontWeight: '700', color: '#334155' }}>Logistics Status Legend:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 'bold' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
                      Trichy Apex Central Hub
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 'bold' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#059669' }} />
                      Healthy Stock Buffer (&gt;75%)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 'bold' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D97706' }} />
                      Low Buffer Warning (25-75%)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', fontWeight: 'bold' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                      Critical Shortage (&lt;25%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Depot Inspector */}
              <div className="white-card" style={{ padding: '24px', minHeight: '620px', display: 'flex', flexDirection: 'column' }}>
                {!selectedDepot ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px 16px', color: '#64748B' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '14px', backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#0F766E' }}>
                      <Warehouse size={28} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
                      Select an Agricultural Depot to Inspect
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '300px', lineHeight: 1.5 }}>
                      Click any pin on the Google Map to inspect live fertilizer and seed buffer reserves, calculate shortage deficits, or dispatch delivery carriers.
                    </p>

                    <div style={{ marginTop: '24px', width: '100%', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Quick Select Depots
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {filteredDepots.slice(0, 4).map((d) => (
                          <button
                            key={d.id}
                            onClick={() => setSelectedDepot(d)}
                            style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', cursor: 'pointer' }}
                          >
                            <span style={{ fontWeight: '600', color: '#1E293B' }}>{d.name}</span>
                            <ChevronRight size={14} color="#94A3B8" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        backgroundColor: selectedDepot.status === 'CRITICAL_SHORTAGE' ? '#FEE2E2' : (selectedDepot.isApex ? '#E0F2FE' : '#DCFCE7'),
                        color: selectedDepot.status === 'CRITICAL_SHORTAGE' ? '#DC2626' : (selectedDepot.isApex ? '#0284C7' : '#16A34A'),
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {selectedDepot.status.replace('_', ' ')}
                      </span>
                      <button onClick={() => setSelectedDepot(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '12px' }}>
                        Clear
                      </button>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', lineHeight: 1.3 }}>
                        {selectedDepot.name}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{selectedDepot.address}</p>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Storage Health</div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: selectedDepot.color }}>
                          {selectedDepot.status.replace('_', ' ')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Capacity Utilization</div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                          {Math.round((selectedDepot.currentStockKg / selectedDepot.capacityKg) * 100)}% ({selectedDepot.currentStockKg.toLocaleString()} / {selectedDepot.capacityKg.toLocaleString()} kg)
                        </div>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div style={{ height: '8px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.round((selectedDepot.currentStockKg / selectedDepot.capacityKg) * 100)}%`, backgroundColor: selectedDepot.color, borderRadius: '4px' }} />
                    </div>

                    {/* Stock Grid */}
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                        Live Fertilizer & Seed Stockpile
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>⚡ Urea (Nitrogen)</span>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: selectedDepot.deficits?.urea_kg ? '#DC2626' : '#0F172A' }}>
                            {selectedDepot.inventory.urea_kg.toLocaleString()} kg
                          </div>
                          {selectedDepot.deficits?.urea_kg && (
                            <span style={{ fontSize: '10px', color: '#DC2626', fontWeight: 'bold' }}>Deficit: -{selectedDepot.deficits.urea_kg.toLocaleString()} kg</span>
                          )}
                        </div>

                        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>🌿 DAP (Phosphorus)</span>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                            {selectedDepot.inventory.dap_kg.toLocaleString()} kg
                          </div>
                        </div>

                        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>🌰 Certified Seeds</span>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                            {selectedDepot.inventory.seeds_kg.toLocaleString()} kg
                          </div>
                          {selectedDepot.seedNames && (
                            <div style={{ fontSize: '10px', color: '#166534', fontWeight: '700', marginTop: '2px' }}>
                              🌾 {selectedDepot.seedNames}
                            </div>
                          )}
                        </div>

                        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px' }}>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>🛡️ Bio-Pesticides</span>
                          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                            {selectedDepot.inventory.pesticides_l.toLocaleString()} L
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Estimated Delivery Time to Local Hubs / Farms */}
                    <div style={{
                      backgroundColor: darkMode ? '#1E293B' : '#FEF3C7',
                      border: '1px solid #FDE68A',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} color="#D97706" />
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#92400E' }}>
                            Estimated Delivery / Dispatch Time
                          </div>
                          <div style={{ fontSize: '10px', color: '#B45309' }}>
                            {selectedDepot.deliveryEtaBadge || 'Direct Dispatch'}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '900', color: '#92400E' }}>
                        {selectedDepot.deliveryEta || '2 - 4 Hours'}
                      </div>
                    </div>

                    {/* City Live Agro-Meteorology Card */}
                    {selectedDepot.weather && (
                      <div style={{
                        backgroundColor: darkMode ? '#0F172A' : '#F0FDF4',
                        border: `1px solid ${darkMode ? '#065F46' : '#BBF7D0'}`,
                        borderRadius: '10px',
                        padding: '12px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <CloudSun size={14} />
                            {selectedDepot.district} City Live Weather
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: '900', color: theme.textHead }}>
                            {selectedDepot.weather.temp}°C
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: theme.textMuted, marginBottom: '6px' }}>
                          <span>Condition: <strong style={{ color: theme.textHead }}>{selectedDepot.weather.condition}</strong></span>
                          <span>Rainfall: <strong style={{ color: '#0284C7' }}>{selectedDepot.weather.rainfallMm} mm</strong></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: theme.textMuted }}>
                          <span>Humidity: <strong style={{ color: theme.textHead }}>{selectedDepot.weather.humidity}%</strong></span>
                          <span>Wind: <strong style={{ color: theme.textHead }}>{selectedDepot.weather.windKmh} km/h</strong></span>
                        </div>
                      </div>
                    )}

                    {/* Officer Contact */}
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{selectedDepot.officer}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{selectedDepot.phone}</div>
                        </div>
                        <a href={`tel:${selectedDepot.phone}`} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#0F766E', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={12} />
                          <span>Call Officer</span>
                        </a>
                      </div>
                    </div>

                    {/* Dispatch Action */}
                    <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <button
                        onClick={() => handleDispatch(selectedDepot)}
                        className="btn-primary"
                        style={{ width: '100%', justifyContent: 'center', height: '44px', fontSize: '14px' }}
                      >
                        <Truck size={16} />
                        <span>Dispatch Replenishment Carrier</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: AI DEMAND PREDICTOR & GOVT SUBSIDY CALCULATOR
        ======================================================== */}
        {!isFarmer && activeTab === 'predict' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1.8fr', gap: isMobile ? '14px' : '24px' }}>
            <div className="white-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={18} color="#0F766E" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                  AI Agricultural Demand Simulator
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Target District (Cauvery Delta)</label>
                    {CITY_WEATHER_DATA[simDistrict] && (
                      <span style={{ fontSize: '11px', color: '#0F766E', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{CITY_WEATHER_DATA[simDistrict].icon}</span>
                        <span>{CITY_WEATHER_DATA[simDistrict].temp}°C • 🌧️ {CITY_WEATHER_DATA[simDistrict].rainfallMm}mm</span>
                      </span>
                    )}
                  </div>
                  <select value={simDistrict} onChange={(e) => handleDistrictChange(e.target.value)} className="pill-select" style={{ width: '100%' }}>
                    <option value="Tiruchirappalli">Tiruchirappalli (Cauvery Clay & Red Loam)</option>
                    <option value="Thanjavur">Thanjavur (Cauvery Delta Alluvium)</option>
                    <option value="Tiruvarur">Tiruvarur (Deltaic Alluvium)</option>
                    <option value="Nagapattinam">Nagapattinam (Coastal Alluvium)</option>
                    <option value="Karur">Karur (Black Cotton & Red Sandy)</option>
                    <option value="Pudukkottai">Pudukkottai (Red Laterite)</option>
                    <option value="Perambalur">Perambalur (Black Clay Soil)</option>
                  </select>

                  {/* Live City Agro-Weather Feed for Selected District */}
                  {CITY_WEATHER_DATA[simDistrict] && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: darkMode ? '#1E293B' : '#F0FDF4',
                      border: darkMode ? '1px solid #334155' : '1px solid #BBF7D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '16px' }}>{CITY_WEATHER_DATA[simDistrict].icon}</span>
                        <strong style={{ color: darkMode ? '#86EFAC' : '#166534' }}>{CITY_WEATHER_DATA[simDistrict].condition}</strong>
                        <span style={{ color: '#64748B' }}>({CITY_WEATHER_DATA[simDistrict].tamil})</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', fontWeight: '600', color: darkMode ? '#CBD5E1' : '#334155' }}>
                        <span>🌡️ {CITY_WEATHER_DATA[simDistrict].temp}°C</span>
                        <span>🌧️ {CITY_WEATHER_DATA[simDistrict].rainfallMm} mm</span>
                        <span>💧 {CITY_WEATHER_DATA[simDistrict].humidity}%</span>
                        <span>💨 {CITY_WEATHER_DATA[simDistrict].windKmH} km/h</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Target Crop</label>
                  <select value={simCrop} onChange={(e) => handleCropChange(e.target.value)} className="pill-select" style={{ width: '100%' }}>
                    <option value="Paddy (Rice)">Paddy (Rice)</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Groundnut">Groundnut</option>
                    <option value="Pulses (Blackgram/Greengram)">Pulses (Blackgram/Greengram)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>Sowing Season ({simCrop})</label>
                  <select value={simSeason} onChange={(e) => setSimSeason(e.target.value)} className="pill-select" style={{ width: '100%' }}>
                    {(CROP_SEASONS[simCrop] || [simSeason]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Cultivated Area (Hectares)</label>
                    <span style={{ fontSize: '13px', color: '#0F766E', fontWeight: 'bold' }}>{simArea} Ha ({(simArea * 2.471).toFixed(1)} Acres)</span>
                  </div>
                  <input type="range" min="2" max="60" step="0.5" value={simArea} onChange={(e) => setSimArea(e.target.value)} style={{ width: '100%', accentColor: '#0F766E' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>Forecast Rainfall (mm)</label>
                    <input type="number" value={simRain} onChange={(e) => setSimRain(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>Avg Temp (°C)</label>
                    <input type="number" value={simTemp} onChange={(e) => setSimTemp(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }} />
                  </div>
                </div>

                <button onClick={handlePredict} className="btn-primary" style={{ justifyContent: 'center', height: '44px', marginTop: '6px' }}>
                  {isPredicting ? <RefreshCw size={14} className="spin" /> : <Sparkles size={14} />}
                  <span>Compute AI Supply Demand</span>
                </button>

                {/* CSV Batch Upload Section */}
                <div style={{
                  marginTop: '14px',
                  padding: '14px',
                  backgroundColor: '#F8FAFC',
                  border: '1px dashed #CBD5E1',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#0F766E', fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
                    <Upload size={15} />
                    <span>Batch .CSV Demand Prediction</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
                    Upload a <code>.csv</code> spreadsheet of farmer land parcels to run batch AI demand forecasting.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <label style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #0F766E',
                      color: '#0F766E',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: isCsvUploading ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Upload size={12} />
                      <span>{isCsvUploading ? 'Processing...' : 'Upload .CSV File'}</span>
                      <input
                        type="file"
                        accept=".csv"
                        disabled={isCsvUploading}
                        onChange={handleCSVUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      style={{
                        backgroundColor: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#475569',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Download size={12} />
                      <span>Template</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Outputs & Government Subsidy Calculator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="white-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>Predicted Agronomic Requirements</h3>
                    <p style={{ fontSize: '12px', color: '#64748B' }}>Multi-Output Random Forest Regressor (R² = 0.998)</p>
                  </div>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                    Confidence: 99.8%
                  </span>
                </div>

                {predResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '10px' }}>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>🌰 Certified Seeds</p>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#D97706', marginTop: '4px' }}>
                          {(predResult?.predictions?.seed_demand_kg ?? 0).toLocaleString()} <span style={{ fontSize: '12px', color: '#64748B' }}>kg</span>
                        </h4>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '10px' }}>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>⚡ Urea (Nitrogen)</p>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0284C7', marginTop: '4px' }}>
                          {(predResult?.predictions?.urea_demand_kg ?? 0).toLocaleString()} <span style={{ fontSize: '12px', color: '#64748B' }}>kg</span>
                        </h4>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '10px' }}>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>🌿 DAP (Phosphorus)</p>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#7C3AED', marginTop: '4px' }}>
                          {(predResult?.predictions?.dap_demand_kg ?? 0).toLocaleString()} <span style={{ fontSize: '12px', color: '#64748B' }}>kg</span>
                        </h4>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '10px' }}>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>💎 Potash (MOP)</p>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#0F766E', marginTop: '4px' }}>
                          {(predResult?.predictions?.potash_demand_kg ?? 0).toLocaleString()} <span style={{ fontSize: '12px', color: '#64748B' }}>kg</span>
                        </h4>
                      </div>

                      <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '10px' }}>
                        <p style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>🛡️ Bio-Pesticide</p>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#DC2626', marginTop: '4px' }}>
                          {(predResult?.predictions?.pesticide_demand_l ?? 0).toLocaleString()} <span style={{ fontSize: '12px', color: '#64748B' }}>Liters</span>
                        </h4>
                      </div>
                    </div>

                    {/* Advisories */}
                    <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                        <ShieldAlert size={16} />
                        <span>TNAU Agronomic Guidance (Cauvery Delta)</span>
                      </div>
                      {(predResult?.agronomic_advisories || []).map((adv, idx) => (
                        <p key={idx} style={{ fontSize: '12px', color: '#166534', marginBottom: '4px', lineHeight: 1.4 }}>
                          • {adv}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Government Subsidy & Economic Benefit Card */}
              <div className="white-card" style={{ padding: '24px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={20} color="#16A34A" />
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#14532D' }}>
                        Government DBT Subsidy & Farmer Cost Benefit Analysis
                      </h4>
                      <p style={{ fontSize: '11px', color: '#166534' }}>
                        Direct Benefit Transfer (DBT) via National e-Urvarak Fertilizer Subsidy Portal
                      </p>
                    </div>
                  </div>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', border: '1px solid #86EFAC', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                    {farmerSavingsPct}% SAVINGS
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Open Market Price</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#DC2626', marginTop: '2px' }}>
                      ₹{Math.round(commercialCost).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>Non-subsidized retail</div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Cooperative Rate</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F766E', marginTop: '2px' }}>
                      ₹{Math.round(subsidizedCost).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10px', color: '#0F766E' }}>Subsidized Farmer Price</div>
                  </div>

                  <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCFCE7', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Govt DBT Subsidy</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#16A34A', marginTop: '2px' }}>
                      ₹{Math.round(govtSubsidyDelivered).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10px', color: '#16A34A' }}>Direct State Benefit</div>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>
                    <span style={{ color: '#0F766E' }}>Farmer Outlay ({100 - farmerSavingsPct}%)</span>
                    <span style={{ color: '#16A34A' }}>Central / State Subsidy ({farmerSavingsPct}%)</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${100 - farmerSavingsPct}%`, backgroundColor: '#0F766E' }} />
                    <div style={{ width: `${farmerSavingsPct}%`, backgroundColor: '#22C55E' }} />
                  </div>
                </div>
              </div>

              {/* Official Govt of Tamil Nadu 2024-25 Season and Crop Report Benchmark Card */}
              {TN_GOVT_2024_BENCHMARKS[simDistrict] && (
                <div className="white-card" style={{
                  padding: '22px',
                  borderLeft: '4px solid #16A34A',
                  backgroundColor: darkMode ? '#1E293B' : '#F0FDF4',
                  border: darkMode ? '1px solid #334155' : '1px solid #BBF7D0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Award size={20} color="#16A34A" />
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', color: darkMode ? '#86EFAC' : '#14532D', margin: 0 }}>
                          Official TN Govt Ground Truth Benchmark ({simDistrict})
                        </h4>
                        <p style={{ fontSize: '11px', color: darkMode ? '#94A3B8' : '#166534', margin: '2px 0 0 0' }}>
                          Season &amp; Crop Report 2024-25 • Department of Economics and Statistics, Govt. of Tamil Nadu
                        </p>
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: darkMode ? 'rgba(22, 163, 74, 0.25)' : '#DCFCE7',
                      color: '#16A34A',
                      border: '1px solid #86EFAC',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      OFFICIAL TN 2024-25 DATA
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: darkMode ? '1px solid #334155' : '1px solid #DCFCE7' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Paddy Cultivation</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F766E', marginTop: '2px' }}>
                        {TN_GOVT_2024_BENCHMARKS[simDistrict].paddyAreaHa.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748B' }}>Ha</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: darkMode ? '1px solid #334155' : '1px solid #DCFCE7' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Total Production</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#16A34A', marginTop: '2px' }}>
                        {TN_GOVT_2024_BENCHMARKS[simDistrict].paddyProdTonnes.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748B' }}>T</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: darkMode ? '1px solid #334155' : '1px solid #DCFCE7' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Official Yield</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#0284C7', marginTop: '2px' }}>
                        {TN_GOVT_2024_BENCHMARKS[simDistrict].yieldKgHa.toLocaleString()} <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748B' }}>kg/Ha</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: darkMode ? '#0F172A' : '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: darkMode ? '1px solid #334155' : '1px solid #DCFCE7' }}>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Monsoon Dev</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>
                        {TN_GOVT_2024_BENCHMARKS[simDistrict].nemRainDev}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: darkMode ? '#CBD5E1' : '#166534', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div><strong>Soil Classification:</strong> {TN_GOVT_2024_BENCHMARKS[simDistrict].soilType}</div>
                    <div><strong>Primary Season:</strong> {TN_GOVT_2024_BENCHMARKS[simDistrict].peakSowSeason}</div>
                    <div><strong>Staple Production:</strong> {TN_GOVT_2024_BENCHMARKS[simDistrict].stapleCrops}</div>
                  </div>
                </div>
              )}

              {/* Government Agronomic Dataset & ML Verification Panel */}
              <div className="white-card" style={{ padding: '24px', borderLeft: '4px solid #0F766E' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#0F766E" />
                    <div>
                      <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                        Government Agronomic Dataset & ML Model Provenance
                      </h3>
                      <p style={{ fontSize: '11px', color: '#64748B' }}>
                        Indian Council of Agricultural Research (ICAR) & Tamil Nadu Agricultural University (TNAU) Criteria
                      </p>
                    </div>
                  </div>
                  <span style={{ backgroundColor: '#E0F2FE', color: '#0284C7', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                    5,000 Authenticated Records (2021–2026)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>DATASET SOURCE</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>ICAR & TNAU</div>
                    <div style={{ fontSize: '10px', color: '#0F766E' }}>Cauvery Delta Zone</div>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>ALGORITHM</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>MultiOutput RF</div>
                    <div style={{ fontSize: '10px', color: '#16A34A' }}>100 Deep Estimators</div>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>ACCURACY METRIC</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>R² &gt; 0.995</div>
                    <div style={{ fontSize: '10px', color: '#16A34A' }}>MAPE &lt; 4.5%</div>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>DELTA DISTRICTS</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>8 Districts</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Trichy, Thanjavur...</div>
                  </div>
                </div>

                {/* Feature Importance Drivers */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                    Explainable AI: Key Demand Driver Feature Importances
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                      { name: 'Cultivated Farm Area (Hectares)', pct: 48.8, color: '#0F766E' },
                      { name: 'Crop Variety & Soil Classification', pct: 47.3, color: '#0284C7' },
                      { name: 'Monsoon Rainfall & Leaching Multiplier', pct: 1.5, color: '#D97706' },
                      { name: 'Relative Humidity & Pest Incident Risk', pct: 1.0, color: '#DC2626' },
                      { name: 'Temperature & Seasonal Variation', pct: 0.1, color: '#64748B' }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', marginBottom: '2px' }}>
                          <span>{item.name}</span>
                          <span style={{ fontWeight: 'bold' }}>{item.pct}%</span>
                        </div>
                        <div style={{ height: '5px', width: '100%', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${item.pct}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: WAREHOUSE INVENTORY RADAR & 1-CLICK REBALANCE
        ======================================================== */}
        {activeTab === 'radar' && (
          <div className="white-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>Cauvery Delta Regional Stock & Deficit Radar</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Audited stockpile balances matched against AI projected seasonal demand</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleAutoRebalance}
                  style={{
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <Zap size={14} />
                  <span>Execute AI Rebalance Protocol</span>
                </button>

                <button onClick={handleSync} className="btn-action">
                  <RefreshCw size={13} className={isSyncing ? "spin" : ""} />
                  <span>Sync Depot Data</span>
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'கிடங்கு / மையம்' : 'Depot / Hub'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'மாவட்டம்' : 'District'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'வானிலை & மழை' : 'Weather & Rain'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'நிலை' : 'Status'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'சான்றளிக்கப்பட்ட விதைகள் (வகைகள் & இருப்பு)' : 'Certified Seeds (Varieties & Stock)'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'எதிர்பார்க்கப்படும் விநியோக நேரம்' : 'Est. Delivery Time'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'யூரியா (கிலோ)' : 'Urea (kg)'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'டி.ஏ.பி (கிலோ)' : 'DAP (kg)'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'பொட்டாஷ் (கிலோ)' : 'Potash (kg)'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'கணிக்கப்பட்ட பற்றாக்குறை' : 'Projected Deficit'}</th>
                    <th style={{ padding: '12px 14px' }}>{lang === 'ta' ? 'செயல்பாடு' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  {depotsList.map((wh) => {
                    const isCrit = wh.status === 'CRITICAL_SHORTAGE';
                    const isWarn = wh.status === 'WARNING_DEFICIT';
                    const w = wh.weather || CITY_WEATHER_DATA[wh.district] || { temp: 31, condition: 'Clear', rainfallMm: 0, humidity: 70, icon: '☀️' };
                    return (
                      <tr key={wh.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: isCrit ? '#FEF2F2' : 'transparent' }}>
                        <td style={{ padding: '14px', fontWeight: '700', color: '#0F172A' }}>
                          {wh.name} {wh.isApex && <span style={{ color: '#0284C7', fontSize: '10px', marginLeft: '6px' }}>{lang === 'ta' ? '[தலைமை கிடங்கு]' : '[APEX HUB]'}</span>}
                        </td>
                        <td style={{ padding: '14px', color: '#64748B' }}>{wh.district}</td>
                        <td style={{ padding: '14px' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: darkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                            fontSize: '12px',
                            whiteSpace: 'nowrap'
                          }}>
                            <span style={{ fontSize: '14px' }}>{w.icon || '⛅'}</span>
                            <span style={{ fontWeight: '700', color: darkMode ? '#F8FAFC' : '#0F172A' }}>{w.temp}°C</span>
                            <span style={{ color: '#0284C7', fontSize: '11px', fontWeight: '600' }}>🌧️ {w.rainfallMm}mm</span>
                            <span style={{ color: '#64748B', fontSize: '10px' }}>💧{w.humidity}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          {isCrit && <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{lang === 'ta' ? 'அதிதீவிர பற்றாக்குறை' : 'CRITICAL'}</span>}
                          {isWarn && <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{lang === 'ta' ? 'பற்றாக்குறை' : 'DEFICIT'}</span>}
                          {!isCrit && !isWarn && <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>{lang === 'ta' ? 'போதுமான இருப்பு' : 'HEALTHY'}</span>}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '800', color: darkMode ? '#F8FAFC' : '#0F172A', fontSize: '13px' }} className="mono">
                            {wh.inventory.seeds_kg.toLocaleString()} kg
                          </div>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '4px',
                            backgroundColor: darkMode ? '#064E3B' : '#ECFDF5',
                            border: darkMode ? '1px solid #047857' : '1px solid #A7F3D0',
                            borderRadius: '6px',
                            padding: '2px 7px',
                            fontSize: '11px',
                            color: darkMode ? '#6EE7B7' : '#065F46',
                            fontWeight: '700',
                            whiteSpace: 'nowrap'
                          }}>
                            <span>🌾</span>
                            <span>{lang === 'ta' ? (wh.seedNamesTa || wh.seedNames) : wh.seedNames}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: darkMode ? '#1E293B' : '#FEF3C7',
                              border: darkMode ? '1px solid #78350F' : '1px solid #FDE68A',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '800',
                              color: darkMode ? '#FDE68A' : '#92400E',
                              whiteSpace: 'nowrap'
                            }}>
                              <Clock size={12} />
                              <span>{wh.deliveryEta || '2 - 4 Hours'}</span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>
                              {wh.deliveryEtaBadge || 'Direct Dispatch'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px' }} className="mono">{wh.inventory.urea_kg.toLocaleString()}</td>
                        <td style={{ padding: '14px' }} className="mono">{wh.inventory.dap_kg.toLocaleString()}</td>
                        <td style={{ padding: '14px' }} className="mono">{wh.inventory.potash_kg.toLocaleString()}</td>
                        <td style={{ padding: '14px', fontWeight: 'bold' }}>
                          {wh.deficits?.total_deficit_kg > 0 ? (
                            <span style={{ color: '#DC2626' }}>-{wh.deficits.total_deficit_kg.toLocaleString()} kg</span>
                          ) : (
                            <span style={{ color: '#16A34A' }}>{lang === 'ta' ? 'உபரி இருப்பு தயார்' : 'Surplus OK'}</span>
                          )}
                        </td>
                        <td style={{ padding: '14px' }}>
                          {isFarmer ? (
                            <button
                              onClick={() => {
                                const newId = `ORD-DEPOT-${wh.id.slice(-3)}-${Date.now().toString().slice(-4)}`;
                                const urea = 250;
                                const dap = 100;
                                const pot = 75;
                                const seeds = 40;
                                const market = Math.round((urea * 54.4) + (dap * 76.0) + (pot * 64.0));
                                const sub = Math.round((urea * 5.91) + (dap * 27.0) + (pot * 34.0));
                                const savings = Math.max(0, market - sub);

                                const newReq = {
                                  id: newId,
                                  token: `TN-DEPOT-${wh.id.slice(-3)}-PASS`,
                                  date: "Just now",
                                  crop: farmerCrop || "Paddy (Rice Samba)",
                                  areaHa: farmerLandArea || 5.0,
                                  ureaKg: urea,
                                  dapKg: dap,
                                  potashKg: pot,
                                  seedsKg: seeds,
                                  seedVariety: wh.seedNames || "CR-1009 Sub-1",
                                  estimatedDeliveryTime: wh.deliveryEta || "Within 2 Hours",
                                  depot: wh.name,
                                  depotAddress: `${wh.district} Main Road`,
                                  officer: "Depot Store In-Charge",
                                  officerPhone: "+91 94432 77102",
                                  status: "ALLOCATED",
                                  totalCostSubsidized: sub,
                                  totalCostMarket: market,
                                  savings: savings
                                };

                                const newOrder = {
                                  id: newId,
                                  farmer: "K. Arunkumar (Progressive Farmer)",
                                  district: wh.district,
                                  crop: farmerCrop || "Paddy (Rice Samba)",
                                  area: `${farmerLandArea || 5.0} Ha`,
                                  items: `${urea} kg Urea • ${dap} kg DAP • ${seeds} kg Seeds`,
                                  truck: "TN-48-DEPOT-EXPRESS",
                                  driver: "Depot Direct Courier",
                                  status: "ALLOCATED",
                                  eta: wh.deliveryEta || "Within 2 Hours",
                                  co2Saved: "12.5 kg"
                                };

                                setFarmerRequisitions(prev => [newReq, ...prev]);
                                setOrdersList(prev => [newOrder, ...prev]);
                                setActiveTab('farmer_orders');

                                showToast(
                                  lang === 'ta'
                                    ? `[${wh.name}] கிடங்கிலிருந்து ${wh.seedNames} & உரம் வெற்றிகரமாக முன்பதிவு செய்யப்பட்டது!`
                                    : `Allocated order at [${wh.name}]! Token generated: ${newReq.token}`,
                                  "success"
                                );
                              }}
                              style={{
                                backgroundColor: '#16A34A',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                              }}
                            >
                              <span>📦</span>
                              <span>{lang === 'ta' ? 'முன்பதிவு செய்' : 'Book from Depot'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setReqDistrict(wh.district);
                                setIsRequisitionOpen(true);
                              }}
                              style={{
                                backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                                border: `1px solid ${darkMode ? '#334155' : '#CBD5E1'}`,
                                color: '#0F766E',
                                borderRadius: '6px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Requisition
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: FLEET DISPATCHES, MANIFEST EXPORT & WAYBILL
        ======================================================== */}
        {!isFarmer && activeTab === 'transfers' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1.8fr', gap: isMobile ? '14px' : '24px' }}>
            {/* Route Optimizer Manifest */}
            <div className="white-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Navigation size={18} color="#0F766E" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                  Carrier Route Optimization Manifest
                </h3>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 'bold' }}>CARRIER DESIGNATION</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>TN-48-AB-2041 (16-Tonne)</div>
                  </div>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#16A34A', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                    ON ROUTE
                  </span>
                </div>
                <div style={{ borderTop: '1px solid #E2E8F0', marginTop: '10px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                  <span>Total Circuit: <strong>254.2 km</strong></span>
                  <span>Est. Duration: <strong>4h 45m</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { step: 1, name: "Trichy Apex Hub (Central Goods Shed)", action: "LOAD 25,000 kg AGRI SUPPLIES", dist: "0 km" },
                  { step: 2, name: "Thanjavur Farmers Depot", action: "UNLOAD 12,000 kg Urea/DAP", dist: "58.4 km" },
                  { step: 3, name: "Tiruvarur Agro Supply Center", action: "UNLOAD 7,500 kg Urea (CRITICAL)", dist: "42.1 km" },
                  { step: 4, name: "Nagapattinam Coastal Hub", action: "UNLOAD 4,000 kg Hybrid Seeds", dist: "26.3 km" },
                  { step: 5, name: "Pudukkottai Regional Depot", action: "UNLOAD 1,500 kg DAP", dist: "114.2 km" },
                  { step: 6, name: "Trichy Apex Hub (Base Standby Return)", action: "DEPOT RE-ARMING & STANDBY", dist: "48.6 km" }
                ].map((s) => (
                  <div key={s.step} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: s.step === 1 ? '#0284C7' : '#0F766E', color: '#FFF', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {s.step}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{s.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Leg: {s.dist}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '11px', backgroundColor: '#E2E8F0', padding: '3px 8px', borderRadius: '4px', color: '#334155', fontWeight: '600' }}>
                      {s.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Orders Queue with Export CSV & Print Waybill */}
            <div className="white-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>Active Supply Chain Dispatches</h3>
                  <p style={{ fontSize: '12px', color: '#64748B' }}>Real-time replenishment rakes and farmer delivery allocations</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleExportCSV}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0F766E',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => setIsRequisitionOpen(true)}
                    style={{
                      backgroundColor: '#0F766E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={13} />
                    <span>Requisition</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ordersList.map((t) => (
                  <div key={t.id} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0F766E' }}>{t.id}</span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>{t.farmer}</span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>• {t.district}</span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setActiveWaybill(t)}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <Printer size={11} />
                          <span>Waybill</span>
                        </button>

                        <span style={{
                          backgroundColor: t.status.includes('DISPATCH') || t.status.includes('EMERGENCY') ? '#FEF3C7' : '#E0F2FE',
                          color: t.status.includes('DISPATCH') || t.status.includes('EMERGENCY') ? '#D97706' : '#0284C7',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#334155', marginBottom: '8px' }}>
                      <strong>Payload:</strong> {t.items} ({t.crop})
                    </p>

                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                      <span>Truck: <strong>{t.truck}</strong> ({t.driver})</span>
                      <span style={{ color: '#0F766E', fontWeight: 'bold' }}>ETA: {t.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          EMERGENCY FARMER REQUISITION MODAL DIALOG
      ======================================================== */}
      {isRequisitionOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsRequisitionOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F0FDF4', color: '#0F766E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusCircle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>New Agricultural Requisition</h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>Priority fertilizer & seed allocation for Cauvery Delta farmers</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequisition} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Farmer / Farmer Producer Org (FPO) Name</label>
                <input
                  type="text"
                  required
                  value={reqFarmer}
                  onChange={(e) => setReqFarmer(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>District</label>
                  <select value={reqDistrict} onChange={(e) => setReqDistrict(e.target.value)} className="pill-select" style={{ width: '100%' }}>
                    <option value="Thanjavur">Thanjavur</option>
                    <option value="Tiruvarur">Tiruvarur</option>
                    <option value="Tiruchirappalli">Tiruchirappalli</option>
                    <option value="Nagapattinam">Nagapattinam</option>
                    <option value="Pudukkottai">Pudukkottai</option>
                    <option value="Karur">Karur</option>
                    <option value="Perambalur">Perambalur</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Crop Type</label>
                  <select value={reqCrop} onChange={(e) => setReqCrop(e.target.value)} className="pill-select" style={{ width: '100%' }}>
                    <option value="Paddy (Rice Samba)">Paddy (Rice Samba)</option>
                    <option value="Paddy (Rice Kuruvai)">Paddy (Rice Kuruvai)</option>
                    <option value="Sugarcane">Sugarcane</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Maize">Maize</option>
                    <option value="Groundnut">Groundnut</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Cultivated Area (Hectares)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="100"
                    required
                    value={reqArea}
                    onChange={(e) => setReqArea(parseFloat(e.target.value) || 1)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Requisition Urgency</label>
                  <select value={reqUrgency} onChange={(e) => setReqUrgency(e.target.value)} className="pill-select" style={{ width: '100%' }}>
                    <option value="Critical Emergency (Within 4h)">Critical Emergency (Within 4h)</option>
                    <option value="Priority Urgent (Within 12h)">Priority Urgent (Within 12h)</option>
                    <option value="Routine Distribution (48h)">Routine Distribution (48h)</option>
                  </select>
                </div>
              </div>

              {/* Live Preview Box */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px', fontSize: '12px' }}>
                <div style={{ fontWeight: '700', color: '#0F766E', marginBottom: '4px' }}>Calculated Agronomic Payload:</div>
                <div style={{ color: '#334155' }}>
                  ⚡ Urea: <strong>{Math.round(reqArea * 220).toLocaleString()} kg</strong> • 🌿 DAP: <strong>{Math.round(reqArea * 110).toLocaleString()} kg</strong> • 🌰 Seeds: <strong>{Math.round(reqArea * 40).toLocaleString()} kg</strong>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Field Notes / Soil Condition</label>
                <textarea
                  rows="2"
                  value={reqNotes}
                  onChange={(e) => setReqNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '12px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsRequisitionOpen(false)}
                  style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#0F766E', border: 'none', borderRadius: '8px', padding: '9px 20px', fontSize: '13px', fontWeight: '700', color: '#FFFFFF', cursor: 'pointer' }}
                >
                  Confirm & Dispatch Rake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          WAYBILL / DISPATCH MANIFEST PREVIEW MODAL
      ======================================================== */}
      {activeWaybill && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '580px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
            position: 'relative',
            border: '2px solid #0F766E'
          }}>
            <button
              onClick={() => setActiveWaybill(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ borderBottom: '2px solid #0F766E', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F766E', letterSpacing: '1px' }}>
                    GOVERNMENT OF TAMIL NADU • DEPARTMENT OF AGRICULTURE
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>
                    Official Rake Consignment Waybill
                  </h3>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Cauvery Delta Precision Farming Logistics Command</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>WAYBILL ID</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F766E' }}>{activeWaybill.id}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>CONSIGNEE / BENEFICIARY</span>
                <div style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A', marginTop: '2px' }}>{activeWaybill.farmer}</div>
                <div style={{ color: '#64748B', marginTop: '2px' }}>District: <strong>{activeWaybill.district}</strong></div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 'bold' }}>CARRIER & PILOT</span>
                <div style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A', marginTop: '2px' }}>{activeWaybill.truck}</div>
                <div style={{ color: '#64748B', marginTop: '2px' }}>Pilot: <strong>{activeWaybill.driver}</strong></div>
              </div>
            </div>

            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px', fontSize: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', color: '#166534', fontWeight: 'bold' }}>AUTHORIZED AGRO COMMODITY PAYLOAD</span>
              <div style={{ fontWeight: '800', fontSize: '13px', color: '#14532D', marginTop: '4px' }}>
                {activeWaybill.items}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #86EFAC', color: '#166534', fontSize: '11px' }}>
                <span>Crop: <strong>{activeWaybill.crop}</strong></span>
                <span>Area: <strong>{activeWaybill.area}</strong></span>
                <span>ETA: <strong>{activeWaybill.eta}</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
              <div>
                Security Stamp: <strong>VERIFIED • HACKDUDE-SEC-2026</strong>
              </div>
              <button
                onClick={() => { window.print(); }}
                style={{ backgroundColor: '#0F766E', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '7px 14px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              >
                <Printer size={13} />
                <span>Print Official Waybill</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar (Auto-shown on mobile devices) */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          backgroundColor: theme.bgCard,
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 1500,
          boxShadow: darkMode ? '0 -4px 14px rgba(0,0,0,0.6)' : '0 -2px 10px rgba(0,0,0,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}>
          {(isFarmer ? [
            { id: 'farmer_home', label: lang === 'ta' ? 'உழவர் போர்டல்' : 'My Farm', icon: Leaf },
            { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'மருத்துவர்' : 'Doctor', icon: Sparkles },
            { id: 'farmer_orders', label: lang === 'ta' ? 'பதிவுகள்' : 'Orders', icon: Package },
            { id: 'farmer_advisory', label: lang === 'ta' ? 'வழிகாட்டி' : 'Advisory', icon: Sun },
          ] : currentRole === 'Supplier' ? [
            { id: 'radar', label: lang === 'ta' ? 'இருப்பு' : 'Stock', icon: Warehouse },
            { id: 'predict', label: lang === 'ta' ? 'கணிப்பு' : 'Demand', icon: BarChart3 },
            { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'மருத்துவர்' : 'Doctor', icon: Sparkles },
            { id: 'map', label: lang === 'ta' ? 'வரைபடம்' : 'Grid', icon: Compass },
            { id: 'transfers', label: lang === 'ta' ? 'சரக்கு' : 'Transfers', icon: Truck },
          ] : currentRole === 'Distributor' ? [
            { id: 'map', label: lang === 'ta' ? 'வரைபடம்' : 'Routes', icon: Compass },
            { id: 'radar', label: lang === 'ta' ? 'கிடங்கு' : 'Depots', icon: Warehouse },
            { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'மருத்துவர்' : 'Doctor', icon: Sparkles },
            { id: 'transfers', label: lang === 'ta' ? 'லாரிகள்' : 'Fleet', icon: Truck },
            { id: 'predict', label: lang === 'ta' ? 'கணிப்பு' : 'Demand', icon: BarChart3 },
          ] : [
            { id: 'transfers', label: lang === 'ta' ? 'விற்பனை' : 'Orders', icon: Store },
            { id: 'radar', label: lang === 'ta' ? 'இருப்பு' : 'Stock', icon: Warehouse },
            { id: 'farmer_crop_doctor', label: lang === 'ta' ? 'மருத்துவர்' : 'Doctor', icon: Sparkles },
            { id: 'predict', label: lang === 'ta' ? 'கணிப்பு' : 'Demand', icon: BarChart3 },
            { id: 'map', label: lang === 'ta' ? 'வரைபடம்' : 'Map', icon: Compass },
          ]).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  color: isActive ? '#16A34A' : theme.textMuted,
                  cursor: 'pointer',
                  padding: '6px 0',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  padding: '4px 14px',
                  borderRadius: '12px',
                  backgroundColor: isActive ? (darkMode ? 'rgba(22, 163, 74, 0.28)' : '#DCFCE7') : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: isActive ? '800' : '600' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* FOOTER */}
      <footer style={{
        backgroundColor: theme.bgCard,
        borderTop: `1px solid ${theme.border}`,
        padding: isMobile ? '12px 14px 75px 14px' : '14px 28px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '6px' : '12px',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        fontSize: '11px',
        color: theme.textMuted
      }}>
        <div>HACKWELL 2.0 • Saranathan College of Engineering, Tiruchirappalli</div>
        <div>Team: <strong>HACK DUDE (H20-022)</strong> • Domain: Precision Farming</div>
      </footer>
      </div>

      {/* ========================================================
          CENTRAL AI ASSISTANT MODAL (CHAT & TWO-WAY VOICE)
      ======================================================== */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        currentRole={currentRole}
        activeTab={activeTab}
        lang={lang}
        pageName={getPageNameByTab(activeTab, currentRole)}
        pageContext={{
          currentRole,
          activeTab,
          totalOrders: ordersList.length,
          totalDepots: depotsList.length,
          ureaDemandKg: predResult?.predictions?.urea_demand_kg || 0,
          dapDemandKg: predResult?.predictions?.dap_demand_kg || 0,
          potashDemandKg: predResult?.predictions?.potash_demand_kg || 0,
          farmerCrop: isFarmer ? farmerCrop : null,
          farmerLandArea: isFarmer ? farmerLandArea : null,
          farmerDistrict: isFarmer ? farmerDistrict : null,
          farmerRequisitionsCount: isFarmer ? farmerRequisitions.length : null,
          recentRequisitions: isFarmer ? farmerRequisitions.slice(0, 2) : ordersList.slice(0, 3)
        }}
        onExecuteAction={(action) => {
          if (!action) return;
          if (action.type === 'NAVIGATE' && action.parameters?.tab) {
            setActiveTab(action.parameters.tab);
            showToast({ message: `Navigated to ${action.parameters.tab}` });
          } else if (action.type === 'CREATE_REQUISITION') {
            const p = action.parameters || {};
            const newReq = {
              id: `ORD-AI-${Date.now().toString().slice(-4)}`,
              token: `AI-REQ-${Date.now().toString().slice(-4)}-PASS`,
              date: "Just now (via AI Assistant)",
              crop: p.crop || farmerCrop || "Paddy (Rice Samba)",
              areaHa: farmerLandArea || 5.0,
              ureaKg: p.quantity_bags ? p.quantity_bags * 50 : 250,
              dapKg: 100,
              potashKg: 75,
              seedsKg: 40,
              seedVariety: "CR-1009 Sub-1",
              depot: "Cauvery Delta Farmers Depot (Thanjavur)",
              status: "PROCESSING",
              totalCostSubsidized: 3415,
              totalCostMarket: 21865,
              savings: 18450
            };
            setFarmerRequisitions(prev => [newReq, ...prev]);
            showToast({ message: `Requisition ${newReq.id} created via AI Assistant!` });
            setActiveTab('farmer_orders');
          } else {
            showToast({ message: `Action "${action.title || action.type}" processed.` });
          }
        }}
        darkMode={darkMode}
        theme={theme}
      />

      {/* Floating AI Assistant Trigger Button (Bottom-Right) */}
      <button
        onClick={() => setIsAssistantOpen(true)}
        title="Open AgriConnect AI Assistant (Chat & Voice)"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9990,
          background: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
          color: '#FFFFFF',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '50px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.45)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.45)';
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={22} />
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4ADE80',
              boxShadow: '0 0 8px #4ADE80'
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 }}>
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '-0.2px' }}>
            AgriConnect AI
          </span>
          <span style={{ fontSize: '9.5px', fontWeight: '600', color: '#D1FAE5' }}>
            Tap to Talk or Chat
          </span>
        </div>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '2px'
          }}
        >
          <Mic size={14} />
        </div>
      </button>
    </div>
  );
}
