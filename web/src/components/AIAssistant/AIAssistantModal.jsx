import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  RotateCcw,
  X,
  ChevronDown,
  Check,
  AlertCircle,
  ArrowRight,
  Globe,
  Play,
  Square,
  Zap,
  MessageSquare,
  ShieldCheck,
  CornerDownLeft,
  ExternalLink,
  Layers,
  Leaf
} from 'lucide-react';
import {
  speak as engineSpeak,
  stopSpeaking as engineStopSpeaking,
  startListening as engineStartListening,
  stopListening as engineStopListening,
  unlockAudioContext
} from './speechEngine';

import AgriAILogo from './AgriAILogo';

// Supported Indian & Regional Languages
const SUPPORTED_LANGUAGES = [
  { code: 'ta-IN', name: 'Tamil', native: 'தமிழ்' },
  { code: 'en-IN', name: 'English (India)', native: 'English' },
  { code: 'auto', name: 'Auto Detect', native: 'தானியங்கி / Auto' },
  { code: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te-IN', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം' }
];

export default function AIAssistantModal({
  isOpen,
  onClose,
  currentRole = 'Farmer',
  activeTab = 'dashboard',
  pageName = 'Dashboard',
  pageContext = null,
  lang = 'en',
  onExecuteAction = () => {},
  darkMode = false,
  theme = {}
}) {
  const [selectedLang, setSelectedLang] = useState(lang === 'ta' ? 'ta-IN' : 'en-IN');

  useEffect(() => {
    if (lang === 'ta') setSelectedLang('ta-IN');
    else if (lang === 'en') setSelectedLang('en-IN');
  }, [lang]);

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: getInitialGreeting(currentRole, pageName),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: null
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceState, setVoiceState] = useState('IDLE'); // IDLE, LISTENING, THINKING, SPEAKING, ERROR
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  // Clean up speech synthesis & recognition on unmount or close
  useEffect(() => {
    return () => {
      engineStopSpeaking();
      engineStopListening();
    };
  }, []);

  function getInitialGreeting(role, page) {
    if (role === 'Farmer') {
      return `வணக்கம்! Welcome to AgriConnect AI.\n\nI can help you diagnose crop diseases, check subsidized fertilizer quotas (Urea, DAP, MOP), track your requisitions, or answer agricultural & general questions. How may I assist you on the **${page}** page today?`;
    }
    if (role === 'Retailer') {
      return `Hello! AgriConnect Retail AI at your service.\n\nI can help you monitor store inventory, spot low-stock items, prepare supplier requisitions, and track farmer counter orders on the **${page}** page. How can I assist you right now?`;
    }
    if (role === 'Distributor') {
      return `Greetings! AgriConnect Fleet & Logistics AI online.\n\nI can assist with transport route optimization, depot buffer stocks, live fleet transfers, and regional demand forecasting on the **${page}** page. What would you like to review?`;
    }
    return `Hello! AgriConnect Supply Grid AI Assistant online.\n\nI can help with state-level replenishment requisitions, warehouse buffer stocks, fertilizer production tracking, and supply grid distribution on the **${page}** page. How can I assist you?`;
  }

  // ----------------------------------------------------
  // Speech Handlers (Butter-smooth Speech Engine)
  // ----------------------------------------------------
  function handleToggleListening() {
    unlockAudioContext();
    if (voiceState === 'LISTENING') {
      engineStopListening();
      setVoiceState('IDLE');
      setInterimTranscript('');
    } else {
      engineStopSpeaking();
      const speechLang = selectedLang === 'auto' ? (lang === 'ta' ? 'ta-IN' : 'en-IN') : selectedLang;
      engineStartListening({
        lang: speechLang,
        onStart: () => {
          setVoiceState('LISTENING');
          setInterimTranscript('');
        },
        onInterim: (text) => {
          setInterimTranscript(text);
          setInputText(text);
        },
        onFinal: (finalText) => {
          setVoiceState('IDLE');
          setInterimTranscript('');
          setInputText('');
          handleSendMessage(finalText);
        },
        onError: (err) => {
          console.warn('STT Error:', err);
          setVoiceState(err === 'no-speech' ? 'IDLE' : 'ERROR');
          setInterimTranscript('');
        },
        onEnd: () => {
          setVoiceState('IDLE');
          setInterimTranscript('');
        }
      });
    }
  }

  function handleSpeakMessage(text, langTag = null) {
    unlockAudioContext();
    const effectiveLang = langTag || (selectedLang === 'auto' ? (detectTamilOrHindi(text) || 'en-IN') : selectedLang);
    engineSpeak(text, effectiveLang, {
      onStart: () => setVoiceState('SPEAKING'),
      onEnd: () => setVoiceState('IDLE')
    });
  }

  function handleStopSpeaking() {
    engineStopSpeaking();
    setVoiceState('IDLE');
  }

  function detectTamilOrHindi(text) {
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
    return null;
  }

  // ----------------------------------------------------
  // Send Message & Multimodal Reasoning
  // ----------------------------------------------------
  async function handleSendMessage(overrideText = null) {
    const textToSend = (overrideText !== null ? overrideText : inputText).trim();
    if (!textToSend || isLoading) return;

    engineStopSpeaking();
    engineStopListening();
    unlockAudioContext();

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setVoiceState('THINKING');

    const historyForBackend = messages.map((m) => ({
      role: m.role,
      content: m.content
    }));

    try {
      // 1. Try Backend Assistant Endpoint first
      const backendUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/assistant/chat`;
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversation_history: historyForBackend,
          user_role: currentRole,
          current_page: pageName,
          current_tab: activeTab,
          language: selectedLang,
          page_context: pageContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'I am here to help you across AgriConnect.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: data.action || null,
          lang: data.detected_language || 'en'
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsLoading(false);

        // Auto speak if enabled
        if (autoSpeakEnabled) {
          handleSpeakMessage(aiMsg.content, data.detected_language);
        } else {
          setVoiceState('IDLE');
        }
        return;
      }
    } catch (_) {
      // Proceed to Direct Gemini Client fallback
    }

    // 2. Direct Gemini Fallback Caller (Guarantees zero downtime)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

      const historyPrompt = historyForBackend.slice(-6).map((h) => `${h.role}: ${h.content}`).join('\n');
      const directPrompt = `You are AgriConnect Central AI Assistant. Respond strictly in JSON: {"reply": "...", "action": null, "detected_language": "en"}.
User Role: ${currentRole}
Current Page: ${pageName} (${activeTab})
Data Context: ${JSON.stringify(pageContext || {})}
Conversation History:
${historyPrompt}

Current User Message: ${textToSend}`;

      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: directPrompt }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 }
        })
      });

      if (geminiRes.ok) {
        const gData = await geminiRes.json();
        const raw = gData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw);
          const aiMsg = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: parsed.reply || raw,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: parsed.action || null,
            lang: parsed.detected_language || 'en'
          };
          setMessages((prev) => [...prev, aiMsg]);
          setIsLoading(false);
          if (autoSpeakEnabled) {
            handleSpeakMessage(aiMsg.content, parsed.detected_language);
          } else {
            setVoiceState('IDLE');
          }
          return;
        }
      }
    } catch (directErr) {
      console.error('Direct Gemini error:', directErr);
    }

    // Final fallback if offline
    const fallbackMsg = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: 'I could not connect to the network right now. Please check your internet connection or ask again.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: null,
      lang: 'en'
    };
    setMessages((prev) => [...prev, fallbackMsg]);
    setIsLoading(false);
    setVoiceState('IDLE');
  }

  // ----------------------------------------------------
  // Contextual Prompt Chips (Role + Page Adapted)
  // ----------------------------------------------------
  function getContextualSuggestions() {
    if (activeTab.includes('crop_doctor')) {
      return [
        'Explain this diagnosis in detail',
        'தமிழ்ல விளக்கம் சொல்லுங்க',
        'What organic medicine should I use?',
        'Will this disease spread to other crops?'
      ];
    }
    if (activeTab === 'predict') {
      return [
        'Summarize this demand forecast',
        'Which fertilizer has the highest demand?',
        'What should I order for next month?',
        'Explain how rainfall impacts this demand'
      ];
    }
    if (activeTab === 'radar' || activeTab === 'products') {
      return [
        'Which products are low in stock?',
        'Prepare restock requisition for Urea',
        'Show certified paddy seeds available',
        'Check depot buffer storage levels'
      ];
    }
    if (activeTab === 'map' || activeTab === 'transfers') {
      return [
        'Are there any transport delays right now?',
        'Show active rake points & fleet status',
        'Track my latest shipment',
        'Explain the distribution route'
      ];
    }
    if (currentRole === 'Farmer') {
      return [
        'Check my fertilizer quota savings',
        'என் தக்காளி பயிருக்கு என்ன உரம் போடலாம்?',
        'When will my order be ready for pickup?',
        'Explain photosynthesis simply'
      ];
    }
    return [
      'What are my key tasks today?',
      'Check pending requisitions',
      'Explain GST rates on agro fertilizers',
      'Help me draft a distributor message'
    ];
  }

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleStopSpeaking();
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '700px',
          height: '88vh',
          maxHeight: '820px',
          backgroundColor: darkMode ? '#0F172A' : '#FFFFFF',
          borderRadius: '22px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${darkMode ? '#1E293B' : '#E2E8F0'}`,
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* ========================================================
            MODAL HEADER: BRANDING + AUTO-SPEAK + VOICE CONTROLS
        ======================================================== */}
        <div
          style={{
            padding: '16px 20px',
            background: darkMode
              ? 'linear-gradient(135deg, #064E3B 0%, #0F172A 100%)'
              : 'linear-gradient(135deg, #0A3628 0%, #0F766E 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <AgriAILogo size={40} glowing={true} />
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  border: '2px solid #064E3B',
                  boxShadow: '0 0 8px #22C55E'
                }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                  AgriConnect AI
                </h3>
                <span
                  style={{
                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    color: '#4ADE80',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 7px',
                    borderRadius: '8px',
                    border: '1px solid rgba(74, 222, 128, 0.35)',
                    letterSpacing: '0.4px'
                  }}
                >
                  LIVE AI VOICE
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '11.5px', opacity: 0.9 }}>
                <span>Role: <strong>{currentRole}</strong></span>
                <span>•</span>
                <span>Page: <strong>{pageName}</strong></span>
              </div>
            </div>
          </div>

          {/* Action buttons: Auto-Speak, Reset, Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Auto-Speak Toggle */}
            <button
              onClick={() => {
                if (autoSpeakEnabled) handleStopSpeaking();
                setAutoSpeakEnabled(!autoSpeakEnabled);
              }}
              title={autoSpeakEnabled ? 'Auto-speak enabled (Click to mute)' : 'Auto-speak muted (Click to enable)'}
              style={{
                background: autoSpeakEnabled ? 'rgba(74, 222, 128, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                border: autoSpeakEnabled ? '1px solid #4ADE80' : 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                color: autoSpeakEnabled ? '#4ADE80' : '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: '700'
              }}
            >
              {autoSpeakEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span>{autoSpeakEnabled ? 'Voice ON' : 'Muted'}</span>
            </button>

            {/* Clear conversation */}
            <button
              onClick={() => {
                handleStopSpeaking();
                engineStopListening();
                setMessages([
                  {
                    id: 'welcome-reset',
                    role: 'assistant',
                    content: getInitialGreeting(currentRole, pageName),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    action: null
                  }
                ]);
              }}
              title="Reset Conversation"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '8px',
                padding: '7px',
                cursor: 'pointer',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RotateCcw size={17} />
            </button>

            {/* Close modal */}
            <button
              onClick={() => {
                handleStopSpeaking();
                engineStopListening();
                onClose();
              }}
              title="Close Assistant"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '8px',
                padding: '7px',
                cursor: 'pointer',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ========================================================
            VOICE STATE INDICATOR STRIP (Live Audio Feedback)
        ======================================================== */}
        {voiceState !== 'IDLE' && (
          <div
            style={{
              padding: '9px 18px',
              backgroundColor:
                voiceState === 'LISTENING'
                  ? '#047857'
                  : voiceState === 'SPEAKING'
                  ? '#0369A1'
                  : voiceState === 'ERROR'
                  ? '#B91C1C'
                  : '#4338CA',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  animation: 'pulse 1s infinite'
                }}
              />
              <span>
                {voiceState === 'LISTENING' && 'Listening to your speech (Tamil & English supported)... Speak now'}
                {voiceState === 'THINKING' && 'Gemini is reasoning over AgriConnect platform...'}
                {voiceState === 'SPEAKING' && 'Speaking answer aloud... (Tap microphone to interrupt)'}
                {voiceState === 'ERROR' && 'Speech recognition error. Tap mic button to retry.'}
              </span>
            </div>

            {voiceState === 'SPEAKING' && (
              <button
                onClick={handleStopSpeaking}
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Square size={10} fill="#FFFFFF" /> Stop Voice
              </button>
            )}
          </div>
        )}

        {/* ========================================================
            CONVERSATION MESSAGES SCROLL AREA
        ======================================================== */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: darkMode ? '#0B1120' : '#F8FAFC'
          }}
        >
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    maxWidth: '85%'
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isUser ? '#10B981' : '#0F766E',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '800',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {isUser ? currentRole[0] : <AgriAILogo size={26} glowing={false} />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      backgroundColor: isUser
                        ? '#0F766E'
                        : darkMode
                        ? '#1E293B'
                        : '#FFFFFF',
                      color: isUser ? '#FFFFFF' : darkMode ? '#F1F5F9' : '#0F172A',
                      fontSize: '13.5px',
                      lineHeight: 1.55,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      border: isUser
                        ? 'none'
                        : `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word'
                    }}
                  >
                    {m.content}

                    {/* Per-message Audio Replay Button (for Assistant responses) */}
                    {!isUser && (
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleSpeakMessage(m.content, m.lang)}
                          title="Listen to this message"
                          style={{
                            backgroundColor: darkMode ? '#334155' : '#F1F5F9',
                            border: `1px solid ${darkMode ? '#475569' : '#E2E8F0'}`,
                            color: darkMode ? '#94A3B8' : '#475569',
                            cursor: 'pointer',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '11px',
                            fontWeight: '700',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#10B981';
                            e.currentTarget.style.borderColor = '#10B981';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = darkMode ? '#94A3B8' : '#475569';
                            e.currentTarget.style.borderColor = darkMode ? '#475569' : '#E2E8F0';
                          }}
                        >
                          <Volume2 size={13} />
                          <span>Listen Aloud</span>
                        </button>
                      </div>
                    )}

                    {/* Action Confirmation Card (If proposed by AI) */}
                    {m.action && (
                      <div
                        style={{
                          marginTop: '12px',
                          padding: '12px',
                          borderRadius: '10px',
                          backgroundColor: darkMode ? '#0F172A' : '#F0FDF4',
                          border: '1px solid #86EFAC',
                          color: darkMode ? '#F8FAFC' : '#065F46'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800', fontSize: '12px', color: '#16A34A', marginBottom: '4px' }}>
                          <Zap size={14} /> PROPOSED ACTION (REQUIRES CONFIRMATION)
                        </div>
                        <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '8px' }}>
                          {m.action.title || m.action.type}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              onExecuteAction(m.action);
                              setMessages((prev) =>
                                prev.map((item) =>
                                  item.id === m.id
                                    ? {
                                        ...item,
                                        content: `${item.content}\n\n✅ Action confirmed & executed successfully.`
                                      }
                                    : item
                                )
                              );
                            }}
                            style={{
                              backgroundColor: '#16A34A',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Check size={14} /> Confirm & Execute
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10.5px',
                    color: darkMode ? '#64748B' : '#94A3B8',
                    marginTop: '4px',
                    marginRight: isUser ? '42px' : '0',
                    marginLeft: !isUser ? '42px' : '0'
                  }}
                >
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {/* Interim speech recognition live preview */}
          {interimTranscript && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0.85 }}>
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: '16px 4px 16px 16px',
                  backgroundColor: '#047857',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontStyle: 'italic',
                  boxShadow: '0 4px 12px rgba(4, 120, 87, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80', animation: 'pulse 0.8s infinite' }} />
                <span>{interimTranscript}...</span>
              </div>
            </div>
          )}

          {/* Thinking skeleton */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#0F766E',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={18} />
              </div>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '4px 16px 16px 16px',
                  backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'bounce 0.6s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'bounce 0.6s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'bounce 0.6s infinite 0.4s' }} />
                <span style={{ fontSize: '12px', color: darkMode ? '#94A3B8' : '#64748B', marginLeft: '6px', fontWeight: '600' }}>
                  Gemini reasoning...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========================================================
            CONTEXTUAL PROMPT SUGGESTION CHIPS
        ======================================================== */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: darkMode ? '#0F172A' : '#F1F5F9',
            borderTop: `1px solid ${darkMode ? '#1E293B' : '#E2E8F0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: '800', color: darkMode ? '#94A3B8' : '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} color="#10B981" /> Prompts:
          </span>
          {getContextualSuggestions().map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
              style={{
                backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                color: darkMode ? '#E2E8F0' : '#0F766E',
                border: `1px solid ${darkMode ? '#334155' : '#CBD5E1'}`,
                borderRadius: '16px',
                padding: '4px 11px',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10B981';
                e.currentTarget.style.color = '#10B981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = darkMode ? '#334155' : '#CBD5E1';
                e.currentTarget.style.color = darkMode ? '#E2E8F0' : '#0F766E';
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* ========================================================
            INPUT BAR: TEXT CHAT + VOICE RECORDING BUTTON
        ======================================================== */}
        <div
          style={{
            padding: '14px 20px',
            backgroundColor: darkMode ? '#0F172A' : '#FFFFFF',
            borderTop: `1px solid ${darkMode ? '#1E293B' : '#E2E8F0'}`,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            position: 'relative'
          }}
        >
          {/* Language selector toggle */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              title="Select Language"
              style={{
                backgroundColor: darkMode ? '#1E293B' : '#F1F5F9',
                border: `1px solid ${darkMode ? '#334155' : '#CBD5E1'}`,
                borderRadius: '10px',
                padding: '8px 10px',
                color: darkMode ? '#E2E8F0' : '#334155',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Globe size={15} color="#10B981" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.native?.split(' ')[0] || 'Auto'}</span>
              <ChevronDown size={13} />
            </button>

            {showLangMenu && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '48px',
                  left: 0,
                  width: '180px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  backgroundColor: darkMode ? '#1E293B' : '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  border: `1px solid ${darkMode ? '#334155' : '#E2E8F0'}`,
                  zIndex: 100,
                  padding: '6px'
                }}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => {
                      setSelectedLang(l.code);
                      setShowLangMenu(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: selectedLang === l.code ? '800' : '500',
                      color: selectedLang === l.code ? '#10B981' : darkMode ? '#E2E8F0' : '#1E293B',
                      backgroundColor: selectedLang === l.code ? (darkMode ? '#0F766E' : '#DCFCE7') : 'transparent',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{l.native}</span>
                    {selectedLang === l.code && <Check size={13} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick 1-Tap Tamil / English Toggle */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              onClick={() => {
                setSelectedLang('ta-IN');
                if (voiceState === 'SPEAKING') handleStopSpeaking();
              }}
              title="Switch AI voice & speech to தமிழ் (Tamil)"
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                border: selectedLang === 'ta-IN' ? '1.5px solid #10B981' : `1px solid ${darkMode ? '#334155' : '#CBD5E1'}`,
                backgroundColor: selectedLang === 'ta-IN' ? (darkMode ? '#064E3B' : '#DCFCE7') : (darkMode ? '#1E293B' : '#F8FAFC'),
                color: selectedLang === 'ta-IN' ? (darkMode ? '#6EE7B7' : '#166534') : (darkMode ? '#94A3B8' : '#64748B'),
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              தமிழ்
            </button>
            <button
              onClick={() => {
                setSelectedLang('en-IN');
                if (voiceState === 'SPEAKING') handleStopSpeaking();
              }}
              title="Switch AI voice & speech to English"
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                border: selectedLang === 'en-IN' ? '1.5px solid #10B981' : `1px solid ${darkMode ? '#334155' : '#CBD5E1'}`,
                backgroundColor: selectedLang === 'en-IN' ? (darkMode ? '#064E3B' : '#DCFCE7') : (darkMode ? '#1E293B' : '#F8FAFC'),
                color: selectedLang === 'en-IN' ? (darkMode ? '#6EE7B7' : '#166534') : (darkMode ? '#94A3B8' : '#64748B'),
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              English
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            placeholder={
              voiceState === 'LISTENING'
                ? (selectedLang === 'ta-IN' ? '🎤 தமிழில் பேசுங்கள்... (Listening in Tamil...)' : '🎤 Speak now... (Listening in English...)')
                : (selectedLang === 'ta-IN' ? 'கேள்வி கேளுங்கள் (பயிர், உரம், அரசு மானியம்)...' : 'Ask AgriConnect AI (crop health, fertilizers, orders, general questions)...')
            }
            value={inputText}
            onChange={(e) => {
              if (voiceState === 'SPEAKING') handleStopSpeaking();
              setInputText(e.target.value);
            }}
            onKeyDown={(e) => {
              if (voiceState === 'SPEAKING') handleStopSpeaking();
              if (e.key === 'Enter') handleSendMessage();
            }}
            disabled={isLoading || voiceState === 'LISTENING'}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '12px',
              backgroundColor: darkMode ? '#1E293B' : '#F8FAFC',
              border: `1px solid ${darkMode ? '#334155' : '#CBD5E1'}`,
              color: darkMode ? '#F1F5F9' : '#0F172A',
              fontSize: '13.5px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
          />

          {/* Voice Microphone Assistant Button */}
          <button
            onClick={handleToggleListening}
            title={voiceState === 'LISTENING' ? 'Stop Listening' : 'Speak to AI (English & Tamil)'}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: voiceState === 'LISTENING' ? '#EF4444' : '#0F766E',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: voiceState === 'LISTENING' ? '0 0 14px rgba(239, 68, 68, 0.6)' : 'none',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            {voiceState === 'LISTENING' ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Send text button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            title="Send Message"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: inputText.trim() && !isLoading ? '#10B981' : darkMode ? '#334155' : '#E2E8F0',
              color: inputText.trim() && !isLoading ? '#FFFFFF' : darkMode ? '#64748B' : '#94A3B8',
              border: 'none',
              cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
