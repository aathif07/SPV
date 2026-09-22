import { createPost } from "@/app/lib/posts";
import { buildPostInput, requireAdminApi } from "@/app/lib/post-payload";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const body = await request.json().catch(() => null);
  const result = await buildPostInput(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });

  const post = await createPost(result.input, user.id);
  return Response.json({ id: post.id, slug: post.slug }, { status: 201 });
}
