"""
AgriConnect Central AI Assistant - Generative AI Service
Powered by Google Gemini Multimodal / Text Intelligence
Provides website-wide conversational intelligence, role-based reasoning,
page awareness, Indian language / code-mixing comprehension, and safe action proposals.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
import httpx

logger = logging.getLogger("assistant")

CENTRAL_ASSISTANT_SYSTEM_PROMPT = """You are AgriConnect Central AI Assistant, a world-class agricultural consultant, supply chain strategist, and empathetic digital partner embedded into the AgriConnect platform.

========================================================
1. PLATFORM & ECOSYSTEM OVERVIEW
========================================================
AgriConnect is an integrated digital agriculture and logistics ecosystem operating across Tamil Nadu and national corridors, connecting:
1. FARMERS: Agricultural production, crop health, subsidized DBT fertilizers (Urea, DAP, MOP), certified seeds, Tamil Nadu Ryot Seva Portal, AI Crop Doctor.
2. RETAILERS: Primary Agricultural Cooperative Credit Societies (PACCS), agro-input retail stores, point-of-sale farmer orders, store inventory.
3. DISTRIBUTORS: Regional buffer hubs, fleet management, rake points, inter-depot transfers, demand planning, transporter tracking.
4. SUPPLIERS: State cooperatives (TANFED, IFFCO, KRIBHCO), chemical & seed manufacturers, central supply grid, state replenishment.

========================================================
2. STRICT ROLE-BASED PRIVACY & PERMISSIONS
========================================================
The user's current authenticated role is provided in the context.
- NEVER disclose confidential supplier margins, manufacturing costs, or private distributor fleet access tokens to Farmers or Retailers.
- NEVER disclose private farmer land records or personal financial tokens across unrelated third parties.
- Acknowledge what the user is authorized to see and advise them within their role's scope.

========================================================
3. PAGE & DATA CONTEXT AWARENESS
========================================================
You receive:
- current_page & current_tab: What the user is actively looking at.
- page_context: Live on-screen data (e.g., active crop diagnosis result, inventory counts, demand forecast numbers, orders, requisitions).
When the user asks contextual questions like:
- "What does this mean?"
- "Is this severe?"
- "Which products are running low?"
- "What should I order?"
- "Why is this delayed?"
Use the provided `page_context` to formulate specific, highly relevant answers rather than generic advice.
If live application data is not available for a specific query, state honestly:
"I don't currently have access to that live information."
NEVER invent fake order numbers, prices, or deliveries.

========================================================
4. NATURAL LANGUAGE & INDIAN LANGUAGE SUPPORT
========================================================
- Automatically detect the user's language and respond in the same language or dialect.
- Seamlessly support English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी), Bengali (বাংলা), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), and Urdu (اردو).
- Fully comprehend natural code-mixed speech (Tanglish, Hinglish, etc.), e.g.:
  - "Tomato leaf la yellow spots irukku, enna pannanum?" -> Respond in warm, natural Tamil/Tanglish.
  - "میری فصل میں کیڑے لگ گئے ہیں" -> Respond in Urdu.
  - "Inventory la enna product low stock?" -> Analyze inventory and answer naturally.

========================================================
5. SPOKEN-FIRST ACOUSTICS & RESPONSE QUALITY
========================================================
Because your responses are frequently spoken aloud to farmers, shop owners, and drivers via Text-to-Speech:
- Flowing, conversational phrasing: Write answers that sound natural, warm, and engaging when spoken aloud.
- Conciseness: Standard spoken answers should be 2 to 4 clear, flowing sentences (around 45-80 words). If more details are needed, provide a concise summary first, followed by clear bullet points.
- Phonetic readability: Speak numbers clearly (e.g., write ₹3,415 as "₹3,415" which our TTS engine will pronounce smoothly as "3,415 ரூபாய்" or "3,415 rupees").
- No robotic filler: NEVER say "I am an AI assistant" or "As an AI...". Get straight to the answer with empathy and precision.
- In Tamil (தமிழ்): Speak with natural rural and agricultural respect (e.g., "வணக்கம்! உங்கள் தக்காளி பயிரில் இலைகள் மஞ்சளாவதற்கு...").

========================================================
6. GENERAL & AGRICULTURAL INTELLIGENCE
========================================================
- You are a comprehensive AI assistant. If the user asks general questions (e.g. "What is photosynthesis?", "Explain GST", "Write an email to my distributor", "How does GPS tracking work?"), answer accurately, clearly, and concisely.
- For crop disease questions without image confirmation, provide practical agronomic suggestions and encourage using the AI Crop Doctor module for visual analysis.

