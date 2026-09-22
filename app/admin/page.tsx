import type { Metadata } from "next";
import { requireAdmin } from "../lib/auth";
import { listAllPosts } from "../lib/posts";
import AdminShell from "../components/admin-shell";
import DeletePostButton from "../components/delete-post-button";
import { formatPostDate } from "../lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Posts | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPostsPage() {
  const user = await requireAdmin("/admin");
  const posts = await listAllPosts();

  const published = posts.filter((post) => post.status === "published").length;
  const drafts = posts.length - published;

  return (
    <AdminShell user={user}>
      <div className="admin-head">
        <div>
          <p className="section-label">Blog</p>
          <h1>Posts</h1>
          <p className="admin-sub">
            {posts.length} total · {published} published · {drafts} draft
            {drafts === 1 ? "" : "s"}
          </p>
        </div>
        <Link className="button button-primary" href="/admin/posts/new">
          New Post <span>+</span>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="admin-empty">
          <p>No posts yet.</p>
          <Link className="button button-primary" href="/admin/posts/new">
            Write the first post <span>→</span>
          </Link>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
              <th>Languages</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => {
              const date = formatPostDate(post.publishedAt ?? post.updatedAt);
              const hasTamil = Boolean(post.titleTa?.trim() && post.contentTa?.trim());
              return (
                <tr key={post.id}>
                  <td>
                    <Link className="admin-post-title" href={`/admin/posts/${post.id}`}>
                      {post.titleEn}
                    </Link>
                    <span className="admin-slug">/blog/{post.slug}</span>
                  </td>
                  <td data-label="Status">
                    <span className={`admin-status is-${post.status}`}>{post.status}</span>
                  </td>
                  <td data-label="Date">{date.en}</td>
                  <td data-label="Languages">{hasTamil ? "EN + தமிழ்" : "EN"}</td>
                  <td className="admin-actions" data-label="Actions">
                    <Link className="admin-link" href={`/admin/posts/${post.id}`}>
                      Edit
                    </Link>
                    {post.status === "published" ? (
                      <a
                        className="admin-link"
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : null}
                    <DeletePostButton id={post.id} title={post.titleEn} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </AdminShell>
  );
}
