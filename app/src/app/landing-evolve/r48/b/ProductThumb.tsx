import Image from "next/image";

/**
 * The image frame reserves a fixed aspect ratio and a background color before the photo ever
 * loads, so a failed or slow load never collapses the card. Badges (grade, seller, match,
 * discount) are rendered by the caller OUTSIDE this frame, in normal flow below it — never as
 * an absolute overlay on top of the photo — so a fallback alt-text node here can never collide
 * with badge text.
 */
export function ProductThumb({
  photoId,
  alt,
  sizes,
  rounded = "rounded-xl",
}: {
  photoId: string;
  alt: string;
  sizes: string;
  rounded?: string;
}) {
  return (
    <div className={`relative aspect-[4/3] w-full overflow-hidden ${rounded} bg-white/5`}>
      <Image
        src={`https://images.unsplash.com/photo-${photoId}?q=80&w=800&auto=format&fit=crop`}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
