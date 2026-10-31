export default function PaperDoodle({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`paper-doodle-img ${className}`}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  );
}

