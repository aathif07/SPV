import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/site-header";
import SiteFooter from "../../components/site-footer";
import PostImage from "../../components/post-image";
import {
  Bilingual,
  BilingualHtml,
  LanguageProvider,
  LanguageToggle,
} from "../../components/language";
import { getPublishedPostBySlug, htmlToPlainText } from "../../lib/posts";
import { formatPostDate } from "../../lib/format";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Post not found | S. P. Velumani" };

  const description = post.excerptEn || htmlToPlainText(post.contentEn, 160);
  return {
    title: `${post.titleEn} | S. P. Velumani`,
    description,
    openGraph: {
      type: "article",
      title: post.titleEn,
      description,
      publishedTime: (post.publishedAt ?? post.createdAt).toISOString(),
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.titleEn,
      description,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const date = formatPostDate(post.publishedAt ?? post.createdAt);
  const hasTamil = Boolean(post.titleTa?.trim() && post.contentTa?.trim());

  return (
    <main id="top">
      <SiteHeader />

      <LanguageProvider>
        <article className="post">
          <header className="post-header">
            <a className="post-back" href="/blog">
              ← Back to Blog
            </a>

            <p className="post-meta">
              {post.category ? <span className="post-category">{post.category}</span> : null}
              <span>
                <Bilingual en={date.en} ta={date.ta} />
              </span>
            </p>

            <h1 className="post-title">
              <Bilingual en={post.titleEn} ta={post.titleTa} />
            </h1>

            {post.excerptEn ? (
              <p className="post-standfirst">
                <Bilingual en={post.excerptEn} ta={post.excerptTa} />
              </p>
            ) : null}

            <LanguageToggle hasTamil={hasTamil} />
          </header>

          {post.coverImageUrl ? (
            <figure className="post-cover">
              {/* The alt text describes the photo; no visible caption, so
                  assistive tech does not announce it twice. */}
              <PostImage
                src={post.coverImageUrl}
                alt={post.coverImageAlt ?? post.titleEn}
                priority
              />
            </figure>
          ) : null}

          <BilingualHtml
            className="post-body"
            en={post.contentEn}
            ta={post.contentTa}
          />

          <footer className="post-footer">
            <a className="button button-secondary" href="/blog">
              ← All Posts
            </a>
            <a className="button button-primary" href="/#connect">
              Connect With Us <span>↗</span>
            </a>
          </footer>
        </article>
      </LanguageProvider>

      <SiteFooter />
    </main>
  );
}
