"use client";

import { ShieldCheck, ShoppingBag, Tag } from "lucide-react";
import { GRADE_LABEL, formatUsd, type SizeOption } from "./data";

/**
 * Interaction 2 — the size selector doubles as the buy box. This is the page's structural bet: no
 * vertical sidebar carries price/CTA next to the photo. Instead a full-width horizontal ledger sits
 * directly under the media, and every number in it (price, asks available, condition grade, ship
 * window) recomputes the instant a size pill is chosen, because each size is genuinely its own pool
 * of resale listings with its own lowest ask. Price/CTA are visible at rest — no click required to
 * see them, only to change them.
 */
export default function SizeLedger({
  sizes,
  selectedUs,
  onSelect,
}: {
  sizes: SizeOption[];
  selectedUs: string;
  onSelect: (us: string) => void;
}) {
  const selected = sizes.find((s) => s.us === selectedUs) ?? sizes[0];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 p-5 sm:p-6">
        <p id="size-label" className="text-xs font-medium uppercase tracking-wide text-zinc-600">
          US size
        </p>
        <div role="group" aria-labelledby="size-label" className="mt-3 flex flex-wrap gap-2">
          {sizes.map((s) => {
            const isSelected = s.us === selectedUs;
            return (
              <button
                key={s.us}
                type="button"
                disabled={!s.inStock}
                aria-pressed={isSelected}
                aria-label={
                  s.inStock
                    ? `US size ${s.us}, ${formatUsd(s.price)}, ${s.asksAvailable} asks available`
                    : `US size ${s.us}, sold out`
                }
                onClick={() => s.inStock && onSelect(s.us)}
                className={`min-w-[3.25rem] rounded-lg border px-3 py-2 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 ${
                  !s.inStock
                    ? "cursor-not-allowed border-zinc-200 text-zinc-500 line-through"
                    : isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 text-zinc-700 hover:border-zinc-500"
                }`}
              >
                {s.us}
              </button>
            );
          })}
        </div>
        {!selected.inStock ? (
          <p className="mt-3 text-sm font-normal text-zinc-600">
            This size is sold out. Choose another size to see current asks.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <dl className="grid grid-cols-3 gap-4 sm:gap-8">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-600">Lowest ask</dt>
            <dd className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900">
              {selected.inStock ? formatUsd(selected.price) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-600">Condition</dt>
            <dd className="mt-1 flex items-center gap-1.5 text-sm font-normal text-zinc-700">
              <Tag className="h-4 w-4 flex-none text-[#A16207]" aria-hidden="true" />
              <span className="font-medium text-zinc-900">{selected.grade}</span>
              <span className="hidden sm:inline">{GRADE_LABEL[selected.grade]}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-600">Asks / ships</dt>
            <dd className="mt-1 text-sm font-normal tabular-nums text-zinc-700">
              {selected.inStock ? (
                <>
                  {selected.asksAvailable} live &middot; in {selected.shipsInDays}d
                </>
              ) : (
                "0 live"
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-none flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!selected.inStock}
            className="inline-flex items-center gap-2 rounded-lg bg-[#A16207] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8A5306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            <ShoppingBag className="h-4 w-4 flex-none" aria-hidden="true" />
            Add to bag
          </button>
          <button
            type="button"
            disabled={!selected.inStock}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-zinc-500"
          >
            Make an offer
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-200 px-5 py-4 text-xs font-normal text-zinc-600 sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 flex-none text-[#A16207]" aria-hidden="true" />
          Every order independently authenticated before it ships to you
        </span>
      </div>
    </div>
  );
}
