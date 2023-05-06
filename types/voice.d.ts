declare global {
    interface Window {
        SpeechRecognition: typeof window.webkitSpeechRecognition;
        webkitSpeechRecognition: typeof window.webkitSpeechRecognition;
    }
}

export {};
