import Image from "next/image";
import { LangToggle, MobileMenu } from "./home/home-client";

// TODO: replace "#" with the official profile URLs.
const socialLinks: [string, string][] = [
  ["Facebook", "#"],
  ["X / Twitter", "#"],
  ["Instagram", "#"],
  ["YouTube", "#"],
];
const socialHref = (label: string) => socialLinks.find(([name]) => name === label)?.[1] ?? "#";

/**
 * Plain anchors for every link: they keep same-page smooth
 * scroll and work reliably with the current Vinext runtime.
 */
export function PlainLink(props: React.ComponentPropsWithoutRef<"a">) {
  // eslint-disable-next-line jsx-a11y/anchor-has-content -- content arrives via props.children
  return <a {...props} />;
}

export function Arrow() {
  return <span className="sp-arr" aria-hidden="true">→</span>;
}

/**
 * Shared public header and footer. On the homepage the section links stay
 * in-page anchors for smooth scrolling; elsewhere they point back home.
 */
export function SiteTop({ onHome = false }: { onHome?: boolean }) {
  const home = onHome ? "" : "/";
  const navLinks = [
    [`${home}#about`, "About"],
    [`${home}#leadership`, "Leadership"],
    [`${home}#achievements`, "Achievements"],
    [`${home}#vision`, "Vision"],
    [`${home}#gallery`, "Gallery"],
    ["/blog", "Blog"],
  ];
  return (
    <>
    <div className="sp-tricolor" />
    <div className="sp-topbar"><div className="sp-wrap">
      <div className="sp-soc">{socialLinks.map(([label, href]) => <PlainLink key={label} href={href}>{label}</PlainLink>)}</div>
      <span className="sp-ta" lang="ta" style={{ fontWeight: 500 }}>அனைத்திந்திய அண்ணா திராவிட முன்னேற்றக் கழகம்</span>
      <LangToggle />
    </div></div>

    <header className="sp-main"><div className="sp-wrap">
      <PlainLink href={onHome ? "#top" : "/"} className="sp-logo" aria-label="S. P. Velumani home"><span className="sp-mark"><Image src="/images/spv-avatar.jpg" alt="" width={84} height={84} priority /></span><span><b>S. P. VELUMANI</b><small lang="ta">எஸ். பி. வேலுமணி</small></span></PlainLink>
      <nav className="sp-links" aria-label="Primary navigation">{navLinks.map(([href, label]) => <PlainLink key={href} href={href}>{label}</PlainLink>)}</nav>
      <PlainLink href="/admin/login" className="sp-btn sp-btn-red sp-nav-cta">Admin Login <Arrow /></PlainLink>
      <MobileMenu>
        <summary aria-label="Menu">☰</summary>
        <nav aria-label="Mobile navigation">
          {navLinks.map(([href, label]) => <PlainLink key={href} href={href}>{label}</PlainLink>)}
          <PlainLink href={`${home}#connect`}>Connect</PlainLink>
          <PlainLink href="/admin/login" className="sp-menu-cta">Admin Login <Arrow /></PlainLink>
        </nav>
      </MobileMenu>
    </div></header>
    </>
  );
}

export function SiteBottom({ onHome = false }: { onHome?: boolean }) {
  const home = onHome ? "" : "/";
  return (
    <>
    <footer className="sp-footer"><div className="sp-wrap">
      <div className="sp-fgrid4">
        <div>
          <div className="sp-big">S. P. VELUMANI</div>
          <div className="sp-ta" lang="ta" style={{ marginTop: 6, fontWeight: 700 }}>எஸ். பி. வேலுமணி</div>
          <p style={{ marginTop: 14, fontSize: 14, maxWidth: 300 }}>Leadership. Service. Tamil Nadu. Empowering people, creating opportunity and strengthening communities.</p>
          <div className="sp-socials">
            <PlainLink href={socialHref("Facebook")} aria-label="Facebook"><svg viewBox="0 0 24 24"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" /></svg></PlainLink>
            <PlainLink href={socialHref("X / Twitter")} aria-label="X"><svg viewBox="0 0 24 24"><path d="M4 4h4.5l4 5.5L17 4h3l-6 7.4L21 20h-4.5l-4.4-6L7 20H4l6.6-8z" /></svg></PlainLink>
            <PlainLink href={socialHref("Instagram")} aria-label="Instagram"><svg viewBox="0 0 24 24"><path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /></svg></PlainLink>
            <PlainLink href={socialHref("YouTube")} aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M22 8s-.2-1.6-.9-2.3c-.8-.9-1.8-.9-2.2-1C16 4.5 12 4.5 12 4.5s-4 0-6.9.2c-.4.1-1.4.1-2.2 1C2.2 6.4 2 8 2 8s-.2 1.9-.2 3.8v1.6c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 6.7.2 6.7.2s4 0 6.9-.2c.4-.1 1.4-.1 2.2-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8v-1.6C22.2 9.9 22 8 22 8zM10 15V9l5.2 3z" /></svg></PlainLink>
          </div>
        </div>
        <div><h5>Explore</h5><ul><li><PlainLink href={`${home}#about`}>About</PlainLink></li><li><PlainLink href={`${home}#leadership`}>Leadership</PlainLink></li><li><PlainLink href={`${home}#vision`}>Vision</PlainLink></li><li><PlainLink href={`${home}#gallery`}>Gallery</PlainLink></li></ul></div>
        <div><h5>Updates</h5><ul><li><PlainLink href="/blog">Political Updates</PlainLink></li><li><PlainLink href="/blog">Development</PlainLink></li><li><PlainLink href="/blog">Speeches</PlainLink></li><li><PlainLink href="/blog">Media Coverage</PlainLink></li></ul></div>
        <div><h5>Connect</h5><ul><li><PlainLink href={`${home}#connect`}>Share your voice</PlainLink></li><li><PlainLink href={`${home}#connect`}>WhatsApp</PlainLink></li><li><PlainLink href={`${home}#connect`}>Constituency office</PlainLink></li><li><PlainLink href="/admin/login">Admin login</PlainLink></li></ul></div>
      </div>
      <div className="sp-fbot"><span>© S. P. Velumani. All rights reserved. · Vision photos: Press Information Bureau via Wikimedia Commons (GODL-India)</span><PlainLink href="#top">Back to top ↑</PlainLink></div>
    </div><div className="sp-tricolor" /></footer>

    <PlainLink href={`${home}#connect`} className="sp-wa-float" aria-label="WhatsApp"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.1z" /></svg></PlainLink>
    </>
  );
}
