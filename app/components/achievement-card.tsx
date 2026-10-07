import type { Achievement } from "@/db/schema";
import { AchievementIcon } from "./achievement-icon";
import { Bilingual } from "./language";
import { PlainLink } from "./site-chrome";
import { toMediaUrl } from "../lib/media-url";

export function achievementNumber(index: number): string {
  return `A / ${String(index + 1).padStart(2, "0")}`;
}

export default function AchievementCard({ item, index }: { item: Achievement; index: number }) {
  return (
    <PlainLink href={`/achievements/${item.slug}`} className={`sp-ach-card${item.highlight ? " is-red" : ""}`}>
      <div className="sp-ach-top">
        <span className="sp-ach-no" aria-label={`Achievement ${index + 1}`}>{String(index + 1).padStart(2, "0")}</span>
        <span className="sp-ach-icon"><AchievementIcon name={item.icon} /></span>
      </div>
      {item.imageUrl ? (
        <div className="sp-ach-img">
          {/* Uploaded images can live on S3, so they bypass the image optimiser. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={toMediaUrl(item.imageUrl)} alt={item.imageAlt ?? ""} loading="lazy" />
        </div>
      ) : null}
      <h3><Bilingual en={item.titleEn} ta={item.titleTa} /></h3>
      <p><Bilingual en={item.summaryEn} ta={item.summaryTa} /></p>
      <span className="sp-ach-more">
        View details
        <span className="sp-ach-go" aria-hidden="true">→</span>
      </span>
    </PlainLink>
  );
}
