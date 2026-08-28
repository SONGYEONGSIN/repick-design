import type { LucideIcon } from "lucide-react";

/**
 * Product "photo" area — deliberately not a photograph. The DNA brief allows generative SVG/CSS
 * as an alternative to real photography, and this environment cannot verify a fixed Unsplash
 * photo id resolves (the sandbox's outbound proxy blocks images.unsplash.com entirely), so a
 * wrong id would ship a silently broken image. A flat icon tile is deterministic, keeps the
 * near-monochrome palette, and reads as a spec sheet rather than a marketing photo — which suits
 * a tracked-changes/document aesthetic better than a lifestyle shot would.
 *
 * Fixed aspect-ratio + background color regardless, per the image-container rule, even though
 * this isn't an <img>/next/image element.
 */
export default function SwatchTile({
  icon: Icon,
  size = "md",
}: {
  icon: LucideIcon;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-14 w-14" : "h-16 w-16 sm:h-20 sm:w-20";
  const iconSize = size === "sm" ? "h-6 w-6" : "h-7 w-7 sm:h-8 sm:w-8";
  return (
    <div
      className={`${box} shrink-0 rounded-xl border border-zinc-200 bg-zinc-100 flex items-center justify-center`}
      style={{ aspectRatio: "1 / 1" }}
      aria-hidden="true"
    >
      <Icon className={`${iconSize} text-zinc-400`} strokeWidth={1.5} />
    </div>
  );
}
