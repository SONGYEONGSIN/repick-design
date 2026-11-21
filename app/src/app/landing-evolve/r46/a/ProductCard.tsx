"use client";

import { useState } from "react";
import { Bookmark, Check, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { discountPct, formatUsd, CONDITIONS, type Product } from "./data";
import { ProductThumb } from "./ProductThumb";
import { ACCENT_FILL, ACCENT_TINT_TEXT, FOCUS_RING, MUTED_TEXT, ON_ACCENT_TEXT } from "./tokens";

interface ProductCardProps {
  product: Product;
  credit: number;
}

/**
 * Four distinct badge types, all below the image (never overlaid on it) so a failed-image
 * alt text never collides with badge text: match/relevance, condition grade, seller
 * verification, and a before/after discount indicator. A fifth, live strip ties the card to
 * the shared credit state — "within your credit" vs. "needs $N more" — so cards re-filter by
 * the same dimension the calculator computes, not just an abstract number elsewhere.
 */
export function ProductCard({ product, credit }: ProductCardProps) {
  const [saved, setSaved] = useState(false);
  const grade = CONDITIONS.find((c) => c.id === product.grade) ?? CONDITIONS[0];
  const off = discountPct(product);
  const unlocked = product.price <= credit;
  const gap = product.price - credit;

  return (
    <div
      className={`group relative flex min-w-0 flex-col gap-3 rounded-2xl border p-4 transition-colors duration-200 ${
        unlocked ? "border-sky-500/40 bg-[#12161A]" : "border-white/10 bg-[#15151C]"
      }`}
    >
      <div className="relative">
        <ProductThumb product={product} />
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-pressed={saved}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B0B0F]/70 text-white/80 backdrop-blur transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
        >
          <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} aria-hidden="true" />
          <span className="sr-only">{saved ? `Remove ${product.title} from saved items` : `Save ${product.title}`}</span>
        </button>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#F5F5F7]">{product.title}</p>
        <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{product.brand}</p>
      </div>

      {/* Badge row — four distinct signal types, text+icon paired so color is never the only cue. */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${ACCENT_TINT_TEXT}`}>
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {product.match}% match
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold text-[#F5F5F7]">
          Grade {grade.label}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold text-[#F5F5F7]">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified seller
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold text-[#F5F5F7] tabular-nums">
          <span className={`${MUTED_TEXT} line-through`}>{formatUsd(product.originalPrice)}</span>
          −{off}%
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-2 border-t border-white/10 pt-3">
        <p className="text-base font-semibold tabular-nums text-[#F5F5F7]">{formatUsd(product.price)}</p>
        {unlocked ? (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${ACCENT_FILL} ${ON_ACCENT_TEXT}`}>
            <Check className="h-3 w-3" aria-hidden="true" />
            Within your credit
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[11px] font-semibold ${MUTED_TEXT}`}>
            <Lock className="h-3 w-3" aria-hidden="true" />
            {formatUsd(gap)} more needed
          </span>
        )}
      </div>
    </div>
  );
}
