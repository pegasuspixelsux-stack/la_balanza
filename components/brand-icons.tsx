interface IconProps {
  className?: string;
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M14 8.5V7c0-1 .5-1.5 1.6-1.5H17V2.5h-2.4C11.9 2.5 10.5 4.2 10.5 7v1.5H8V12h2.5v9.5H14V12h2.4l.6-3.5H14Z"
        fill="currentColor"
      />
    </svg>
  );
}
