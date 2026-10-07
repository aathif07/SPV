import type { Metadata } from "next";
import AchievementCard from "../components/achievement-card";
import { LanguageProvider } from "../components/language";
import { SiteBottom, SiteTop } from "../components/site-chrome";
import { listPublishedAchievements } from "../lib/achievements";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements | S. P. Velumani",
  description:
    "Water projects, urban infrastructure, rural development and national recognition from S. P. Velumani’s years in public service.",
};

export default async function AchievementsPage() {
  const items = await listPublishedAchievements();

  return (
    <div className="sp" id="top">
      <SiteTop />
      <LanguageProvider>
        <main className="sp-blog">
          <div className="sp-wrap">
            <header className="sp-blog-head">
              <div>
                <div className="sp-eyebrow">Achievements</div>
                <h1 className="sp-h2">Work that speaks<br />for itself</h1>
                <div className="sp-ta-sub" lang="ta">சாதனைகள்</div>
              </div>
              <div className="sp-blog-head-side">
                <p>{items.length} milestones across water security, Coimbatore’s infrastructure, rural development and digital governance.</p>
              </div>
            </header>
            <div className="sp-ach-grid">
              {items.map((item, i) => <AchievementCard key={item.id} item={item} index={i} />)}
            </div>
          </div>
        </main>
      </LanguageProvider>
      <SiteBottom />
    </div>
  );
}
