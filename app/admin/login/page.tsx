import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../../lib/auth";
import { NameMark } from "../../components/name-mark";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  invalid: "That email and password combination is not correct.",
  missing: "Please enter both your email and your password.",
  throttled: "Too many attempts. Please wait a few minutes and try again.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  // Already signed in? Skip the form.
  if (await getCurrentAdmin()) redirect("/admin");

  const { error, next } = await searchParams;
  const message = error ? (ERRORS[error] ?? ERRORS.invalid) : null;

  return (
    <main className="auth-screen">
      <div className="auth-card">
        <a className="auth-brand" href="/">
          <NameMark />
        </a>
        <p className="section-label">Content Management</p>
        <h1 className="auth-title">Admin Sign In</h1>

        {message ? (
          <p className="auth-error" role="alert">
            {message}
          </p>
        ) : null}

        <form className="auth-form" method="post" action="/api/admin/login">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="button button-primary" type="submit">
            Sign In <span>→</span>
          </button>
        </form>

        <p className="auth-note">
          Back to <a href="/">the website</a>
        </p>
      </div>
    </main>
  );
}
