"use client";

import { useEffect } from "react";

const revealSelector = [
  "main section:not(.hero) .section-label",
  "main section:not(.hero) h2",
  "main section:not(.hero) h3",
  "main section:not(.hero) .prose > p",
  "main section:not(.hero) .lead-statement",
  "main section:not(.hero) .development-lead > p",
  "main section:not(.hero) .rhythm-copy > p",
  "main section:not(.hero) .news-lead",
  "main section:not(.hero) .gallery-head > p",
  "main section:not(.hero) .connect-intro > p",
].join(",");

export default function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector<HTMLElement>("#top");
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    revealItems.forEach((item, index) => {
      item.classList.add("text-reveal");
      item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });
    root.classList.add("effects-ready");

    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );
    revealItems.forEach(item => revealObserver.observe(item));

    const heroObserver = new IntersectionObserver(
      ([entry]) => header?.classList.toggle("is-hidden", !entry.isIntersecting),
      { threshold: 0.08 },
    );
    if (hero) heroObserver.observe(hero);

    return () => {
      revealObserver.disconnect();
      heroObserver.disconnect();
      root.classList.remove("effects-ready");
    };
  }, []);

  return null;
}
