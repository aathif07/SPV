"use client";

import { useRef, useState } from "react";
import RichTextEditor from "./rich-text-editor";
import { ACHIEVEMENT_ICONS, ACHIEVEMENT_ICON_KEYS, AchievementIcon } from "./achievement-icon";
import { toMediaUrl } from "../lib/media-url";
import { PlainLink } from "./site-chrome";

export type AchievementFormValues = {
  id: string | null;
  slug: string;
  titleEn: string;
  titleTa: string;
  summaryEn: string;
  summaryTa: string;
  contentEn: string;
  contentTa: string;
  imageUrl: string;
  imageAlt: string;
  icon: string;
  highlight: boolean;
  sortOrder: number;
  status: "draft" | "published";
};

/** Mirrors the server-side slugify so the preview matches what gets saved. */
function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9஀-௿]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function AchievementForm({
  initial,
  storageConfigured,
}: {
  initial: AchievementFormValues;
  storageConfigured: boolean;
}) {
  const [values, setValues] = useState<AchievementFormValues>(initial);
  const [tab, setTab] = useState<"en" | "ta">("en");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slugTouched = useRef(Boolean(initial.slug));
  const imageInput = useRef<HTMLInputElement>(null);

  function set<K extends keyof AchievementFormValues>(key: K, value: AchievementFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setTitleEn(value: string) {
    setValues((current) => ({
      ...current,
      titleEn: value,
      slug: slugTouched.current ? current.slug : slugify(value),
    }));
  }

  /** Same backend upload as posts, so it does not depend on bucket CORS. */
  async function uploadImage(file: File) {
    setError(null);
    if (file.size > 10 * 1024 * 1024) {
      setError(`That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please use one under 10 MB.`);
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const upload = await fetch("/api/admin/upload", { method: "POST", body });
      const result = await upload.json().catch(() => ({}));
      if (!upload.ok) {
        setError(result.error ?? "Image storage is not configured yet.");
        return;
      }
      set("imageUrl", result.publicUrl as string);
    } catch (cause) {
      setError(`Upload failed: ${String(cause)}`);
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!values.titleEn.trim()) {
      setError("An English title is required.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(
        values.id ? `/api/admin/achievements/${values.id}` : "/api/admin/achievements",
        {
          method: values.id ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setError(body.error ?? `Could not save (${response.status}).`);
        return;
      }
      window.location.href = "/admin/achievements";
    } catch (cause) {
      setError(`Could not save: ${String(cause)}`);
    } finally {
      setSaving(false);
    }
  }

  const isEnglish = tab === "en";

  return (
    <form className="post-form" onSubmit={submit}>
      {error ? <p className="admin-error" role="alert">{error}</p> : null}

      <div className="post-form-grid">
        <div className="post-form-main">
          <div className="lang-tabs" role="tablist" aria-label="Achievement language">
            <button type="button" role="tab" aria-selected={isEnglish} className={isEnglish ? "is-active" : ""} onClick={() => setTab("en")}>
              English
            </button>
            <button type="button" role="tab" aria-selected={!isEnglish} className={!isEnglish ? "is-active" : ""} onClick={() => setTab("ta")} lang="ta">
              தமிழ்
            </button>
          </div>

          {isEnglish ? (
            <>
              <label className="field">
                Title (English) <em>required</em>
                <input value={values.titleEn} onChange={(event) => setTitleEn(event.target.value)} placeholder="e.g. Noyyal River Rejuvenation" required />
              </label>
              <label className="field">
                Card text (English)
                <span className="field-hint">One or two short sentences shown on the card.</span>
                <textarea rows={3} value={values.summaryEn} onChange={(event) => set("summaryEn", event.target.value)} placeholder="What was achieved, in a line." />
              </label>
              <div className="field">
                Full details (English)
                <span className="field-hint">Shown on the achievement’s own page.</span>
                <RichTextEditor ariaLabel="English achievement details" lang="en" value={values.contentEn} onChange={(html) => set("contentEn", html)} />
              </div>
            </>
          ) : (
            <>
              <label className="field">
                Title (Tamil)
                <input lang="ta" value={values.titleTa} onChange={(event) => set("titleTa", event.target.value)} placeholder="தலைப்பு" />
              </label>
              <label className="field">
                Card text (Tamil)
                <textarea lang="ta" rows={3} value={values.summaryTa} onChange={(event) => set("summaryTa", event.target.value)} placeholder="சுருக்கமான விளக்கம்" />
              </label>
              <div className="field">
                Full details (Tamil)
                <RichTextEditor ariaLabel="Tamil achievement details" lang="ta" value={values.contentTa} onChange={(html) => set("contentTa", html)} />
              </div>
              <p className="field-hint">Leave the Tamil fields blank to show English only.</p>
            </>
          )}
        </div>

        <aside className="post-form-side">
          <div className="side-card">
            <h2>Publishing</h2>
            <label className="field">
              Status
              <select value={values.status} onChange={(event) => set("status", event.target.value as "draft" | "published")}>
                <option value="published">Published — shown on the site</option>
                <option value="draft">Draft — hidden</option>
              </select>
            </label>
            <label className="field">
              Position
              <span className="field-hint">Lower numbers come first in the cards.</span>
              <input type="number" min={0} step={10} value={values.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} />
            </label>
            <label className="field-check">
              <input type="checkbox" checked={values.highlight} onChange={(event) => set("highlight", event.target.checked)} />
              Highlight this card in red
            </label>
            <label className="field">
              URL slug
              <span className="field-hint">/achievements/{values.slug || "…"}</span>
              <input
                value={values.slug}
                onChange={(event) => {
                  slugTouched.current = true;
                  set("slug", event.target.value);
                }}
                placeholder="auto-from-title"
              />
            </label>
          </div>

          <div className="side-card">
            <h2>Icon</h2>
            <div className="icon-picker" role="radiogroup" aria-label="Card icon">
              {ACHIEVEMENT_ICON_KEYS.map((key) => (
                <button
                  type="button"
                  key={key}
                  role="radio"
                  aria-checked={values.icon === key}
                  className={values.icon === key ? "is-active" : ""}
                  title={ACHIEVEMENT_ICONS[key].label}
                  onClick={() => set("icon", key)}
                >
                  <AchievementIcon name={key} />
                  <span>{ACHIEVEMENT_ICONS[key].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="side-card">
            <h2>Image</h2>
            {values.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cover-preview" src={toMediaUrl(values.imageUrl)} alt="Achievement preview" />
            ) : (
              <div className="cover-preview is-empty">No image — the card shows the icon only</div>
            )}
            <div className="side-card-row">
              <button type="button" className="button button-secondary" disabled={uploading} onClick={() => imageInput.current?.click()}>
                {uploading ? "Uploading…" : values.imageUrl ? "Replace image" : "Upload image"}
              </button>
              {values.imageUrl ? (
                <button type="button" className="button button-secondary" onClick={() => set("imageUrl", "")}>
                  Remove
                </button>
              ) : null}
            </div>
            <input
              ref={imageInput}
              type="file"
              accept="image/*"
              hidden
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) await uploadImage(file);
              }}
            />
            {storageConfigured ? null : (
              <p className="field-hint">Image storage is not connected yet. Configure the S3 settings before uploading.</p>
            )}
            <label className="field">
              Image description (alt text)
              <input value={values.imageAlt} onChange={(event) => set("imageAlt", event.target.value)} placeholder="What the photo shows" />
            </label>
          </div>

          <div className="post-form-actions">
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : values.id ? "Save changes" : "Add achievement"}
            </button>
            <PlainLink className="button button-secondary" href="/admin/achievements">Cancel</PlainLink>
          </div>
        </aside>
      </div>
    </form>
  );
}
