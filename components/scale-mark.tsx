interface ScaleMarkProps {
  className?: string;
  /** Rendered size in pixels (width and height). */
  size?: number;
  strokeWidth?: number;
}

/**
 * The balance ("balanza") — the restaurant's chalk-drawn emblem and the idea
 * behind its name: el precio justo, the fair weighing of fire and patience.
 * Draws with `currentColor` so it inherits text color.
 */
export function ScaleMark({ className, size = 28, strokeWidth = 1.4 }: ScaleMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* stand */}
      <path d="M24 12v26" />
      <path d="M16 39h16" />
      {/* beam */}
      <path d="M9 16h30" />
      <circle cx="24" cy="13" r="1.6" fill="currentColor" stroke="none" />
      {/* left pan */}
      <path d="M9 16l-4 8h8l-4-8" />
      <path d="M4 24a5 3 0 0 0 10 0" />
      {/* right pan */}
      <path d="M39 16l-4 8h8l-4-8" />
      <path d="M34 24a5 3 0 0 0 10 0" />
    </svg>
  );
}
