/**
 * AgriConnect Speech Engine (STT & TTS)
 * Battle-tested speech architecture referencing Diya / Clever-Bell gold standard:
 * - Async voice readiness discovery with voiceschanged listener
 * - Multi-language voice quality scoring (specialized for Tamil and Indian English)
 * - Phonetic text cleaner expanding currencies (₹ -> ரூபாய் / rupees), units, and symbols
 * - Sentence chunking under 160 characters to prevent Chromium TTS freeze
 * - 9-second pause/resume keepalive timer preventing Chrome audio suspension
 * - Robust Web Speech Recognition tracking both final & interim transcripts
 */

let cachedVoices = [];
let speakingToken = 0;
let keepAliveTimer = null;
let recognitionInstance = null;
let isAudioContextUnlocked = false;

// ----------------------------------------------------
// 1. Audio Context Unlocker (User Gesture Policy)
// ----------------------------------------------------
export function unlockAudioContext() {
  if (isAudioContextUnlocked) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      isAudioContextUnlocked = true;
    }
  } catch (_) {}
}

// ----------------------------------------------------
// 2. Voice Readiness & Discovery (Chromium Async Loader)
// ----------------------------------------------------
export function getVoicesReady() {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve([]);
    const have = window.speechSynthesis.getVoices();
    if (have && have.length > 0) {
      cachedVoices = have;
      return resolve(have);
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      cachedVoices = window.speechSynthesis.getVoices() || [];
      resolve(cachedVoices);
    };
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
    setTimeout(finish, 1800);
  });
}

// ----------------------------------------------------
// 3. Voice Quality Scoring Algorithm
// ----------------------------------------------------
function scoreVoice(voice, langTag) {
  const vLang = (voice.lang || '').replace('_', '-').toLowerCase();
  const targetTag = (langTag || 'en-IN').toLowerCase();
  const primaryTarget = targetTag.split('-')[0];
  const primaryVLang = vLang.split('-')[0];

  let score = 0;

  // Language match logic
  if (primaryTarget === 'ta') {
    if (vLang === 'ta-in' || vLang === 'ta') score += 120;
    else if (vLang.includes('ta') || (voice.name || '').toLowerCase().includes('tamil')) score += 110;
    else return -1;
  } else if (primaryTarget === 'en') {
    if (vLang === 'en-in') score += 100;
    else if (primaryVLang === 'en') score += 60;
    else return -1;
  } else if (primaryTarget === 'hi') {
    if (vLang === 'hi-in' || vLang === 'hi') score += 110;
    else if (primaryVLang === 'hi' || (voice.name || '').toLowerCase().includes('hindi')) score += 90;
    else return -1;
  } else {
    if (vLang === targetTag) score += 90;
    else if (primaryVLang === primaryTarget) score += 60;
    else return -1;
  }

  const label = ((voice.name || '') + ' ' + (voice.voiceURI || '')).toLowerCase();

  // Natural / Neural quality signals
  if (['natural', 'neural', 'online', 'enhanced', 'google', 'microsoft', 'apple'].some((q) => label.includes(q))) {
    score += 35;
  }

  // Known high-clarity Indian voices
  const preferredNames = [
    'valluvar', 'lekha', 'priya', 'kalpana', 'swara', 'veena', 'neerja', 'heera',
    'pallavi', 'shruti', 'samantha', 'karen', 'victoria', 'serena', 'zira', 'aria',
    'jenny', 'sonia', 'google தமிழ்', 'google tamil', 'google hindi', 'google uk english female'
  ];
  if (preferredNames.some((fn) => label.includes(fn)) || label.includes('female')) {
    score += 30;
  }

  if (voice.default) score += 5;
  return score;
}

