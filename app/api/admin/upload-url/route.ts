import { createUploadUrl } from "@/app/lib/s3";
import { requireAdminApi } from "@/app/lib/post-payload";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function POST(request: Request) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const body = await request.json().catch(() => null);
  const filename = typeof body?.filename === "string" ? body.filename : "";
  const contentType = typeof body?.contentType === "string" ? body.contentType : "";

  if (!filename) {
    return Response.json({ error: "A filename is required." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(contentType)) {
    return Response.json(
      { error: "Only JPEG, PNG, WebP, AVIF or GIF images can be uploaded." },
      { status: 400 },
    );
  }

  const signed = await createUploadUrl(filename, contentType);
  if (!signed) {
    return Response.json(
      { error: "Image storage is not configured. Set the S3_* variables in .env." },
      { status: 503 },
    );
  }

  return Response.json(signed);
}
