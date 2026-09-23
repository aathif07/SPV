import { downloadObject } from "@/app/lib/s3";

export const dynamic = "force-dynamic";

type RouteProps = { params: Promise<{ key?: string[] }> };

export async function GET(_request: Request, { params }: RouteProps) {
  const { key: parts = [] } = await params;
  const key = parts.map((part) => decodeURIComponent(part)).join("/");
  if (!key || key.includes("..")) return new Response("Not found", { status: 404 });

  try {
    const upstream = await downloadObject(key);
    if (!upstream || !upstream.ok || !upstream.body) {
      return new Response("Not found", { status: upstream?.status === 403 ? 403 : 404 });
    }
    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    const contentLength = upstream.headers.get("content-length");
    if (contentType) headers.set("content-type", contentType);
    if (contentLength) headers.set("content-length", contentLength);
    headers.set("cache-control", "public, max-age=31536000, immutable");
    return new Response(upstream.body, { status: 200, headers });
  } catch (error) {
    console.error("Media proxy failed", error);
    return new Response("Media unavailable", { status: 502 });
  }
}
