import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const HackDudeAgriApp());
}

// =============================================================
// APP ROOT & THEME / LOCALIZATION CONTROLLER
// =============================================================
class HackDudeAgriApp extends StatefulWidget {
  const HackDudeAgriApp({super.key});

  static HackDudeAgriAppState of(BuildContext context) =>
      context.findAncestorStateOfType<HackDudeAgriAppState>()!;

  @override
  State<HackDudeAgriApp> createState() => HackDudeAgriAppState();
}

class HackDudeAgriAppState extends State<HackDudeAgriApp> {
  Map<String, dynamic>? currentUser;
  ThemeMode _themeMode = ThemeMode.light;
  String _lang = "ta"; // Default to Tamil for Delta farmers ("en" | "ta")
  // Primary Wi-Fi IP with auto-probing fallback to 10.0.2.2 & 127.0.0.1
  String _backendHost = "192.168.137.60";

  ThemeMode get themeMode => _themeMode;
  String get lang => _lang;
  String get backendHost => _backendHost;

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.light
          ? ThemeMode.dark
          : ThemeMode.light;
    });
  }

  void toggleLanguage() {
    setState(() {
      _lang = _lang == "en" ? "ta" : "en";
    });
  }

  void setLanguage(String l) {
    setState(() {
      _lang = l;
    });
  }

  void setBackendHost(String host) {
    setState(() {
      _backendHost = host.trim();
    });
  }

  @override
  Widget build(BuildContext context) {
    const primaryTeal = Color(0xFF0F766E);
    const secondaryEmerald = Color(0xFF10B981);

    return MaterialApp(
      title: 'AgriConnect - Tamil Nadu',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        fontFamily: 'Segoe UI',
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryTeal,
          primary: primaryTeal,
          secondary: secondaryEmerald,
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        cardTheme: CardThemeData(
          elevation: 1,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          color: Colors.white,
          surfaceTintColor: Colors.transparent,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        fontFamily: 'Segoe UI',
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF14B8A6),
          secondary: Color(0xFF34D399),
          surface: Color(0xFF1E293B),
        ),
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
        cardTheme: CardThemeData(
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          color: const Color(0xFF1E293B),
          surfaceTintColor: Colors.transparent,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E293B),
          foregroundColor: Color(0xFFF8FAFC),
          elevation: 0,
        ),
      ),
      home: currentUser == null
          ? MobileAuthScreen(
              onLoginSuccess: (user) => setState(() => currentUser = user),
            )
          : MainNavigationScreen(
              currentUser: currentUser!,
              onLogout: () => setState(() => currentUser = null),
            ),
    );
  }
}

// =============================================================
// OFFICIAL TN GOVT 2024-25 DATASET BENCHMARKS (GROUND TRUTH)
// =============================================================
class TnDistrictBenchmark {
  final int paddyAreaHa;
  final int paddyProdTonnes;
  final int yieldKgHa;
  final String nemRainDev;
  final String soilTypeEn;
  final String soilTypeTa;
  final String peakSowSeasonEn;
  final String peakSowSeasonTa;
  final String stapleCropsEn;
  final String stapleCropsTa;

  const TnDistrictBenchmark({
    required this.paddyAreaHa,
    required this.paddyProdTonnes,
    required this.yieldKgHa,
    required this.nemRainDev,
    required this.soilTypeEn,
    required this.soilTypeTa,
    required this.peakSowSeasonEn,
    required this.peakSowSeasonTa,
    required this.stapleCropsEn,
    required this.stapleCropsTa,
  });
}

const Map<String, TnDistrictBenchmark> tnBenchmarks = {
  'Thanjavur': TnDistrictBenchmark(
    paddyAreaHa: 209532,
    paddyProdTonnes: 665523,
    yieldKgHa: 3176,
    nemRainDev: "+25.5%",
    soilTypeEn: "Cauvery Delta Alluvium",
    soilTypeTa: "காவிரி டெல்டா வண்டல் மண்",
    peakSowSeasonEn: "Kuruvai (Jun-Jul) & Samba (Sep-Oct)",
    peakSowSeasonTa: "குறுவை (ஜூன்-ஜூலை) & சம்பா (செப்-அக்)",
    stapleCropsEn: "Paddy (Granary Hub), Blackgram, Groundnut",
    stapleCropsTa: "நெல் (நெற்களஞ்சியம்), உளுந்து, நிலக்கடலை",
  ),
  'Tiruchirappalli': TnDistrictBenchmark(
    paddyAreaHa: 67931,
    paddyProdTonnes: 260087,
    yieldKgHa: 3829,
    nemRainDev: "+42.6%",
    soilTypeEn: "Cauvery Clay & Red Loam",
    soilTypeTa: "காவிரி களிமண் மற்றும் செம்மண்",
    peakSowSeasonEn: "Samba (Oct-Nov)",
    peakSowSeasonTa: "சம்பா (அக்-நவ)",
    stapleCropsEn: "Paddy, Maize (22.3k Ha), Sugarcane",
    stapleCropsTa: "நெல், மக்காச்சோளம் (22.3ஆ.ஹெக்), கரும்பு",
  ),
  'Tiruvarur': TnDistrictBenchmark(
    paddyAreaHa: 195952,
    paddyProdTonnes: 617781,
    yieldKgHa: 3153,
    nemRainDev: "+23.3%",
    soilTypeEn: "Deltaic Fine Clay & Alluvium",
    soilTypeTa: "டெல்டா மென் களிமண் & வண்டல்",
    peakSowSeasonEn: "Samba & Thaladi (Aug-Jan)",
    peakSowSeasonTa: "சம்பா மற்றும் தாளடி (ஆக-ஜன)",
    stapleCropsEn: "Paddy, Pulses (Rice Fallow)",
    stapleCropsTa: "நெல், உளுந்து / பயறு (நெல் தரிசு)",
  ),
  'Nagapattinam': TnDistrictBenchmark(
    paddyAreaHa: 67999,
    paddyProdTonnes: 177549,
    yieldKgHa: 2611,
    nemRainDev: "+31.0%",
    soilTypeEn: "Coastal Alluvium & Saline",
    soilTypeTa: "கடற்கரை வண்டல் & உவர் மண்",
    peakSowSeasonEn: "Samba (Aug-Jan) & Navarai (Dec-Apr)",
    peakSowSeasonTa: "சம்பா (ஆக-ஜன) & நவரை (டிச-ஏப்)",
    stapleCropsEn: "Paddy, Greengram, Blackgram",
    stapleCropsTa: "நெல், பாசிப்பயறு, உளுந்து",
  ),
  'Karur': TnDistrictBenchmark(
    paddyAreaHa: 14722,
    paddyProdTonnes: 54501,
    yieldKgHa: 3702,
    nemRainDev: "+35.4%",
    soilTypeEn: "Black Cotton & Red Sandy Clay",
    soilTypeTa: "கரிசல் மண் & செம்மண் கலவை",
    peakSowSeasonEn: "Samba (Oct-Feb) & Navarai (Jan-Apr)",
    peakSowSeasonTa: "சம்பா (அக்-பிப்) & நவரை (ஜன-ஏப்)",
    stapleCropsEn: "Paddy, Jowar (21.1k Ha), Cotton",
    stapleCropsTa: "நெல், சோளம் (21.1ஆ.ஹெக்), பருத்தி",
  ),
  'Pudukkottai': TnDistrictBenchmark(
    paddyAreaHa: 94173,
    paddyProdTonnes: 310179,
    yieldKgHa: 3294,
    nemRainDev: "+44.3%",
    soilTypeEn: "Red Laterite & Gravelly Clay",
    soilTypeTa: "செந்நிற சரளை மண் & களிமண்",
    peakSowSeasonEn: "Samba (Oct-Feb)",
    peakSowSeasonTa: "சம்பா பருவம் (அக்-பிப்)",
    stapleCropsEn: "Paddy, Groundnut (10.5k Ha), Sugarcane",
    stapleCropsTa: "நெல், நிலக்கடலை (10.5ஆ.ஹெக்), கரும்பு",
  ),
  'Perambalur': TnDistrictBenchmark(
    paddyAreaHa: 8241,
    paddyProdTonnes: 32553,
    yieldKgHa: 3950,
    nemRainDev: "+14.1%",
    soilTypeEn: "Deep Vertisols (Black Cotton)",
    soilTypeTa: "ஆழமான கரிசல் மண் (வெர்ட்டிசால்)",
    peakSowSeasonEn: "Maize Kharif (75.6k Ha) & Cotton",
    peakSowSeasonTa: "மக்காச்சோளம் காரிப் (75.6ஆ.ஹெக்) & பருத்தி",
    stapleCropsEn: "Maize (Top Producer: 4.22L Tonnes), Cotton",
    stapleCropsTa: "மக்காச்சோளம் (முதலிடம்: 4.22 இலட்சம் டன்), பருத்தி",
  ),
};

