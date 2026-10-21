"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cloud, CloudOff, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

interface SyncModalProps {
  open: boolean;
  onClose: () => void;
  onSynced: () => void;
  onSignedOut?: () => void;
  /** When already signed in, show manage/disconnect instead of email form. */
  isSynced?: boolean;
  userEmail?: string | null;
  onSignOut?: () => Promise<void>;
}

type Step = "email" | "otp" | "connected";

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

function authRedirectTo(): string {
  if (typeof window === "undefined") return "https://english-sakhi.vercel.app";
  return `${window.location.origin}/`;
}

/**
 * Passwordless email auth (OTP / magic link) + disconnect (logout) when synced.
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
  const [otp, setOtp] = useState("");
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

  // Magic-link return: session appears while waiting for OTP.
  useEffect(() => {
    if (!open || isSynced) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") {
        onSynced();
        setStep("connected");
        setOtp("");
        setMessageHi("क्लाउड से जुड़ गए।");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [open, isSynced, onSynced]);

  async function sendOtp() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessageHi(
        "क्लाउड कुंजी नहीं मिली। Vercel पर NEXT_PUBLIC_SUPABASE_URL और NEXT_PUBLIC_SUPABASE_ANON_KEY सेट कर Redeploy करें।",
      );
      return;
    }
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      setMessageHi("कृपया सही ईमेल लिखें।");
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
      setMessageHi("कोड भेजने में समस्या हुई — बाद में कोशिश करें।");
      return;
    }

    setStep("otp");
    setMessageHi(
      "ईमेल खोलें: लिंक पर टैप करें, या अगर कोड दिखे तो यहाँ लिखें।",
    );
  }

  async function verifyOtp() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const code = otp.trim();
    if (code.length < 6) {
      setMessageHi("कोड कम से कम ६ अंक का होना चाहिए।");
      return;
    }

    setBusy(true);
    setMessageHi(null);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code,
      type: "email",
    });
    setBusy(false);

    if (error) {
      setMessageHi("कोड मिला नहीं — दोबारा जाँचें।");
      return;
    }

    onSynced();
    setStep("connected");
    setOtp("");
    setMessageHi("क्लाउड से जुड़ गए।");
  }

  async function handleSignOut() {
    if (!onSignOut) return;
    setBusy(true);
    setMessageHi(null);
    try {
      await onSignOut();
      setStep("email");
      setEmail("");
      setOtp("");
      setMessageHi("क्लाउड बंद हो गया। इस फ़ोन की प्रगति सुरक्षित है।");
      onSignedOut?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-sakhi-ink/40 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sync-modal-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={spring}
            className="w-full max-w-md rounded-3xl bg-cream p-5 shadow-soft"
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
            ) : (
              <>
                <p className="mb-4 font-hindi text-sm leading-relaxed text-sakhi-muted">
                  पासवर्ड नहीं लगेगा। ईमेल में लिंक या कोड आएगा — टैप करें या
                  कोड लिखें।
                </p>

                {step === "email" ? (
                  <div className="flex flex-col gap-3">
                    <label className="font-hindi text-sm font-medium text-sakhi-ink">
                      ईमेल
                      <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aapka@email.com"
                        className="mt-1 w-full min-h-touch rounded-2xl border border-stone-200 bg-white px-4 text-base text-sakhi-ink outline-none focus:border-sakhi-emerald focus:ring-2 focus:ring-sakhi-emerald/30"
                      />
                    </label>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      disabled={busy}
                      onClick={() => void sendOtp()}
                      className="min-h-touch cursor-pointer rounded-2xl bg-sakhi-emerald font-hindi text-base font-semibold text-white disabled:opacity-60"
                    >
                      {busy ? "भेज रहे हैं…" : "लिंक / कोड भेजें"}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="font-hindi text-sm leading-relaxed text-sakhi-ink">
                      ईमेल में <strong>लिंक</strong> हो तो उसी फ़ोन पर टैप करें
                      — साइन-इन अपने आप हो जाएगा।
                    </p>
                    <label className="font-hindi text-sm font-medium text-sakhi-ink">
                      या कोड लिखें (६–१० अंक)
                      <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="••••••"
                        className="mt-1 w-full min-h-touch rounded-2xl border border-stone-200 bg-white px-4 text-center font-sans text-2xl tracking-[0.3em] text-sakhi-ink outline-none focus:border-sakhi-emerald focus:ring-2 focus:ring-sakhi-emerald/30"
                      />
                    </label>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      disabled={busy}
                      onClick={() => void verifyOtp()}
                      className="min-h-touch cursor-pointer rounded-2xl bg-sakhi-emerald font-hindi text-base font-semibold text-white disabled:opacity-60"
                    >
                      {busy ? "जाँच हो रही है…" : "पुष्टि करें"}
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="min-h-touch cursor-pointer font-hindi text-sm text-sakhi-muted underline"
                    >
                      ईमेल बदलें
                    </button>
                  </div>
                )}
              </>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
