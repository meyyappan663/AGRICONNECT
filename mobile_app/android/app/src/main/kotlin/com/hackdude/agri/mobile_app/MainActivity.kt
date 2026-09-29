package com.hackdude.agri.mobile_app

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.util.Locale

class MainActivity : FlutterActivity(), TextToSpeech.OnInitListener {
    private val CHANNEL = "com.hackdude.agri/voice"
    private var tts: TextToSpeech? = null
    private var isTtsReady = false
    private var speechRecognizer: SpeechRecognizer? = null
    private var methodChannel: MethodChannel? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        tts = TextToSpeech(this, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isTtsReady = true
        }
    }

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        methodChannel = MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL)
        methodChannel?.setMethodCallHandler { call, result ->
            when (call.method) {
                "speak" -> {
                    val text = call.argument<String>("text") ?: ""
                    val lang = call.argument<String>("lang") ?: "ta"
                    speakText(text, lang, result)
                }
                "stopSpeaking" -> {
                    tts?.stop()
                    result.success(true)
                }
                "isTtsAvailable" -> {
                    result.success(isTtsReady)
                }
                "startListening" -> {
                    val lang = call.argument<String>("lang") ?: "ta"
                    startListening(lang, result)
                }
                "stopListening" -> {
                    stopListening()
                    result.success(true)
                }
                else -> result.notImplemented()
            }
        }
    }

    private fun speakText(text: String, lang: String, result: MethodChannel.Result) {
        if (tts == null || !isTtsReady) {
            result.error("TTS_NOT_READY", "TextToSpeech engine not initialized", null)
            return
        }
        val locale = if (lang == "ta") {
            Locale("ta", "IN")
        } else {
            Locale("en", "IN")
        }
        val langResult = tts?.setLanguage(locale)
        if (langResult == TextToSpeech.LANG_MISSING_DATA || langResult == TextToSpeech.LANG_NOT_SUPPORTED) {
            tts?.setLanguage(Locale.getDefault())
        }
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "agri_tts_id")
        result.success(true)
    }

    private fun startListening(lang: String, result: MethodChannel.Result) {
        runOnUiThread {
            if (!SpeechRecognizer.isRecognitionAvailable(this)) {
                result.error("NOT_AVAILABLE", "Speech recognition not available on this device", null)
                return@runOnUiThread
            }
            try {
                speechRecognizer?.destroy()
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this)
                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, if (lang == "ta") "ta-IN" else "en-IN")
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
                }
                speechRecognizer?.setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {}
                    override fun onBeginningOfSpeech() {}
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {}
                    override fun onError(error: Int) {
                        methodChannel?.invokeMethod("onSpeechError", error)
                    }
                    override fun onResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (!matches.isNullOrEmpty()) {
                            methodChannel?.invokeMethod("onSpeechResult", matches[0])
                        }
                    }
                    override fun onPartialResults(partialResults: Bundle?) {}
                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
                speechRecognizer?.startListening(intent)
                result.success(true)
            } catch (e: Exception) {
                result.error("SPEECH_ERROR", e.message, null)
            }
        }
    }

    private fun stopListening() {
        runOnUiThread {
            speechRecognizer?.stopListening()
            speechRecognizer?.destroy()
            speechRecognizer = null
        }
    }

    override fun onDestroy() {
        tts?.stop()
        tts?.shutdown()
        speechRecognizer?.destroy()
        super.onDestroy()
    }
}
