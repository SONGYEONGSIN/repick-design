import ItemArt from "./ItemArt";
import { AccentBadge, Badge } from "./ui";
import type { ItemPreset } from "./data";
import { CARD_TINT, INK, MUTED_ON_TINT } from "./theme";

/**
 * The compact product-preview strip that must live *inside* the Hero
 * component's own grid (not a separate section below it). Badges sit in a
 * row underneath the art, never absolutely positioned on top of it, and
 * the art container reserves a fixed aspect-ratio + background color so a
 * failed/slow load never collides with the badge row.
 */
export default function ProofStrip({ item }: { item: ItemPreset }) {
  return (
    <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center">
      <div className="aspect-square w-20 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: CARD_TINT }}>
        <ItemArt id={item.id} className="h-full w-full" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold leading-snug" style={{ color: INK }}>
          {item.name}
        </p>
        <p className="text-sm font-normal leading-[1.5]" style={{ color: MUTED_ON_TINT }}>
          {item.category} · tracked in the ledger above
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          <Badge>Match {item.match}%</Badge>
          <Badge>Grade {item.grade}</Badge>
          <Badge icon>{item.cert}</Badge>
          <AccentBadge>−{item.discountPct}% vs retail</AccentBadge>
        </ul>
      </div>
    </div>
  );
}
