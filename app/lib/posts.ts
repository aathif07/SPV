import sanitizeHtml from "sanitize-html";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { posts, type Post } from "@/db/schema";

export type PostStatus = "draft" | "published";

export type PostInput = {
  slug: string;
  titleEn: string;
  titleTa: string | null;
  excerptEn: string;
  excerptTa: string | null;
  contentEn: string;
  contentTa: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  category: string | null;
  status: PostStatus;
  publishedAt: Date | null;
};

/* -------------------------------------------------------------- sanitising */

/**
 * The editor produces HTML. Admins are trusted, but the body is still stored
 * and re-rendered, so keep it to a known-safe allowlist.
 */
export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "blockquote", "code", "pre",
      "h2", "h3", "h4", "ul", "ol", "li", "a", "img", "figure", "figcaption", "hr",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

/** Strips tags so HTML never leaks into a card summary or meta description. */
export function htmlToPlainText(html: string, limit = 220): string {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text;
}

/* ------------------------------------------------------------------- slugs */

export function slugify(value: string): string {
  const base = value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9஀-௿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || `post-${Date.now().toString(36)}`;
}

/** Appends -2, -3 … until the slug is free. */
export async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const candidateBase = slugify(base);
  let candidate = candidateBase;

  for (let suffix = 2; suffix < 200; suffix += 1) {
    const clash = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        excludeId
          ? and(eq(posts.slug, candidate), ne(posts.id, excludeId))
          : eq(posts.slug, candidate),
      )
      .limit(1);
    if (clash.length === 0) return candidate;
    candidate = `${candidateBase}-${suffix}`;
  }
  return `${candidateBase}-${Date.now().toString(36)}`;
}

/* ----------------------------------------------------------------- queries */

export async function listPublishedPosts(limit = 50, offset = 0): Promise<Post[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(sql`coalesce(${posts.publishedAt}, ${posts.createdAt})`))
    .limit(limit)
    .offset(offset);
}

export async function countPublishedPosts(): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(posts)
    .where(eq(posts.status, "published"));
  return rows[0]?.count ?? 0;
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  const rows = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);
  return rows[0] ?? null;
}

export async function listAllPosts(): Promise<Post[]> {
  return db.select().from(posts).orderBy(desc(posts.updatedAt));
}

export async function getPostById(id: string): Promise<Post | null> {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createPost(input: PostInput, authorId: string): Promise<Post> {
  const rows = await db.insert(posts).values({ ...input, authorId }).returning();
  return rows[0];
}

export async function updatePost(id: string, input: PostInput): Promise<Post | null> {
  const rows = await db
    .update(posts)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deletePost(id: string): Promise<void> {
  await db.delete(posts).where(eq(posts.id, id));
}
