import { deletePost, getPostById, updatePost } from "@/app/lib/posts";
import { buildPostInput, requireAdminApi } from "@/app/lib/post-payload";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;
  if (!(await getPostById(id))) {
    return Response.json({ error: "Post not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const result = await buildPostInput(body, id);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });

  const post = await updatePost(id, result.input);
  if (!post) return Response.json({ error: "Post not found." }, { status: 404 });

  return Response.json({ id: post.id, slug: post.slug });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;
  await deletePost(id);
  return Response.json({ ok: true });
}
