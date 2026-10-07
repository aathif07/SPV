import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../../lib/auth";
import { PlainLink } from "../../components/site-chrome";

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
        <div className="sp-tricolor" />
        <PlainLink className="auth-brand sp-logo" href="/">
          <span className="sp-mark"><Image src="/images/spv-avatar.jpg" alt="" width={84} height={84} priority /></span>
          <span><b>S. P. VELUMANI</b><small lang="ta">எஸ். பி. வேலுமணி</small></span>
        </PlainLink>
        <p className="section-label">Content management</p>
        <h1 className="auth-title">Admin sign in</h1>
        <p className="auth-sub">Sign in to write and publish posts on the blog.</p>

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
          <PlainLink href="/">← Back to the website</PlainLink>
        </p>
      </div>
    </main>
  );
}
