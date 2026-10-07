import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  index,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/** People who can sign in to /admin. */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Server-side sessions. Only the hash of the cookie token is stored. */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenHash: text("token_hash").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

/**
 * Blog posts. Every reader-facing string exists in English and Tamil; the
 * Tamil columns are optional so a post can go out in one language first.
 */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),

    titleEn: varchar("title_en", { length: 300 }).notNull(),
    titleTa: varchar("title_ta", { length: 300 }),

    // Short description shown on the blog listing card.
    excerptEn: text("excerpt_en").notNull().default(""),
    excerptTa: text("excerpt_ta"),

    // Full article body, stored as HTML from the rich text editor.
    contentEn: text("content_en").notNull().default(""),
    contentTa: text("content_ta"),

    coverImageUrl: text("cover_image_url"),
    coverImageAlt: varchar("cover_image_alt", { length: 300 }),

    category: varchar("category", { length: 80 }),
    status: varchar("status", { length: 16 }).notNull().default("draft"),

    publishedAt: timestamp("published_at", { withTimezone: true }),
    authorId: uuid("author_id").references(() => adminUsers.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("posts_status_published_at_idx").on(table.status, table.publishedAt),
  ],
);

/**
 * Achievements shown as cards on the homepage and on /achievements. Ordered
 * by `sortOrder`; Tamil columns are optional, as with posts.
 */
export const achievements = pgTable(
  "achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),

    titleEn: varchar("title_en", { length: 300 }).notNull(),
    titleTa: varchar("title_ta", { length: 300 }),

    // One or two sentences for the card.
    summaryEn: text("summary_en").notNull().default(""),
    summaryTa: text("summary_ta"),

    // Full write-up for the detail page, stored as HTML.
    contentEn: text("content_en").notNull().default(""),
    contentTa: text("content_ta"),

    imageUrl: text("image_url"),
    imageAlt: varchar("image_alt", { length: 300 }),
    // Key into the icon set in app/components/achievement-icon.tsx.
    icon: varchar("icon", { length: 32 }).notNull().default("award"),
    // Renders the card in solid red.
    highlight: boolean("highlight").notNull().default(false),

    sortOrder: integer("sort_order").notNull().default(0),
    status: varchar("status", { length: 16 }).notNull().default("published"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("achievements_status_sort_idx").on(table.status, table.sortOrder)],
);

export type AdminUser = typeof adminUsers.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;