export function pickBestVoice(langTag = 'en-IN') {
  if (!cachedVoices || !cachedVoices.length) {
    if ('speechSynthesis' in window) {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    }
  }
  if (!cachedVoices || !cachedVoices.length) return null;

  let best = null;
  let maxScore = -1;
  for (const v of cachedVoices) {
    const s = scoreVoice(v, langTag);
    if (s > maxScore) {
      maxScore = s;
      best = v;
    }
  }

  // Fallback to en-IN or generic English if no specific regional voice is installed
  if (!best) {
    for (const v of cachedVoices) {
      const s = scoreVoice(v, 'en-IN');
      if (s > maxScore) {
        maxScore = s;
        best = v;
      }
    }
  }

  return best || cachedVoices[0] || null;
}

// ----------------------------------------------------
// 4. Phonetic Text Cleaner (Currencies, Units, Markdown)
// ----------------------------------------------------
export function cleanTextForSpeech(text, langTag = 'en') {
  if (!text) return '';
  let t = text.replace(/[*_#`>-]/g, ' ');

  // Strip emojis & unicode pictographs
  t = t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '');
  t = t.replace(/[\r\n]+/g, '. ');

  const primary = (langTag || 'en').split('-')[0].toLowerCase();

  // Spoken currency expansion
  if (primary === 'ta') {
    t = t.replace(/₹\s*([0-9,.]+)/g, '$1 ரூபாய்');
    t = t.replace(/\bkg\b/gi, 'கிலோ');
    t = t.replace(/\bha\b/gi, 'ஹெக்டேர்');
    t = t.replace(/%/g, ' சதவீதம் ');
    t = t.replace(/\bPACS\b/gi, 'தொடக்க கூட்டுறவு சங்கம்');
    t = t.replace(/\bDBT\b/gi, 'நேரடி மானியம்');
  } else if (primary === 'hi') {
    t = t.replace(/₹\s*([0-9,.]+)/g, '$1 रुपये');
    t = t.replace(/\bkg\b/gi, 'किलो');
    t = t.replace(/\bha\b/gi, 'हेक्टेयर');
    t = t.replace(/%/g, ' प्रतिशत ');
  } else {
    t = t.replace(/₹\s*([0-9,.]+)/g, '$1 rupees');
    t = t.replace(/\bkg\b/gi, 'kilograms');
    t = t.replace(/\bha\b/gi, 'hectares');
    t = t.replace(/%/g, ' percent ');
    t = t.replace(/\bDBT\b/g, 'Direct Benefit Transfer');
  }

  return t.replace(/\s+/g, ' ').trim();
}

// ----------------------------------------------------
// 5. Sentence Chunking (Prevents Chrome 180-char freeze)
// ----------------------------------------------------
export function splitIntoChunks(text) {
  if (text.length <= 150) return [text];
  const chunks = [];
  const sentenceRegex = /([^.!?।॥。！？\n]+[.!?।॥。！？\n]+)/g;
  const parts = text.match(sentenceRegex) || [text];

  let current = '';
  for (const p of parts) {
    if ((current + ' ' + p).trim().length <= 150) {
      current = (current + ' ' + p).trim();
    } else {
      if (current) chunks.push(current);
      if (p.length <= 150) {
        current = p.trim();
      } else {
        const subwords = p.split(/([,;\s]+)/);
        let sub = '';
        for (const w of subwords) {
          if ((sub + w).length <= 150) {
            sub += w;
          } else {
            if (sub.trim()) chunks.push(sub.trim());
            sub = w;
          }
        }
        current = sub.trim();
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ----------------------------------------------------
// 6. Text-to-Speech (TTS) Execution Engine
// ----------------------------------------------------
export function stopSpeaking() {
  speakingToken++;
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

export async function speak(text, langTag = 'en-IN', { onStart, onEnd, onChunk } = {}) {
  stopSpeaking();
  unlockAudioContext();

  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  await getVoicesReady();
  const myToken = speakingToken;

  // Auto-detect Tamil / Hindi from text characters if langTag is 'auto' or generic
  let targetLang = langTag;
  if (/[\u0B80-\u0BFF]/.test(text)) {
    targetLang = 'ta-IN';
  } else if (/[\u0900-\u097F]/.test(text)) {
    targetLang = 'hi-IN';
  } else if (/[\u0C00-\u0C7F]/.test(text)) {
    targetLang = 'te-IN';
  } else if (!targetLang || targetLang === 'auto' || targetLang === 'en') {
    targetLang = 'en-IN';
  }

  const cleaned = cleanTextForSpeech(text, targetLang);
  if (!cleaned) {
    if (onEnd) onEnd();
    return;
  }

  const bestVoice = pickBestVoice(targetLang);
  const chunks = splitIntoChunks(cleaned);
  let index = 0;

  // Delay 65ms after cancel() to avoid Chromium cancel/speak race condition
  setTimeout(() => {
    if (myToken !== speakingToken) return;

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (_) {}

    if (onStart) onStart();

    // Chromium 15s freeze bug keepalive timer
    if (keepAliveTimer) clearInterval(keepAliveTimer);
    keepAliveTimer = setInterval(() => {
      if (myToken !== speakingToken) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
        return;
      }
      try {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } catch (_) {}
    }, 8500);

    function speakNext() {
      if (myToken !== speakingToken) return;
      if (index >= chunks.length) {
        if (keepAliveTimer) {
          clearInterval(keepAliveTimer);
          keepAliveTimer = null;
        }
        if (onEnd) onEnd();
        return;
      }

      const chunk = chunks[index++];
      if (onChunk) onChunk(chunk, index, chunks.length);

      const utterance = new SpeechSynthesisUtterance(chunk);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
      } else {
        utterance.lang = targetLang;
      }
      utterance.rate = targetLang.startsWith('ta') ? 0.90 : 1.0;
      utterance.pitch = 1.02;
      utterance.volume = 1.0;

      utterance.onend = () => {
        if (myToken !== speakingToken) return;
        setTimeout(speakNext, 70);
      };

      utterance.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        if (myToken !== speakingToken) return;
        setTimeout(speakNext, 70);
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
        setTimeout(speakNext, 70);
      }
    }

    speakNext();
  }, 65);
}

// ----------------------------------------------------
// 7. Speech-to-Text (STT) Recognition Engine
// ----------------------------------------------------
export function startListening({
  lang = 'en-IN',
  onStart = () => {},
  onInterim = () => {},
  onFinal = () => {},
  onError = () => {},
  onEnd = () => {}
}) {
  unlockAudioContext();
  stopSpeaking();
  stopListening();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('Speech Recognition is not supported in this browser. Please use Chrome/Edge.');
    return;
  }

  try {
    const recognition = new SpeechRecognition();
    recognitionInstance = recognition;

    // Normalizing language code (ta -> ta-IN, en -> en-IN)
    let boundLang = lang;
    if (boundLang === 'ta' || boundLang === 'ta-IN') boundLang = 'ta-IN';
    else if (boundLang === 'en' || boundLang === 'en-IN' || boundLang === 'auto') boundLang = 'en-IN';
    else if (boundLang === 'hi' || boundLang === 'hi-IN') boundLang = 'hi-IN';

    recognition.lang = boundLang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    let finalCaptured = '';
    let activeTranscript = '';

    recognition.onstart = () => {
      onStart();
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          finalCaptured += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      activeTranscript = (finalCaptured + ' ' + interim).trim();
      onInterim(activeTranscript);
    };

    recognition.onerror = (event) => {
      console.warn('STT Error Event:', event.error);
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      recognitionInstance = null;
      onEnd();
      const textToSend = (finalCaptured || activeTranscript).trim();
      if (textToSend) {
        onFinal(textToSend);
      }
    };

    recognition.start();
  } catch (err) {
    console.error('Error starting recognition:', err);
    if (onError) onError(err.message || 'STT start failed');
  }
}

export function stopListening() {
  if (recognitionInstance) {
    const rec = recognitionInstance;
    recognitionInstance = null;
    try {
      rec.stop();
    } catch (_) {
      try { rec.abort(); } catch (_) {}
    }
  }
}
