"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The signature element. A balance whose beam tips from off-kilter into level
 * as it scrolls into view — fire on one side, patience on the other, meeting
 * at el punto justo.
 */
export function BalanceScale({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* stand */}
      <path d="M120 40v104" strokeWidth={2} />
      <path d="M96 145h48" strokeWidth={2} />
      <path d="M108 145c0-9 5-15 12-15s12 6 12 15" strokeWidth={2} />

      {/* pivoting beam + pans */}
      <motion.g
        style={{ transformOrigin: "120px 42px", transformBox: "fill-box" }}
        initial={reduceMotion ? { rotate: 0 } : { rotate: -10 }}
        whileInView={{ rotate: 0 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 55, damping: 7, mass: 1.1 }
        }
      >
        <circle cx="120" cy="42" r="3" fill="currentColor" stroke="none" />
        <path d="M40 42h160" strokeWidth={2} />

        {/* left pan */}
        <path d="M40 42v14" strokeWidth={1.6} />
        <path d="M22 56h36l-18 34-18-34" strokeWidth={1.6} />
        <path d="M18 56c0 13 10 22 22 22s22-9 22-22" strokeWidth={1.6} />

        {/* right pan */}
        <path d="M200 42v14" strokeWidth={1.6} />
        <path d="M182 56h36l-18 34-18-34" strokeWidth={1.6} />
        <path d="M178 56c0 13 10 22 22 22s22-9 22-22" strokeWidth={1.6} />
      </motion.g>
    </svg>
  );
}
