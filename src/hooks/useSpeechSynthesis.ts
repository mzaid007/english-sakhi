"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechSpeed = "normal" | "turtle";

const RATES: Record<SpeechSpeed, number> = {
  normal: 0.85,
  turtle: 0.7,
};

function hasSpeech(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickIndianVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const byLang = (lang: string) =>
    voices.find((v) => v.lang.toLowerCase().replace("_", "-") === lang);

  return (
    byLang("en-in") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en-in")) ??
    byLang("en-gb") ??
    byLang("en-us") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("en")) ??
    voices[0] ??
    null
  );
}

export interface UseSpeechSynthesisResult {
  isSupported: boolean;
  isReady: boolean;
  isSpeaking: boolean;
  speak: (text: string, speed?: SpeechSpeed) => void;
  stop: () => void;
}

/** Indian English TTS via Web Speech API — prefers en-IN, rates 0.85 / 0.7. */
export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  /** Only cancel on unmount if this hook instance started the active utterance. */
  const ownsUtteranceRef = useRef(false);

  useEffect(() => {
    if (!hasSpeech()) {
      setIsSupported(false);
      setIsReady(true);
      return;
    }

    setIsSupported(true);
    const synth = window.speechSynthesis;

    function loadVoices() {
      voiceRef.current = pickIndianVoice(synth.getVoices());
      setIsReady(true);
    }

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      if (ownsUtteranceRef.current) {
        synth.cancel();
        ownsUtteranceRef.current = false;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (!hasSpeech()) return;
    window.speechSynthesis.cancel();
    ownsUtteranceRef.current = false;
    setIsSpeaking(false);
  }, []);

  const speak = useCallback((text: string, speed: SpeechSpeed = "normal") => {
    const trimmed = text.trim();
    if (!trimmed || !hasSpeech()) return;

    const synth = window.speechSynthesis;
    synth.cancel();
    ownsUtteranceRef.current = false;

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = "en-IN";
    utterance.rate = RATES[speed];
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = voiceRef.current ?? pickIndianVoice(synth.getVoices());
    if (voice) {
      voiceRef.current = voice;
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      ownsUtteranceRef.current = true;
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      ownsUtteranceRef.current = false;
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      ownsUtteranceRef.current = false;
      setIsSpeaking(false);
    };

    try {
      ownsUtteranceRef.current = true;
      synth.speak(utterance);
    } catch {
      ownsUtteranceRef.current = false;
      setIsSpeaking(false);
    }
  }, []);

  return { isSupported, isReady, isSpeaking, speak, stop };
}
