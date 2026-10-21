"use client";

import { motion } from "framer-motion";
import { Turtle, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import type { SpeechSpeed } from "@/hooks/useSpeechSynthesis";

interface AudioButtonProps {
  label: string;
  onPlay: (speed: SpeechSpeed) => void;
  isSpeaking?: boolean;
  disabled?: boolean;
  showTurtle?: boolean;
  className?: string;
}

const spring = { type: "spring" as const, stiffness: 480, damping: 28 };

const baseTap =
  "inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

interface TapIconButtonProps {
  disabled: boolean;
  ariaLabel: string;
  title?: string;
  className: string;
  onClick: () => void;
  children: ReactNode;
}

function TapIconButton({
  disabled,
  ariaLabel,
  title,
  className,
  onClick,
  children,
}: TapIconButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.95 }}
      transition={spring}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      className={`${baseTap} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function AudioButton({
  label,
  onPlay,
  isSpeaking = false,
  disabled = false,
  showTurtle = true,
  className = "",
}: AudioButtonProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <TapIconButton
        disabled={disabled}
        ariaLabel={`${label} सुनें`}
        onClick={() => onPlay("normal")}
        className="bg-sakhi-emerald text-white shadow-pill hover:bg-emerald-700 focus-visible:outline-sakhi-emerald"
      >
        <Volume2
          className={`h-5 w-5 ${isSpeaking ? "animate-pulse" : ""}`}
          aria-hidden
        />
      </TapIconButton>

      {showTurtle && (
        <TapIconButton
          disabled={disabled}
          ariaLabel={`${label} धीरे सुनें`}
          title="धीरे (कछुआ)"
          onClick={() => onPlay("turtle")}
          className="border-2 border-sakhi-amber bg-sakhi-amber-soft text-sakhi-amber hover:bg-amber-100 focus-visible:outline-sakhi-amber"
        >
          <Turtle className="h-5 w-5" aria-hidden />
        </TapIconButton>
      )}
    </div>
  );
}
