import type { Achievement } from "@/db/schema";
import type { AchievementFormValues } from "@/app/components/achievement-form";

export function emptyAchievementForm(sortOrder = 10): AchievementFormValues {
  return {
    id: null,
    slug: "",
    titleEn: "",
    titleTa: "",
    summaryEn: "",
    summaryTa: "",
    contentEn: "",
    contentTa: "",
    imageUrl: "",
    imageAlt: "",
    icon: "award",
    highlight: false,
    sortOrder,
    status: "published",
  };
}

export function toAchievementForm(item: Achievement): AchievementFormValues {
  return {
    id: item.id,
    slug: item.slug,
    titleEn: item.titleEn,
    titleTa: item.titleTa ?? "",
    summaryEn: item.summaryEn,
    summaryTa: item.summaryTa ?? "",
    contentEn: item.contentEn,
    contentTa: item.contentTa ?? "",
    imageUrl: item.imageUrl ?? "",
    imageAlt: item.imageAlt ?? "",
    icon: item.icon,
    highlight: item.highlight,
    sortOrder: item.sortOrder,
    status: item.status === "draft" ? "draft" : "published",
  };
}
