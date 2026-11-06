"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { coverageAcceptingCategory, discountPercent, formatUsd, pluralPoints, type CoverageResult, type ProductItem } from "./data";
import { ACCENT_FILL, ACCENT_TEXT, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

/**
 * Rich product card. Badges (AI match %, condition grade, seller verification, before/after
 * discount) sit in a row BELOW the photo, never as absolute overlays on top of it, so a
 * broken/slow image never collides with badge text. The "accepted near you" line is a second
 * live link into the same selection state the Hero's pin field drives -- it recomputes per
 * selection/filter, it is never a fixed string.
 */
export default function ProductCard({
  item,
  coverage,
  compact = false,
}: {
  item: ProductItem;
  coverage: CoverageResult;
  compact?: boolean;
}) {
  const discount = discountPercent(item.priceBefore, item.priceAfter);
  const [reasonOpen, setReasonOpen] = useState(false);
  const reasonId = useId();
  const accepting = coverageAcceptingCategory(coverage, item.category);

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E7E3E3] bg-white">
      <div className={`relative w-full shrink-0 bg-[#F5F3F3] ${compact ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes={compact ? "160px" : "(min-width: 1024px) 360px, 50vw"}
          className="object-cover"
        />
      </div>

      <div className={`flex min-w-0 flex-1 flex-col gap-1.5 ${compact ? "p-2.5" : "p-4 gap-2"}`}>
        <div className="min-w-0">
          <p className={`truncate font-semibold text-[#171717] ${compact ? "text-sm" : "text-base"}`}>{item.title}</p>
          <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{item.brand}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}`}>
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {item.matchPercent}% match
          </span>
          <span className="inline-flex items-center rounded-full border border-[#E7E3E3] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#171717]">
            Grade {item.conditionGrade}
          </span>
          {item.verified && (
            <span className={`inline-flex items-center gap-1 rounded-full border border-[#F3D6DA] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] ${ACCENT_TEXT}`}>
              <BadgeCheck className="h-3 w-3" aria-hidden="true" />
              Verified seller
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
              className={`inline-flex min-h-8 items-center gap-1 text-xs font-semibold ${ACCENT_TEXT} ${FOCUS_RING} rounded-sm`}
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

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className={`text-sm font-normal ${MUTED_TEXT} line-through`}>{formatUsd(item.priceBefore)}</span>
          <span className={`font-extrabold tabular-nums leading-none text-[#171717] ${compact ? "text-xl" : "text-2xl"}`}>
            {formatUsd(item.priceAfter)}
          </span>
          <span className={`text-xs font-semibold ${ACCENT_TEXT}`}>-{discount}%</span>
        </div>

        {!compact && (
          <div className="flex items-center gap-1.5 border-t border-[#E7E3E3] pt-2">
            <MapPin className="h-3 w-3 shrink-0 text-zinc-500" aria-hidden="true" />
            <p className={`text-[11px] font-normal tracking-[0.02em] ${MUTED_TEXT}`}>
              Accepted at <span className="font-semibold text-[#171717]">{accepting}</span> of{" "}
              {coverage.totalCount} verified {pluralPoints(coverage.totalCount)} near {coverage.point.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
