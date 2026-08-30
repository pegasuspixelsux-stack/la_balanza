/** Shared between `proxy.ts` (edge-safe) and `lib/auth.ts` (Node). No imports. */
export const SESSION_COOKIE = "lb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

/**
 * Demo credentials. Override in any real deployment by setting `ADMIN_USER` /
 * `ADMIN_PASSWORD` (and `SESSION_SECRET`) as environment variables.
 */
export const DEMO_USER = "la_balanza";
export const DEMO_PASSWORD = "test12345";

export const adminUser = () => process.env.ADMIN_USER || DEMO_USER;
export const adminPassword = () => process.env.ADMIN_PASSWORD || DEMO_PASSWORD;
