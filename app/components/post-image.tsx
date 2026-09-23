/**
 * Cover images can live on S3, so they bypass the built-in image optimiser
 * (which only serves assets bundled with the site).
 */
export default function PostImage({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return <div className={`post-image-placeholder ${className ?? ""}`.trim()} aria-hidden="true" />;
  }
  const mediaSrc = src.startsWith("https://spv.web.welocalhost.com/")
    ? `/api/media/${src.slice("https://spv.web.welocalhost.com/".length)}`
    : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={mediaSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