// =============================================================
// BILINGUAL TRANSLATION DICTIONARY (EN / தமிழ்)
// =============================================================
class I18n {
  static final Map<String, Map<String, String>> _strings = {
    'en': {
      'brand': 'AgriConnect',
      'brandTagline': 'Farm to Future • Tamil Nadu Delta',
      'tabCalculator': 'Calculator',
      'tabMap': 'Delta Map',
      'tabRoute': 'Fleet Route',
      'tabOrders': 'My Orders',
      'tabAdvisory': 'Water & Rain',
      'tabAssistant': 'AI Assistant',
      'targetDistrict': 'Target District',
      'cropType': 'Crop Type',
      'season': 'Sowing Season',
      'fieldArea': 'Cultivated Field Area',
      'seeds': 'Certified Seeds',
      'urea': 'Urea (Nitrogen)',
      'dap': 'DAP (Phosphorus)',
      'potash': 'Potash (K2O)',
      'pesticide': 'Bio-Pesticides',
      'requestAllocation': 'Request Supply Allocation',
      'dbtSavings': 'Farmer DBT Subsidy Savings',
      'commercialPrice': 'Market Rate',
      'subsidizedPrice': 'Cooperative Rate',
      'govBenefit': 'State DBT Benefit',
      'tnGovReport': 'TN Govt Ground Truth (2024-25)',
      'paddyCultivation': 'Paddy Cultivation',
      'totalProduction': 'Total Production',
      'officialYield': 'Observed Yield',
      'monsoonDev': 'Monsoon Deviation',
      'soilType': 'Soil Classification',
      'peakSeason': 'Primary Sowing Window',
      'changeIp': 'Configure Server IP',
      'logout': 'Sign Out',
      'instantDemoTitle': 'INSTANT EVALUATION ACCESS',
      'instantLoginBtn': '🚀 Launch Selected Demo Profile',
      'selectRole': 'Select Login Role:',
      'quotaSummary': 'Fertilizer Quota Meter (Subsidized)',
      'canalWaterTitle': 'Cauvery & Grand Anicut (கல்லணை) Canal Status',
      'metturStorage': 'Mettur Dam: 93.4 TMC',
      'canalDischarge': 'Discharge: 14,500 Cusecs',
      'canalStatusActive': '🟢 Active Irrigation Flow in Grand Anicut',
      'bookSuccessTitle': 'Requisition Confirmed & Dispatched!',
      'bookSuccessBtn': 'Track Delivery Status',
      'aiChatPrompt': 'Ask AgriConnect AI or tap mic...',
      'askQuota': 'What is my fertilizer quota balance?',
      'askWater': 'What is Cauvery canal irrigation status?',
      'askUrea': 'Is Urea in stock at Thanjavur depot?',
      'askPest': 'Remedy for paddy blast disease?',
      'voiceListening': 'Listening to voice... Speak now...',
      'voiceSpeak': '🔊 Listen Aloud',
      'voiceStop': '⏹️ Stop Voice',
      'mapTitle': 'Cauvery Delta Depot & Truck Radar',
      'tapToInspect': 'Tap any hub to inspect stock & book',
      'bookFromDepot': '📦 Book 1-Tap Requisition from Depot',
    },
    'ta': {
      'brand': 'அக்ரிகனெக்ட்',
      'brandTagline': 'விவசாயத்தின் எதிர்காலம் • காவிரி டெல்டா',
      'tabCalculator': 'உர கணிப்பான்',
      'tabMap': 'டெல்டா வரைபடம்',
      'tabRoute': 'லாரி பாதை',
      'tabOrders': 'என் ஆர்டர்கள்',
      'tabAdvisory': 'நீர் & வானிலை',
      'tabAssistant': 'AI உதவியாளர்',
      'targetDistrict': 'இலக்கு மாவட்டம்',
      'cropType': 'பயிர் வகை',
      'season': 'விதைப்பு பருவம்',
      'fieldArea': 'சாகுபடி பரப்பு',
      'seeds': 'சான்றளிக்கப்பட்ட விதைகள்',
      'urea': 'யூரியா (தழைச்சத்து)',
      'dap': 'டி.ஏ.பி (மணிச்சத்து)',
      'potash': 'பொட்டாஷ் (சாம்பல்ச்சத்து)',
      'pesticide': 'உயிர் பூச்சிக்கொல்லி',
      'requestAllocation': 'மானிய உரம் & விதை முன்பதிவு',
      'dbtSavings': 'விவசாயிகள் நேரடி மானிய சேமிப்பு (DBT)',
      'commercialPrice': 'வெளிச்சந்தை விலை',
      'subsidizedPrice': 'கூட்டுறவு மானிய விலை',
      'govBenefit': 'அரசு மானிய உதவித்தொகை',
      'tnGovReport': 'தமிழக அரசு அதிகாரப்பூர்வ அறிக்கை (2024-25)',
      'paddyCultivation': 'நெல் சாகுபடி பரப்பு',
      'totalProduction': 'மொத்த உற்பத்தி',
      'officialYield': 'அரசு கண்டறிந்த விளைச்சல்',
      'monsoonDev': 'பருவமழை மாறுபாடு',
      'soilType': 'மண் வகைப்பாடு',
      'peakSeason': 'முதன்மை விதைப்பு பருவம்',
      'changeIp': 'சர்வர் IP முகவரி மாற்று',
      'logout': 'வெளியேறு',
      'instantDemoTitle': 'ஒரே கிளிக்கில் மாதிரி உள்நுழைவு',
      'instantLoginBtn': '🚀 உடனடி மாதிரி உள்நுழைவு',
      'selectRole': 'பங்கைத் தேர்வு செய்க:',
      'quotaSummary': 'உர ஒதுக்கீடு இருப்பு அளவீடு (மானிய விலை)',
      'canalWaterTitle': 'காவிரி & கல்லணை கால்வாய் பாசன நீர் நிலை',
      'metturStorage': 'மேட்டூர் அணை: 93.4 டி.எம்.சி',
      'canalDischarge': 'கால்வாய் திறப்பு: 14,500 கனஅடி',
      'canalStatusActive':
          '🟢 கல்லணை கிளைக் கால்வாய்களில் பாசன நீர் சீராக பாய்கிறது',
      'bookSuccessTitle': 'உர முன்பதிவு உறுதி செய்யப்பட்டது!',
      'bookSuccessBtn': 'விநியோக நிலையை கண்காணிக்கவும்',
      'aiChatPrompt': 'AI-யிடம் கேளுங்கள் அல்லது மைக் அழுத்தவும்...',
      'askQuota': 'எனது உர ஒதுக்கீடு இருப்பு எவ்வளவு?',
      'askWater': 'காவிரி டெல்டா கால்வாய் நீர் நிலை என்ன?',
      'askUrea': 'தஞ்சாவூர் கிடங்கில் யூரியா இருப்பு உள்ளதா?',
      'askPest': 'நெல் இலை கருகல் நோய்க்கு தீர்வு என்ன?',
      'voiceListening': 'குரலைக் கேட்கிறது... பேசுங்கள்...',
      'voiceSpeak': '🔊 குரலில் கேள்',
      'voiceStop': '⏹️ நிறுத்து',
      'mapTitle': 'காவிரி டெல்டா கிடங்குகள் & லாரி ரேடார்',
      'tapToInspect': 'இருப்பு விவரங்களைக் காண மையத்தைத் தொடவும்',
      'bookFromDepot': '📦 கிடங்கிலிருந்து உடனடி முன்பதிவு செய்க',
    },
  };

  static String t(BuildContext context, String key) {
    final lang = HackDudeAgriApp.of(context).lang;
    return _strings[lang]?[key] ?? _strings['en']?[key] ?? key;
  }

  static String districtTa(String dist) {
    switch (dist) {
      case 'Thanjavur':
        return 'தஞ்சாவூர்';
      case 'Tiruchirappalli':
        return 'திருச்சிராப்பள்ளி';
      case 'Tiruvarur':
        return 'திருவாரூர்';
      case 'Nagapattinam':
        return 'நாகப்பட்டினம்';
      case 'Karur':
        return 'கரூர்';
      case 'Pudukkottai':
        return 'புதுக்கோட்டை';
      case 'Perambalur':
        return 'பெரம்பலூர்';
      case 'Kumbakonam':
        return 'கும்பகோணம்';
      default:
        return dist;
    }
  }

  static String cropTa(String crop) {
    if (crop.contains("Paddy")) return "நெல் (குறுவை / சம்பா)";
    if (crop.contains("Sugarcane")) return "கரும்பு (ஆண்டுப் பயிர்)";
    if (crop.contains("Cotton")) return "பருத்தி (குளிர்காலம்/கோடை)";
    if (crop.contains("Maize")) return "மக்காச்சோளம் (காரிப்/ரபி)";
    if (crop.contains("Groundnut")) return "நிலக்கடலை (பயறு வகை)";
    return crop;
  }
}

// =============================================================
// CAUVERY DELTA HUBS DATA
// =============================================================
class DeltaHub {
  final String id;
  final String nameEn;
  final String nameTa;
  final String districtEn;
  final String districtTa;
  final double x;
  final double y;
  final int ureaKg;
  final int dapKg;
  final int seedsKg;
  final String weather;
  final String distance;
  final bool isApex;

  const DeltaHub({
    required this.id,
    required this.nameEn,
    required this.nameTa,
    required this.districtEn,
    required this.districtTa,
    required this.x,
    required this.y,
    required this.ureaKg,
    required this.dapKg,
    required this.seedsKg,
    required this.weather,
    required this.distance,
    this.isApex = false,
  });
}

const List<DeltaHub> cauveryDeltaHubs = [
  DeltaHub(
    id: "hub_trichy",
    nameEn: "Trichy Apex Railway Hub",
    nameTa: "திருச்சி தலைமை ரயில்வே சேமிப்புக் கிடங்கு",
    districtEn: "Tiruchirappalli",
    districtTa: "திருச்சிராப்பள்ளி",
    x: 0.16,
    y: 0.48,
    ureaKg: 125000,
    dapKg: 64000,
    seedsKg: 38000,
    weather: "⛅ 31°C • மழை: 0mm",
    distance: "58.4 km",
    isApex: true,
  ),
  DeltaHub(
    id: "hub_thanjavur",
    nameEn: "Thanjavur Paddy Granary Depot",
    nameTa: "தஞ்சாவூர் நெற்களஞ்சியம் & PACCS கிடங்கு",
    districtEn: "Thanjavur",
    districtTa: "தஞ்சாவூர்",
    x: 0.45,
    y: 0.46,
    ureaKg: 58000,
    dapKg: 28000,
    seedsKg: 18500,
    weather: "🌧️ 28°C • மழை: 14mm",
    distance: "4.2 km (அருகில்)",
  ),
  DeltaHub(
    id: "hub_kumbakonam",
    nameEn: "Kumbakonam Wholesale Hub",
    nameTa: "கும்பகோணம் உர மொத்த விற்பனை மையம்",
    districtEn: "Kumbakonam",
    districtTa: "கும்பகோணம்",
    x: 0.60,
    y: 0.28,
    ureaKg: 42000,
    dapKg: 19500,
    seedsKg: 14000,
    weather: "🌦️ 29°C • மழை: 8mm",
    distance: "36.8 km",
  ),
  DeltaHub(
    id: "hub_tiruvarur",
    nameEn: "Tiruvarur Central Supply Depot",
    nameTa: "திருவாரூர் மத்திய வேளாண் விநியோக மையம்",
    districtEn: "Tiruvarur",
    districtTa: "திருவாரூர்",
    x: 0.72,
    y: 0.58,
    ureaKg: 34000,
    dapKg: 16000,
    seedsKg: 12000,
    weather: "🌧️ 28°C • மழை: 22mm",
    distance: "52.1 km",
  ),
  DeltaHub(
    id: "hub_nagapattinam",
    nameEn: "Nagapattinam Coastal Agro Port",
    nameTa: "நாகப்பட்டினம் கடற்கரை வேளாண் மையம்",
    districtEn: "Nagapattinam",
    districtTa: "நாகப்பட்டினம்",
    x: 0.88,
    y: 0.62,
    ureaKg: 28000,
    dapKg: 12500,
    seedsKg: 9500,
    weather: "🌧️ 27°C • மழை: 28mm",
    distance: "76.4 km",
  ),
];

