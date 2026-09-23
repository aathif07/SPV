"use client";

import { useRef, useState } from "react";
import RichTextEditor from "./rich-text-editor";

export type PostFormValues = {
  id: string | null;
  slug: string;
  titleEn: string;
  titleTa: string;
  excerptEn: string;
  excerptTa: string;
  contentEn: string;
  contentTa: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: string;
  status: "draft" | "published";
  /** `YYYY-MM-DD`, matching the date input. A plain date dodges timezone drift. */
  publishedAt: string;
};

const CATEGORIES = [
  "Political Updates",
  "Public Activities",
  "Development",
  "Speeches & Statements",
  "Media Coverage",
];

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

export default function PostForm({
  initial,
  storageConfigured,
}: {
  initial: PostFormValues;
  storageConfigured: boolean;
}) {
  const [values, setValues] = useState<PostFormValues>(initial);
  const [tab, setTab] = useState<"en" | "ta">("en");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  // Once the slug has been typed by hand, stop deriving it from the title.
  const slugTouched = useRef(Boolean(initial.slug));
  const coverInput = useRef<HTMLInputElement>(null);

  function set<K extends keyof PostFormValues>(key: K, value: PostFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function setTitleEn(value: string) {
    setValues((current) => ({
      ...current,
      titleEn: value,
      slug: slugTouched.current ? current.slug : slugify(value),
    }));
  }

  /** Upload through the backend so browser uploads do not depend on bucket CORS. */
  async function uploadImage(file: File): Promise<string | null> {
    setError(null);

    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setError(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Please use one under 10 MB.`,
      );
      return null;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const upload = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const result = await upload.json().catch(() => ({}));
      if (!upload.ok) {
        setError(result.error ?? "Image storage is not configured yet.");
        return null;
      }
      return result.publicUrl as string;
    } catch (cause) {
      setError(`Upload failed: ${String(cause)}`);
      return null;
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
        values.id ? `/api/admin/posts/${values.id}` : "/api/admin/posts",
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
      window.location.href = "/admin";
    } catch (cause) {
      setError(`Could not save: ${String(cause)}`);
    } finally {
      setSaving(false);
    }
  }

  const isEnglish = tab === "en";

  return (
    <form className="post-form" onSubmit={submit}>
      {error ? (
        <p className="admin-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="post-form-grid">
        <div className="post-form-main">
          <div className="lang-tabs" role="tablist" aria-label="Post language">
            <button
              type="button"
              role="tab"
              aria-selected={isEnglish}
              className={isEnglish ? "is-active" : ""}
              onClick={() => setTab("en")}
            >
              English
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isEnglish}
              className={!isEnglish ? "is-active" : ""}
              onClick={() => setTab("ta")}
              lang="ta"
            >
              தமிழ்
            </button>
          </div>

          {isEnglish ? (
            <>
              <label className="field">
                Title (English) <em>required</em>
                <input
                  value={values.titleEn}
                  onChange={(event) => setTitleEn(event.target.value)}
                  placeholder="Post title"
                  required
                />
              </label>

              <label className="field">
                Short description (English)
                <span className="field-hint">Shown on the blog card.</span>
                <textarea
                  rows={3}
                  value={values.excerptEn}
                  onChange={(event) => set("excerptEn", event.target.value)}
                  placeholder="One or two sentences summarising the post."
                />
              </label>

              <div className="field">
                Full content (English)
                <RichTextEditor
                  ariaLabel="English post content"
                  lang="en"
                  value={values.contentEn}
                  onChange={(html) => set("contentEn", html)}
                  uploadImage={uploadImage}
                />
              </div>
            </>
          ) : (
            <>
              <label className="field">
                Title (Tamil)
                <input
                  lang="ta"
                  value={values.titleTa}
                  onChange={(event) => set("titleTa", event.target.value)}
                  placeholder="தலைப்பு"
                />
              </label>

              <label className="field">
                Short description (Tamil)
                <span className="field-hint">Shown on the blog card in Tamil.</span>
                <textarea
                  lang="ta"
                  rows={3}
                  value={values.excerptTa}
                  onChange={(event) => set("excerptTa", event.target.value)}
                  placeholder="சுருக்கமான விளக்கம்"
                />
              </label>

              <div className="field">
                Full content (Tamil)
                <RichTextEditor
                  ariaLabel="Tamil post content"
                  lang="ta"
                  value={values.contentTa}
                  onChange={(html) => set("contentTa", html)}
                  uploadImage={uploadImage}
                />
              </div>

              <p className="field-hint">
                Leave the Tamil fields blank to publish in English only. The
                language switch on the website appears once Tamil is filled in.
              </p>
            </>
          )}
        </div>

        <aside className="post-form-side">
          <div className="side-card">
            <h2>Publishing</h2>

            <label className="field">
              Status
              <select
                value={values.status}
                onChange={(event) =>
                  set("status", event.target.value as "draft" | "published")
                }
              >
                <option value="draft">Draft — not visible on the site</option>
                <option value="published">Published — live on the site</option>
              </select>
            </label>

            <label className="field">
              Publish date
              <input
                type="date"
                value={values.publishedAt}
                onChange={(event) => set("publishedAt", event.target.value)}
              />
            </label>

            <label className="field">
              Category
              <input
                list="post-categories"
                value={values.category}
                onChange={(event) => set("category", event.target.value)}
                placeholder="e.g. Public Activities"
              />
            </label>
            <datalist id="post-categories">
              {CATEGORIES.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>

            <label className="field">
              URL slug
              <span className="field-hint">/blog/{values.slug || "…"}</span>
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
            <h2>Cover image</h2>

            {values.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cover-preview" src={values.coverImageUrl} alt="Cover preview" />
            ) : (
              <div className="cover-preview is-empty">No image yet</div>
            )}

            <button
              type="button"
              className="button button-secondary"
              disabled={uploading}
              onClick={() => coverInput.current?.click()}
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              hidden
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                const url = await uploadImage(file);
                if (url) set("coverImageUrl", url);
              }}
            />

            {storageConfigured ? null : (
              <p className="field-hint">
                Image storage is not connected yet, so uploads will fail. Paste an
                image URL below until the S3 settings are added.
              </p>
            )}

            <label className="field">
              Image URL
              <input
                value={values.coverImageUrl}
                onChange={(event) => set("coverImageUrl", event.target.value)}
                placeholder="https://…"
              />
            </label>

            <label className="field">
              Image description (alt text)
              <input
                value={values.coverImageAlt}
                onChange={(event) => set("coverImageAlt", event.target.value)}
                placeholder="What the photo shows"
              />
            </label>
          </div>

          <div className="post-form-actions">
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : values.id ? "Save changes" : "Create post"}
            </button>
            <a className="button button-secondary" href="/admin">
              Cancel
            </a>
          </div>
        </aside>
      </div>
    </form>
  );
}
