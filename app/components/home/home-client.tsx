"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { LanguageProvider, useLang } from "../language";

/** Marks the page as scripted, then fades `.sp-rv` blocks in as they scroll into view. */
export function Reveal() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".sp");
    if (!root) return;
    root.classList.add("sp-js");
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sp-shown");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    root.querySelectorAll(".sp-rv").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

const heroPhotos = [
  { src: "/images/spv-studio-victory-close.jpg", alt: "S. P. Velumani raising a victory sign" },
  { src: "/images/spv-studio-namaste-close.jpg", alt: "S. P. Velumani greeting with folded hands" },
  { src: "/images/spv-studio-wave.jpg", alt: "S. P. Velumani waving to the public" },
  { src: "/images/spv-studio-seated-close.jpg", alt: "S. P. Velumani seated portrait" },
];

export function HeroPhoto() {
  const [active, setActive] = useState(0);
  const photo = heroPhotos[active];

  return (
    <div className="sp-hero-photo sp-rv">
      <Image className="sp-main" key={photo.src} src={photo.src} alt={photo.alt} fill priority sizes="(max-width: 1000px) 100vw, 50vw" />
      <div className="sp-stripe-v" aria-hidden="true"><i /><i /><i /></div>
      <div className="sp-badge-card sp-tl">
        <span className="sp-em" aria-hidden="true" />
        <span><small>Member, TN Legislative Assembly</small><b>Thondamuthur</b></span>
      </div>
      <div className="sp-hero-name">
        <div><b>S. P. VELUMANI</b><span>மக்களே முதல் · People First</span></div>
        <div className="sp-thumbs" role="group" aria-label="Choose photograph">
          {heroPhotos.map((item, index) => (
            <button
              type="button"
              key={item.src}
              className={index === active ? "sp-on" : ""}
              aria-label={`Show photograph ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              <Image src={item.src} alt="" width={92} height={138} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Category chips. Visual selection only, as in the prototype. */
export function Filters({ items }: { items: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="sp-filters sp-rv">
      {items.map((item, index) => (
        <button type="button" key={item} className={index === active ? "sp-on" : ""} aria-pressed={index === active} onClick={() => setActive(index)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function LangButtons() {
  const { lang, setLang } = useLang();
  return (
    <div className="sp-lang" role="group" aria-label="Choose language">
      <button type="button" className={lang === "en" ? "sp-on" : ""} aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
      <button type="button" lang="ta" className={`sp-ta ${lang === "ta" ? "sp-on" : ""}`} aria-pressed={lang === "ta"} onClick={() => setLang("ta")}>தமிழ்</button>
    </div>
  );
}

/** Shares the stored language preference with the blog. */
export function LangToggle() {
  return <LanguageProvider><LangButtons /></LanguageProvider>;
}

const topics = ["Suggestion", "Grievance", "Invitation", "Media"];

export function ConnectForm() {
  const [sent, setSent] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <form className="sp-card sp-rv" onSubmit={onSubmit}>
      <h3>Share your voice</h3>
      <div className="sp-sub">Pick a topic, tell us where you are, and write your message. <span className="sp-ta">தமிழிலும் எழுதலாம்.</span></div>
      <div className="sp-topics">
        {topics.map((topic, index) => (
          <label key={topic}><input type="radio" name="topic" value={topic} defaultChecked={index === 0} /><span>{topic}</span></label>
        ))}
      </div>
      <div className="sp-fgrid">
        <div className="sp-field"><label htmlFor="sp-name">Name</label><input id="sp-name" name="name" placeholder="Your full name" /></div>
        <div className="sp-field"><label htmlFor="sp-mobile">Mobile number</label><input id="sp-mobile" name="mobile" placeholder="+91" inputMode="tel" /></div>
        <div className="sp-field"><label htmlFor="sp-district">District</label>
          <select id="sp-district" name="district" defaultValue="">
            <option value="" disabled>Select district</option>
            {["Coimbatore", "Chennai", "Madurai", "Tiruppur", "Salem"].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="sp-field"><label htmlFor="sp-constituency">Constituency</label><input id="sp-constituency" name="constituency" placeholder="e.g. Thondamuthur" /></div>
        <div className="sp-field sp-full"><label htmlFor="sp-message">Message</label><textarea id="sp-message" name="message" placeholder="Write your message…" /></div>
      </div>
      <button className="sp-btn sp-btn-red" type="submit" disabled={sent}>
        {sent ? "✓ Thank you — message received" : <>Submit your message <span className="sp-arr">→</span></>}
      </button>
      <div className="sp-privacy">Your details are used only to respond to your message.</div>
    </form>
  );
}

/** Mobile menu that closes once a link is chosen (in-page anchors don't reload). */
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    // Link activation by mouse, touch or keyboard all fire "click".
    const close = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest("a")) menu.open = false;
    };
    menu.addEventListener("click", close);
    return () => menu.removeEventListener("click", close);
  }, []);
  return <details className="sp-burger" ref={ref}>{children}</details>;
}

/**
 * Two-row card rail that scrolls continuously and loops forever. The cards are
 * rendered again after the originals (hidden from assistive tech) so the loop
 * point is seamless. Pauses on hover, focus, touch or wheel.
 */
export function AchievementRail({ children, count, label }: { children: React.ReactNode; count: number; label: string }) {
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pausedUntil = useRef(0);
  const hovering = useRef(false);
  const loopWidth = useRef(0);

  // Two rows: an odd count would start the copy on the second row, so the
  // loop period is two full sets instead of one.
  const extraSets = count % 2 === 0 ? 1 : 2;
  const periodIndex = count % 2 === 0 ? count : count * 2;

  useEffect(() => {
    const rail = railRef.current;
    const bar = barRef.current;
    if (!rail) return;

    const measure = () => {
      const cards = rail.querySelectorAll<HTMLElement>(".sp-ach-card");
      const first = cards[0];
      const loopStart = cards[periodIndex];
      loopWidth.current = first && loopStart ? loopStart.offsetLeft - first.offsetLeft : 0;
    };
    const updateBar = () => {
      if (!bar) return;
      const loop = loopWidth.current || rail.scrollWidth - rail.clientWidth;
      const size = Math.min(1, Math.max(0.1, rail.clientWidth / (loop + rail.clientWidth)));
      const progress = loop > 0 ? (rail.scrollLeft % loop) / loop : 0;
      bar.style.width = `${size * 100}%`;
      bar.style.left = `${progress * (1 - size) * 100}%`;
    };
    // Keep the visible position inside the first set so it never runs out.
    const wrap = () => {
      const loop = loopWidth.current;
      if (loop <= 0) return;
      if (rail.scrollLeft >= loop) rail.scrollLeft -= loop;
    };

    measure();
    updateBar();
    const resize = new ResizeObserver(() => { measure(); updateBar(); });
    resize.observe(rail);

    const pause = (ms: number) => () => { pausedUntil.current = Date.now() + ms; };
    const onTouch = pause(5000);
    const onWheel = pause(3000);
    const onEnter = () => { hovering.current = true; };
    const onLeave = () => { hovering.current = false; };
    rail.addEventListener("scroll", updateBar, { passive: true });
    rail.addEventListener("touchstart", onTouch, { passive: true });
    rail.addEventListener("wheel", onWheel, { passive: true });
    rail.addEventListener("pointerenter", onEnter);
    rail.addEventListener("pointerleave", onLeave);

    let visible = false;
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    seen.observe(rail);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let last = 0;
    let carry = 0;
    const tick = (now: number) => {
      const elapsed = last ? Math.min(now - last, 50) : 0;
      last = now;
      const moving = visible && !hovering.current && Date.now() > pausedUntil.current && !rail.contains(document.activeElement);
      rail.classList.toggle("is-gliding", moving);
      if (moving && loopWidth.current > 0) {
        // Browsers round scrollLeft, so keep the fraction between frames.
        carry += elapsed * 0.045;
        const whole = Math.floor(carry);
        if (whole > 0) {
          rail.scrollLeft += whole;
          carry -= whole;
        }
      }
      wrap();
      frame = requestAnimationFrame(tick);
    };
    if (!reduced) frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
      rail.removeEventListener("scroll", updateBar);
      rail.removeEventListener("touchstart", onTouch);
      rail.removeEventListener("wheel", onWheel);
      rail.removeEventListener("pointerenter", onEnter);
      rail.removeEventListener("pointerleave", onLeave);
    };
  }, [periodIndex]);

  const manual = (direction: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(".sp-ach-card");
    if (!rail || !card) return;
    pausedUntil.current = Date.now() + 6000;
    // Step back into the copies first so scrolling left never hits the edge.
    if (loopWidth.current > 0 && direction === -1 && rail.scrollLeft < card.offsetWidth * 2) rail.scrollLeft += loopWidth.current;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({ left: (card.offsetWidth + gap) * direction, behavior: "smooth" });
  };

  return (
    <div className="sp-ach-railwrap">
      {/* Focusable so keyboard users can scroll it with the arrow keys. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className="sp-ach-rail" ref={railRef} role="region" aria-label={label} tabIndex={0}>
        {children}
        {Array.from({ length: extraSets }, (_, i) => (
          <div className="sp-ach-copy" aria-hidden="true" inert key={i}>{children}</div>
        ))}
      </div>
      <div className="sp-ach-controls">
        <div className="sp-ach-track" aria-hidden="true"><span ref={barRef} /></div>
        <button type="button" aria-label="Previous achievements" onClick={() => manual(-1)}>←</button>
        <button type="button" aria-label="Next achievements" onClick={() => manual(1)}>→</button>
      </div>
    </div>
  );
}
