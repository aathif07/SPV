import {
  buildAchievementInput,
  deleteAchievement,
  getAchievementById,
  updateAchievement,
} from "@/app/lib/achievements";
import { requireAdminApi } from "@/app/lib/post-payload";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;
  if (!(await getAchievementById(id))) {
    return Response.json({ error: "Achievement not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const result = await buildAchievementInput(body, id);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });

  const achievement = await updateAchievement(id, result.input);
  if (!achievement) return Response.json({ error: "Achievement not found." }, { status: 404 });

  return Response.json({ id: achievement.id, slug: achievement.slug });
}

export async function DELETE(_request: Request, { params }: Context) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const { id } = await params;
  await deleteAchievement(id);
  return Response.json({ ok: true });
}
