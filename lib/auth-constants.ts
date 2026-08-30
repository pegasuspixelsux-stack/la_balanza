/** Shared between `proxy.ts` (edge-safe) and `lib/auth.ts` (Node). No imports. */
export const SESSION_COOKIE = "lb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds
