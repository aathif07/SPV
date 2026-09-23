const GARAGE_PUBLIC_HOST = "https://spv.web.welocalhost.com/";

/** Keeps legacy Garage URLs working when the public bucket hostname is unavailable. */
export function toMediaUrl(src: string): string {
  return src.startsWith(GARAGE_PUBLIC_HOST)
    ? `/api/media/${src.slice(GARAGE_PUBLIC_HOST.length)}`
    : src;
}
