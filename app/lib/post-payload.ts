import { getCurrentAdmin } from "./auth";
import {
  ensureUniqueSlug,
  sanitizePostHtml,
  htmlToPlainText,
  type PostInput,
} from "./posts";

/** `YYYY-MM-DD` → midday UTC, so the date never rolls over in either direction. */
function parseDateInput(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function optional(value: string): string | null {
  return value === "" ? null : value;
}

export type PayloadResult =
  | { ok: true; input: PostInput }
  | { ok: false; error: string };

/** Validates and normalises the JSON the admin form posts. */
export async function buildPostInput(
  body: unknown,
  existingId?: string,
): Promise<PayloadResult> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." };
  }
  const raw = body as Record<string, unknown>;

  const titleEn = text(raw.titleEn, 300);
  if (!titleEn) return { ok: false, error: "An English title is required." };

  const titleTa = text(raw.titleTa, 300);
  const contentEn = sanitizePostHtml(typeof raw.contentEn === "string" ? raw.contentEn : "");
  const contentTa = sanitizePostHtml(typeof raw.contentTa === "string" ? raw.contentTa : "");

  const status = raw.status === "published" ? "published" : "draft";

  // Fall back to the start of the body when no summary was written.
  const excerptEn = text(raw.excerptEn, 600) || htmlToPlainText(contentEn, 220);
  const excerptTa = text(raw.excerptTa, 600) || (contentTa ? htmlToPlainText(contentTa, 220) : "");

  const requestedSlug = text(raw.slug, 200) || titleEn;
  const slug = await ensureUniqueSlug(requestedSlug, existingId);

  const coverImageUrl = text(raw.coverImageUrl, 1000);
  if (coverImageUrl && !/^https?:\/\//i.test(coverImageUrl) && !coverImageUrl.startsWith("/")) {
    return { ok: false, error: "The cover image must be an http(s) URL." };
  }

  return {
    ok: true,
    input: {
      slug,
      titleEn,
      titleTa: optional(titleTa),
      excerptEn,
      excerptTa: optional(excerptTa),
      contentEn,
      contentTa: optional(contentTa),
      coverImageUrl: optional(coverImageUrl),
      coverImageAlt: optional(text(raw.coverImageAlt, 300)),
      category: optional(text(raw.category, 80)),
      status,
      publishedAt:
        status === "published" ? (parseDateInput(raw.publishedAt) ?? new Date()) : null,
    },
  };
}

/** Shared guard for the admin JSON endpoints. */
export async function requireAdminApi() {
  const user = await getCurrentAdmin();
  if (!user) {
    return {
      user: null,
      response: Response.json({ error: "Not signed in." }, { status: 401 }),
    } as const;
  }
  return { user, response: null } as const;
}
