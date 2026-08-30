"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface ConfirmButtonProps {
  /** Resting label. */
  children: React.ReactNode;
  /** Label shown after the first click, before confirming. */
  confirmLabel?: string;
  className?: string;
}

/** Two-step submit button — no native `confirm()` dialog. */
export function ConfirmButton({
  children,
  confirmLabel = "¿Confirmar?",
  className = "",
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <button
      type={armed ? "submit" : "button"}
      onClick={() => {
        if (!armed) {
          setArmed(true);
          timer.current = setTimeout(() => setArmed(false), 3000);
        }
      }}
      onBlur={() => setArmed(false)}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
        armed
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-stone-400 hover:bg-stone-800 hover:text-red-300"
      } ${className}`}
    >
      {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
      {armed ? confirmLabel : children}
    </button>
  );
}
