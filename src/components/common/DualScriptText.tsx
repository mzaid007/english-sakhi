"use client";

import { AudioButton } from "@/components/common/AudioButton";
import {
  useSpeechSynthesis,
  type SpeechSpeed,
} from "@/hooks/useSpeechSynthesis";
import type { DualScript } from "@/lib/types";

interface DualScriptTextProps extends DualScript {
  showAudio?: boolean;
  size?: "md" | "lg";
  className?: string;
  /** Parent-owned speak — skips an internal TTS hook (avoids cancel-on-unmount). */
  onSpeak?: (text: string, speed: SpeechSpeed) => void;
  isSpeaking?: boolean;
  audioDisabled?: boolean;
  speechSupported?: boolean;
}

interface DualScriptBodyProps extends DualScriptTextProps {
  speak: (text: string, speed: SpeechSpeed) => void;
  speaking: boolean;
  disabled: boolean;
  supported: boolean;
}

function DualScriptBody({
  en,
  phonetic_hi,
  hi,
  showAudio = true,
  size = "md",
  className = "",
  speak,
  speaking,
  disabled,
  supported,
}: DualScriptBodyProps) {
  const enSize = size === "lg" ? "text-2xl sm:text-[1.65rem]" : "text-xl";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-col items-start gap-3">
        <p
          className={`${enSize} w-full font-sans font-semibold leading-snug tracking-tight text-sakhi-ink`}
          lang="en"
        >
          {en}
        </p>
        {showAudio && (
          <AudioButton
            label={en}
            onPlay={(speed) => speak(en, speed)}
            isSpeaking={speaking}
            disabled={disabled}
          />
        )}
      </div>

      <p
        className="font-hindi text-base leading-relaxed text-sakhi-muted"
        lang="hi"
      >
        {phonetic_hi}
      </p>

      <p
        className="font-hindi text-lg font-medium leading-relaxed text-sakhi-ink/90"
        lang="hi"
      >
        {hi}
      </p>

      {showAudio && !supported && (
        <p className="font-hindi text-sm text-sakhi-muted" role="status">
          इस फ़ोन पर आवाज़ उपलब्ध नहीं है — वाक्य पढ़कर दोहराएँ।
        </p>
      )}
    </div>
  );
}

/** Standalone variant — owns its own TTS hook. */
function DualScriptTextStandalone(props: DualScriptTextProps) {
  const { speak, isSpeaking, audioUnavailable } = useSpeechSynthesis();

  return (
    <DualScriptBody
      {...props}
      speak={speak}
      speaking={isSpeaking}
      disabled={audioUnavailable}
      supported={!audioUnavailable}
    />
  );
}

/**
 * English + Devanagari phonetics + Hindi meaning with accessible audio.
 * Pass `onSpeak` from a parent hook when remounting this tree (e.g. AnimatePresence).
 */
export function DualScriptText(props: DualScriptTextProps) {
  if (props.onSpeak) {
    return (
      <DualScriptBody
        {...props}
        speak={props.onSpeak}
        speaking={props.isSpeaking ?? false}
        disabled={props.audioDisabled ?? false}
        supported={props.speechSupported ?? true}
      />
    );
  }

  return <DualScriptTextStandalone {...props} />;
}
