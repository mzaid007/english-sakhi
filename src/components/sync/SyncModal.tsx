"use client";

import { motion } from "framer-motion";
import { Cloud, CloudOff, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

interface SyncModalProps {
  open: boolean;
  onClose: () => void;
  onSynced: () => void;
  onSignedOut?: () => void;
  isSynced?: boolean;
  userEmail?: string | null;
  onSignOut?: () => Promise<void>;
}

type Step = "email" | "checkEmail" | "connected";

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

function authRedirectTo(): string {
  if (typeof window === "undefined") return "https://english-sakhi.vercel.app";
  return `${window.location.origin}/`;
}

/**
 * Passwordless sync via email magic link (default Supabase mailer — no custom SMTP).
 * Digit OTP needs a custom email template, which requires SMTP; we don't use that path.
 */
export function SyncModal({
  open,
  onClose,
  onSynced,
  onSignedOut,
  isSynced = false,
  userEmail = null,
  onSignOut,
}: SyncModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [messageHi, setMessageHi] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setMessageHi(null);
    if (isSynced) {
      setStep("connected");
      return;
    }
    setStep("email");
  }, [open, isSynced]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || isSynced) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") {
        onSynced();
        setStep("connected");
        setMessageHi("क्लाउड से जुड़ गए।");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [open, isSynced, onSynced]);

  async function sendMagicLink() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessageHi(
        "क्लाउड कुंजी नहीं मिली। Vercel पर NEXT_PUBLIC_SUPABASE_URL और NEXT_PUBLIC_SUPABASE_ANON_KEY सेट कर Redeploy करें।",
      );
      return;
    }
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessageHi(
        "ईमेल अंग्रेज़ी अक्षरों में होता है — उसमें @ और डॉट होना चाहिए।",
      );
      return;
    }

    setBusy(true);
    setMessageHi(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: authRedirectTo(),
      },
    });
    setBusy(false);

    if (error) {
      setMessageHi("ईमेल भेजने में समस्या हुई — बाद में कोशिश करें।");
      return;
    }

    setStep("checkEmail");
    setMessageHi(null);
  }

  async function handleSignOut() {
    if (!onSignOut) return;
    setBusy(true);
    setMessageHi(null);
    try {
      await onSignOut();
      setStep("email");
      setEmail("");
      setMessageHi("क्लाउड बंद हो गया। इस फ़ोन की प्रगति सुरक्षित है।");
      onSignedOut?.();
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-sakhi-ink/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sync-modal-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={spring}
            className="w-full max-w-md rounded-3xl bg-cream p-5 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Cloud className="h-6 w-6 text-sakhi-emerald" aria-hidden />
                <h2
                  id="sync-modal-title"
                  className="font-hindi text-lg font-semibold text-sakhi-ink"
                >
                  {step === "connected"
                    ? "क्लाउड सिंक"
                    : "प्रगति सुरक्षित करें"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="बंद करें"
                className="inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center rounded-full hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === "connected" ? (
              <div className="flex flex-col gap-4">
                <p className="font-hindi text-sm leading-relaxed text-sakhi-muted">
                  आप क्लाउड से जुड़े हैं। प्रगति दूसरे फ़ोन पर भी मिल सकती है।
                </p>
                {userEmail && (
                  <p className="rounded-2xl bg-sakhi-emerald-soft px-4 py-3 font-sans text-sm text-emerald-900 ring-1 ring-sakhi-emerald/20">
                    {userEmail}
                  </p>
                )}
                <p className="font-hindi text-sm text-sakhi-muted">
                  क्लाउड बंद करने पर इस फ़ोन की प्रगति मिटेगी नहीं — सिर्फ़
                  खाता अलग हो जाएगा।
                </p>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  disabled={busy || !onSignOut}
                  onClick={() => void handleSignOut()}
                  className="flex min-h-touch cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white font-hindi text-base font-semibold text-sakhi-ink ring-1 ring-stone-300 disabled:opacity-60"
                >
                  <CloudOff className="h-5 w-5 text-sakhi-muted" aria-hidden />
                  {busy ? "बंद हो रहा है…" : "क्लाउड बंद करें"}
                </motion.button>
              </div>
            ) : step === "email" ? (
              <div className="flex flex-col gap-3">
                <p className="font-hindi text-sm leading-relaxed text-sakhi-muted">
                  पासवर्ड नहीं लगेगा। हम ईमेल पर एक <strong>साइन-इन लिंक</strong>{" "}
                  भेजेंगे — उसी फ़ोन पर टैप करें।
                </p>
                <p className="font-hindi text-sm leading-relaxed text-sakhi-ink">
                  ईमेल अंग्रेज़ी अक्षरों में लिखें। उदाहरण: naam@email.com
                </p>
                <label className="font-hindi text-sm font-medium text-sakhi-ink">
                  ईमेल
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@email.com"
                    className="mt-1 w-full min-h-touch rounded-2xl border border-stone-200 bg-white px-4 text-base text-sakhi-ink outline-none focus:border-sakhi-emerald focus:ring-2 focus:ring-sakhi-emerald/30"
                  />
                </label>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  disabled={busy}
                  onClick={() => void sendMagicLink()}
                  className="min-h-touch cursor-pointer rounded-2xl bg-sakhi-emerald font-hindi text-base font-semibold text-white disabled:opacity-60"
                >
                  {busy ? "भेज रहे हैं…" : "साइन-इन लिंक भेजें"}
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sakhi-emerald-soft text-sakhi-emerald">
                  <Mail className="h-7 w-7" aria-hidden />
                </div>
                <p className="font-hindi text-base font-semibold text-sakhi-ink">
                  ईमेल खोलें
                </p>
                <p className="font-hindi text-sm leading-relaxed text-sakhi-muted">
                  <span className="font-sans text-sakhi-ink">{email}</span>
                  <br />
                  पर <strong>Sign in</strong> लिंक टैप करें। उसी ब्राउज़र में
                  वापस आएँ — सिंक अपने आप हो जाएगा।
                </p>
                <p className="font-hindi text-xs text-sakhi-muted">
                  स्पैम फ़ोल्डर भी देख लें। लिंक कुछ समय में खत्म हो जाता है।
                </p>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="min-h-touch cursor-pointer font-hindi text-sm text-sakhi-muted underline"
                >
                  ईमेल बदलें
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-touch w-full cursor-pointer rounded-2xl bg-sakhi-emerald font-hindi text-base font-semibold text-white"
                >
                  समझ गई — ईमेल खोलूँगी
                </button>
              </div>
            )}

            {messageHi && (
              <p
                className="mt-3 font-hindi text-sm text-sakhi-amber"
                role="status"
              >
                {messageHi}
              </p>
            )}
          </motion.div>
        </div>
  );
}
