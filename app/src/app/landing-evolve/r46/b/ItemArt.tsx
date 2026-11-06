import type { Category } from "./data";

/**
 * Flat, generative abstract art standing in for a product photo — a deliberate choice over a
 * remote photo in this sandbox (see candidates note). Shapes are solid color blocks, not
 * outline/blueprint line-art, so they don't read as the decorative line-art the brief bans.
 * Each is a plain inline SVG (not next/image, since there is no raster asset here), wrapped by
 * the caller in a fixed-aspect-ratio, reserved-background container.
 */
export function ItemArt({ category }: { category: Category }) {
  switch (category) {
    case "bags":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <rect width="100" height="100" fill="#e4e4e7" />
          <path d="M38 34 L38 24 Q38 16 50 16 Q62 16 62 24 L62 34" fill="none" stroke="#3f3f46" strokeWidth="3" />
          <rect x="24" y="34" width="52" height="46" rx="4" fill="#27272a" />
          <rect x="24" y="34" width="52" height="12" fill="#0f766e" />
        </svg>
      );
    case "sneakers":
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <rect width="100" height="100" fill="#e4e4e7" />
          <path
            d="M18 62 Q18 50 34 48 L52 44 Q62 42 70 48 L82 56 Q86 58 86 64 L86 70 L18 70 Z"
            fill="#27272a"
          />
          <rect x="18" y="68" width="68" height="8" rx="2" fill="#0f766e" />
          <rect x="30" y="50" width="4" height="14" fill="#e4e4e7" />
          <rect x="40" y="48" width="4" height="16" fill="#e4e4e7" />
          <rect x="50" y="46" width="4" height="18" fill="#e4e4e7" />
        </svg>
      );
    case "furniture":
    default:
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <rect width="100" height="100" fill="#e4e4e7" />
          <rect x="26" y="30" width="48" height="34" rx="3" fill="#27272a" />
          <rect x="26" y="30" width="48" height="10" fill="#0f766e" />
          <rect x="30" y="64" width="6" height="18" fill="#3f3f46" />
          <rect x="64" y="64" width="6" height="18" fill="#3f3f46" />
        </svg>
      );
  }
}
