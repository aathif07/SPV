/**
 * Imports the blog posts converted from public/Blogs.zip.
 *
 *   npm run blogs:import
 *
 * Each post in db/seed/blogs.json is inserted as published, or updated in
 * place when a post with the same slug already exists, so it is safe to run
 * again. Images are served from public/images/blog for now; they move to
 * Garage once storage is reachable again.
 */
import { readFile } from "node:fs/promises";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const posts = JSON.parse(await readFile(new URL("../db/seed/blogs.json", import.meta.url), "utf8"));
const pool = new Pool({ connectionString, max: 1 });
let created = 0;
let updated = 0;

try {
  for (const post of posts) {
    const { rows } = await pool.query(
      `INSERT INTO posts (slug, title_en, excerpt_en, content_en, cover_image_url, cover_image_alt,
                          category, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'published', $8)
       ON CONFLICT (slug) DO UPDATE SET
         title_en = EXCLUDED.title_en,
         excerpt_en = EXCLUDED.excerpt_en,
         content_en = EXCLUDED.content_en,
         cover_image_url = EXCLUDED.cover_image_url,
         cover_image_alt = EXCLUDED.cover_image_alt,
         category = EXCLUDED.category,
         status = EXCLUDED.status,
         published_at = EXCLUDED.published_at,
         updated_at = now()
       RETURNING (xmax = 0) AS inserted`,
      [
        post.slug,
        post.titleEn,
        post.excerptEn,
        post.contentEn,
        post.coverImageUrl,
        post.coverImageAlt,
        post.category,
        post.publishedAt,
      ],
    );
    if (rows[0].inserted) created += 1;
    else updated += 1;
  }
  console.log(`Blogs imported: ${created} created, ${updated} updated.`);
} catch (error) {
  console.error("Import failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
