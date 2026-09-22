import type { ReactNode } from "react";
import type { AdminUser } from "@/db/schema";
import { NameMark } from "./name-mark";

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: ReactNode;
}) {
  return (
    <div className="admin">
      <header className="admin-bar">
        <a className="admin-brand" href="/admin">
          <NameMark />
          <span className="admin-brand-tag">CMS</span>
        </a>

        <nav className="admin-nav" aria-label="Admin navigation">
          <a href="/admin">Posts</a>
          <a href="/blog" target="_blank" rel="noopener noreferrer">
            View Blog ↗
          </a>
        </nav>

        <div className="admin-user">
          <span>{user.name}</span>
          <form method="post" action="/api/admin/logout">
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>

      <div className="admin-body">{children}</div>
    </div>
  );
}
