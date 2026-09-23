import { AwsClient } from "aws4fetch";

export type S3Config = {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Set for MinIO or another S3-compatible service. */
  endpoint?: string;
  /** Base URL the uploaded objects are publicly readable from. */
  publicBaseUrl: string;
};

/** Returns null when storage has not been configured yet. */
export function getS3Config(): S3Config | null {
  const region = process.env.S3_REGION?.trim();
  const bucket = process.env.S3_BUCKET?.trim();
  const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim();
  if (!region || !bucket || !accessKeyId || !secretAccessKey) return null;

  const endpoint = process.env.S3_ENDPOINT?.trim().replace(/\/$/, "") || undefined;
  const publicBaseUrl =
    process.env.S3_PUBLIC_BASE_URL?.trim().replace(/\/$/, "") ||
    (endpoint
      ? `${endpoint}/${bucket}`
      : `https://${bucket}.s3.${region}.amazonaws.com`);

  return { region, bucket, accessKeyId, secretAccessKey, endpoint, publicBaseUrl };
}

export function isStorageConfigured(): boolean {
  return getS3Config() !== null;
}

function objectUrl(config: S3Config, key: string): string {
  return config.endpoint
    ? `${config.endpoint}/${config.bucket}/${key}`
    : `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

/** Builds a collision-free, URL-safe key like `blog/2026/ab12cd34-photo.jpg`. */
export function buildObjectKey(filename: string): string {
  const safeName =
    filename
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(-60) || "image";
  const id = crypto.randomUUID().slice(0, 8);
  return `blog/${new Date().getFullYear()}/${id}-${safeName}`;
}

/**
 * Presigns a PUT so the browser can upload straight to the bucket.
 * The bucket needs a CORS rule allowing PUT from the site's origin.
 */
export async function createUploadUrl(
  filename: string,
  contentType: string,
  expiresInSeconds = 600,
): Promise<{ uploadUrl: string; publicUrl: string; key: string } | null> {
  const config = getS3Config();
  if (!config) return null;

  const key = buildObjectKey(filename);
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    service: "s3",
  });

  const signed = await client.sign(
    new Request(`${objectUrl(config, key)}?X-Amz-Expires=${expiresInSeconds}`, {
      method: "PUT",
      headers: { "content-type": contentType },
    }),
    { aws: { signQuery: true, allHeaders: false } },
  );

  return {
    uploadUrl: signed.url,
    publicUrl: `${config.publicBaseUrl}/${key}`,
    key,
  };
}

/** Uploads an object from the server, avoiding browser CORS requirements. */
export async function uploadObject(
  filename: string,
  contentType: string,
  body: ArrayBuffer,
): Promise<{ publicUrl: string; key: string } | null> {
  const config = getS3Config();
  if (!config) return null;

  const key = buildObjectKey(filename);
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region,
    service: "s3",
  });
  const signed = await client.sign(
    new Request(objectUrl(config, key), {
      method: "PUT",
      headers: { "content-type": contentType },
      body,
    }),
  );
  const response = await fetch(signed);
  if (!response.ok) {
    throw new Error(`Storage upload failed (${response.status}).`);
  }
  return { publicUrl: `${config.publicBaseUrl}/${key}`, key };
}
