import type { Metadata } from "next";
import { requireAdmin } from "../../../lib/auth";
import { isStorageConfigured } from "../../../lib/s3";
import { emptyPostForm } from "../../../lib/post-form-values";
import AdminShell from "../../../components/admin-shell";
import PostForm from "../../../components/post-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Post | Admin",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const user = await requireAdmin("/admin/posts/new");

  return (
    <AdminShell user={user}>
      <div className="admin-head">
        <div>
          <p className="section-label">Blog</p>
          <h1>New Post</h1>
        </div>
      </div>
      <PostForm initial={emptyPostForm()} storageConfigured={isStorageConfigured()} />
    </AdminShell>
  );
}