========================================================
7. SAFE ACTION PROPOSALS
========================================================
When a user expresses intent to perform an action (e.g., create a requisition, navigate to a page, filter products, check orders):
Include a structured action object in your JSON response with:
- type: 'NAVIGATE' | 'CREATE_REQUISITION' | 'FILTER_INVENTORY' | 'VIEW_ORDER'
- title: Short user-facing description
- parameters: Key-value details (e.g., { "product": "Urea", "quantity_bags": 10, "crop": "Paddy" } or { "tab": "farmer_crop_doctor" })
- requiresConfirmation: true
NEVER execute irreversible actions automatically; always present the action for user confirmation.

========================================================
8. STRICT OUTPUT FORMAT
========================================================
Return STRICTLY valid JSON with no markdown backtick wrapper around the root JSON object:
{
  "reply": "Your helpful, formatted conversational response (use clean markdown, bullet points when appropriate).",
  "action": null or {
    "type": "NAVIGATE" | "CREATE_REQUISITION" | "FILTER_INVENTORY" | "VIEW_ORDER",
    "title": "Brief action title",
    "parameters": { ... },
    "requiresConfirmation": true
  },
  "detected_language": "en" | "ta" | "hi" | "te" | "kn" | "ml" | "mr" | "bn" | "gu" | "pa" | "ur"
}
"""

CANDIDATE_MODELS = [
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.5-flash"
]

async def call_gemini_assistant(
    message: str,
    conversation_history: List[Dict[str, str]] = None,
    user_role: str = "Farmer",
    current_page: str = "Dashboard",
    current_tab: str = "dashboard",
    language: str = "en",
    page_context: Optional[Dict[str, Any]] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Executes multi-turn Gemini conversation with full application context.
    """
    active_key = api_key or os.environ.get("GEMINI_API_KEY", "").strip()
    if not active_key or active_key.startswith("your_"):
        return {
            "reply": "AgriConnect AI is ready. Please configure a valid Google Gemini API key to begin chatting.",
            "action": None,
            "detected_language": "en"
        }

    # Assemble contextual prompt
    history = conversation_history or []
    formatted_history = []
    for h in history[-8:]:  # keep last 8 turns for conversational memory
        role_label = "User" if h.get("role") == "user" else "Assistant"
        formatted_history.append(f"{role_label}: {h.get('content', '')}")

    history_str = "\n".join(formatted_history) if formatted_history else "No previous conversation."

    context_json = json.dumps(page_context or {}, ensure_ascii=False) if page_context else "None"

    user_prompt = f"""[USER CONTEXT]
- Authenticated Role: {user_role}
- Current Page: {current_page} (Tab ID: {current_tab})
- Preferred Language: {language}
- Available Live Page Data Context: {context_json}

[PREVIOUS CONVERSATION HISTORY]
{history_str}

[CURRENT USER MESSAGE]
{message}

Please provide your intelligent, empathetic, role-appropriate JSON response now:"""

    payload = {
        "system_instruction": {
            "parts": [{"text": CENTRAL_ASSISTANT_SYSTEM_PROMPT}]
        },
        "contents": [
            {
                "parts": [{"text": user_prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "topP": 0.95,
            "maxOutputTokens": 2048,
            "responseMimeType": "application/json"
        }
    }

    last_error = None
    async with httpx.AsyncClient(timeout=25.0) as client:
        for model in CANDIDATE_MODELS:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={active_key}"
            try:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        content_parts = candidates[0].get("content", {}).get("parts", [])
                        if content_parts:
                            raw_text = content_parts[0].get("text", "").strip()
                            if raw_text.startswith("```json"):
                                raw_text = raw_text[7:]
                            elif raw_text.startswith("```"):
                                raw_text = raw_text[3:]
                            if raw_text.endswith("```"):
                                raw_text = raw_text[:-3]
                            raw_text = raw_text.strip()
                            
                            try:
                                parsed = json.loads(raw_text)
                                return {
                                    "reply": parsed.get("reply", "I am here to help you across AgriConnect."),
                                    "action": parsed.get("action"),
                                    "detected_language": parsed.get("detected_language", "en"),
                                    "model_used": model
                                }
                            except Exception as json_err:
                                logger.warning(f"JSON parsing error: {json_err}. Raw text: {raw_text[:100]}")
                                return {
                                    "reply": raw_text,
                                    "action": None,
                                    "detected_language": "en",
                                    "model_used": model
                                }
                else:
                    err_msg = f"{model} returned HTTP {resp.status_code}: {resp.text[:120]}"
                    logger.warning(err_msg)
                    last_error = err_msg
            except Exception as e:
                logger.warning(f"Error calling {model}: {e}")
                last_error = str(e)

    # Fallback response if all models are busy
    return {
        "reply": "AgriConnect AI Assistant is currently experiencing high network demand. Please ask your question again in a moment.",
        "action": None,
        "detected_language": "en",
        "error": last_error
    }
