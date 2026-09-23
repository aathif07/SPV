import { uploadObject } from "@/app/lib/s3";
import { requireAdminApi } from "@/app/lib/post-payload";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const { user, response } = await requireAdminApi();
  if (!user) return response;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "An image file is required." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { error: "Only JPEG, PNG, WebP, AVIF or GIF images can be uploaded." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Please use an image under 10 MB." }, { status: 400 });
  }

  try {
    const uploaded = await uploadObject(file.name, file.type, await file.arrayBuffer());
    if (!uploaded) {
      return Response.json(
        { error: "Image storage is not configured. Set the S3_* variables in Dokploy." },
        { status: 503 },
      );
    }
    return Response.json(uploaded);
  } catch (error) {
    console.error("S3 upload failed", error);
    return Response.json({ error: "Image upload failed. Check the storage configuration." }, { status: 502 });
  }
}
