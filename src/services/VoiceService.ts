/*
 * VoiceService.ts
 * Wrapper for Web Speech API with TypeScript definitions
 */

// Extend Window interface for SpeechRecognition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

export class VoiceService {
    private recognition: any = null;
    private synthesis: SpeechSynthesis = window.speechSynthesis;
    public isListening: boolean = false;

    constructor() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
        }
    }

    startListening(onResult: (text: string) => void, onError: (err: any) => void) {
        if (!this.recognition) {
            onError("Voice recognition not supported in this browser.");
            return;
        }

        this.isListening = true;
        try {
            this.recognition.start();
        } catch (e) {
            // Sometimes start is called while already running
            console.warn("Speech recognition already started");
        }

        this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
            this.isListening = false;
        };

        this.recognition.onerror = (event: any) => {
            // Common error: 'no-speech' if user didn't say anything
            console.error("Speech recognition error", event.error);
            onError(event.error);
            this.isListening = false;
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };
    }

    speak(text: string) {
        if (!this.synthesis) return;

        // Cancel any pending speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.1;
        utterance.rate = 1.0;

        // Try to find a female voice
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
        if (preferredVoice) utterance.voice = preferredVoice;

        this.synthesis.speak(utterance);
    }
}
