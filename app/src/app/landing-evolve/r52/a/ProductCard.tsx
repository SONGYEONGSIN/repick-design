"use client";

import { BadgeCheck, ShieldCheck, TrendingDown, Sparkles } from "lucide-react";
import type { Listing } from "./data";
import type { ItemState } from "./model";
import { formatUsd } from "./model";
import { ProductArt } from "./ProductArt";
import { ACCENT_HEX, SURFACE_BORDER, FIG_CAPTION } from "./tokens";

type ProductCardProps = {
  item: Listing;
  state: ItemState;
  compact?: boolean;
};

/**
 * Rich preview card. Badges (match %, grade, verification, discount) live in their own row BELOW
 * the art panel -- never absolute-positioned on top of it -- so a failed/slow image load (or here,
 * a slow-mounting SVG) never collides with badge text. All four badge values are read straight off
 * the live `state`/`item` passed in; nothing here is a separately hardcoded literal.
 */
export function ProductCard({ item, state, compact }: ProductCardProps) {
  return (
    <div
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl"
      style={{ backgroundColor: "#13131A", border: `1px solid ${SURFACE_BORDER}` }}
    >
      <ProductArt category={item.category} />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className={`${FIG_CAPTION} text-[#A1A1AA]`}>{item.brand}</p>
          {/* Not a heading tag: these titles repeat across cards and aren't part of the page's
              document outline, so making them real <h*> elements would create unpredictable
              heading-level jumps depending on where a card happens to sit. */}
          <p className="font-sans text-[16px] font-extrabold leading-snug text-white">
            {item.title}
          </p>
          <p className={`${FIG_CAPTION} text-[#A1A1AA]`}>{item.specLabel}</p>
        </div>

        {!compact && (
          <p className="flex items-center gap-1.5 text-[12px] font-normal text-[#A1A1AA]">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_HEX }} />
            {item.matchTag}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-3" style={{ borderColor: SURFACE_BORDER }}>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold tabular-nums"
            style={{ backgroundColor: "#211A0C", color: ACCENT_HEX }}
          >
            <Sparkles aria-hidden="true" className="h-3 w-3" />
            {state.matchPct}% match
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D4D4D8]">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-[#A1A1AA]" />
            {item.grade}
          </span>

          {item.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D4D4D8]">
              <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 text-[#A1A1AA]" />
              Verified seller
            </span>
          )}

          <span className="ml-auto inline-flex items-center gap-2">
            <span className="text-[11px] font-normal text-[#A1A1AA] line-through tabular-nums">
              {formatUsd(item.retailPrice)}
            </span>
            <span className="text-[14px] font-semibold text-white tabular-nums">
              {formatUsd(state.price)}
            </span>
          </span>
        </div>

        <p className="flex items-center gap-1 text-[11px] font-semibold tabular-nums" style={{ color: ACCENT_HEX }}>
          <TrendingDown aria-hidden="true" className="h-3.5 w-3.5" />
          {state.discountPct}% off retail
        </p>
      </div>
    </div>
  );
}
