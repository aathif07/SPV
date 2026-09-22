import { createSession, findAdminByEmail, verifyPassword } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

/** Simple in-memory throttle. Enough to blunt password guessing. */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

/** Only same-origin relative paths, so `next` cannot become an open redirect. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/admin";
  return value;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? "/admin"));

  const failure = (reason: string) =>
    Response.redirect(
      new URL(`/admin/login?error=${reason}&next=${encodeURIComponent(next)}`, request.url),
      303,
    );

  const clientKey =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (tooManyAttempts(clientKey)) return failure("throttled");
  if (!email || !password) return failure("missing");

  const user = await findAdminByEmail(email);
  // Always run a verification so a missing user and a wrong password take
  // roughly the same time.
  const placeholder =
    "pbkdf2$210000$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  const ok = await verifyPassword(password, user?.passwordHash ?? placeholder);

  if (!user || !ok) return failure("invalid");

  attempts.delete(clientKey);
  await createSession(user.id);
  return Response.redirect(new URL(next, request.url), 303);
}
