import { destroySession } from "@/app/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await destroySession();
  return Response.redirect(new URL("/admin/login", request.url), 303);
}
