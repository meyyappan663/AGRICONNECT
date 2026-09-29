/**
 * AgriConnect Bilingual Translations Dictionary (English & Tamil)
 * Complete, fluent Tamil terminology for agricultural, logistics, and executive operations.
 */

export const TRANSLATIONS = {
  en: {
    brand: "AgriConnect",
    tagline: "Farm to Future",
    searchPlaceholder: "Search Cauvery Delta depots, fleet, rakes, seeds...",
    notifications: "Active Alerts",
    switchRole: "Switch Role",
    newRequisition: "+ Requisition",
    langToggle: "தமிழ்",
    themeNormal: "Light Mode",
    themeDark: "Dark Mode",
    signOut: "Sign Out",

    // Roles
    roleFarmer: "Farmer",
    roleSupplier: "Supplier",
    roleDistributor: "Distributor",
    roleRetailer: "Retailer",

    // Tabs
    tabDashboard: "Dashboard",
    tabMyFarm: "My Farm & Quota",
    tabCropDoctor: "AI Crop Doctor",
    tabRequisitions: "My Requisitions",
    tabAdvisory: "TN Agro Advisory",
    tabDepotStocks: "Depot Stocks",
    tabRouteFleet: "Route & Fleet",
    tabDemandAI: "Demand Analytics",
    tabProducts: "Store Products",
    tabSupplyGrid: "Supply Grid",
    tabSettings: "Settings",

    // Dashboard KPIs
    kpiTotalStockpile: "Total Stockpile",
    kpiStockpileSub: "State buffer storage across all hubs",
    kpiDeficitDepots: "Deficit Depots",
    kpiDeficitSub: "Hubs below safety buffer margin",
    kpiTotalDeficit: "Projected Shortfall",
    kpiTotalDeficitSub: "Recommended replenishment rake volume",
    kpiActiveOrders: "Active Allocations",
    kpiActiveOrdersSub: "Orders in transit / queued for pickup",

    // Requisition Modal
    reqTitle: "New Agricultural Requisition",
    reqSubtitle: "Priority fertilizer & certified seed allocation for Cauvery Delta farmers",
    reqFarmerName: "Farmer / Farmer Producer Org (FPO) Name",
    reqDistrict: "District",
    reqCropType: "Crop Type",
    reqAreaHa: "Cultivated Area (Hectares)",
    reqUrgency: "Requisition Urgency",
    reqUrgencyCritical: "Critical Emergency (Within 4h)",
    reqUrgencyUrgent: "Priority Urgent (Within 12h)",
    reqUrgencyRoutine: "Routine Distribution (48h)",
    reqCalculatedPayload: "Calculated Agronomic Payload:",
    reqFieldNotes: "Field Notes / Soil Condition",
    reqCancel: "Cancel",
    reqSubmit: "Confirm & Dispatch Rake",

    // Depot Stocks / Radar
    radarTitle: "Cauvery Delta Regional Stock & Deficit Radar",
    radarSubtitle: "Audited stockpile balances matched against AI projected seasonal demand",
    radarRebalanceBtn: "Execute AI Rebalance Protocol",
    radarSyncBtn: "Sync Depot Data",
    colDepot: "Depot / Hub",
    colDistrict: "District",
    colWeather: "Weather & Rain",
    colStatus: "Status",
    colCertifiedSeeds: "Certified Seeds (Varieties & Stock)",
    colDeliveryTime: "Est. Delivery Time",
    colUrea: "Urea (kg)",
    colDAP: "DAP (kg)",
    colPotash: "Potash (kg)",
    colDeficit: "Projected Deficit",
    colAction: "Action",
    btnBookDepot: "Book from Depot",

    // Status Badges
    statusCritical: "CRITICAL",
    statusDeficit: "DEFICIT",
    statusHealthy: "HEALTHY",
    statusSurplus: "Surplus OK",
    statusDispatched: "DISPATCHED",
    statusInTransit: "IN TRANSIT",
    statusAllocated: "ALLOCATED",
    statusReadyPickup: "READY FOR PICKUP",

    // Weather Radar
    weatherRadarTitle: "Cauvery Delta Live City Weather & Agronomic Climate Radar",
    weatherRadarSubtitle: "Click any district to view real-time IMD/TNAU micro-climate telemetry",
    liveSatellite: "LIVE SATELLITE METEOROLOGY",

    // Products
    productsTitle: "Agricultural Products Catalog & Inventory",
    productsSubtitle: "Certified seeds, ICAR/TNAU fertilizers, bio-pesticides and micronutrients",
    prodNewOrder: "+ New Requisition Order",
    prodSearch: "Search products or manufacturer...",
    prodCurrentStock: "Current Stockpile",
    prodDBTPrice: "DBT Subsidized: ",
    prodMarketPrice: "Market: ",
    prodRequestRestock: "Request Emergency Restock",
    prodOrderRebalance: "Order Stock Rebalance",

    // Farmer Requisitions Pipeline
    pipelineTitle: "My Requisitions & Live Allocation Pipeline",
    pipelineActive: "Requisitions Active",
    step1: "1. Submitted",
    step2: "2. PACS Verified",
    step3: "3. Stock Allocated",
    step4: "4. Ready at Depot",
    voucherToken: "Digital Voucher Token",
    allocatedInputs: "ALLOCATED INPUTS & CERTIFIED SEEDS",

    // AI Assistant
    assistantLiveVoice: "LIVE AI VOICE",
    assistantAskPlaceholder: "Ask AgriConnect AI (crop health, fertilizers, orders, general questions)...",
    assistantListeningPlaceholder: "Listening to your voice...",
    voiceOn: "Voice ON",
    voiceMuted: "Muted"
  },
  ta: {
    brand: "அக்ரிகனெக்ட்",
    tagline: "விவசாயத்தின் எதிர்காலம்",
    searchPlaceholder: "காவிரி டெல்டா கிடங்குகள், லாரிகள், சரக்குகளை தேடுக...",
    notifications: "செயலில் உள்ள அறிவிப்புகள்",
    switchRole: "பங்கு மாற்றம்",
    newRequisition: "+ புதிய பதிவு",
    langToggle: "EN",
    themeNormal: "பகல் பயன்முறை",
    themeDark: "இருள் பயன்முறை",
    signOut: "வெளியேறு",

    // Roles
    roleFarmer: "உழவர் / விவசாயி",
    roleSupplier: "உற்பத்தியாளர்",
    roleDistributor: "விநியோகஸ்தர்",
    roleRetailer: "கூட்டுறவு விற்பனையாளர்",

    // Tabs
    tabDashboard: "முகப்பு டாஷ்போர்டு",
    tabMyFarm: "எனது பண்ணை & மானியம்",
    tabCropDoctor: "AI பயிர் மருத்துவர்",
    tabRequisitions: "எனது பதிவுகள் & ஆர்டர்கள்",
    tabAdvisory: "தமிழ்நாடு வேளாண் வழிகாட்டி",
    tabDepotStocks: "கிடங்கு இருப்பு ரேடார்",
    tabRouteFleet: "வாகனப் பாதை & தளவாடம்",
    tabDemandAI: "தேவை கணிப்பு & பகுப்பாய்வு",
    tabProducts: "பொருட்கள் பட்டியல்",
    tabSupplyGrid: "விநியோக வரைபடம்",
    tabSettings: "அமைப்புகள்",

    // Dashboard KPIs
    kpiTotalStockpile: "மொத்த சரக்கு இருப்பு",
    kpiStockpileSub: "அனைத்து மையங்களிலும் உள்ள தாங்கல் இருப்பு",
    kpiDeficitDepots: "பற்றாக்குறை கிடங்குகள்",
    kpiDeficitSub: "பாதுகாப்பு வரம்பிற்கு கீழ் உள்ள மையங்கள்",
    kpiTotalDeficit: "எதிர்பார்க்கப்படும் பற்றாக்குறை",
    kpiTotalDeficitSub: "பரிந்துரைக்கப்பட்ட அவசர சரக்கு அளவு",
    kpiActiveOrders: "செயலில் உள்ள ஒதுக்கீடுகள்",
    kpiActiveOrdersSub: "பயணத்தில் / கிடங்கில் தயாராக உள்ளவை",

    // Requisition Modal
    reqTitle: "புதிய வேளாண் விநியோகப் பதிவு",
    reqSubtitle: "காவிரி டெல்டா விவசாயிகளுக்கான முன்னுரிமை உரம் மற்றும் விதை ஒதுக்கீடு",
    reqFarmerName: "விவசாயி / உழவர் உற்பத்தியாளர் அமைப்பு (FPO) பெயர்",
    reqDistrict: "மாவட்டம்",
    reqCropType: "பயிர் வகை",
    reqAreaHa: "சாகுபடி பரப்பு (ஹெக்டேர்)",
    reqUrgency: "பதிவின் அவசர நிலை",
    reqUrgencyCritical: "அதிதீவிர அவசரம் (4 மணிநேரத்திற்குள்)",
    reqUrgencyUrgent: "முன்னுரிமை விநியோகம் (12 மணிநேரத்திற்குள்)",
    reqUrgencyRoutine: "வழக்கமான விநியோகம் (48 மணிநேரம்)",
    reqCalculatedPayload: "கணக்கிடப்பட்ட உர ஒதுக்கீடு:",
    reqFieldNotes: "வயல் குறிப்புகள் / மண் நிலை",
    reqCancel: "ரத்து செய்",
    reqSubmit: "உறுதி செய்து சரக்கை அனுப்புக",

    // Depot Stocks / Radar
    radarTitle: "காவிரி டெல்டா மண்டல கிடங்கு இருப்பு & பற்றாக்குறை ரேடார்",
    radarSubtitle: "AI கணிக்கப்பட்ட தேவைக்கு ஏற்ப தணிக்கை செய்யப்பட்ட இருப்பு அளவுகள்",
    radarRebalanceBtn: "AI மறுசீரமைப்பு நெறிமுறையை இயக்குக",
    radarSyncBtn: "கிடங்கு தரவை ஒத்திசை",
    colDepot: "கிடங்கு / மையம்",
    colDistrict: "மாவட்டம்",
    colWeather: "வானிலை & மழை",
    colStatus: "நிலை",
    colCertifiedSeeds: "சான்றளிக்கப்பட்ட விதைகள் (வகைகள் & இருப்பு)",
    colDeliveryTime: "விநியோக நேரம்",
    colUrea: "யூரியா (கிலோ)",
    colDAP: "டி.ஏ.பி (கிலோ)",
    colPotash: "பொட்டாஷ் (கிலோ)",
    colDeficit: "பற்றாக்குறை அளவு",
    colAction: "முன்பதிவு",
    btnBookDepot: "கிடங்கில் முன்பதிவு செய்",

    // Status Badges
    statusCritical: "அதிதீவிர பற்றாக்குறை",
    statusDeficit: "பற்றாக்குறை",
    statusHealthy: "போதுமான இருப்பு",
    statusSurplus: "உபரி இருப்பு தயார்",
    statusDispatched: "அனுப்பப்பட்டது",
    statusInTransit: "லாரியில் வருகிறது",
    statusAllocated: "ஒதுக்கப்பட்டது",
    statusReadyPickup: "கிடங்கில் தயார்",

    // Weather Radar
    weatherRadarTitle: "காவிரி டெல்டா நேரடி வானிலை & தட்பவெப்ப ரேடார்",
    weatherRadarSubtitle: "வானிலை விவரங்களை காண மாவட்டத்தை கிளிக் செய்க",
    liveSatellite: "நேரலை செயற்கைக்கோள் வானிலை",

    // Products
    productsTitle: "வேளாண் பொருட்கள் மற்றும் விநியோக பட்டியல்",
    productsSubtitle: "சான்றளிக்கப்பட்ட விதைகள், உரங்கள், உயிரி பூச்சிக்கொல்லிகள் மற்றும் நுண்ணூட்டச்சத்துக்கள்",
    prodNewOrder: "+ புதிய விநியோகப் பதிவு",
    prodSearch: "பொருட்கள் அல்லது நிறுவனத்தை தேடுக...",
    prodCurrentStock: "தற்போதைய கிடங்கு இருப்பு",
    prodDBTPrice: "அரசு மானிய விலை: ",
    prodMarketPrice: "சந்தை விலை: ",
    prodRequestRestock: "அவசர இருப்பு கோரிக்கை",
    prodOrderRebalance: "இருப்பு மறுசீரமைப்பு ஆணை",

    // Farmer Requisitions Pipeline
    pipelineTitle: "எனது உர ஒதுக்கீடுகள் & நேரலை நிலை",
    pipelineActive: "பதிவுகள் உள்ளன",
    step1: "1. சமர்ப்பிக்கப்பட்டது",
    step2: "2. கூட்டுறவு சரிபார்ப்பு",
    step3: "3. இருப்பு ஒதுக்கப்பட்டது",
    step4: "4. கிடங்கில் தயார்",
    voucherToken: "டிஜிட்டல் உறுதிச்சீட்டு டோக்கன்",
    allocatedInputs: "ஒதுக்கப்பட்ட உரம் & சான்றளிக்கப்பட்ட விதைகள்",

    // AI Assistant
    assistantLiveVoice: "நேரலை AI குரல்",
    assistantAskPlaceholder: "கேள்வி கேளுங்கள் (பயிர் நலம், உரம், மானியம், பொதுவான தகவல்கள்)...",
    assistantListeningPlaceholder: "குரலைக் கேட்கிறது... பேசுங்கள்...",
    voiceOn: "குரல் ஒலி இயக்கம்",
    voiceMuted: "ஒலியடக்கம்"
  }
};

/**
 * Returns translated string for key, fallback to English or key itself
 */
export function getTranslation(lang, key) {
  const currentLang = lang === 'ta' ? 'ta' : 'en';
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS['en']?.[key] || key;
}
