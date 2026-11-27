import Image from "next/image";
import { BadgeCheck, CircleDashed, Sparkles } from "lucide-react";
import { categoryById, computeAiPrice, deltaPct, formatDelta, gradeById, isVerified, money, type Item } from "./data";
import { CAPTION } from "./tokens";

/**
 * Compact parallel listing card used inside the hero fold -- photo + badge row only, no
 * accordion. Badges live in a row below the photo, never overlaid on top of it, so a slow or
 * failed image load never lets alt text run underneath an illegible floating pill.
 */
export function SpotlightThumb({ item, selected, preload }: { item: Item; selected: boolean; preload?: boolean }) {
  const category = categoryById(item.categoryId);
  const grade = gradeById(item.gradeId);
  const aiPrice = computeAiPrice(item);
  const delta = deltaPct(item.listedPrice, aiPrice);
  const verified = isVerified(item.gradeId);

  return (
    <div
      className={`min-w-0 overflow-hidden rounded-xl border bg-white ${
        selected ? "border-teal-700 ring-1 ring-teal-700/30" : "border-zinc-200"
      }`}
    >
      <div className="relative aspect-square w-full bg-zinc-100">
        <Image
          src={`https://images.unsplash.com/photo-${category.photoId}?auto=format&fit=crop&w=320&q=70`}
          alt={`${category.label} comparable, ${grade.label} condition grade`}
          fill
          sizes="(min-width: 1024px) 160px, 45vw"
          className="object-cover"
          preload={preload}
        />
      </div>

      <div className="p-2.5">
        <div className="flex items-center justify-between gap-1">
          <span className={`${CAPTION} ${selected ? "text-teal-700" : "text-zinc-500"}`}>{grade.label}</span>
          {selected && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-teal-700">
              <Sparkles className="h-2.5 w-2.5" aria-hidden="true" strokeWidth={2.5} />
              Selected
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs font-semibold text-zinc-950">{item.short}</p>

        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700">
            {item.matchPct}% match
          </span>
          {verified ? (
            <span className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600">
              <BadgeCheck className="h-2.5 w-2.5" aria-hidden="true" strokeWidth={2} />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500">
              <CircleDashed className="h-2.5 w-2.5" aria-hidden="true" strokeWidth={2} />
              Pending
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-baseline justify-between gap-1">
          <span className="text-xs font-semibold text-zinc-500 line-through">{money(item.listedPrice)}</span>
          <span className="text-xs font-extrabold text-zinc-950">{money(aiPrice)}</span>
        </div>
        <p className="mt-0.5 text-[10px] font-semibold text-zinc-500">{formatDelta(delta)} vs. asking</p>
      </div>
    </div>
  );
}
