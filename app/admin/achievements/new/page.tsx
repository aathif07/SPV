import type { Metadata } from "next";
import { requireAdmin } from "../../../lib/auth";
import { isStorageConfigured } from "../../../lib/s3";
import { nextSortOrder } from "../../../lib/achievements";
import { emptyAchievementForm } from "../../../lib/achievement-form-values";
import AdminShell from "../../../components/admin-shell";
import AchievementForm from "../../../components/achievement-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Achievement | Admin",
  robots: { index: false, follow: false },
};

export default async function NewAchievementPage() {
  const user = await requireAdmin("/admin/achievements/new");
  const sortOrder = await nextSortOrder().catch(() => 10);

  return (
    <AdminShell user={user}>
      <div className="admin-head">
        <div>
          <p className="section-label">Achievements</p>
          <h1>New achievement</h1>
        </div>
      </div>
      <AchievementForm initial={emptyAchievementForm(sortOrder)} storageConfigured={isStorageConfigured()} />
    </AdminShell>
  );
}
