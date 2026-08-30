import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "./auth-constants";

const SECRET =
  process.env.SESSION_SECRET ?? "dev-insecure-secret-change-me-in-production";

function sign(value: string): string {
  return crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
}

/** Signed, self-contained session token: `admin.<expiryMs>.<hmac>`. */
export function createSessionToken(): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [role, expiresAt, signature] = parts;
  const expected = sign(`${role}.${expiresAt}`);

  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length) return false;
  if (!crypto.timingSafeEqual(given, want)) return false;

  if (role !== "admin") return false;
  if (!Number.isFinite(Number(expiresAt)) || Number(expiresAt) < Date.now()) {
    return false;
  }
  return true;
}

/** True when the current request carries a valid admin session cookie. */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
