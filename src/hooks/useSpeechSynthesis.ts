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

function voiceScore(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase().replace("_", "-");
  const name = voice.name.toLowerCase();
  let score = 0;

  if (lang === "en-in" || lang.startsWith("en-in")) score += 100;
  else if (lang.startsWith("en-gb")) score += 40;
  else if (lang.startsWith("en")) score += 20;
  else score -= 50;

  // The "I" lines are बनाती हूँ — prefer a woman's Indian voice (Heera) over Ravi.
  if (/female|heera|aditi|neerja|swara|kajal|priya|veena/.test(name)) score += 25;
  if (/male|ravi|prabhat|hemant|david|mark/.test(name)) score -= 15;
  return score;
}

function pickIndianVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  return [...voices].sort((a, b) => voiceScore(b) - voiceScore(a))[0] ?? null;
}

export interface UseSpeechSynthesisResult {
  isSupported: boolean;
  /** False until the first client check. Do not show "no voice" before this. */
  hasChecked: boolean;
  /** True only after the check, when this phone has no speechSynthesis. */
  audioUnavailable: boolean;
  isReady: boolean;
  isSpeaking: boolean;
  speak: (text: string, speed?: SpeechSpeed) => void;
  stop: () => void;
}

/** Indian English TTS via Web Speech API — prefers en-IN, rates 0.85 / 0.7. */
export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSupported, setIsSupported] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  /** Only cancel on unmount if this hook instance started the active utterance. */
  const ownsUtteranceRef = useRef(false);

  useEffect(() => {
    const supported = hasSpeech();
    setIsSupported(supported);
    setHasChecked(true);

    if (!supported) {
      setIsReady(true);
      return;
    }

    const synth = window.speechSynthesis;

    function loadVoices() {
      const voices = synth.getVoices();
      if (voices.length === 0) return;
      voiceRef.current = pickIndianVoice(voices);
      setIsReady(true);
    }

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    const giveUpWaiting = window.setTimeout(() => setIsReady(true), 700);

    return () => {
      window.clearTimeout(giveUpWaiting);
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

  return {
    isSupported,
    hasChecked,
    audioUnavailable: hasChecked && !isSupported,
    isReady,
    isSpeaking,
    speak,
    stop,
  };
}