// =============================================================
// SCREEN 1: PROFESSIONAL REAL LOGIN + 1-BUTTON INSTANT DEMO LOGIN
// =============================================================
class MobileAuthScreen extends StatefulWidget {
  final Function(Map<String, dynamic>) onLoginSuccess;
  const MobileAuthScreen({super.key, required this.onLoginSuccess});

  @override
  State<MobileAuthScreen> createState() => _MobileAuthScreenState();
}

class _MobileAuthScreenState extends State<MobileAuthScreen> {
  final _emailController = TextEditingController(
    text: "farmer.thanjavur@hackwell.agri",
  );
  final _passwordController = TextEditingController(text: "demo123456");
  bool isSignUp = false;
  bool isLoading = false;
  bool isPasswordVisible = false;
  String? errorMessage;
  int selectedDemoRoleIndex = 0;

  final List<Map<String, String>> demoRoles = [
    {
      "role": "Farmer",
      "name": "K. Arunkumar (திரு. கே. அருண்குமார்)",
      "email": "farmer.thanjavur@hackwell.agri",
      "tagEn": "🌾 Farmer (Thanjavur Samba)",
      "tagTa": "🌾 உழவர் (தஞ்சாவூர் சம்பா)",
      "subEn": "5.0 Ha Paddy Cultivator",
      "subTa": "5.0 ஹெக் நெல் சாகுபடியாளர்",
    },
    {
      "role": "Logistics Officer",
      "name": "Bala Sabarivasan (Lead)",
      "email": "officer.trichy@hackwell.agri",
      "tagEn": "🚚 Logistics Lead (Trichy)",
      "tagTa": "🚚 தளவாட அதிகாரி (திருச்சி)",
      "subEn": "Apex Railway Buffer Hub",
      "subTa": "தலைமை ரயில்வே கிடங்கு",
    },
    {
      "role": "Supplier",
      "name": "Ramesh Kumar (MFL)",
      "email": "supplier.mfl@hackwell.agri",
      "tagEn": "🧪 Supplier (MFL Chennai)",
      "tagTa": "🧪 உற்பத்தியாளர் (சென்னை)",
      "subEn": "Fertilizer Manufacturing",
      "subTa": "உர உற்பத்தி வளாகம்",
    },
    {
      "role": "Retailer",
      "name": "A. Selvam (PACCS Secretary)",
      "email": "retailer.kumbakonam@hackwell.agri",
      "tagEn": "🏪 Retailer (PACCS)",
      "tagTa": "🏪 கூட்டுறவு சங்கம் (கும்பகோணம்)",
      "subEn": "Distribution Counter",
      "subTa": "நேரடி விநியோக விற்பனை",
    },
  ];

