import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/auth";
import { isStorageConfigured } from "../../../lib/s3";
import { getPostById } from "../../../lib/posts";
import { toPostForm } from "../../../lib/post-form-values";
import AdminShell from "../../../components/admin-shell";
import PostForm from "../../../components/post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Post | Admin",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAdmin(`/admin/posts/${id}`);

  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <AdminShell user={user}>
      <div className="admin-head">
        <div>
          <p className="section-label">Blog</p>
          <h1>Edit Post</h1>
          <p className="admin-sub">/blog/{post.slug}</p>
        </div>
        {post.status === "published" ? (
          <a
            className="button button-secondary"
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View live ↗
          </a>
        ) : null}
      </div>
      <PostForm initial={toPostForm(post)} storageConfigured={isStorageConfigured()} />
    </AdminShell>
  );
}
