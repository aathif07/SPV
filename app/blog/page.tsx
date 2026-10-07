import type { Metadata } from "next";
import PostImage from "../components/post-image";
import { Bilingual, LanguageProvider, LanguageToggle } from "../components/language";
import { Arrow, PlainLink, SiteBottom, SiteTop } from "../components/site-chrome";
import { listPublishedPosts } from "../lib/posts";
import { formatPostDate } from "../lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | S. P. Velumani",
  description:
    "News, updates and statements from S. P. Velumani — political programmes, public meetings and development initiatives across Tamil Nadu.",
};

export default async function BlogIndexPage() {
  const posts = await listPublishedPosts(60);
  const anyTamil = posts.some((post) => post.titleTa?.trim());
  const [featured, ...rest] = posts;

  return (
    <div className="sp" id="top">
      <SiteTop />

      {/* One provider wraps both the toggle and the cards so they share state. */}
      <LanguageProvider>
        <main className="sp-blog">
          <div className="sp-wrap">
            <header className="sp-blog-head">
              <div>
                <div className="sp-eyebrow">News &amp; updates</div>
                <h1 className="sp-h2">Latest from<br />S. P. Velumani</h1>
                <div className="sp-ta-sub" lang="ta">சமீபத்திய செய்திகள்</div>
              </div>
              <div className="sp-blog-head-side">
                <p>Political programmes, public meetings, development initiatives and statements.</p>
                <LanguageToggle hasTamil={anyTamil} />
              </div>
            </header>

            {!featured ? (
              <div className="sp-blog-empty">
                <p>No posts have been published yet. Please check back soon.</p>
                <PlainLink href="/" className="sp-btn sp-btn-ghost">Back to home <Arrow /></PlainLink>
              </div>
            ) : (
              <>
                <PlainLink href={`/blog/${featured.slug}`} className="sp-blog-feature">
                  <div className="sp-blog-feature-media">
                    <PostImage src={featured.coverImageUrl} alt={featured.coverImageAlt ?? featured.titleEn} priority />
                  </div>
                  <div className="sp-blog-feature-body">
                    <PostMeta category={featured.category} date={formatPostDate(featured.publishedAt ?? featured.createdAt)} />
                    <h2><Bilingual en={featured.titleEn} ta={featured.titleTa} /></h2>
                    {featured.excerptEn ? <p><Bilingual en={featured.excerptEn} ta={featured.excerptTa} /></p> : null}
                    <span className="sp-blog-more">Read story <Arrow /></span>
                  </div>
                </PlainLink>

                {rest.length ? (
                  <div className="sp-blog-grid">
                    {rest.map((post) => (
                      <PlainLink href={`/blog/${post.slug}`} className="sp-blog-card" key={post.id}>
                        <div className="sp-blog-card-media">
                          <PostImage src={post.coverImageUrl} alt={post.coverImageAlt ?? post.titleEn} />
                        </div>
                        <div className="sp-blog-card-body">
                          <PostMeta category={post.category} date={formatPostDate(post.publishedAt ?? post.createdAt)} />
                          <h3><Bilingual en={post.titleEn} ta={post.titleTa} /></h3>
                          {post.excerptEn ? <p><Bilingual en={post.excerptEn} ta={post.excerptTa} /></p> : null}
                          <span className="sp-blog-more">Read story <Arrow /></span>
                        </div>
                      </PlainLink>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </main>
      </LanguageProvider>

      <SiteBottom />
    </div>
  );
}

function PostMeta({ category, date }: { category: string | null; date: { en: string; ta: string } }) {
  return (
    <p className="sp-blog-meta">
      {category ? <span className="sp-tag">{category}</span> : null}
      <span><Bilingual en={date.en} ta={date.ta} /></span>
    </p>
  );
}