  Future<void> _handleRealAuth() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      setState(() => errorMessage = "Please enter both email and password.");
      return;
    }

    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final app = HackDudeAgriApp.of(context);
    final hostCandidates = [
      app.backendHost,
      "192.168.137.60",
      "127.0.0.1",
      "10.0.2.2",
      "localhost",
      "10.139.34.253",
    ];

    // 1. Try FastAPI backend authentication
    for (final host in hostCandidates) {
      if (host.isEmpty) continue;
      try {
        final authEndpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
        final res = await http
            .post(
              Uri.parse("http://$host:8000$authEndpoint"),
              headers: {"Content-Type": "application/json"},
              body: jsonEncode({"email": email, "password": password}),
            )
            .timeout(const Duration(milliseconds: 3000));

        if (res.statusCode == 200) {
          final data = jsonDecode(utf8.decode(res.bodyBytes));
          if (data["user"] != null) {
            app.setBackendHost(host);
            widget.onLoginSuccess(Map<String, dynamic>.from(data["user"]));
            return;
          }
        }
      } catch (_) {}
    }

    // 2. Direct fallback
    widget.onLoginSuccess({
      "email": email,
      "full_name": email.contains("farmer")
          ? "K. Arunkumar (திரு. கே. அருண்குமார்)"
          : (email.contains("supplier") ? "Ramesh Kumar" : "Bala Sabarivasan"),
      "role": email.contains("farmer")
          ? "Farmer"
          : (email.contains("supplier") ? "Supplier" : "Logistics Officer"),
      "district": "Thanjavur",
    });
  }

  void _executeSingleInstantLogin() {
    final profile = demoRoles[selectedDemoRoleIndex];
    widget.onLoginSuccess({
      "email": profile["email"]!,
      "full_name": profile["name"]!,
      "role": profile["role"]!,
      "district": "Thanjavur",
    });
  }

  @override
  Widget build(BuildContext context) {
    final app = HackDudeAgriApp.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isTa = app.lang == "ta";
    final activeDemo = demoRoles[selectedDemoRoleIndex];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          // Language Switcher
          Container(
            margin: const EdgeInsets.only(right: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFCCFBF1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: TextButton.icon(
              onPressed: app.toggleLanguage,
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              ),
              icon: const Icon(
                Icons.language,
                size: 15,
                color: Color(0xFF0F766E),
              ),
              label: Text(
                app.lang == "en" ? "தமிழ்" : "English",
                style: const TextStyle(
                  color: Color(0xFF0F766E),
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
            ),
          ),
          IconButton(
            onPressed: app.toggleTheme,
            icon: Icon(
              isDark ? Icons.light_mode : Icons.dark_mode,
              size: 20,
              color: isDark ? const Color(0xFFFDE047) : const Color(0xFF0F766E),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // App Brand Mark (DU/DE Badge)
                  Center(
                    child: Container(
                      width: 58,
                      height: 58,
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF062D24), Color(0xFF0F766E)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: const Color(0xFF34D399),
                          width: 1.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF0F766E)
                                .withValues(alpha: 0.3),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "DU",
                            style: TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 17,
                              height: 1.0,
                            ),
                          ),
                          Text(
                            "DE",
                            style: TextStyle(
                              color: Color(0xFF34D399),
                              fontWeight: FontWeight.w900,
                              fontSize: 17,
                              height: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Brand Title
                  Text(
                    I18n.t(context, 'brand'),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -0.3,
                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    I18n.t(context, 'brandTagline'),
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF0F766E),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // =========================================================
                  // SECTION A: 1-BUTTON INSTANT DEMO LOGIN (SLEEK SEGMENTED)
                  // =========================================================
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      side: const BorderSide(
                        color: Color(0xFF10B981),
                        width: 1.2,
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    color: isDark
                        ? const Color(0xFF1E293B)
                        : const Color(0xFFF0FDF4),
                    child: Padding(
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.flash_on,
                                color: Color(0xFF16A34A),
                                size: 16,
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  I18n.t(context, 'instantDemoTitle'),
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF16A34A),
                                    letterSpacing: 0.4,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),

                          // Clean Role Selector Chips in 2x2 Grid / Wrap
                          Wrap(
                            spacing: 6,
                            runSpacing: 6,
                            children: List.generate(demoRoles.length, (i) {
                              final isSelected = selectedDemoRoleIndex == i;
                              final role = demoRoles[i];
                              return ChoiceChip(
                                label: Text(
                                  isTa ? role["tagTa"]! : role["tagEn"]!,
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: isSelected
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                    color: isSelected
                                        ? Colors.white
                                        : (isDark
                                              ? Colors.white70
                                              : Colors.black87),
                                  ),
                                ),
                                selected: isSelected,
                                selectedColor: const Color(0xFF0F766E),
                                backgroundColor: isDark
                                    ? const Color(0xFF0F172A)
                                    : Colors.white,
                                showCheckmark: false,
                                onSelected: (_) =>
                                    setState(() => selectedDemoRoleIndex = i),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                  side: BorderSide(
                                    color: isSelected
                                        ? const Color(0xFF0F766E)
                                        : Colors.grey.shade300,
                                  ),
                                ),
                              );
                            }),
                          ),
                          const SizedBox(height: 10),

                          // Active Selected Profile Info Banner
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF0F172A)
                                  : Colors.white,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: const Color(0xFFBBF7D0),
                              ),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.check_circle,
                                  size: 14,
                                  color: Color(0xFF16A34A),
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    "${activeDemo['name']} • ${isTa ? activeDemo['subTa'] : activeDemo['subEn']}",
                                    style: TextStyle(
                                      fontSize: 10.5,
                                      fontWeight: FontWeight.w600,
                                      color: isDark
                                          ? Colors.white70
                                          : const Color(0xFF166534),
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 10),

                          // THE ONE INSTANT LOGIN BUTTON
                          ElevatedButton.icon(
                            onPressed: _executeSingleInstantLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF0F766E),
                              foregroundColor: Colors.white,
                              elevation: 2,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            icon: const Icon(Icons.bolt, size: 18),
                            label: Text(
                              I18n.t(context, 'instantLoginBtn'),
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Divider between Instant & Real Login
                  Row(
                    children: [
                      Expanded(child: Divider(color: Colors.grey.shade300)),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: Text(
                          isTa
                              ? "அல்லது மின்னஞ்சல் மூலம்"
                              : "OR WITH CREDENTIALS",
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade500,
                          ),
                        ),
                      ),
                      Expanded(child: Divider(color: Colors.grey.shade300)),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // =========================================================
                  // SECTION B: REAL CREDENTIALS FORM
                  // =========================================================
                  Card(
                    elevation: 1,
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          if (errorMessage != null) ...[
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFEF2F2),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: const Color(0xFFFECACA),
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.error_outline,
                                    color: Color(0xFFDC2626),
                                    size: 15,
                                  ),
                                  const SizedBox(width: 6),
                                  Expanded(
                                    child: Text(
                                      errorMessage!,
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: Color(0xFFDC2626),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 10),
                          ],

                          // Email Input
                          TextField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: InputDecoration(
                              labelText: isTa
                                  ? "மின்னஞ்சல் முகவரி"
                                  : "Email Address",
                              labelStyle: const TextStyle(fontSize: 12),
                              prefixIcon: const Icon(
                                Icons.email_outlined,
                                size: 18,
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 10,
                              ),
                            ),
                          ),
                          const SizedBox(height: 10),

                          // Password Input with Visibility Toggle
                          TextField(
                            controller: _passwordController,
                            obscureText: !isPasswordVisible,
                            decoration: InputDecoration(
                              labelText: isTa ? "கடவுச்சொல்" : "Password",
                              labelStyle: const TextStyle(fontSize: 12),
                              prefixIcon: const Icon(
                                Icons.lock_outline,
                                size: 18,
                              ),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  isPasswordVisible
                                      ? Icons.visibility_off
                                      : Icons.visibility,
                                  size: 18,
                                ),
                                onPressed: () => setState(
                                  () => isPasswordVisible = !isPasswordVisible,
                                ),
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 10,
                              ),
                            ),
                          ),
                          const SizedBox(height: 14),

                          // Submit Real Login Button
                          ElevatedButton(
                            onPressed: isLoading ? null : _handleRealAuth,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: isDark
                                  ? const Color(0xFF14B8A6)
                                  : const Color(0xFF0F172A),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: isLoading
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : Text(
                                    isSignUp
                                        ? (isTa ? "பதிவு செய்க" : "Register")
                                        : (isTa ? "உள்நுழைக" : "Sign In"),
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13,
                                    ),
                                  ),
                          ),

                          const SizedBox(height: 6),
                          TextButton(
                            onPressed: () =>
                                setState(() => isSignUp = !isSignUp),
                            child: Text(
                              isSignUp
                                  ? (isTa
                                        ? "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக"
                                        : "Already have an account? Sign In")
                                  : (isTa
                                        ? "கணக்கு இல்லையா? புதிய பதிவு"
                                        : "Don't have an account? Register"),
                              style: const TextStyle(
                                color: Color(0xFF0F766E),
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// =============================================================
// MAIN NAVIGATION (NO APPBAR OVERFLOW & CLEAN MOBILE SIZING)
// =============================================================
class MainNavigationScreen extends StatefulWidget {
  final Map<String, dynamic> currentUser;
  final VoidCallback onLogout;
  const MainNavigationScreen({
    super.key,
    required this.currentUser,
    required this.onLogout,
  });

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;
  String? _activeRole;

  String get currentRole =>
      _activeRole ?? (widget.currentUser['role']?.toString() ?? 'Farmer');

  bool get isFarmer => currentRole.toLowerCase().contains('farmer');

  void _showAIAssistant() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => MobileAIAssistantModal(
        currentUser: widget.currentUser,
        currentRole: currentRole,
      ),
    );
  }

  void _showIpDialog() {
    final app = HackDudeAgriApp.of(context);
    final controller = TextEditingController(text: app.backendHost);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(I18n.t(context, 'changeIp')),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              "Set the backend host IPv4 to connect to FastAPI REST server:",
              style: TextStyle(fontSize: 12),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: controller,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: "192.168.137.60 or 10.0.2.2",
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel"),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF0F766E),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              app.setBackendHost(controller.text);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    "Backend server host set to ${controller.text}",
                  ),
                ),
              );
            },
            child: const Text("Save"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final app = HackDudeAgriApp.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Widget> screens = isFarmer
        ? [
            FarmerPredictorScreen(
              currentUser: widget.currentUser,
              onLogout: widget.onLogout,
            ),
            const CauveryDeltaMapScreen(),
            const OrdersTrackingScreen(),
            const AdvisoryScreen(),
          ]
        : [
            const DriverFleetScreen(),
            const CauveryDeltaMapScreen(),
            const OrdersTrackingScreen(),
            const AdvisoryScreen(),
          ];

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 10,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F766E), Color(0xFF10B981)],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.eco, size: 16, color: Colors.white),
            ),
            const SizedBox(width: 6),
            Text(
              I18n.t(context, 'brand'),
              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15),
            ),
          ],
        ),
        actions: [
          // Compact Role Badge
          InkWell(
            onTap: () {
              setState(() {
                _activeRole = isFarmer ? "Logistics Officer" : "Farmer";
                _currentIndex = 0;
              });
            },
            borderRadius: BorderRadius.circular(10),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
              decoration: BoxDecoration(
                color: isFarmer
                    ? const Color(0xFFDCFCE7)
                    : const Color(0xFFE0F2FE),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                isFarmer
                    ? (app.lang == 'ta' ? '🌾 உழவர்' : '🌾 Farmer')
                    : (app.lang == 'ta' ? '🚚 அதிகாரி' : '🚚 Officer'),
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.bold,
                  color: isFarmer
                      ? const Color(0xFF16A34A)
                      : const Color(0xFF0284C7),
                ),
              ),
            ),
          ),
          const SizedBox(width: 2),

          // Language Toggle
          TextButton(
            onPressed: app.toggleLanguage,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              minimumSize: const Size(36, 30),
            ),
            child: Text(
              app.lang == "en" ? "தமிழ்" : "EN",
              style: const TextStyle(
                color: Color(0xFF0F766E),
                fontWeight: FontWeight.bold,
                fontSize: 11,
              ),
            ),
          ),

          // Robot AI Quick Action
          IconButton(
            icon: const Icon(
              Icons.smart_toy_outlined,
              color: Color(0xFF0F766E),
              size: 20,
            ),
            padding: const EdgeInsets.all(4),
            constraints: const BoxConstraints(),
            tooltip: I18n.t(context, 'tabAssistant'),
            onPressed: _showAIAssistant,
          ),

          // Overflow menu (Guarantees zero overflow)
          PopupMenuButton<String>(
            padding: EdgeInsets.zero,
            icon: const Icon(Icons.more_vert, size: 20),
            onSelected: (val) {
              if (val == 'theme') {
                app.toggleTheme();
              } else if (val == 'ip') {
                _showIpDialog();
              } else if (val == 'role') {
                setState(() {
                  _activeRole = isFarmer ? "Logistics Officer" : "Farmer";
                  _currentIndex = 0;
                });
              } else if (val == 'logout') {
                widget.onLogout();
              }
            },
            itemBuilder: (ctx) => [
              PopupMenuItem(
                value: 'theme',
                child: Row(
                  children: [
                    Icon(isDark ? Icons.light_mode : Icons.dark_mode, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      isDark ? 'Light Mode' : 'Dark Mode',
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'ip',
                child: Row(
                  children: [
                    const Icon(Icons.wifi, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      I18n.t(context, 'changeIp'),
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'logout',
                child: Row(
                  children: [
                    const Icon(Icons.logout, size: 16, color: Colors.red),
                    const SizedBox(width: 8),
                    Text(
                      I18n.t(context, 'logout'),
                      style: const TextStyle(color: Colors.red, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: screens[_currentIndex >= screens.length ? 0 : _currentIndex],
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAIAssistant,
        backgroundColor: const Color(0xFF0F766E),
        foregroundColor: Colors.white,
        elevation: 3,
        icon: const Icon(Icons.auto_awesome, size: 18),
        label: Text(
          app.lang == 'ta' ? "AI குரல் & அரட்டை" : "AI Voice & Chat",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex >= screens.length ? 0 : _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        indicatorColor: const Color(0xFFCCFBF1),
        destinations: isFarmer
            ? [
                NavigationDestination(
                  icon: const Icon(Icons.calculate_outlined),
                  selectedIcon: const Icon(
                    Icons.calculate,
                    color: Color(0xFF0F766E),
                  ),
                  label: I18n.t(context, 'tabCalculator'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.map_outlined),
                  selectedIcon: const Icon(Icons.map, color: Color(0xFF0F766E)),
                  label: I18n.t(context, 'tabMap'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.inventory_2_outlined),
                  selectedIcon: const Icon(
                    Icons.inventory_2,
                    color: Color(0xFF0F766E),
                  ),
                  label: I18n.t(context, 'tabOrders'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.water_drop_outlined),
                  selectedIcon: const Icon(
                    Icons.water_drop,
                    color: Color(0xFF0F766E),
                  ),
                  label: I18n.t(context, 'tabAdvisory'),
                ),
              ]
            : [
                NavigationDestination(
                  icon: const Icon(Icons.local_shipping_outlined),
                  selectedIcon: const Icon(
                    Icons.local_shipping,
                    color: Color(0xFF0F766E),
                  ),
                  label: I18n.t(context, 'tabRoute'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.map_outlined),
                  selectedIcon: const Icon(Icons.map, color: Color(0xFF0F766E)),
                  label: I18n.t(context, 'tabMap'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.inventory_2_outlined),
                  selectedIcon: const Icon(
                    Icons.inventory_2,
                    color: Color(0xFF0F766E),
                  ),
                  label: I18n.t(context, 'tabOrders'),
                ),
                NavigationDestination(
                  icon: const Icon(Icons.water_drop_outlined),
                  selectedIcon: const Icon(
                    Icons.water_drop,
                    color: Color(0xFF0F766E),
                  ),
                  label: I18n.t(context, 'tabAdvisory'),
                ),
              ],
      ),
    );
  }
}

// =============================================================
// SCREEN 2: FARMER PREDICTOR & NECESSARY DETAILS (NO OVERFLOW)
// =============================================================
class FarmerPredictorScreen extends StatefulWidget {
  final Map<String, dynamic>? currentUser;
  final VoidCallback? onLogout;
  const FarmerPredictorScreen({super.key, this.currentUser, this.onLogout});

  @override
  State<FarmerPredictorScreen> createState() => _FarmerPredictorScreenState();
}

class _FarmerPredictorScreenState extends State<FarmerPredictorScreen> {
  String selectedDistrict = "Thanjavur";
  String selectedCrop = "Paddy (Rice)";
  String selectedSeason = "Kuruvai (Jun-Sep)";
  double areaHa = 5.0;

  bool isLoading = false;
  Map<String, dynamic>? predictionResult;

  final List<String> districts = [
    "Thanjavur",
    "Tiruchirappalli",
    "Tiruvarur",
    "Nagapattinam",
    "Karur",
    "Pudukkottai",
    "Perambalur",
  ];

  final List<Map<String, dynamic>> cropTypes = [
    {"name": "Paddy (Rice)", "icon": Icons.grass, "sub": "Kuruvai / Samba"},
    {"name": "Sugarcane", "icon": Icons.forest, "sub": "Annual Crop"},
    {"name": "Cotton", "icon": Icons.cloud_outlined, "sub": "Winter / Summer"},
    {"name": "Maize", "icon": Icons.grain, "sub": "Kharif / Rabi"},
    {"name": "Groundnut", "icon": Icons.circle, "sub": "Pod Legume"},
  ];

  @override
  void initState() {
    super.initState();
    _calculateDemand();
  }

  Future<void> _calculateDemand() async {
    setState(() => isLoading = true);

    final app = HackDudeAgriApp.of(context);
    final hostCandidates = [
      app.backendHost,
      "192.168.137.60",
      "127.0.0.1",
      "10.0.2.2",
      "localhost",
      "10.139.34.253",
    ];

    try {
      http.Response? response;
      for (final host in hostCandidates) {
        if (host.isEmpty) continue;
        try {
          final res = await http
              .post(
                Uri.parse("http://$host:8000/api/predict"),
                headers: {"Content-Type": "application/json"},
                body: jsonEncode({
                  "district": selectedDistrict,
                  "crop_type": selectedCrop,
                  "season": selectedSeason,
                  "cultivated_area_ha": areaHa,
                }),
              )
              .timeout(const Duration(milliseconds: 1800));

          if (res.statusCode == 200) {
            response = res;
            app.setBackendHost(host);
            break;
          }
        } catch (_) {}
      }

      if (response != null && response.statusCode == 200) {
        setState(() {
          predictionResult = jsonDecode(response!.body);
          isLoading = false;
        });
        return;
      }
    } catch (_) {}

    // ICAR & TNAU coefficient fallback
    double seedRate = selectedCrop.contains("Paddy")
        ? 40.0
        : (selectedCrop.contains("Sugarcane") ? 350.0 : 18.0);
    double ureaRate = selectedCrop.contains("Sugarcane")
        ? 450.0
        : (selectedCrop.contains("Paddy") ? 220.0 : 160.0);
    double dapRate = selectedCrop.contains("Paddy") ? 110.0 : 130.0;
    double potashRate = selectedCrop.contains("Sugarcane") ? 200.0 : 85.0;
    double pestRate = 3.5;

    setState(() {
      predictionResult = {
        "predictions": {
          "seed_demand_kg": (areaHa * seedRate).roundToDouble(),
          "urea_demand_kg": (areaHa * ureaRate).roundToDouble(),
          "dap_demand_kg": (areaHa * dapRate).roundToDouble(),
          "potash_demand_kg": (areaHa * potashRate).roundToDouble(),
          "pesticide_demand_l": (areaHa * pestRate).roundToDouble(),
          "total_fertilizer_kg": (areaHa * (ureaRate + dapRate + potashRate))
              .roundToDouble(),
        },
        "agronomic_advisories": [
          "Split Urea application into 3 stages: Basal, Tillering, and Panicle initiation.",
          "Maintain 3-5 cm water depth during transplanting.",
          "High humidity alert: Spray neem-based bio-pesticide during early vegetative growth.",
        ],
      };
      isLoading = false;
    });
  }

  void _bookAllocation() {
    final app = HackDudeAgriApp.of(context);
    final isTa = app.lang == "ta";

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(
                  backgroundColor: Color(0xFF0F766E),
                  radius: 16,
                  child: Icon(Icons.check, color: Colors.white, size: 18),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        I18n.t(context, 'bookSuccessTitle'),
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        "${isTa ? I18n.districtTa(selectedDistrict) : selectedDistrict} PACCS Depot",
                        style: TextStyle(
                          color: Colors.grey.shade600,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              isTa
                  ? "உங்கள் ஒதுக்கீடான ${predictionResult?['predictions']['total_fertilizer_kg']} கிலோ உரம் மற்றும் ${predictionResult?['predictions']['seed_demand_kg']} கிலோ சான்றளிக்கப்பட்ட விதைகள் உடனடி விநியோக வரிசையில் சேர்க்கப்பட்டது. உங்கள் மொபைலுக்கு SMS டோக்கன் அனுப்பப்பட்டுள்ளது."
                  : "Your allocation of ${predictionResult?['predictions']['total_fertilizer_kg']} kg fertilizer and ${predictionResult?['predictions']['seed_demand_kg']} kg certified seeds has been queued for priority dispatch.",
              style: const TextStyle(fontSize: 12, height: 1.4),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F766E),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                onPressed: () => Navigator.pop(ctx),
                child: Text(
                  I18n.t(context, 'bookSuccessBtn'),
                  style: const TextStyle(fontSize: 13),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final app = HackDudeAgriApp.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isTa = app.lang == "ta";
    final benchmark = tnBenchmarks[selectedDistrict];

    final double ureaKg =
        predictionResult?['predictions']?['urea_demand_kg']?.toDouble() ?? 1100;
    final double dapKg =
        predictionResult?['predictions']?['dap_demand_kg']?.toDouble() ?? 550;
    final double potashKg =
        predictionResult?['predictions']?['potash_demand_kg']?.toDouble() ??
        425;

    final commercialCost = (ureaKg * 38.0) + (dapKg * 62.0) + (potashKg * 44.0);
    final subsidizedCost = (ureaKg * 5.9) + (dapKg * 27.0) + (potashKg * 22.0);
    final govtBenefit = commercialCost - subsidizedCost;
    final savingsPct =
        ((govtBenefit / (commercialCost > 0 ? commercialCost : 1)) * 100)
            .round();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. FARMER PROFILE & QUOTA METER CARD
          Card(
            color: isDark ? const Color(0xFF1E293B) : const Color(0xFFECFDF5),
            shape: RoundedRectangleBorder(
              side: const BorderSide(color: Color(0xFF10B981), width: 1.2),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            const CircleAvatar(
                              radius: 15,
                              backgroundColor: Color(0xFF10B981),
                              child: Icon(
                                Icons.person,
                                color: Colors.white,
                                size: 16,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    isTa
                                        ? "திரு. கே. அருண்குமார் (உழவர்)"
                                        : "K. Arunkumar (Farmer)",
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  Text(
                                    "${isTa ? 'தஞ்சாவூர்' : 'Thanjavur'} • $areaHa Ha",
                                    style: TextStyle(
                                      fontSize: 10.5,
                                      color: isDark
                                          ? Colors.white70
                                          : Colors.grey.shade700,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F766E),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isTa ? "மானிய அட்டை" : "DBT: ACTIVE",
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 16),
                  Text(
                    I18n.t(context, 'quotaSummary'),
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 11,
                      color: Color(0xFF0F766E),
                    ),
                  ),
                  const SizedBox(height: 6),
                  _quotaRow("யூரியா / Urea", 250, 110, const Color(0xFF0F766E)),
                  const SizedBox(height: 5),
                  _quotaRow("டி.ஏ.பி / DAP", 125, 45, const Color(0xFF0284C7)),
                  const SizedBox(height: 5),
                  _quotaRow(
                    "பொட்டாஷ் / Potash",
                    100,
                    30,
                    const Color(0xFFD97706),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),

          // 2. METTUR DAM & GRAND ANICUT CANAL WATER STATUS
          Card(
            color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF0F9FF),
            shape: RoundedRectangleBorder(
              side: const BorderSide(color: Color(0xFF38BDF8), width: 1.2),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.water,
                        color: Color(0xFF0284C7),
                        size: 16,
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          I18n.t(context, 'canalWaterTitle'),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 11.5,
                            color: Color(0xFF0369A1),
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          I18n.t(context, 'metturStorage'),
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w600,
                            color: isDark ? Colors.white70 : Colors.black87,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          I18n.t(context, 'canalDischarge'),
                          style: const TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF0284C7),
                          ),
                          textAlign: TextAlign.right,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 3),
                  Text(
                    I18n.t(context, 'canalStatusActive'),
                    style: const TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF16A34A),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // 3. SELECTION CONTROLS
          Text(
            isTa
                ? "விளைநில விவரங்கள் & தேவை கணக்கீடு"
                : "Field Details & Demand Calculator",
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),

          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      I18n.t(context, 'targetDistrict'),
                      style: const TextStyle(
                        fontSize: 10.5,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 3),
                    DropdownButtonFormField<String>(
                      isExpanded: true,
                      initialValue: selectedDistrict,
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 6,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: districts
                          .map(
                            (d) => DropdownMenuItem(
                              value: d,
                              child: Text(
                                isTa ? I18n.districtTa(d) : d,
                                style: const TextStyle(fontSize: 11),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          )
                          .toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() => selectedDistrict = val);
                          _calculateDemand();
                        }
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      I18n.t(context, 'cropType'),
                      style: const TextStyle(
                        fontSize: 10.5,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 3),
                    DropdownButtonFormField<String>(
                      isExpanded: true,
                      initialValue: selectedCrop,
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 6,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                      items: cropTypes
                          .map(
                            (c) => DropdownMenuItem(
                              value: c["name"] as String,
                              child: Text(
                                isTa ? I18n.cropTa(c["name"]) : c["name"],
                                style: const TextStyle(fontSize: 11),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          )
                          .toList(),
                      onChanged: (val) {
                        if (val != null) {
                          setState(() => selectedCrop = val);
                          _calculateDemand();
                        }
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Field Area Slider Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        I18n.t(context, 'fieldArea'),
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        "${areaHa.toStringAsFixed(1)} Ha (${(areaHa * 2.471).toStringAsFixed(1)} Acres)",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0F766E),
                          fontSize: 11.5,
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: areaHa,
                    min: 0.5,
                    max: 30.0,
                    divisions: 59,
                    activeColor: const Color(0xFF0F766E),
                    onChanged: (val) {
                      setState(() => areaHa = val);
                      _calculateDemand();
                    },
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),

          // 4. RESULTS GRID
          if (isLoading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: CircularProgressIndicator(),
              ),
            )
          else if (predictionResult != null) ...[
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 6,
              crossAxisSpacing: 6,
              childAspectRatio: 1.8,
              children: [
                _supplyCard(
                  I18n.t(context, 'seeds'),
                  "${predictionResult!['predictions']['seed_demand_kg']} kg",
                  Icons.eco,
                  const Color(0xFF16A34A),
                ),
                _supplyCard(
                  I18n.t(context, 'urea'),
                  "${predictionResult!['predictions']['urea_demand_kg']} kg",
                  Icons.science_outlined,
                  const Color(0xFF0F766E),
                ),
                _supplyCard(
                  I18n.t(context, 'dap'),
                  "${predictionResult!['predictions']['dap_demand_kg']} kg",
                  Icons.pie_chart_outline,
                  const Color(0xFF0284C7),
                ),
                _supplyCard(
                  I18n.t(context, 'potash'),
                  "${predictionResult!['predictions']['potash_demand_kg']} kg",
                  Icons.diamond_outlined,
                  const Color(0xFFD97706),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // 5. OFFICIAL TN GOVT BENCHMARK CARD
            if (benchmark != null) ...[
              Card(
                color: isDark
                    ? const Color(0xFF1E293B)
                    : const Color(0xFFF0FDF4),
                shape: RoundedRectangleBorder(
                  side: BorderSide(
                    color: isDark
                        ? const Color(0xFF16A34A)
                        : const Color(0xFFBBF7D0),
                    width: 1.2,
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.verified,
                                  color: Color(0xFF16A34A),
                                  size: 14,
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    "${I18n.t(context, 'tnGovReport')} (${isTa ? I18n.districtTa(selectedDistrict) : selectedDistrict})",
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 10.5,
                                      color: Color(0xFF16A34A),
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 5,
                              vertical: 1,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFDCFCE7),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              "2024-25",
                              style: TextStyle(
                                fontSize: 8.5,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF16A34A),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Expanded(
                            child: _benchmarkTile(
                              I18n.t(context, 'paddyCultivation'),
                              "${benchmark.paddyAreaHa.toString()} Ha",
                              isDark,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _benchmarkTile(
                              I18n.t(context, 'totalProduction'),
                              "${benchmark.paddyProdTonnes.toString()} T",
                              isDark,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Expanded(
                            child: _benchmarkTile(
                              I18n.t(context, 'officialYield'),
                              "${benchmark.yieldKgHa.toString()} kg/Ha",
                              isDark,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: _benchmarkTile(
                              I18n.t(context, 'monsoonDev'),
                              benchmark.nemRainDev,
                              isDark,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],

            // 6. GOVERNMENT DBT SUBSIDY & SAVINGS CARD
            Card(
              color: isDark ? const Color(0xFF1E293B) : const Color(0xFFFFFBEB),
              shape: RoundedRectangleBorder(
                side: BorderSide(
                  color: isDark
                      ? const Color(0xFFF59E0B)
                      : const Color(0xFFFDE68A),
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              const Icon(
                                Icons.savings_outlined,
                                color: Color(0xFFD97706),
                                size: 14,
                              ),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  I18n.t(context, 'dbtSavings'),
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 11,
                                    color: Color(0xFFD97706),
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 5,
                            vertical: 1,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            "$savingsPct% SAVED",
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 9.5,
                              color: Color(0xFFD97706),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: _costColumn(
                            I18n.t(context, 'commercialPrice'),
                            "₹${commercialCost.round()}",
                            Colors.red.shade700,
                          ),
                        ),
                        Expanded(
                          child: _costColumn(
                            I18n.t(context, 'subsidizedPrice'),
                            "₹${subsidizedCost.round()}",
                            const Color(0xFF0F766E),
                          ),
                        ),
                        Expanded(
                          child: _costColumn(
                            I18n.t(context, 'govBenefit'),
                            "₹${govtBenefit.round()}",
                            const Color(0xFF16A34A),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 46,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F766E),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  elevation: 2,
                ),
                icon: const Icon(Icons.send, size: 16),
                label: Text(
                  I18n.t(context, 'requestAllocation'),
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                onPressed: _bookAllocation,
              ),
            ),
            const SizedBox(height: 10),
          ],
        ],
      ),
    );
  }

  Widget _quotaRow(String label, int total, int used, Color color) {
    final remain = total - used;
    final pct = (used / total).clamp(0.0, 1.0);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w600,
              ),
            ),
            Text(
              "$remain kg / $total kg",
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.bold,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        LinearProgressIndicator(
          value: pct,
          backgroundColor: Colors.grey.shade200,
          valueColor: AlwaysStoppedAnimation<Color>(color),
          minHeight: 4,
          borderRadius: BorderRadius.circular(3),
        ),
      ],
    );
  }

  Widget _benchmarkTile(String title, String val, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : Colors.white,
        borderRadius: BorderRadius.circular(6),
        border: Border.all(
          color: isDark ? const Color(0xFF334155) : const Color(0xFFDCFCE7),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 8.5,
              color: isDark ? Colors.white60 : Colors.black54,
              fontWeight: FontWeight.w600,
            ),
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            val,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0F766E),
            ),
          ),
        ],
      ),
    );
  }

  Widget _costColumn(String title, String price, Color color) {
    return Column(
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 8.5, color: Colors.grey),
          textAlign: TextAlign.center,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 1),
        Text(
          price,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }

  Widget _supplyCard(String title, String qty, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              children: [
                Icon(icon, size: 14, color: color),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: 9.5,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 2),
            Text(
              qty,
              style: TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================
// SCREEN 3: CAUVERY DELTA INTERACTIVE MAP
// =============================================================
class CauveryDeltaMapScreen extends StatefulWidget {
  const CauveryDeltaMapScreen({super.key});

  @override
  State<CauveryDeltaMapScreen> createState() => _CauveryDeltaMapScreenState();
}

class _CauveryDeltaMapScreenState extends State<CauveryDeltaMapScreen> {
  DeltaHub? _selectedHub = cauveryDeltaHubs[1];

  void _inspectHub(DeltaHub hub) {
    setState(() => _selectedHub = hub);
  }

  void _bookFromHub(DeltaHub hub) {
    final app = HackDudeAgriApp.of(context);
    final isTa = app.lang == "ta";

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          isTa
              ? "[${hub.nameTa}] கிடங்கில் 250 kg உரம் முன்பதிவு செய்யப்பட்டது! டோக்கன்: TK-${hub.id.substring(4).toUpperCase()}-99"
              : "Booked 250 kg fertilizer at [${hub.nameEn}]! Token: TK-${hub.id.substring(4).toUpperCase()}-99",
        ),
        backgroundColor: const Color(0xFF0F766E),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final app = HackDudeAgriApp.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isTa = app.lang == "ta";

    return SingleChildScrollView(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      I18n.t(context, 'mapTitle'),
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      I18n.t(context, 'tapToInspect'),
                      style: TextStyle(
                        fontSize: 10.5,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFDCFCE7),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  "LIVE",
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF16A34A),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Map Canvas with LayoutBuilder (Guarantees zero overflow)
          Card(
            clipBehavior: Clip.antiAlias,
            child: LayoutBuilder(
              builder: (ctx, constraints) {
                final mapW = constraints.maxWidth;
                const mapH = 240.0;

                return Container(
                  height: mapH,
                  width: mapW,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: isDark
                          ? [const Color(0xFF0F172A), const Color(0xFF1E293B)]
                          : [const Color(0xFFF0FDF4), const Color(0xFFE0F2FE)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Stack(
                    children: [
                      CustomPaint(
                        size: Size(mapW, mapH),
                        painter: CauveryRiverPainter(isDark: isDark),
                      ),
                      ...cauveryDeltaHubs.map((hub) {
                        final isSelected = _selectedHub?.id == hub.id;
                        final posX = (mapW - 36) * hub.x;
                        final posY = (mapH - 40) * hub.y;

                        return Positioned(
                          left: posX.clamp(4.0, mapW - 60.0),
                          top: posY.clamp(4.0, mapH - 50.0),
                          child: GestureDetector(
                            onTap: () => _inspectHub(hub),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? const Color(0xFF0F766E)
                                        : (hub.isApex
                                              ? const Color(0xFF0284C7)
                                              : Colors.white),
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isSelected
                                          ? Colors.white
                                          : const Color(0xFF0F766E),
                                      width: 1.5,
                                    ),
                                  ),
                                  child: Icon(
                                    hub.isApex ? Icons.train : Icons.warehouse,
                                    size: 13,
                                    color: isSelected || hub.isApex
                                        ? Colors.white
                                        : const Color(0xFF0F766E),
                                  ),
                                ),
                                const SizedBox(height: 1),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 3,
                                    vertical: 1,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isDark
                                        ? Colors.black87
                                        : Colors.white.withValues(alpha: 0.9),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    isTa ? hub.districtTa : hub.districtEn,
                                    style: TextStyle(
                                      fontSize: 8.5,
                                      fontWeight: FontWeight.bold,
                                      color: isSelected
                                          ? const Color(0xFF0F766E)
                                          : (isDark
                                                ? Colors.white
                                                : Colors.black87),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 10),

          if (_selectedHub != null) ...[
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                side: const BorderSide(color: Color(0xFF0F766E), width: 1.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                isTa
                                    ? _selectedHub!.nameTa
                                    : _selectedHub!.nameEn,
                                style: const TextStyle(
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0F766E),
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                "${_selectedHub!.distance} • ${_selectedHub!.weather}",
                                style: TextStyle(
                                  fontSize: 10,
                                  color: Colors.grey.shade600,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 5,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            isTa ? "இருப்பு உள்ளது" : "IN STOCK",
                            style: const TextStyle(
                              fontSize: 8.5,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF16A34A),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 14),
                    Row(
                      children: [
                        Expanded(
                          child: _hubStockCol(
                            isTa ? "யூரியா" : "Urea",
                            "${_selectedHub!.ureaKg} kg",
                            const Color(0xFF0F766E),
                          ),
                        ),
                        Expanded(
                          child: _hubStockCol(
                            isTa ? "DAP" : "DAP",
                            "${_selectedHub!.dapKg} kg",
                            const Color(0xFF0284C7),
                          ),
                        ),
                        Expanded(
                          child: _hubStockCol(
                            isTa ? "விதைகள்" : "Seeds",
                            "${_selectedHub!.seedsKg} kg",
                            const Color(0xFF16A34A),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      height: 38,
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F766E),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        icon: const Icon(Icons.shopping_bag_outlined, size: 14),
                        label: Text(
                          I18n.t(context, 'bookFromDepot'),
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        onPressed: () => _bookFromHub(_selectedHub!),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _hubStockCol(String label, String val, Color color) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 9.5, color: Colors.grey),
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 1),
        Text(
          val,
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
      ],
    );
  }
}

class CauveryRiverPainter extends CustomPainter {
  final bool isDark;
  CauveryRiverPainter({required this.isDark});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF38BDF8).withValues(alpha: isDark ? 0.3 : 0.4)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(size.width * 0.1, size.height * 0.45);
    path.cubicTo(
      size.width * 0.35,
      size.height * 0.48,
      size.width * 0.55,
      size.height * 0.42,
      size.width * 0.95,
      size.height * 0.65,
    );
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// =============================================================
// SCREEN 4: DRIVER FLEET SCREEN (NO OVERFLOW)
// =============================================================
class DriverFleetScreen extends StatefulWidget {
  const DriverFleetScreen({super.key});

  @override
  State<DriverFleetScreen> createState() => _DriverFleetScreenState();
}

class _DriverFleetScreenState extends State<DriverFleetScreen> {
  final List<Map<String, dynamic>> routeStops = [
    {
      "step": 1,
      "name": "Trichy Apex Central Hub",
      "nameTa": "திருச்சி தலைமை ரயில்வே சேமிப்புக் கிடங்கு",
      "action": "LOAD CARGO (25,000 kg)",
      "actionTa": "சரக்கு ஏற்றப்பட்டது (25,000 கிலோ)",
      "status": "COMPLETED",
    },
    {
      "step": 2,
      "name": "Cauvery Delta Farmers Depot",
      "nameTa": "தஞ்சாவூர் நெற்களஞ்சியம் & PACCS கிடங்கு",
      "action": "UNLOAD 12,000 kg Urea/DAP",
      "actionTa": "12,000 கிலோ உரம் இறக்கப்பட்டது",
      "status": "IN_PROGRESS",
    },
    {
      "step": 3,
      "name": "Tiruvarur Agro Supply Center",
      "nameTa": "திருவாரூர் மத்திய வேளாண் விநியோக மையம்",
      "action": "UNLOAD 6,500 kg Urea/Potash",
      "actionTa": "6,500 கிலோ உரம் இறக்கப்பட வேண்டும்",
      "status": "PENDING",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final app = HackDudeAgriApp.of(context);
    final isTa = app.lang == "ta";

    return SingleChildScrollView(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            color: const Color(0xFF0F172A),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Row(
                          children: [
                            const Icon(
                              Icons.local_shipping,
                              color: Color(0xFF38BDF8),
                              size: 24,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "TN-48-AB-2041",
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                  Text(
                                    isTa
                                        ? "16 டன் • பால சவரிவாசன்"
                                        : "16-Tonne • Bala Sabarivasan",
                                    style: const TextStyle(
                                      color: Colors.white70,
                                      fontSize: 10,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isTa ? "பயணத்தில்" : "ON ROUTE",
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9.5,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: Colors.white24, height: 16),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _statItem(isTa ? "மொத்தம்" : "Total", "254 km"),
                        const SizedBox(width: 18),
                        _statItem(isTa ? "நிறுத்தம்" : "Stops", "4 Depots"),
                        const SizedBox(width: 18),
                        _statItem(
                          isTa ? "CO2 சேமிப்பு" : "CO2 Saved",
                          "38.2 kg",
                        ),
                        const SizedBox(width: 18),
                        _statItem(isTa ? "நேரம்" : "ETA", "3h 40m"),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            isTa ? "விநியோக வழித்தடம்" : "Delivery Manifest",
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: routeStops.length,
            itemBuilder: (ctx, i) {
              final stop = routeStops[i];
              final isDone = stop["status"] == "COMPLETED";

              return Card(
                margin: const EdgeInsets.only(bottom: 8),
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundColor: isDone
                            ? const Color(0xFF10B981)
                            : const Color(0xFF0F766E),
                        child: Text(
                          "${stop['step']}",
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isTa ? stop["nameTa"] : stop["name"],
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                            Text(
                              isTa ? stop["actionTa"] : stop["action"],
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.grey.shade600,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      if (isDone)
                        const Icon(
                          Icons.check_circle,
                          color: Color(0xFF10B981),
                          size: 18,
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _statItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white60, fontSize: 9.5),
        ),
        const SizedBox(height: 1),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}

// =============================================================
// SCREEN 5: ORDERS TRACKING SCREEN
// =============================================================
class OrdersTrackingScreen extends StatelessWidget {
  const OrdersTrackingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = HackDudeAgriApp.of(context);
    final isTa = app.lang == "ta";

    final sampleOrders = [
      {
        "id": "ORD-TN-7821",
        "cropTa": "நெல் சம்பா - 5.0 ஹெக்",
        "cropEn": "Paddy Samba - 5.0 Ha",
        "itemsTa": "1,100 கிலோ யூரியா • 550 கிலோ DAP",
        "itemsEn": "1,100 kg Urea • 550 kg DAP",
        "status": "READY_FOR_PICKUP",
        "depotTa": "தஞ்சாவூர் தொடக்க கூட்டுறவு சங்கம் (PACCS)",
        "depotEn": "Thanjavur PACCS Depot",
        "token": "TN-7821-X9",
      },
      {
        "id": "ORD-TN-7822",
        "cropTa": "நெல் சம்பா - 8.5 ஹெக்",
        "cropEn": "Paddy Samba - 8.5 Ha",
        "itemsTa": "1,870 கிலோ யூரியா • 935 கிலோ DAP",
        "itemsEn": "1,870 kg Urea • 935 kg DAP",
        "status": "IN_TRANSIT",
        "depotTa": "திருவாரூர் மத்திய வேளாண் மையம்",
        "depotEn": "Tiruvarur Central Depot",
        "token": "TN-7822-B4",
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(14),
      itemCount: sampleOrders.length,
      itemBuilder: (ctx, i) {
        final o = sampleOrders[i];
        final isReady = o["status"] == "READY_FOR_PICKUP";

        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      o["id"]!,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: Color(0xFF0F766E),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: isReady
                            ? const Color(0xFFDCFCE7)
                            : const Color(0xFFE0F2FE),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        isReady
                            ? (isTa ? "கிடங்கில் தயார்" : "READY FOR PICKUP")
                            : (isTa ? "வழியில் வருகிறது" : "IN TRANSIT"),
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.bold,
                          color: isReady
                              ? const Color(0xFF16A34A)
                              : const Color(0xFF0284C7),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 5),
                Text(
                  isTa ? o["cropTa"]! : o["cropEn"]!,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  isTa ? o["itemsTa"]! : o["itemsEn"]!,
                  style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                ),
                const Divider(height: 14),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          const Icon(
                            Icons.pin_drop_outlined,
                            size: 13,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              isTa ? o['depotTa']! : o['depotEn']!,
                              style: const TextStyle(fontSize: 10.5),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      "Token: ${o['token']}",
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFD97706),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

// =============================================================
// SCREEN 6: ADVISORIES & WATER MONITOR
// =============================================================
class AdvisoryScreen extends StatelessWidget {
  const AdvisoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = HackDudeAgriApp.of(context);
    final isTa = app.lang == "ta";

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        _alertCard(
          isTa
              ? "வடகிழக்கு பருவமழை & பாசன நீர் எச்சரிக்கை"
              : "North-East Monsoon & Canal Advisory",
          isTa
              ? "காவிரி டெல்டா மாவட்டங்களில் அடுத்த 48 மணிநேரத்தில் மிதமான மழை பெய்யக்கூடும். மேட்டூர் அணையில் இருந்து 14,500 கனஅடி நீர் திறந்துவிடப்பட்டு கல்லணை கால்வாய்கள் நிரம்பி வருகின்றன."
              : "Cauvery Delta districts expected to receive moderate showers. Mettur release is 14,500 cusecs through Grand Anicut.",
          Icons.thunderstorm,
          Colors.amber.shade800,
          const Color(0xFFFFFBEB),
        ),
        const SizedBox(height: 8),
        _alertCard(
          isTa
              ? "பயிர் பாதுகாப்பு: நெல் இலை கருகல் எச்சரிக்கை"
              : "Pest Watch: Paddy Blast Alert",
          isTa
              ? "தஞ்சாவூர் சம்பா நெல்லில் இலைக்கருகல் அறிகுறிகள் தென்பட்டால் ட்ரைசைக்ளசோல் 75% WP @ 1 கிராம்/லிட்டர் மாலை வேளையில் தெளிக்கவும்."
              : "Spray Tricyclazole 75% WP @ 1 g/L during evening hours if blast spots are observed.",
          Icons.warning_amber_rounded,
          Colors.red.shade700,
          const Color(0xFFFEF2F2),
        ),
        const SizedBox(height: 8),
        _alertCard(
          isTa
              ? "சம்பா நெல் அடி உரம் மேலாண்மை (TNAU)"
              : "Basal Dressing for Samba Paddy (TNAU)",
          isTa
              ? "கடைசி உழவின் போது முழு அளவு டி.ஏ.பி (110 கிலோ/ஹெக்) மற்றும் 25% யூரியா இடுவதன் மூலம் வேர் வளர்ச்சி பலப்படும்."
              : "Apply full dose of DAP (110 kg/ha) and 25% of Urea during final puddling for robust root establishment.",
          Icons.eco,
          const Color(0xFF0F766E),
          const Color(0xFFF0FDF4),
        ),
      ],
    );
  }

  Widget _alertCard(
    String title,
    String desc,
    IconData icon,
    Color color,
    Color bg,
  ) {
    return Card(
      color: bg,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: color.withValues(alpha: 0.3)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 18),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 11.5,
                      color: color,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    desc,
                    style: const TextStyle(
                      fontSize: 10.5,
                      color: Colors.black87,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =============================================================
// SCREEN 7: REAL VOICE & TEXT GEMINI AI ASSISTANT MODAL
// =============================================================
class MobileAIAssistantModal extends StatefulWidget {
  final Map<String, dynamic> currentUser;
  final String currentRole;
  const MobileAIAssistantModal({
    super.key,
    required this.currentUser,
    required this.currentRole,
  });

  @override
  State<MobileAIAssistantModal> createState() => _MobileAIAssistantModalState();
}

class _MobileAIAssistantModalState extends State<MobileAIAssistantModal> {
  static const MethodChannel _voiceChannel = MethodChannel(
    'com.hackdude.agri/voice',
  );

  final TextEditingController _inputController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  bool _isListening = false;
  bool _isSpeaking = false;

  final List<Map<String, String>> _messages = [
    {
      "role": "assistant",
      "text": "வணக்கம்! நான் உங்கள் அக்ரிகனெக்ட் AI உதவியாளர். உங்கள் உர ஒதுக்கீடு, மேட்டூர் கால்வாய் நீர் பாசனம், மானியம் அல்லது பயிர் நோய் பற்றி பேசலாம்.",
    },
  ];

  @override
  void initState() {
    super.initState();
    _setupNativeVoiceHandler();
  }

  void _setupNativeVoiceHandler() {
    _voiceChannel.setMethodCallHandler((call) async {
      if (call.method == 'onSpeechResult') {
        final captured = call.arguments?.toString() ?? "";
        if (captured.isNotEmpty) {
          setState(() {
            _isListening = false;
            _inputController.text = captured;
          });
          _sendMessage(captured);
        }
      } else if (call.method == 'onSpeechError') {
        setState(() => _isListening = false);
      }
    });
  }

  Future<void> _startNativeVoiceListening() async {
    final app = HackDudeAgriApp.of(context);
    setState(() => _isListening = true);

    try {
      await _voiceChannel.invokeMethod('startListening', {'lang': app.lang});
    } catch (_) {
      // In case native recognition is busy/unavailable, cycle simulated voice prompt
      await Future.delayed(const Duration(milliseconds: 1400));
      if (mounted) {
        setState(() => _isListening = false);
        final prompt = app.lang == 'ta'
            ? "காவிரி டெல்டா கால்வாய் நீர் நிலை என்ன?"
            : "What is Cauvery canal irrigation status?";
        _sendMessage(prompt);
      }
    }
  }

  Future<void> _speakResponse(String text) async {
    final app = HackDudeAgriApp.of(context);
    setState(() => _isSpeaking = true);
    try {
      await _voiceChannel.invokeMethod('speak', {
        'text': text,
        'lang': app.lang,
      });
    } catch (_) {}
  }

  Future<void> _stopSpeaking() async {
    setState(() => _isSpeaking = false);
    try {
      await _voiceChannel.invokeMethod('stopSpeaking');
    } catch (_) {}
  }

  Future<void> _sendMessage(String userText) async {
    final text = userText.trim();
    if (text.isEmpty) return;

    _inputController.clear();
    setState(() {
      _messages.add({"role": "user", "text": text});
      _isLoading = true;
    });

    _scrollToBottom();

    final app = HackDudeAgriApp.of(context);
    final hostCandidates = [
      app.backendHost,
      "192.168.137.60",
      "127.0.0.1",
      "10.0.2.2",
      "localhost",
      "10.139.34.253",
    ];

    final requestBody = jsonEncode({
      "message": text,
      "user_role": widget.currentRole,
      "language": app.lang,
      "current_page": "Mobile App - Farmer Portal",
      "current_tab": "calculator",
      "page_context": {
        "farmer": widget.currentUser["full_name"],
        "district": "Thanjavur",
        "crop": "Paddy Samba",
        "area_ha": 5.0,
        "canal_flow": "14500 cusecs",
        "nearest_depot": "Thanjavur PACCS",
      },
    });

    for (final host in hostCandidates) {
      if (host.isEmpty) continue;
      for (final endpoint in ["/api/assistant/chat", "/api/ai-assistant"]) {
        try {
          final res = await http
              .post(
                Uri.parse("http://$host:8000$endpoint"),
                headers: {"Content-Type": "application/json"},
                body: requestBody,
              )
              .timeout(const Duration(milliseconds: 3500));

          if (res.statusCode == 200) {
            final data = jsonDecode(utf8.decode(res.bodyBytes));
            final reply = data["reply"] ?? data["text"] ?? "பதில் பெறப்பட்டது.";
            app.setBackendHost(host);
            if (mounted) {
              setState(() {
                _messages.add({"role": "assistant", "text": reply});
                _isLoading = false;
              });
              _scrollToBottom();
              _speakResponse(reply);
            }
            return;
          }
        } catch (_) {}
      }
    }

    // Smart Agronomic Fallback
    String fallbackReply;
    final lower = text.toLowerCase();
    final isTa = app.lang == "ta";

    if (lower.contains("quota") || text.contains("ஒதுக்கீடு")) {
      fallbackReply = isTa
          ? "உங்கள் 5.0 ஹெக்டேர் சம்பா நெல் நிலத்திற்கு: யூரியா 1,100 கிலோ (ஒதுக்கீடு 250 கிலோ/மாதம்), DAP 550 கிலோ, பொட்டாஷ் 425 கிலோ அனுமதிக்கப்பட்டுள்ளது. தஞ்சாவூர் PACCS கூட்டுறவு கிடங்கில் போதுமான இருப்பு உள்ளது."
          : "For your 5.0 Ha Samba Paddy: Allowed quota is 1,100 kg Urea, 550 kg DAP, and 425 kg Potash. Stocks are available at Thanjavur PACCS depot.";
    } else if (lower.contains("water") ||
        lower.contains("canal") ||
        text.contains("கால்வாய்") ||
        text.contains("மேட்டூர்")) {
      fallbackReply = isTa
          ? "மேட்டூர் அணை நீர் இருப்பு தற்போது 93.4 டி.எம்.சியாக உள்ளது. பாசனத்திற்காக 14,500 கனஅடி நீர் திறந்துவிடப்பட்டு கல்லணை வழியாக வெண்ணாறு மற்றும் காவிரி கிளைக் கால்வாய்களில் தடையின்றி பாய்கிறது."
          : "Mettur Dam storage is 93.4 TMC. 14,500 cusecs is being discharged through Grand Anicut into Cauvery and Vennar canal systems for Samba irrigation.";
    } else if (lower.contains("blast") ||
        lower.contains("pest") ||
        text.contains("கருகல்") ||
        text.contains("நோய்")) {
      fallbackReply = isTa
          ? "நெல் இலைக்கருகல் நோய்க்கு TNAU பரிந்துரை: ட்ரைசைக்ளசோல் 75% WP @ 1 கிராம்/லிட்டர் அல்லது எடifenபாஸ் 50% EC @ 1 மிலி/லிட்டர் மாலை வேளையில் தெளிக்கவும். தழைச்சத்து (யூரியா) இடுவதை தற்காலிகமாக குறைக்கவும்."
          : "For Paddy Blast disease: Spray Tricyclazole 75% WP @ 1 g/L or Edifenphos 50% EC @ 1 ml/L in the evening. Temporarily hold nitrogen application.";
    } else {
      fallbackReply = isTa
          ? "காவிரி டெல்டா வேளாண் தரவுகளின்படி உங்கள் கோரிக்கை பதிவு செய்யப்பட்டது. தஞ்சாவூர் PACCS கிடங்கில் யூரியா 58,000 கிலோ மற்றும் CR-1009 Sub-1 விதைகள் தயாராக உள்ளன."
          : "According to Cauvery Delta telemetry, 58,000 kg Urea and CR-1009 certified seeds are in stock at Thanjavur PACCS depot ready for dispatch.";
    }

    if (mounted) {
      setState(() {
        _messages.add({"role": "assistant", "text": fallbackReply});
        _isLoading = false;
      });
      _scrollToBottom();
      _speakResponse(fallbackReply);
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _stopSpeaking();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isTa = HackDudeAgriApp.of(context).lang == "ta";

    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF0F172A) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        children: [
          Container(
            margin: const EdgeInsets.only(top: 8, bottom: 6),
            width: 36,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey.shade400,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            child: Row(
              children: [
                Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0F766E), Color(0xFF10B981)],
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.auto_awesome,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        isTa
                            ? "அக்ரிகனெக்ட் குரல் AI உதவியாளர்"
                            : "AgriConnect Voice AI Assistant",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        isTa
                            ? "ஜெமினி AI & தமிழ்நாடு அரசு தரவுகள்"
                            : "Gemini AI & TN Ground Truth Telemetry",
                        style: TextStyle(
                          fontSize: 9.5,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
                if (_isSpeaking)
                  IconButton(
                    icon: const Icon(
                      Icons.volume_off,
                      color: Colors.red,
                      size: 20,
                    ),
                    tooltip: I18n.t(context, 'voiceStop'),
                    onPressed: _stopSpeaking,
                  ),
                IconButton(
                  icon: const Icon(Icons.close, size: 18),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Suggestion Chips (Horizontal Scroll)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Row(
              children: [
                _chip(
                  I18n.t(context, 'askQuota'),
                  () => _sendMessage(I18n.t(context, 'askQuota')),
                ),
                _chip(
                  I18n.t(context, 'askWater'),
                  () => _sendMessage(I18n.t(context, 'askWater')),
                ),
                _chip(
                  I18n.t(context, 'askUrea'),
                  () => _sendMessage(I18n.t(context, 'askUrea')),
                ),
                _chip(
                  I18n.t(context, 'askPest'),
                  () => _sendMessage(I18n.t(context, 'askPest')),
                ),
              ],
            ),
          ),

          // Message Bubbles
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              itemCount: _messages.length,
              itemBuilder: (ctx, i) {
                final m = _messages[i];
                final isUser = m["role"] == "user";
                return Align(
                  alignment: isUser
                      ? Alignment.centerRight
                      : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 3),
                    padding: const EdgeInsets.all(10),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.82,
                    ),
                    decoration: BoxDecoration(
                      color: isUser
                          ? const Color(0xFF0F766E)
                          : (isDark
                                ? const Color(0xFF1E293B)
                                : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          m["text"]!,
                          style: TextStyle(
                            fontSize: 11.5,
                            height: 1.35,
                            color: isUser
                                ? Colors.white
                                : (isDark ? Colors.white : Colors.black87),
                          ),
                        ),
                        if (!isUser) ...[
                          const SizedBox(height: 4),
                          InkWell(
                            onTap: () => _speakResponse(m["text"]!),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.volume_up,
                                  size: 13,
                                  color: Color(0xFF0F766E),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  I18n.t(context, 'voiceSpeak'),
                                  style: const TextStyle(
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF0F766E),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          if (_isListening)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              color: const Color(0xFFFEF3C7),
              child: Row(
                children: [
                  const Icon(Icons.mic, color: Colors.red, size: 16),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      I18n.t(context, 'voiceListening'),
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFB45309),
                      ),
                    ),
                  ),
                ],
              ),
            ),

          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(6),
              child: SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),

          // Input Bar (Mic + Textfield + Send)
          Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(
                    _isListening ? Icons.mic : Icons.mic_none,
                    color: _isListening ? Colors.red : const Color(0xFF0F766E),
                    size: 22,
                  ),
                  onPressed: _startNativeVoiceListening,
                ),
                Expanded(
                  child: TextField(
                    controller: _inputController,
                    decoration: InputDecoration(
                      hintText: I18n.t(context, 'aiChatPrompt'),
                      hintStyle: const TextStyle(fontSize: 11.5),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onSubmitted: (txt) => _sendMessage(txt),
                  ),
                ),
                const SizedBox(width: 6),
                CircleAvatar(
                  radius: 17,
                  backgroundColor: const Color(0xFF0F766E),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white, size: 14),
                    onPressed: () => _sendMessage(_inputController.text),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _chip(String label, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(right: 6),
      child: ActionChip(
        label: Text(label, style: const TextStyle(fontSize: 10.5)),
        backgroundColor: const Color(0xFFE0F2FE),
        labelStyle: const TextStyle(color: Color(0xFF0369A1)),
        onPressed: onTap,
        padding: const EdgeInsets.symmetric(horizontal: 4),
      ),
    );
  }
}
