import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/auth";
import { isStorageConfigured } from "../../../lib/s3";
import { getAchievementById } from "../../../lib/achievements";
import { toAchievementForm } from "../../../lib/achievement-form-values";
import AdminShell from "../../../components/admin-shell";
import AchievementForm from "../../../components/achievement-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Achievement | Admin",
  robots: { index: false, follow: false },
};

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAdmin(`/admin/achievements/${id}`);

  const item = await getAchievementById(id);
  if (!item) notFound();

  return (
    <AdminShell user={user}>
      <div className="admin-head">
        <div>
          <p className="section-label">Achievements</p>
          <h1>Edit achievement</h1>
          <p className="admin-sub">/achievements/{item.slug}</p>
        </div>
        {item.status === "published" ? (
          <a className="button button-secondary" href={`/achievements/${item.slug}`} target="_blank" rel="noopener noreferrer">
            View live ↗
          </a>
        ) : null}
      </div>
      <AchievementForm initial={toAchievementForm(item)} storageConfigured={isStorageConfigured()} />
    </AdminShell>
  );
}
