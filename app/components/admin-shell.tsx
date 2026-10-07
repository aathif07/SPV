import Image from "next/image";
import type { ReactNode } from "react";
import type { AdminUser } from "@/db/schema";
import { PlainLink } from "./site-chrome";

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: ReactNode;
}) {
  return (
    <div className="admin">
      <div className="sp-tricolor" />
      <header className="admin-bar">
        <a className="admin-brand sp-logo" href="/admin">
          <span className="sp-mark"><Image src="/images/spv-avatar.jpg" alt="" width={84} height={84} priority /></span>
          <span><b>S. P. VELUMANI</b><small>Content management</small></span>
        </a>

        <nav className="admin-nav" aria-label="Admin navigation">
          <a href="/admin">Posts</a>
          <PlainLink href="/admin/achievements">Achievements</PlainLink>
          <a href="/blog" target="_blank" rel="noopener noreferrer">
            View blog ↗
          </a>
          <PlainLink href="/" target="_blank" rel="noopener noreferrer">
            View site ↗
          </PlainLink>
        </nav>

        <div className="admin-user">
          <span className="admin-avatar" aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</span>
          <span className="admin-user-name">{user.name}</span>
          <form method="post" action="/api/admin/logout">
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>

      <div className="admin-body">{children}</div>
    </div>
  );
}
