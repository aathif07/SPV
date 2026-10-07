import type { ReactNode } from "react";

/** Line icons for achievement cards. Keys are stored in `achievements.icon`. */
export const ACHIEVEMENT_ICONS: Record<string, { label: string; paths: ReactNode }> = {
  water: { label: "Water", paths: <><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /><path d="M9 15a3 3 0 0 0 3 3" /></> },
  river: { label: "River", paths: <path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /> },
  lake: { label: "Lake", paths: <><ellipse cx="12" cy="15" rx="9" ry="4" /><path d="M7 15c1.5 1 3 1 5 0s3.5-1 5 0M12 11V4l4 2-4 2" /></> },
  tap: { label: "Drinking water", paths: <><path d="M4 9h9a3 3 0 0 1 3 3v1h-4v-1H4z" /><path d="M8 9V6h3M6.5 6h6" /><path d="M14 16s-1.5 2-1.5 3a1.5 1.5 0 0 0 3 0c0-1-1.5-3-1.5-3z" /></> },
  pipe: { label: "Water supply", paths: <><path d="M3 7h8v6h10" /><path d="M3 4v6M21 10v6M11 4v3M14 13v-3" /><path d="M17 18s-1.2 1.6-1.2 2.4a1.2 1.2 0 0 0 2.4 0c0-.8-1.2-2.4-1.2-2.4z" /></> },
  recharge: { label: "Recharge", paths: <><path d="M12 2s4 4.3 4 7.3a4 4 0 0 1-8 0C8 6.3 12 2 12 2z" /><path d="M3 17h18M6 21h12M12 13v6M9.5 16.5 12 19l2.5-2.5" /></> },
  city: { label: "City", paths: <><path d="M3 21h18M5 21V9h5v12M10 21V4h6v17M16 21v-8h4v8" /><path d="M7 12h1M7 15h1M12.5 7h1M12.5 10h1M12.5 13h1" /></> },
  flyover: { label: "Flyover", paths: <><path d="M2 12c3-4 7-6 10-6s7 2 10 6" /><path d="M2 12h20M6 12v8M12 12v8M18 12v8M2 20h20" /></> },
  road: { label: "Road", paths: <><path d="M8 3 4 21M16 3l4 18" /><path d="M12 4v3M12 10.5v3M12 17v3" /></> },
  park: { label: "Park", paths: <><path d="M12 3a5 5 0 0 1 5 5 4 4 0 0 1-1 7H8a4 4 0 0 1-1-7 5 5 0 0 1 5-5z" /><path d="M12 15v6M9 21h6M12 12l-2-2M12 13l2-2" /></> },
  award: { label: "Award", paths: <><circle cx="12" cy="9" r="6" /><path d="m12 6 1 2 2 .3-1.5 1.4.4 2.1L12 10.8l-1.9 1 .4-2.1L9 8.3l2-.3z" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></> },
  trophy: { label: "Trophy", paths: <><path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M9 18h6" /></> },
  digital: { label: "Digital", paths: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 21h8M12 16v5M8 11l2-2 2 2 4-4" /></> },
  network: { label: "Network", paths: <><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="M12 7.5v4M12 11.5 6.5 16M12 11.5l5.5 4.5" /></> },
  workers: { label: "Employment", paths: <><circle cx="8" cy="7" r="3" /><circle cx="17" cy="8" r="2.5" /><path d="M2 20c.5-4 3-6 6-6s5.5 2 6 6M14 14.5c3 0 5.5 1.5 6 5.5" /></> },
  building: { label: "Public building", paths: <><path d="M3 21h18M4 10h16M12 3l9 7H3z" /><path d="M6 10v11M10 10v11M14 10v11M18 10v11" /></> },
  house: { label: "Housing", paths: <><path d="M3 11 12 4l9 7" /><path d="M5 10v11h14V10M10 21v-6h4v6" /></> },
  region: { label: "Region", paths: <><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></> },
  landmark: { label: "Constituency", paths: <><path d="M4 21h16M6 21v-9h12v9M12 3l7 6H5z" /><path d="M10 21v-5h4v5" /></> },
  calendar: { label: "Tenure", paths: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M16 14h0M8 17h2M12 17h2" /></> },
  education: { label: "Education", paths: <><path d="M2 8l10-4 10 4-10 4z" /><path d="M6 10v5c3 2.5 9 2.5 12 0v-5M22 8v6" /></> },
  health: { label: "Health", paths: <><path d="M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z" /><path d="M12 9v5M9.5 11.5h5" /></> },
  farming: { label: "Agriculture", paths: <path d="M12 21V10M12 10c0-4 3-7 8-7 0 5-3 7-8 7zM12 14c0-3-2-5-7-5 0 4 2 5 7 5z" /> },
};

export const ACHIEVEMENT_ICON_KEYS = Object.keys(ACHIEVEMENT_ICONS);

export function AchievementIcon({ name, className }: { name: string; className?: string }) {
  const icon = ACHIEVEMENT_ICONS[name] ?? ACHIEVEMENT_ICONS.award;
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon.paths}
    </svg>
  );
}
