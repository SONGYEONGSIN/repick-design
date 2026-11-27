"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronDown, Sparkles } from "lucide-react";
import { discountPercent, formatUsd, type InventoryItem } from "./data";
import { ACCENT_FILL, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

/**
 * Rich listing card used by both the hero's compact proof row and the fuller Product Preview
 * grid. The four required proof signals (AI match-reasoning tag, condition grade, seller
 * verification, before/after discount) sit in a row BELOW the photo, never as absolute overlays
 * on top of it, so a slow/broken image never collides with badge text.
 */
export default function ProductCard({
  item,
  compact = false,
}: {
  item: InventoryItem;
  compact?: boolean;
}) {
  const discount = discountPercent(item);
  const [reasonOpen, setReasonOpen] = useState(false);
  const reasonId = useId();

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#23232C] bg-[#13131A]">
      <div className={`relative w-full shrink-0 bg-[#1C1C24] ${compact ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes={compact ? "200px" : "(min-width: 1024px) 360px, 90vw"}
          className="object-cover"
        />
      </div>

      <div className={`flex min-w-0 flex-1 flex-col gap-1.5 ${compact ? "p-3" : "p-4 gap-2"}`}>
        <div className="min-w-0">
          <p className={`truncate font-semibold text-white ${compact ? "text-sm" : "text-base"}`}>{item.title}</p>
          <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{item.brand}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}`}
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {item.matchPercent}% match
          </span>
          <span className="inline-flex items-center rounded-full border border-[#23232C] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
            Grade {item.conditionGrade}
          </span>
          {item.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#22D3EE]/40 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#22D3EE]">
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              Verified
            </span>
          )}
        </div>

        {!compact && (
          <div>
            <button
              type="button"
              aria-expanded={reasonOpen}
              aria-controls={reasonId}
              onClick={() => setReasonOpen((v) => !v)}
              className={`inline-flex min-h-8 items-center gap-1 rounded-sm text-xs font-semibold text-[#22D3EE] ${FOCUS_RING}`}
            >
              Why this match
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 motion-reduce:transition-none ${reasonOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            <p id={reasonId} hidden={!reasonOpen} className={`mt-1 text-xs font-normal leading-[1.5] ${MUTED_TEXT}`}>
              {item.matchReason}
            </p>
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2 border-t border-[#23232C] pt-2">
          <span className={`text-sm font-normal ${MUTED_TEXT} line-through`}>{formatUsd(item.listPriceNew)}</span>
          <span className={`font-extrabold tabular-nums leading-none text-white ${compact ? "text-lg" : "text-2xl"}`}>
            {formatUsd(item.salePrice)}
          </span>
          <span className="text-xs font-semibold text-[#22D3EE]">-{discount}%</span>
        </div>
      </div>
    </div>
  );
}
