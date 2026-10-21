"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Cloud, X } from "lucide-react";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

interface SyncModalProps {
  open: boolean;
  onClose: () => void;
  onSynced: () => void;
}

type Step = "email" | "otp";

const spring = { type: "spring" as const, stiffness: 400, damping: 28 };

/**
 * Passwordless email OTP. Email entry is the only typing needed for cloud sync
 * (learning UI stays zero-English-keyboard).
 */
export function SyncModal({ open, onClose, onSynced }: SyncModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [messageHi, setMessageHi] = useState<string | null>(null);

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
      options: { shouldCreateUser: true },
    });
    setBusy(false);

    if (error) {
      setMessageHi("कोड भेजने में समस्या हुई — बाद में कोशिश करें।");
      return;
    }

    setStep("otp");
    setMessageHi("ईमेल में ६ अंकों का कोड आया होगा।");
  }

  async function verifyOtp() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const code = otp.trim();
    if (code.length < 6) {
      setMessageHi("६ अंकों का कोड डालें।");
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
    onClose();
    setStep("email");
    setOtp("");
    setMessageHi(null);
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
                  प्रगति सुरक्षित करें
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

            <p className="mb-4 font-hindi text-sm leading-relaxed text-sakhi-muted">
              पासवर्ड नहीं लगेगा। सिर्फ़ ईमेल पर कोड आएगा — दूसरे फ़ोन पर भी
              प्रगति मिलेगी।
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
                  {busy ? "भेज रहे हैं…" : "कोड भेजें"}
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <label className="font-hindi text-sm font-medium text-sakhi-ink">
                  ६ अंकों का कोड
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
                    }
                    placeholder="••••••"
                    className="mt-1 w-full min-h-touch rounded-2xl border border-stone-200 bg-white px-4 text-center font-display text-2xl tracking-[0.3em] text-sakhi-ink outline-none focus:border-sakhi-emerald focus:ring-2 focus:ring-sakhi-emerald/30"
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

            {messageHi && (
              <p className="mt-3 font-hindi text-sm text-sakhi-amber" role="status">
                {messageHi}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
