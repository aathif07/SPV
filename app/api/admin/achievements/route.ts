import { buildAchievementInput, createAchievement } from "@/app/lib/achievements";
import { requireAdminApi } from "@/app/lib/post-payload";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const body = await request.json().catch(() => null);
  const result = await buildAchievementInput(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });

  const achievement = await createAchievement(result.input);
  return Response.json({ id: achievement.id, slug: achievement.slug }, { status: 201 });
}
