import type { ReactNode } from "react";
import { ScaleMark } from "@/components/scale-mark";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "start" | "center";
}

/** Eyebrow + display title, introduced by the balance mark used as a divider. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "start",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div
        className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
      >
        <ScaleMark size={22} className="shrink-0 text-terracotta" />
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-terracotta">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-4 font-display text-3xl leading-[1.1] text-bone sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {intro ? (
        <p className="mt-4 text-base leading-relaxed text-stone-400">{intro}</p>
      ) : null}
    </div>
  );
}
