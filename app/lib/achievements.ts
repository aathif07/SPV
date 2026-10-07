import { and, asc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { achievements, type Achievement } from "@/db/schema";
import seed from "@/db/seed/achievements.json";
import { ACHIEVEMENT_ICONS } from "../components/achievement-icon";
import { htmlToPlainText, sanitizePostHtml, slugify } from "./posts";

export type AchievementStatus = "draft" | "published";

export type AchievementInput = {
  slug: string;
  titleEn: string;
  titleTa: string | null;
  summaryEn: string;
  summaryTa: string | null;
  contentEn: string;
  contentTa: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  icon: string;
  highlight: boolean;
  sortOrder: number;
  status: AchievementStatus;
};

/* ---------------------------------------------------------- public reads */

/**
 * The built-in list from db/seed, shaped like database rows. Public pages use
 * it if the database cannot be read (for example before the migration runs).
 */
function seedAchievements(): Achievement[] {
  const epoch = new Date(0);
  return seed.map((item, index) => ({
    id: item.slug,
    slug: item.slug,
    titleEn: item.titleEn,
    titleTa: null,
    summaryEn: item.summaryEn,
    summaryTa: null,
    contentEn: item.contentEn,
    contentTa: null,
    imageUrl: null,
    imageAlt: null,
    icon: item.icon,
    highlight: item.highlight,
    sortOrder: (index + 1) * 10,
    status: "published",
    createdAt: epoch,
    updatedAt: epoch,
  }));
}

export async function listPublishedAchievements(): Promise<Achievement[]> {
  try {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.status, "published"))
      .orderBy(asc(achievements.sortOrder), asc(achievements.createdAt));
  } catch (error) {
    console.error("Could not load achievements; using the built-in list", error);
    return seedAchievements();
  }
}

export async function getPublishedAchievementBySlug(slug: string): Promise<Achievement | null> {
  const list = await listPublishedAchievements();
  return list.find((item) => item.slug === slug) ?? null;
}

/* ----------------------------------------------------------- admin CRUD */

export async function listAllAchievements(): Promise<Achievement[]> {
  return db.select().from(achievements).orderBy(asc(achievements.sortOrder), asc(achievements.createdAt));
}

export async function getAchievementById(id: string): Promise<Achievement | null> {
  const rows = await db.select().from(achievements).where(eq(achievements.id, id)).limit(1);
  return rows[0] ?? null;
}

/** The next free position, so new cards land at the end of the rail. */
export async function nextSortOrder(): Promise<number> {
  const rows = await db.select({ max: sql<number>`coalesce(max(${achievements.sortOrder}), 0)::int` }).from(achievements);
  return (rows[0]?.max ?? 0) + 10;
}

export async function createAchievement(input: AchievementInput): Promise<Achievement> {
  const rows = await db.insert(achievements).values(input).returning();
  return rows[0];
}

export async function updateAchievement(id: string, input: AchievementInput): Promise<Achievement | null> {
  const rows = await db
    .update(achievements)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(achievements.id, id))
    .returning();
  return rows[0] ?? null;
}

export async function deleteAchievement(id: string): Promise<void> {
  await db.delete(achievements).where(eq(achievements.id, id));
}

async function ensureUniqueAchievementSlug(base: string, excludeId?: string): Promise<string> {
  const candidateBase = slugify(base);
  let candidate = candidateBase;
  for (let suffix = 2; suffix < 200; suffix += 1) {
    const clash = await db
      .select({ id: achievements.id })
      .from(achievements)
      .where(
        excludeId
          ? and(eq(achievements.slug, candidate), ne(achievements.id, excludeId))
          : eq(achievements.slug, candidate),
      )
      .limit(1);
    if (clash.length === 0) return candidate;
    candidate = `${candidateBase}-${suffix}`;
  }
  return `${candidateBase}-${Date.now().toString(36)}`;
}

/* ------------------------------------------------------------ validation */

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optional(value: string): string | null {
  return value === "" ? null : value;
}

/** Validates and normalises the JSON the admin form posts. */
export async function buildAchievementInput(
  body: unknown,
  existingId?: string,
): Promise<{ ok: true; input: AchievementInput } | { ok: false; error: string }> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." };
  }
  const raw = body as Record<string, unknown>;

  const titleEn = text(raw.titleEn, 300);
  if (!titleEn) return { ok: false, error: "An English title is required." };

  const contentEn = sanitizePostHtml(typeof raw.contentEn === "string" ? raw.contentEn : "");
  const contentTa = sanitizePostHtml(typeof raw.contentTa === "string" ? raw.contentTa : "");
  const summaryEn = text(raw.summaryEn, 400) || htmlToPlainText(contentEn, 160);
  const summaryTa = text(raw.summaryTa, 400) || (contentTa ? htmlToPlainText(contentTa, 160) : "");

  const imageUrl = text(raw.imageUrl, 1000);
  if (imageUrl && !/^https?:\/\//i.test(imageUrl) && !imageUrl.startsWith("/")) {
    return { ok: false, error: "The image must be an http(s) URL." };
  }

  const icon = typeof raw.icon === "string" && raw.icon in ACHIEVEMENT_ICONS ? raw.icon : "award";
  const position = Number(raw.sortOrder);
  const sortOrder = Number.isFinite(position) ? Math.max(0, Math.min(100000, Math.round(position))) : 0;

  return {
    ok: true,
    input: {
      slug: await ensureUniqueAchievementSlug(text(raw.slug, 200) || titleEn, existingId),
      titleEn,
      titleTa: optional(text(raw.titleTa, 300)),
      summaryEn,
      summaryTa: optional(summaryTa),
      contentEn,
      contentTa: optional(contentTa),
      imageUrl: optional(imageUrl),
      imageAlt: optional(text(raw.imageAlt, 300)),
      icon,
      highlight: raw.highlight === true,
      sortOrder,
      status: raw.status === "draft" ? "draft" : "published",
    },
  };
}
