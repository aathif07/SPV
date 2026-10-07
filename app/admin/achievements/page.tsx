import type { Metadata } from "next";
import type { Achievement } from "@/db/schema";
import { requireAdmin } from "../../lib/auth";
import { listAllAchievements } from "../../lib/achievements";
import AdminShell from "../../components/admin-shell";
import DeletePostButton from "../../components/delete-post-button";
import { AchievementIcon } from "../../components/achievement-icon";
import { PlainLink } from "../../components/site-chrome";
import { toMediaUrl } from "../../lib/media-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminAchievementsPage() {
  const user = await requireAdmin("/admin/achievements");

  let items: Achievement[] = [];
  let loadError = false;
  try {
    items = await listAllAchievements();
  } catch (error) {
    console.error("Could not load achievements", error);
    loadError = true;
  }
  const published = items.filter((item) => item.status === "published").length;

  return (
    <AdminShell user={user}>
      <div className="admin-head">
        <div>
          <p className="section-label">Homepage</p>
          <h1>Achievements</h1>
          <p className="admin-sub">
            {items.length} total · {published} published · shown in this order on the site
          </p>
        </div>
        <PlainLink className="button button-primary" href="/admin/achievements/new">
          Add achievement <span>+</span>
        </PlainLink>
      </div>

      {loadError ? (
        <p className="admin-error" role="alert">
          The achievements table is not in the database yet. Run <code>npm run db:migrate</code> once to create it with the starting list.
        </p>
      ) : items.length === 0 ? (
        <div className="admin-empty">
          <p>No achievements yet.</p>
          <PlainLink className="button button-primary" href="/admin/achievements/new">
            Add the first achievement <span>→</span>
          </PlainLink>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Achievement</th>
              <th>Status</th>
              <th>Image</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="admin-ach-no">{String(index + 1).padStart(2, "0")}</td>
                <td data-label="Achievement">
                  <div className="admin-ach">
                    <span className={`admin-ach-icon${item.highlight ? " is-red" : ""}`}>
                      <AchievementIcon name={item.icon} />
                    </span>
                    <div>
                      <a className="admin-post-title" href={`/admin/achievements/${item.id}`}>{item.titleEn}</a>
                      <span className="admin-slug">{item.summaryEn}</span>
                    </div>
                  </div>
                </td>
                <td data-label="Status">
                  <span className={`admin-status is-${item.status}`}>{item.status}</span>
                </td>
                <td data-label="Image">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="admin-ach-thumb" src={toMediaUrl(item.imageUrl)} alt="" />
                  ) : (
                    <span className="admin-slug">Icon only</span>
                  )}
                </td>
                <td className="admin-actions" data-label="Actions">
                  <a className="admin-link" href={`/admin/achievements/${item.id}`}>Edit</a>
                  {item.status === "published" ? (
                    <a className="admin-link" href={`/achievements/${item.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                  ) : null}
                  <DeletePostButton id={item.id} title={item.titleEn} endpoint="/api/admin/achievements" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
