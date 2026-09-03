"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/images/sp-velumani-standing.jpg",
    alt: "S. P. Velumani wearing the AIADMK colours",
    label: "Leadership",
    position: "center 32%",
  },
  {
    src: "/images/sp-velumani-commons.jpg",
    alt: "S. P. Velumani greeting with folded hands",
    label: "Public service",
    position: "center 26%",
  },
  {
    src: "/images/sp-velumani-public-meeting.jpg",
    alt: "S. P. Velumani at a public engagement",
    label: "With the people",
    position: "center 42%",
  },
];

export default function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const visualRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % slides.length), 5600);
    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;
    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const rect = visual.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
      visual.style.setProperty("--hero-parallax-y", `${progress * 34}px`);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--hero-parallax-x", `${((event.clientX - rect.left) / rect.width - 0.5) * -18}px`);
    event.currentTarget.style.setProperty("--hero-parallax-pointer-y", `${((event.clientY - rect.top) / rect.height - 0.5) * -12}px`);
  };

  return (
    <aside
      className="hero-visual"
      ref={visualRef}
      aria-label="Featured photographs"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={event => {
        setPaused(false);
        event.currentTarget.style.setProperty("--hero-parallax-x", "0px");
        event.currentTarget.style.setProperty("--hero-parallax-pointer-y", "0px");
      }}
      onPointerMove={onPointerMove}
    >
      <div className="hero-party-band" aria-label="AIADMK party colours">
        <span>AIADMK</span><span>Black</span><span>White</span><span>Red</span>
      </div>
      <span className="hero-word" aria-hidden="true">SPV</span>
      <Image src="/images/aiadmk-emblem-transparent.png" alt="" aria-hidden="true" width={1254} height={1254} className="hero-emblem" />
      <span className="hero-rail" aria-hidden="true">S. P. VELUMANI · TAMIL NADU</span>
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <figure className={`hero-slide ${index === active ? "is-active" : ""}`} key={slide.src} aria-hidden={index !== active}>
            <Image
              src={slide.src}
              alt={index === active ? slide.alt : ""}
              fill
              priority={index === 0}
              sizes="(max-width: 900px) 100vw, 48vw"
              style={{ objectPosition: slide.position }}
            />
            <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{slide.label}</figcaption>
          </figure>
        ))}
      </div>
      <div className="hero-slide-controls" role="group" aria-label="Choose featured photograph">
        {slides.map((slide, index) => (
          <button
            type="button"
            className={index === active ? "is-active" : ""}
            aria-label={`Show ${slide.label} photograph`}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
            key={slide.src}
          ><span>{String(index + 1).padStart(2, "0")}</span></button>
        ))}
      </div>
      <p className="hero-photo-credit">Public imagery · Wikimedia Commons &amp; supplied media sources</p>
    </aside>
  );
}
