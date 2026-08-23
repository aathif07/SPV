"use client";

import { useEffect } from "react";

const revealSelector = [
  "main section:not(.hero) .section-label",
  "main section:not(.hero) h2",
  "main section:not(.hero) h3",
  "main section:not(.hero) .prose > p",
  "main section:not(.hero) .lead-statement",
  "main section:not(.hero) .timeline article",
  "main section:not(.hero) .development-lead > p",
  "main section:not(.hero) .rhythm-copy > p",
  "main section:not(.hero) .news-lead",
  "main section:not(.hero) .gallery-head > p",
  "main section:not(.hero) .connect-intro > p",
  "main section:not(.hero) article > p",
  "main section:not(.hero) .people-copy > p",
  "main section:not(.hero) .focus-block > p",
  "main .rural-section > div > p",
  "main section:not(.hero) .constituency-copy > p",
  "main section:not(.hero) .service-copy > p",
  "main section:not(.hero) li",
  ".footer h2",
  ".footer p",
].join(",");

export default function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>(".site-header");
    const hero = document.querySelector<HTMLElement>("#top");
    const visionRail = document.querySelector<HTMLElement>(".vision-grid");
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

    let visionFrame = 0;
    let lastFrame = 0;
    let visionLoopWidth = 0;
    let clonedVisionCards: HTMLElement[] = [];
    let isRailVisible = false;
    let isFocused = false;
    let resumeAt = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pauseTemporarily = (milliseconds: number) => { resumeAt = performance.now() + milliseconds; };
    const onFocusIn = () => { isFocused = true; };
    const onFocusOut = () => { isFocused = false; };
    const onWheel = () => pauseTemporarily(2800);
    const onTouchStart = () => pauseTemporarily(4500);
    const visionObserver = new IntersectionObserver(
      ([entry]) => { isRailVisible = entry.isIntersecting; },
      { threshold: 0.18 },
    );
    const updateVisionLoopWidth = () => {
      if (visionRail && clonedVisionCards[0] && visionRail.firstElementChild) {
        visionLoopWidth = clonedVisionCards[0].offsetLeft - (visionRail.firstElementChild as HTMLElement).offsetLeft;
      }
    };
    const visionResizeObserver = new ResizeObserver(updateVisionLoopWidth);

    const moveVisionRail = (timestamp: number) => {
      if (!lastFrame) lastFrame = timestamp;
      const elapsed = Math.min(timestamp - lastFrame, 32);
      lastFrame = timestamp;

      if (visionRail && isRailVisible && !isFocused && timestamp >= resumeAt) {
        if (visionLoopWidth > 0) {
          visionRail.scrollLeft += elapsed * 0.095;
          if (visionRail.scrollLeft >= visionLoopWidth) {
            visionRail.scrollLeft -= visionLoopWidth;
          }
        }
      }
      visionFrame = window.requestAnimationFrame(moveVisionRail);
    };

    if (visionRail && !reducedMotion) {
      const sourceCards = Array.from(visionRail.children) as HTMLElement[];
      clonedVisionCards = sourceCards.map(card => {
        const clone = card.cloneNode(true) as HTMLElement;
        clone.classList.add("vision-clone");
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll<HTMLElement>(".text-reveal").forEach(item => {
          item.classList.remove("text-reveal", "is-visible");
          item.style.removeProperty("--reveal-delay");
        });
        visionRail.appendChild(clone);
        return clone;
      });
      visionRail.classList.add("is-looping");
      updateVisionLoopWidth();
      visionResizeObserver.observe(visionRail);
      visionObserver.observe(visionRail);
      visionRail.addEventListener("focusin", onFocusIn);
      visionRail.addEventListener("focusout", onFocusOut);
      visionRail.addEventListener("wheel", onWheel, { passive: true });
      visionRail.addEventListener("touchstart", onTouchStart, { passive: true });
      visionFrame = window.requestAnimationFrame(moveVisionRail);
    }

    return () => {
      revealObserver.disconnect();
      heroObserver.disconnect();
      visionObserver.disconnect();
      visionResizeObserver.disconnect();
      window.cancelAnimationFrame(visionFrame);
      visionRail?.removeEventListener("focusin", onFocusIn);
      visionRail?.removeEventListener("focusout", onFocusOut);
      visionRail?.removeEventListener("wheel", onWheel);
      visionRail?.removeEventListener("touchstart", onTouchStart);
      clonedVisionCards.forEach(card => card.remove());
      visionRail?.classList.remove("is-looping");
      root.classList.remove("effects-ready");
    };
  }, []);

  return null;
}
