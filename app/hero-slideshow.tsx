"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    src: "/images/spv-studio-namaste-close.jpg",
    alt: "S. P. Velumani greeting with folded hands",
    label: "People first",
    position: "center 18%",
  },
  {
    src: "/images/spv-studio-victory-close.jpg",
    alt: "S. P. Velumani raising a victory sign",
    label: "Voice of the people",
    position: "center 16%",
  },
  {
    src: "/images/spv-studio-namaste-scarf.jpg",
    alt: "S. P. Velumani in the party scarf greeting with folded hands",
    label: "Public leadership",
    position: "center 20%",
  },
  {
    src: "/images/spv-studio-seated-close.jpg",
    alt: "S. P. Velumani seated portrait",
    label: "Experience",
    position: "center 24%",
  },
  {
    src: "/images/spv-studio-wave.jpg",
    alt: "S. P. Velumani waving to the public",
    label: "Public service",
    position: "center 14%",
  },
  {
    src: "/images/spv-studio-namaste-full.jpg",
    alt: "S. P. Velumani greeting in the party colours",
    label: "Party programme",
    position: "center 16%",
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
        <button type="button" className="slide-arrow" aria-label="Previous photograph" onClick={() => setActive(current => (current - 1 + slides.length) % slides.length)}>←</button>
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
        <button type="button" className="slide-arrow" aria-label="Next photograph" onClick={() => setActive(current => (current + 1) % slides.length)}>→</button>
      </div>
      <p className="hero-photo-credit">Official photographs</p>
    </aside>
  );
}
