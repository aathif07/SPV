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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
