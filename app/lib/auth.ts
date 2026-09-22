import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq, lt } from "drizzle-orm";
import { db } from "@/db/client";
import { adminUsers, sessions, type AdminUser } from "@/db/schema";

export const SESSION_COOKIE = "spv_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const PBKDF2_ITERATIONS = 210_000;

/* ---------------------------------------------------------------- passwords */

function toBase64(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    256,
  );
}

/** Returns `pbkdf2$<iterations>$<salt>$<hash>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterationsRaw, saltRaw, hashRaw] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterationsRaw || !saltRaw || !hashRaw) return false;

  const derived = new Uint8Array(
    await pbkdf2(password, fromBase64(saltRaw), Number(iterationsRaw)),
  );
  const expected = fromBase64(hashRaw);
  if (derived.length !== expected.length) return false;

  // Constant-time comparison.
  let diff = 0;
  for (let i = 0; i < derived.length; i += 1) diff |= derived[i] ^ expected[i];
  return diff === 0;
}

/* ----------------------------------------------------------------- sessions */

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Issues a session and sets the cookie. Returns the raw token. */
export async function createSession(userId: string): Promise<string> {
  const token = toBase64(crypto.getRandomValues(new Uint8Array(32)));
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({
    tokenHash: await sha256Hex(token),
    userId,
    expiresAt,
  });

  // Opportunistically clear expired rows so the table does not grow forever.
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({ user: adminUsers, expiresAt: sessions.expiresAt })
    .from(sessions)
    .innerJoin(adminUsers, eq(sessions.userId, adminUsers.id))
    .where(eq(sessions.tokenHash, await sha256Hex(token)))
    .limit(1);

  const row = rows[0];
  if (!row || row.expiresAt.getTime() < Date.now()) return null;
  return row.user;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, await sha256Hex(token)));
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Use at the top of every /admin page. Redirects anonymous visitors to login. */
export async function requireAdmin(returnTo = "/admin"): Promise<AdminUser> {
  const user = await getCurrentAdmin();
  if (user) return user;
  redirect(`/admin/login?next=${encodeURIComponent(returnTo)}`);
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.trim().toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}
