import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AchievementIcon } from "../../components/achievement-icon";
import { achievementNumber } from "../../components/achievement-card";
import { Bilingual, BilingualHtml, LanguageProvider, LanguageToggle } from "../../components/language";
import PostImage from "../../components/post-image";
import { Arrow, PlainLink, SiteBottom, SiteTop } from "../../components/site-chrome";
import { listPublishedAchievements } from "../../lib/achievements";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const items = await listPublishedAchievements();
  const index = items.findIndex((item) => item.slug === slug);
  if (index < 0) return null;
  return { item: items[index], index, prev: items[index - 1] ?? null, next: items[index + 1] ?? null };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const found = await load((await params).slug);
  if (!found) return { title: "Achievement not found | S. P. Velumani" };
  const { item } = found;
  return {
    title: `${item.titleEn} | Achievements | S. P. Velumani`,
    description: item.summaryEn,
    openGraph: { title: item.titleEn, description: item.summaryEn, images: item.imageUrl ? [{ url: item.imageUrl }] : undefined },
  };
}

export default async function AchievementPage({ params }: PageProps) {
  const found = await load((await params).slug);
  if (!found) notFound();
  const { item, index, prev, next } = found;
  const hasTamil = Boolean(item.titleTa?.trim());

  return (
    <div className="sp" id="top">
      <SiteTop />
      <LanguageProvider>
        <main>
          <article className="sp-post">
            <header className="sp-post-head">
              <PlainLink className="sp-post-back" href="/achievements">← All achievements</PlainLink>
              <div className="sp-ach-detail-top">
                <span className={`sp-ach-icon sp-ach-icon-lg${item.highlight ? " is-red" : ""}`}><AchievementIcon name={item.icon} /></span>
                <span className="sp-tag">{achievementNumber(index)}</span>
              </div>
              <h1 className="sp-post-title"><Bilingual en={item.titleEn} ta={item.titleTa} /></h1>
              {item.summaryEn ? (
                <p className="sp-post-standfirst"><Bilingual en={item.summaryEn} ta={item.summaryTa} /></p>
              ) : null}
              <LanguageToggle hasTamil={hasTamil} />
            </header>

            {item.imageUrl ? (
              <figure className="sp-post-cover">
                <PostImage src={item.imageUrl} alt={item.imageAlt ?? item.titleEn} priority />
              </figure>
            ) : null}

            <BilingualHtml className="sp-post-body" en={item.contentEn} ta={item.contentTa} />

            <nav className="sp-ach-pager" aria-label="More achievements">
              {prev ? (
                <PlainLink href={`/achievements/${prev.slug}`}><small>← Previous</small><b>{prev.titleEn}</b></PlainLink>
              ) : <span />}
              {next ? (
                <PlainLink href={`/achievements/${next.slug}`} className="is-next"><small>Next →</small><b>{next.titleEn}</b></PlainLink>
              ) : <span />}
            </nav>

            <footer className="sp-post-foot">
              <PlainLink className="sp-btn sp-btn-ghost" href="/achievements">← All achievements</PlainLink>
              <PlainLink className="sp-btn sp-btn-red" href="/#connect">Connect with us <Arrow /></PlainLink>
            </footer>
          </article>
        </main>
      </LanguageProvider>
      <SiteBottom />
    </div>
  );
}
