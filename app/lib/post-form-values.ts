import type { Post } from "@/db/schema";
import type { PostFormValues } from "@/app/components/post-form";

/** `YYYY-MM-DD` in UTC, matching the date input the admin form renders. */
export function toDateInput(value: Date | null): string {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

export function emptyPostForm(): PostFormValues {
  return {
    id: null,
    slug: "",
    titleEn: "",
    titleTa: "",
    excerptEn: "",
    excerptTa: "",
    contentEn: "",
    contentTa: "",
    coverImageUrl: "",
    coverImageAlt: "",
    category: "",
    status: "draft",
    publishedAt: toDateInput(new Date()),
  };
}

export function toPostForm(post: Post): PostFormValues {
  return {
    id: post.id,
    slug: post.slug,
    titleEn: post.titleEn,
    titleTa: post.titleTa ?? "",
    excerptEn: post.excerptEn,
    excerptTa: post.excerptTa ?? "",
    contentEn: post.contentEn,
    contentTa: post.contentTa ?? "",
    coverImageUrl: post.coverImageUrl ?? "",
    coverImageAlt: post.coverImageAlt ?? "",
    category: post.category ?? "",
    status: post.status === "published" ? "published" : "draft",
    publishedAt: toDateInput(post.publishedAt ?? post.createdAt),
  };
}
