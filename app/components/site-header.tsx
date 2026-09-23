import Link from "next/link";
import { NameMark } from "./name-mark";

/**
 * Shared across the homepage and the blog.
 *
 * On the homepage the section links stay as in-page anchors so the smooth
 * scroll still works; everywhere else they become root-relative so they
 * navigate home first.
 */
export default function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  const prefix = onHome ? "" : "/";
  const links = [
    { href: `${prefix}#about`, label: "About" },
    { href: `${prefix}#leadership`, label: "Leadership" },
    { href: `${prefix}#vision`, label: "Vision" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <header className="site-header">
      <NavLink className="brand" href={onHome ? "#top" : "/"} aria-label="S. P. Velumani home">
        <NameMark className="brand-name" />
      </NavLink>

      <nav className="nav-links" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink key={link.label} href={link.href}>
            {link.label}
          </NavLink>
        ))}
        <NavLink className="nav-cta" href={`${prefix}#connect`}>
          Connect
        </NavLink>
        <NavLink className="nav-admin" href="/admin/login">
          Admin Login
        </NavLink>
      </nav>

      <details className="mobile-menu">
        <summary aria-label="Open navigation">
          <span />
          <span />
        </summary>
        <div>
          {links.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <NavLink href={`${prefix}#connect`}>Connect</NavLink>
          <NavLink href="/admin/login">Admin Login</NavLink>
        </div>
      </details>
    </header>
  );
}

/**
 * Same-page anchors stay plain `<a>` so the CSS smooth scroll handles them;
 * anything that leaves the page routes through `next/link`.
 */
function NavLink({
  href,
  children,
  ...rest
}: { href: string } & React.ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={false} {...rest}>
      {children}
    </Link>
  );
}
