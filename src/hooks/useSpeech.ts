import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSpeechReturn {
  speak: (text: string) => void;
  isSupported: boolean;
  isSpeaking: boolean;
  cancel: () => void;
}

export function useSpeech(): UseSpeechReturn {
  const isSupportedRef = useRef(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'speechSynthesis' in window;
      isSupportedRef.current = supported;
      setIsSupported(supported);
      return supported;
    };

    if (!checkSupport()) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const getSpanishVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const preferredLocales = ['es-ES', 'es-MX', 'es-AR', 'es-CO', 'es'];
    
    for (const locale of preferredLocales) {
      const voice = voices.find(v => v.lang.startsWith(locale));
      if (voice) return voice;
    }

    const anySpanish = voices.find(v => v.lang.startsWith('es'));
    if (anySpanish) return anySpanish;

    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupportedRef.current) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const voice = getSpanishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = 1.2;
    utterance.rate = 0.95;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [getSpanishVoice]);

  const cancel = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { speak, isSupported, isSpeaking, cancel };
}