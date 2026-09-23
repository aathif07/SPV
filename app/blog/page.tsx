import type { Metadata } from "next";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import PostImage from "../components/post-image";
import { NameMark } from "../components/name-mark";
import { Bilingual, LanguageProvider, LanguageToggle } from "../components/language";
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

  return (
    <main id="top">
      <SiteHeader />

      {/* One provider wraps both the toggle and the cards so they share state. */}
      <LanguageProvider>
        <section className="section blog-index">
          <div className="blog-index-head">
            <div className="section-head">
              <p className="section-label">News &amp; Updates</p>
              <h2>
                From the desk of <NameMark className="heading" />
              </h2>
            </div>
            <LanguageToggle hasTamil={anyTamil} />
          </div>

          {posts.length === 0 ? (
            <p className="blog-empty">
              No posts have been published yet. Please check back soon.
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => {
                const date = formatPostDate(post.publishedAt ?? post.createdAt);
                return (
                  <article className="blog-card" key={post.id}>
                    <a className="blog-card-link" href={`/blog/${post.slug}`}>
                      <div className="blog-card-media">
                        <PostImage
                          src={post.coverImageUrl}
                          alt={post.coverImageAlt ?? post.titleEn}
                        />
                      </div>
                      <div className="blog-card-body">
                        <p className="blog-card-meta">
                          {post.category ? <span>{post.category}</span> : null}
                          <span>
                            <Bilingual en={date.en} ta={date.ta} />
                          </span>
                        </p>
                        <h3>
                          <Bilingual en={post.titleEn} ta={post.titleTa} />
                        </h3>
                        <p className="blog-card-excerpt">
                          <Bilingual en={post.excerptEn} ta={post.excerptTa} />
                        </p>
                        <span className="blog-card-cta">
                          View Blog <b aria-hidden="true">→</b>
                        </span>
                      </div>
                    </a>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </LanguageProvider>

      <SiteFooter />
    </main>
  );
}
