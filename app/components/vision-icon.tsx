import type { ReactNode } from "react";

export type VisionIconName = "infrastructure" | "youth" | "education" | "healthcare" | "women" | "rural" | "agriculture" | "technology";

const paths: Record<VisionIconName, ReactNode> = {
  infrastructure: <>
    <path d="M3 17h26" />
    <path d="M5 17c3-6 7-9 11-9s8 3 11 9" />
    <path d="M9 17v8M16 17v8M23 17v8" />
    <path d="M3 25h26" />
    <path d="M16 8V4" />
  </>,
  youth: <>
    <circle cx="16" cy="8" r="4" />
    <path d="M8 28v-5a8 8 0 0 1 16 0v5" />
    <path d="M22 5l3-2 1 3" />
    <path d="M25 3c1 4-1 7-3 8" />
  </>,
  education: <>
    <path d="M16 9c-3-2.5-7-3.5-12-3v19c5-.5 9 .5 12 3 3-2.5 7-3.5 12-3V6c-5-.5-9 .5-12 3Z" />
    <path d="M16 9v19" />
    <path d="M8 11c1.8 0 3.4.4 5 1.2M8 15.5c1.8 0 3.4.4 5 1.2M19 12.2c1.6-.8 3.2-1.2 5-1.2M19 16.7c1.6-.8 3.2-1.2 5-1.2" />
  </>,
  healthcare: <>
    <path d="M16 27S4 20 4 11.5A6 6 0 0 1 16 9a6 6 0 0 1 12 2.5C28 20 16 27 16 27Z" />
    <path d="M16 13v8M12 17h8" />
  </>,
  women: <>
    <circle cx="16" cy="7" r="4" />
    <path d="M16 11l-6 12h12l-6-12Z" />
    <path d="M13 23v5M19 23v5" />
    <path d="M9 15l-3 3M23 15l3 3" />
  </>,
  rural: <>
    <path d="M3 14l9-7 9 7" />
    <path d="M5 13v14h14V13" />
    <path d="M10 27v-7h4v7" />
    <circle cx="25.5" cy="13" r="3.5" />
    <path d="M25.5 16.5V27" />
    <path d="M2 27h28" />
  </>,
  agriculture: <>
    <path d="M16 29V9" />
    <path d="M16 9c-2-1.5-2-4.5 0-6 2 1.5 2 4.5 0 6Z" />
    <path d="M16 15c-3.5 0-6-2.2-6-5 3.5 0 6 2.2 6 5ZM16 15c3.5 0 6-2.2 6-5-3.5 0-6 2.2-6 5Z" />
    <path d="M16 21c-3.5 0-6-2.2-6-5 3.5 0 6 2.2 6 5ZM16 21c3.5 0 6-2.2 6-5-3.5 0-6 2.2-6 5Z" />
    <path d="M8 29h16" />
  </>,
  technology: <>
    <rect x="9" y="9" width="14" height="14" rx="2" />
    <rect x="13" y="13" width="6" height="6" rx="1" />
    <path d="M13 9V5M19 9V5M13 27v-4M19 27v-4M9 13H5M9 19H5M27 13h-4M27 19h-4" />
  </>,
};

export function VisionIcon({ name }: { name: VisionIconName }) {
  return <span className="vision-icon" aria-hidden="true">
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
  </span>;
}
