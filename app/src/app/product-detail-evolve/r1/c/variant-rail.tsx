import { Check } from "lucide-react";
import { formatUsd, type Variant, type VariantId } from "./data";

/**
 * The persistent configuration rail — the page's master list. Vertical and sticky on desktop,
 * a horizontal (locally scrollable, never page-scrolling) strip on mobile. Selecting a row is the
 * page's primary live-update interaction: price, the quick-spec strip, the spec sheet, the media
 * gallery alt text and the documentation list all recompute from the chosen variant.
 */
export default function VariantRail({
  variants,
  selectedId,
  onSelect,
}: {
  variants: Variant[];
  selectedId: VariantId;
  onSelect: (id: VariantId) => void;
}) {
  return (
    <ul
      role="list"
      className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
    >
      {variants.map((v) => {
        const selected = v.id === selectedId;
        return (
          <li key={v.id} className="w-40 flex-none lg:w-auto">
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(v.id)}
              className={`w-full min-w-0 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                selected
                  ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-500/10"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.7rem] font-normal text-zinc-600 dark:text-zinc-400">
                  {v.sku}
                </span>
                {selected && (
                  <span className="inline-flex flex-none items-center gap-1 text-[0.7rem] font-medium text-blue-700 dark:text-blue-400">
                    <Check className="h-3 w-3 flex-none" aria-hidden="true" />
                    Selected
                  </span>
                )}
              </span>
              <span className="mt-1.5 block text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {v.strokeMm} mm stroke
              </span>
              <span className="mt-0.5 block text-sm font-normal tabular-nums text-zinc-600 dark:text-zinc-400">
                {formatUsd(v.priceUsd)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
