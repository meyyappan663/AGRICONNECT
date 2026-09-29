import React, { useState } from 'react';
import {
  Warehouse,
  BarChart3,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ArrowRight,
  Package,
  Leaf,
  Store,
  Navigation,
  Clock,
  MapPin,
  Sparkles,
  CloudSun,
  ShieldAlert,
  Sun,
  DollarSign
} from 'lucide-react';
import { REAL_DEMAND_FORECAST } from './realDemandForecast';

export default function DashboardView({
  currentRole = 'Supplier',
  lang = 'en',
  darkMode = false,
  theme,
  totalStockpileKg = 394000,
  deficitDepotsCount = 2,
  totalDeficitKg = 74000,
  ordersList = [],
  farmerLandArea = 5.0,
  farmerCrop = 'Paddy (Rice Samba)',
  farmerDistrict = 'Thanjavur',
  onNavigate,
  selectedRegion = 'All Regions',
  onSelectRegion,
  searchQuery = '',
  cityWeatherData = {},
  onSelectCityWeather
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Region options across Cauvery Delta
  const REGIONS = [
    'All Regions',
    'Tiruchirappalli',
    'Thanjavur',
    'Tiruvarur',
    'Nagapattinam',
    'Karur',
    'Pudukkottai',
    'Perambalur'
  ];

  // Base Products for Product Stock Overview Table
  const ALL_PRODUCTS = [
    {
      id: 1,
      name: 'Hybrid Seeds',
      nameTa: 'வீரிய ஒட்டு விதைகள்',
      spec: 'CR-1009 Sub-1 Certified Samba',
      specTa: 'CR-1009 Sub-1 சான்றளிக்கப்பட்ட சம்பா',
      category: 'Seeds',
      categoryTa: 'விதைகள்',
      currentStock: '5,000 kg',
      stockNum: 5000,
      predictedDemand: '7,500 kg',
      demandNum: 7500,
      status: 'Normal',
      statusTa: 'போதுமான இருப்பு',
      statusColor: '#16A34A',
      statusBg: darkMode ? 'rgba(22, 163, 74, 0.2)' : '#DCFCE7',
      region: 'Thanjavur'
    },
    {
      id: 2,
      name: 'Urea Fertilizer',
      nameTa: 'யூரியா உரம்',
      spec: 'Neem Coated 46% N',
      specTa: 'வேப்ப எண்ணெய் பூசிய 46% தழைச்சத்து',
      category: 'Fertilizers',
      categoryTa: 'உரங்கள்',
      currentStock: '4,000 kg',
      stockNum: 4000,
      predictedDemand: '10,000 kg',
      demandNum: 10000,
      status: 'Low Stock',
      statusTa: 'குறைந்த இருப்பு',
      statusColor: '#D97706',
      statusBg: darkMode ? 'rgba(217, 119, 6, 0.2)' : '#FEF3C7',
      region: 'Tiruchirappalli'
    },
    {
      id: 3,
      name: 'Bio-Pesticides',
      nameTa: 'உயிரி பூச்சிக்கொல்லி',
      spec: 'Neem Kernel & Trichoderma',
      specTa: 'வேப்பங்கொட்டை & ட்ரைக்கோடெர்மா',
      category: 'Pesticides',
      categoryTa: 'பூச்சிக்கொல்லிகள்',
      currentStock: '2,500 L',
      stockNum: 2500,
      predictedDemand: '3,500 L',
      demandNum: 3500,
      status: 'Low Stock',
      statusTa: 'குறைந்த இருப்பு',
      statusColor: '#D97706',
      statusBg: darkMode ? 'rgba(217, 119, 6, 0.2)' : '#FEF3C7',
      region: 'Tiruvarur'
    },
    {
      id: 4,
      name: 'DAP Fertilizer',
      nameTa: 'டி.ஏ.பி உரம்',
      spec: 'Di-Ammonium Phosphate 18:46:0',
      specTa: 'டை-அம்மோனியம் பாஸ்பேட் 18:46:0',
      category: 'Fertilizers',
      categoryTa: 'உரங்கள்',
      currentStock: '6,200 kg',
      stockNum: 6200,
      predictedDemand: '7,800 kg',
      demandNum: 7800,
      status: 'Normal',
      statusTa: 'போதுமான இருப்பு',
      statusColor: '#16A34A',
      statusBg: darkMode ? 'rgba(22, 163, 74, 0.2)' : '#DCFCE7',
      region: 'Nagapattinam'
    },
    {
      id: 5,
      name: 'MOP Potash',
      nameTa: 'பொட்டாஷ் உரம் (MOP)',
      spec: 'Muriate of Potash 60% K2O',
      specTa: 'மியூரேட் ஆப் பொட்டாஷ் 60% K2O',
      category: 'Fertilizers',
      categoryTa: 'உரங்கள்',
      currentStock: '1,800 kg',
      stockNum: 1800,
      predictedDemand: '4,200 kg',
      demandNum: 4200,
      status: 'Critical',
      statusTa: 'அவசர பற்றாக்குறை',
      statusColor: '#DC2626',
      statusBg: darkMode ? 'rgba(220, 38, 38, 0.2)' : '#FEE2E2',
      region: 'Karur'
    }
  ];

  // Filter products by region and search query
  const filteredProducts = ALL_PRODUCTS.filter((prod) => {
    const matchesRegion = selectedRegion === 'All Regions' || prod.region === selectedRegion;
    const matchesSearch = !searchQuery || prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Latest Alerts Data (matching Image 3 Panel 3)
  const ALERTS = [
    {
      id: 1,
      title: 'Urea Fertilizer stock is low',
      titleTa: 'யூரியா உர இருப்பு குறைவாக உள்ளது',
      time: '2 hours ago',
      timeTa: '2 மணிநேரத்திற்கு முன்',
      level: 'warning',
      color: '#DC2626',
      bgColor: darkMode ? 'rgba(220, 38, 38, 0.15)' : '#FEF2F2',
      borderColor: darkMode ? '#7F1D1D' : '#FCA5A5',
      icon: AlertTriangle
    },
    {
      id: 2,
      title: 'Pesticide demand increased in TN region',
      titleTa: 'தமிழக டெல்டாவில் பூச்சிக்கொல்லி தேவை அதிகரிப்பு',
      time: '5 hours ago',
      timeTa: '5 மணிநேரத்திற்கு முன்',
      level: 'info',
      color: '#D97706',
      bgColor: darkMode ? 'rgba(217, 119, 6, 0.15)' : '#FFFBEB',
      borderColor: darkMode ? '#78350F' : '#FDE68A',
      icon: AlertTriangle
    },
    {
      id: 3,
      title: 'New order received from Green Farm Store',
      titleTa: 'கிரீன் பார்ம் ஸ்டோரிலிருந்து புதிய ஆர்டர் பெறப்பட்டது',
      time: '6 hours ago',
      timeTa: '6 மணிநேரத்திற்கு முன்',
      level: 'success',
      color: '#16A34A',
      bgColor: darkMode ? 'rgba(22, 163, 74, 0.15)' : '#F0FDF4',
      borderColor: darkMode ? '#065F46' : '#BBF7D0',
      icon: Package
    },
    {
      id: 4,
      title: 'Restock recommended for Hybrid Seeds',
      titleTa: 'வீரிய ஒட்டு விதைகளுக்கு அவசர மறுஇருப்பு பரிந்துரை',
      time: '8 hours ago',
      timeTa: '8 மணிநேரத்திற்கு முன்',
      level: 'danger',
      color: '#E11D48',
      bgColor: darkMode ? 'rgba(225, 29, 72, 0.15)' : '#FFF1F2',
      borderColor: darkMode ? '#881337' : '#FECDD3',
      icon: AlertTriangle
    }
  ];

  // Header Title & Subtitle based on Role
  const getHeaderInfo = () => {
    switch (currentRole) {
      case 'Farmer':
        return {
          title: lang === 'ta' ? 'விவசாயி டாஷ்போர்டு' : 'Farmer Dashboard',
          subtitle: lang === 'ta' ? 'உங்கள் நிலப்பரப்பு, அங்கீகரிக்கப்பட்ட உரம் மற்றும் மானிய சேமிப்பு' : 'Overview of your farm allocation, crop health and DBT subsidies'
        };
      case 'Distributor':
        return {
          title: lang === 'ta' ? 'விநியோகஸ்தர் டாஷ்போர்டு' : 'Distributor Dashboard',
          subtitle: lang === 'ta' ? 'தளவாடக் குழு, மண்டலக் கிடங்குகள் மற்றும் போக்குவரத்து நிலவரம்' : 'Overview of your regional network, fleet telemetry and dispatch routes'
        };
      case 'Retailer':
        return {
          title: lang === 'ta' ? 'விற்பனையாளர் டாஷ்போர்டு' : 'Retailer Dashboard',
          subtitle: lang === 'ta' ? 'கடை இருப்பு, உழவர் பதிவுகள் மற்றும் விற்பனை நிலவரம்' : 'Overview of your shop inventory, pending farmer orders and counter pickups'
        };
      case 'Supplier':
      default:
        return {
          title: lang === 'ta' ? 'சப்ளையர் டாஷ்போர்டு' : 'Supplier Dashboard',
          subtitle: lang === 'ta' ? 'உங்கள் இருப்பு, தேவை கணிப்பு மற்றும் வழங்கல் நிலை' : 'Overview of your stock, demand and supply status'
        };
    }
  };

  const headerInfo = getHeaderInfo();

  // 4 Top KPI Cards configuration per Role
  const getKPICards = () => {
    switch (currentRole) {
      case 'Farmer':
        return [
          {
            title: lang === 'ta' ? 'அங்கீகரிக்கப்பட்ட உரம்' : 'Total Allocation',
            value: '350 kg',
            subtext: lang === 'ta' ? '250 kg யூரியா • 100 kg DAP' : '250 kg Urea • 100 kg DAP',
            trendColor: '#16A34A',
            icon: Package,
            iconBg: darkMode ? 'rgba(22, 163, 74, 0.25)' : '#DCFCE7',
            iconColor: '#16A34A'
          },
          {
            title: lang === 'ta' ? 'DBT மானிய சேமிப்பு' : 'DBT Subsidy Saved',
            value: '₹18,450',
            subtext: lang === 'ta' ? 'சந்தை விலையில் 74% சேமிப்பு' : '74% Govt Subsidy applied',
            trendColor: '#0284C7',
            icon: DollarSign,
            iconBg: darkMode ? 'rgba(2, 132, 199, 0.25)' : '#E0F2FE',
            iconColor: '#0284C7'
          },
          {
            title: lang === 'ta' ? 'அருகிலுள்ள கிடங்கு' : 'Nearest Agro Depot',
            value: 'Thanjavur Depot',
            badge: lang === 'ta' ? 'இருப்பு உள்ளது' : 'In Stock',
            badgeBg: '#DCFCE7',
            badgeColor: '#16A34A',
            subtext: '4.2 km • PACS Center',
            icon: Warehouse,
            iconBg: darkMode ? 'rgba(217, 119, 6, 0.25)' : '#FEF3C7',
            iconColor: '#D97706'
          },
          {
            title: lang === 'ta' ? 'பதிவு நிலை' : 'Pickup Token',
            value: 'TN-7821',
            subtext: lang === 'ta' ? 'இன்று மாலைக்குள் பெற்றுக்கொள்ளலாம்' : 'Ready for Pickup (Today, 4:30 PM)',
            trendColor: '#9333EA',
            icon: Clock,
            iconBg: darkMode ? 'rgba(147, 51, 234, 0.25)' : '#F3E8FF',
            iconColor: '#9333EA'
          }
        ];

      case 'Distributor':
        return [
          {
            title: 'Network Stockpile',
            value: `${(totalStockpileKg / 1000).toFixed(0)},000 kg`,
            subtext: '+3.8% across 7 regional hubs',
            trendColor: '#16A34A',
            icon: Warehouse,
            iconBg: darkMode ? 'rgba(22, 163, 74, 0.25)' : '#DCFCE7',
            iconColor: '#16A34A'
          },
          {
            title: 'Route Optimization',
            value: '254.2 km',
            subtext: 'Saved 146.4 km • 112 kg CO₂ abated',
            trendColor: '#0284C7',
            icon: Navigation,
            iconBg: darkMode ? 'rgba(2, 132, 199, 0.25)' : '#E0F2FE',
            iconColor: '#0284C7'
          },
          {
            title: 'Depots in Deficit',
            value: `${deficitDepotsCount} Depots`,
            badge: 'Needs Rebalance',
            badgeBg: '#FEE2E2',
            badgeColor: '#DC2626',
            subtext: '74,000 kg pending transfer',
            icon: AlertTriangle,
            iconBg: darkMode ? 'rgba(220, 38, 38, 0.25)' : '#FEF2F2',
            iconColor: '#DC2626'
          },
          {
            title: 'Active Fleet',
            value: '4 Trucks',
            subtext: 'GPS Telemetry tracking live cargo',
            trendColor: '#9333EA',
            icon: ShoppingCart,
            iconBg: darkMode ? 'rgba(147, 51, 234, 0.25)' : '#F3E8FF',
            iconColor: '#9333EA'
          }
        ];

      case 'Retailer':
        return [
          {
            title: 'Store Available Stock',
            value: '82,500 kg',
            subtext: 'Ready for local farmer distribution',
            trendColor: '#16A34A',
            icon: Store,
            iconBg: darkMode ? 'rgba(22, 163, 74, 0.25)' : '#DCFCE7',
            iconColor: '#16A34A'
          },
          {
            title: 'Predicted Demand',
            value: '96,000 kg',
            subtext: 'Next 3 months sowing surge',
            trendColor: '#0284C7',
            icon: BarChart3,
            iconBg: darkMode ? 'rgba(2, 132, 199, 0.25)' : '#E0F2FE',
            iconColor: '#0284C7'
          },
          {
            title: 'Stock Shortage',
            value: '3,200 kg',
            badge: 'Needs Restocking',
            badgeBg: '#FEF3C7',
            badgeColor: '#D97706',
            subtext: 'Urea buffer threshold reached',
            icon: AlertTriangle,
            iconBg: darkMode ? 'rgba(217, 119, 6, 0.25)' : '#FEF3C7',
            iconColor: '#D97706'
          },
          {
            title: 'Pending Farmer Orders',
            value: '14 Orders',
            subtext: '8 verified for counter pickup today',
            trendColor: '#9333EA',
            icon: ShoppingCart,
            iconBg: darkMode ? 'rgba(147, 51, 234, 0.25)' : '#F3E8FF',
            iconColor: '#9333EA'
          }
        ];

      case 'Supplier':
      default: {
        const totalPredKg = currentForecast.reduce((acc, curr) => acc + curr.predicted, 0);
        const avgPredKg = Math.round(totalPredKg / currentForecast.length);
        return [
          {
            title: 'Total Stock',
            value: '12,500 kg',
            subtext: '+5% from last week',
            trendColor: '#16A34A',
            icon: Warehouse,
            iconBg: darkMode ? 'rgba(22, 163, 74, 0.25)' : '#DCFCE7',
            iconColor: '#16A34A'
          },
          {
            title: 'Predicted Demand',
            value: `${avgPredKg.toLocaleString()} kg/mo`,
            subtext: `Total: ${totalPredKg.toLocaleString()} kg (${selectedRegion})`,
            trendColor: '#0284C7',
            icon: BarChart3,
            iconBg: darkMode ? 'rgba(2, 132, 199, 0.25)' : '#E0F2FE',
            iconColor: '#0284C7'
          },
          {
            title: 'Stock Shortage',
            value: '5,500 kg',
            badge: 'Needs restocking',
            badgeBg: '#FEF3C7',
            badgeColor: '#D97706',
            subtext: 'Needs restocking',
            icon: AlertTriangle,
            iconBg: darkMode ? 'rgba(217, 119, 6, 0.25)' : '#FEF3C7',
            iconColor: '#D97706'
          },
          {
            title: 'Pending Orders',
            value: '8',
            subtext: 'From distributors & retailers',
            trendColor: '#9333EA',
            icon: ShoppingCart,
            iconBg: darkMode ? 'rgba(147, 51, 234, 0.25)' : '#F3E8FF',
            iconColor: '#9333EA'
          }
        ];
      }
    }
  };

  // Real Dataset Monthly Demand for currently selected region
  const currentForecast = REAL_DEMAND_FORECAST[selectedRegion] || REAL_DEMAND_FORECAST['All Regions'];
  const kpiCards = getKPICards();

  // SVG Chart Scale and Coordinates mapping (SVG width: 420, height: 200)
  // Max scale 32,000 kg. Range 35 (max) to 175 (0) = 140px.
  const maxScale = 32000;
  const getY = (val) => {
    const clamped = Math.max(0, Math.min(val, maxScale));
    return Math.round(175 - (clamped / maxScale) * 140);
  };
  const xCoords = [45, 155, 265, 375];

  const chartPredictedPoints = currentForecast.map((pt, idx) => ({
    month: pt.month,
    value: `${pt.predicted.toLocaleString()} kg`,
    rawVal: pt.predicted,
    cx: xCoords[idx],
    cy: getY(pt.predicted),
    urea: pt.urea,
    dap: pt.dap,
    potash: pt.potash,
    seeds: pt.seeds
  }));

  const chartActualPoints = currentForecast.map((pt, idx) => ({
    month: pt.month,
    value: `${pt.actual.toLocaleString()} kg`,
    rawVal: pt.actual,
    cx: xCoords[idx],
    cy: getY(pt.actual)
  }));

  const predPolyline = chartPredictedPoints.map(p => `${p.cx},${p.cy}`).join(' ');
  const actPolyline = chartActualPoints.map(p => `${p.cx},${p.cy}`).join(' ');
  const predPolygon = `${predPolyline} 375,175 45,175`;
  const actPolygon = `${actPolyline} 375,175 45,175`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ========================================================
          1. DASHBOARD HEADER & FILTER BAR
      ======================================================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: theme.textHead,
              margin: '0 0 4px 0',
              letterSpacing: '-0.3px'
            }}
          >
            {headerInfo.title}
          </h1>
          <p style={{ fontSize: '13px', color: theme.textMuted, margin: 0 }}>
            {headerInfo.subtitle}
          </p>
        </div>

        {/* Right side controls: Last Updated & Region Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Last Updated Timestamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: theme.bgCard,
              border: `1px solid ${theme.border}`,
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              color: theme.textMuted,
              fontWeight: '500'
            }}
          >
            <Calendar size={14} color="#16A34A" />
            <span>
              {lang === 'ta' ? 'கடைசி புதுப்பிப்பு: ஏப் 26, 2025' : 'Last Updated: Apr 26, 2025'}
            </span>
          </div>

          {/* Region Filter Dropdown (Image 3) */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion && onSelectRegion(e.target.value)}
              style={{
                appearance: 'none',
                backgroundColor: theme.bgCard,
                border: `1px solid ${theme.borderMedium}`,
                borderRadius: '8px',
                padding: '7px 32px 7px 12px',
                fontSize: '12.5px',
                fontWeight: '600',
                color: theme.textHead,
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {REGIONS.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
            <div
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: theme.textMuted,
                display: 'flex'
              }}
            >
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 4 TOP KPI METRIC CARDS (Image 3 Panel 3)
      ======================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="white-card"
              style={{
                padding: '18px 20px',
                backgroundColor: theme.bgCard,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '120px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: theme.textMuted
                    }}
                  >
                    {kpi.title}
                  </span>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: theme.textHead,
                      marginTop: '4px',
                      letterSpacing: '-0.3px'
                    }}
                  >
                    {kpi.value}
                  </div>
                </div>

                {/* Colored Rounded Icon Box */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: kpi.iconBg,
                    color: kpi.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </div>
              </div>

              {/* Bottom Subtext / Status Badge */}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {kpi.badge ? (
                  <span
                    style={{
                      backgroundColor: kpi.badgeBg,
                      color: kpi.badgeColor,
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {kpi.badge}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '600',
                      color: kpi.trendColor || theme.textMuted,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {kpi.subtext}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          3. MAIN CONTENT 3-COLUMN GRID (Image 3 Panel 3)
      ======================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.1fr 0.9fr',
          gap: '18px',
          alignItems: 'stretch'
        }}
      >
        {/* ========================================================
            COLUMN 1: PRODUCT STOCK OVERVIEW TABLE
        ======================================================== */}
        <div
          className="white-card"
          style={{
            padding: '20px',
            backgroundColor: theme.bgCard,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: theme.textHead, margin: 0 }}>
                {lang === 'ta' ? 'பொருட்கள் இருப்பு கண்ணோட்டம்' : 'Product Stock Overview'}
              </h3>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textMuted }}>
                    <th style={{ padding: '8px 10px', fontWeight: '600' }}>{lang === 'ta' ? 'பொருள்' : 'Product'}</th>
                    <th style={{ padding: '8px 10px', fontWeight: '600' }}>{lang === 'ta' ? 'பிரிவு' : 'Category'}</th>
                    <th style={{ padding: '8px 10px', fontWeight: '600' }}>{lang === 'ta' ? 'தற்போதைய இருப்பு' : 'Current Stock'}</th>
                    <th style={{ padding: '8px 10px', fontWeight: '600' }}>{lang === 'ta' ? 'கணிக்கப்பட்ட தேவை' : 'Predicted Demand'}</th>
                    <th style={{ padding: '8px 10px', fontWeight: '600' }}>{lang === 'ta' ? 'நிலை' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: `1px solid ${theme.border}`,
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = darkMode ? '#1E293B' : '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '10px 10px', fontWeight: '700', color: theme.textHead }}>
                        <div>{lang === 'ta' ? (p.nameTa || p.name) : p.name}</div>
                        <div style={{ fontSize: '10px', color: theme.textMuted, fontWeight: '400' }}>
                          {lang === 'ta' ? (p.specTa || p.spec) : p.spec}
                        </div>
                      </td>
                      <td style={{ padding: '10px 10px', color: theme.textMuted }}>
                        {lang === 'ta' ? (p.categoryTa || p.category) : p.category}
                      </td>
                      <td style={{ padding: '10px 10px', fontWeight: '600', color: theme.textHead }}>{p.currentStock}</td>
                      <td style={{ padding: '10px 10px', fontWeight: '600', color: theme.textHead }}>{p.predictedDemand}</td>
                      <td style={{ padding: '10px 10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: p.statusBg,
                            color: p.statusColor,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700'
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: p.statusColor
                            }}
                          />
                          {lang === 'ta' ? (p.statusTa || p.status) : p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* View All Products Link at Bottom */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: `1px solid ${theme.border}` }}>
            <button
              onClick={() => onNavigate && onNavigate('products')}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284C7',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: 0
              }}
            >
              <span>{lang === 'ta' ? 'அனைத்து பொருட்களையும் காண்க' : 'View All Products'}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* ========================================================
            COLUMN 2: DEMAND FORECAST (NEXT 3 MONTHS) CHART
        ======================================================== */}
        <div
          className="white-card"
          style={{
            padding: '20px',
            backgroundColor: theme.bgCard,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: theme.textHead, margin: 0 }}>
                {lang === 'ta' ? 'தேவை கணிப்பு (அடுத்த 3 மாதங்கள்)' : 'Demand Forecast (Next 3 Months)'}
              </h3>

              {/* Chart Legend (Image 3) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', fontWeight: '600' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  <span style={{ color: theme.textMuted }}>{lang === 'ta' ? 'கணிக்கப்பட்டது' : 'Predicted'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
                  <span style={{ color: theme.textMuted }}>{lang === 'ta' ? 'உண்மையானது' : 'Actual'}</span>
                </div>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div style={{ width: '100%', position: 'relative' }}>
              <svg viewBox="0 0 420 200" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="predGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="actGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid Lines & Labels */}
                {[
                  { y: 35, label: '20K' },
                  { y: 70, label: '15K' },
                  { y: 105, label: '10K' },
                  { y: 140, label: '5K' },
                  { y: 175, label: '0' }
                ].map((grid, idx) => (
                  <g key={idx}>
                    <text
                      x="22"
                      y={grid.y + 4}
                      fill={theme.textMuted}
                      fontSize="9.5"
                      textAnchor="end"
                      fontWeight="500"
                    >
                      {grid.label}
                    </text>
                    <line
                      x1="30"
                      y1={grid.y}
                      x2="400"
                      y2={grid.y}
                      stroke={darkMode ? '#334155' : '#E2E8F0'}
                      strokeDasharray="2,3"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Shaded Areas under curves */}
                <polygon
                  points={predPolygon}
                  fill="url(#predGradient)"
                />
                <polygon
                  points={actPolygon}
                  fill="url(#actGradient)"
                />

                {/* Actual Demand Line (Blue) */}
                <polyline
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={actPolyline}
                />

                {/* Predicted Demand Line (Green) */}
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={predPolyline}
                />

                {/* Points on Actual Line */}
                {chartActualPoints.map((pt, idx) => (
                  <circle
                    key={`act-${idx}`}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={hoveredPoint === `act-${idx}` ? 6 : 4}
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    onMouseEnter={() => setHoveredPoint(`act-${idx}`)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* Points on Predicted Line */}
                {chartPredictedPoints.map((pt, idx) => (
                  <circle
                    key={`pred-${idx}`}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={hoveredPoint === `pred-${idx}` ? 6 : 4}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    onMouseEnter={() => setHoveredPoint(`pred-${idx}`)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* X Axis Month Labels */}
                {[
                  { x: 45, month: 'Apr' },
                  { x: 155, month: 'May' },
                  { x: 265, month: 'Jun' },
                  { x: 375, month: 'Jul' }
                ].map((m, idx) => (
                  <text
                    key={idx}
                    x={m.x}
                    y="192"
                    fill={theme.textMuted}
                    fontSize="10"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {m.month}
                  </text>
                ))}
              </svg>
            </div>

            {/* Active Hover Detail Bar */}
            <div
              style={{
                marginTop: '10px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                fontSize: '11px',
                color: theme.textHead,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: '28px'
              }}
            >
              {hoveredPoint ? (
                (() => {
                  const [type, idxStr] = hoveredPoint.split('-');
                  const idx = parseInt(idxStr, 10);
                  const isPred = type === 'pred';
                  const pt = isPred ? chartPredictedPoints[idx] : chartActualPoints[idx];
                  if (!pt) return null;
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '700', color: isPred ? '#10B981' : '#0284C7' }}>
                        ● {pt.month} {isPred ? 'Predicted' : 'Actual'}: <strong>{pt.value}</strong>
                      </span>
                      {isPred && pt.urea && (
                        <span style={{ color: theme.textMuted, fontSize: '10px' }}>
                          Urea: {pt.urea.toLocaleString()} kg | DAP: {pt.dap.toLocaleString()} kg | Potash: {pt.potash.toLocaleString()} kg
                        </span>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', color: theme.textMuted, fontSize: '10.5px' }}>
                  <span>📍 {selectedRegion} Forecast</span>
                  <span>Hover points to inspect ICAR/TNAU fertilizer breakdown</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '11px', color: theme.textMuted, textAlign: 'center' }}>
            AI Random Forest model ($R^2 &gt; 0.995$) based on TNAU/ICAR Delta criteria
          </div>
        </div>

        {/* ========================================================
            COLUMN 3: LATEST ALERTS PANEL
        ======================================================== */}
        <div
          className="white-card"
          style={{
            padding: '20px',
            backgroundColor: theme.bgCard,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: theme.textHead, margin: 0 }}>
                {lang === 'ta' ? 'சமீபத்திய விழிப்பூட்டல்கள்' : 'Latest Alerts'}
              </h3>
              <button
                onClick={() => onNavigate && onNavigate('radar')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284C7',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {lang === 'ta' ? 'அனைத்தையும் காண்க →' : 'View All →'}
              </button>
            </div>

            {/* List of Alerts (Image 3) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ALERTS.map((alert) => {
                const Icon = alert.icon;
                return (
                  <div
                    key={alert.id}
                    style={{
                      padding: '11px 12px',
                      borderRadius: '10px',
                      backgroundColor: alert.bgColor,
                      border: `1px solid ${alert.borderColor}`,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    <div style={{ color: alert.color, marginTop: '2px', flexShrink: 0 }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: theme.textHead,
                          lineHeight: 1.25
                        }}
                      >
                        {lang === 'ta' ? (alert.titleTa || alert.title) : alert.title}
                      </div>
                      <div
                        style={{
                          fontSize: '10.5px',
                          color: theme.textMuted,
                          marginTop: '3px'
                        }}
                      >
                        {lang === 'ta' ? (alert.timeTa || alert.time) : alert.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: `1px solid ${theme.border}`, textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700' }}>
              {lang === 'ta' ? '● 4 செயலில் உள்ள காவிரி டெல்டா தளவாட சிக்னல்கள்' : '● 4 Active Cauvery Delta Logistics Signals'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. CAUVERY DELTA & TAMIL NADU CITY WEATHER RADAR BAR
      ======================================================== */}
      {cityWeatherData && Object.keys(cityWeatherData).length > 0 && (
        <div
          style={{
            backgroundColor: theme.bgCard,
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '14px 16px',
            boxShadow: darkMode ? '0 4px 14px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  backgroundColor: darkMode ? '#064E3B' : '#DCFCE7',
                  padding: '6px',
                  borderRadius: '8px',
                  color: '#16A34A',
                  display: 'flex'
                }}
              >
                <CloudSun size={17} />
              </div>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: theme.textHead, margin: 0, lineHeight: 1.2 }}>
                  {lang === 'ta'
                    ? 'காவிரி டெல்டா நேரடி வானிலை & தட்பவெப்ப ரேடார்'
                    : 'Cauvery Delta Live City Weather & Agronomic Climate Radar'}
                </h4>
                <span style={{ fontSize: '10.5px', color: theme.textMuted }}>
                  {lang === 'ta'
                    ? 'வானிலை விவரங்களைக் காண ஏதேனும் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'
                    : 'Click any district to view real-time IMD/TNAU micro-climate telemetry'}
                </span>
              </div>
            </div>

            <span
              style={{
                backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                border: `1px solid ${theme.borderMedium}`,
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '800',
                color: '#16A34A',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  display: 'inline-block'
                }}
              />
              {lang === 'ta' ? 'நேரலை செயற்கைக்கோள் வானிலை' : 'LIVE SATELLITE METEOROLOGY'}
            </span>
          </div>

          {/* City Weather Cards */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'thin'
            }}
          >
            {Object.values(cityWeatherData)
              .slice(0, 8)
              .map((w) => {
                const isSelected = selectedRegion === w.district;
                return (
                  <div
                    key={w.city}
                    onClick={() => {
                      if (onSelectRegion) onSelectRegion(w.district);
                      if (onSelectCityWeather) onSelectCityWeather(w);
                    }}
                    style={{
                      minWidth: '140px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: isSelected
                        ? (darkMode ? '#064E3B' : '#DCFCE7')
                        : (darkMode ? '#1E293B' : '#F8FAFC'),
                      border: `1.5px solid ${isSelected ? '#16A34A' : theme.border}`,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: theme.textHead }}>
                        {w.city}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#16A34A' }}>
                        {w.temp}°C
                      </span>
                    </div>

                    <div style={{ fontSize: '10px', color: theme.textMuted, marginTop: '2px' }}>
                      {w.condition}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '9.5px',
                        color: theme.textMuted,
                        borderTop: `1px solid ${theme.borderMedium}`,
                        paddingTop: '4px',
                        marginTop: '4px'
                      }}
                    >
                      <span>💧 {w.rainfallMm} mm</span>
                      <span>💨 {w.humidity}%</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
