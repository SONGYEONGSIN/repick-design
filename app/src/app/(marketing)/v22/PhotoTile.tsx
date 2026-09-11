import type { LucideIcon } from "lucide-react";
import { cx } from "./tokens";

/**
 * Generative product-image stand-in, not a photograph. This sandbox's outbound proxy cannot reach
 * images.unsplash.com to confirm a hand-picked photo id actually resolves in production, so a wrong
 * id would ship a silently broken image on every listing card. A flat icon tile is deterministic,
 * stays inside the near-monochrome palette, and reads closer to a spec sheet / ledger entry than a
 * lifestyle photo would — which suits this archetype better than real photography anyway.
 *
 * Still reserves a fixed aspect-ratio box with a background colour regardless of the `<img>` rule,
 * per the image-container discipline.
 */
export default function PhotoTile({
  icon: Icon,
  className,
  ratio = "1 / 1",
}: {
  icon: LucideIcon;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cx("flex shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100", className)}
      style={{ aspectRatio: ratio }}
      aria-hidden="true"
    >
      <Icon className="h-[38%] w-[38%] text-zinc-400" strokeWidth={1.5} />
    </div>
  );
}
