import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";
import { discountPct, formatUsd, type ProductListing } from "./data";
import { ACCENT_BORDER, ACCENT_TINT_TEXT, CARD_BORDER, INK_CLASS, MUTED_TEXT } from "./tokens";

/**
 * A deliberately COMPACT proof card for the hero slot — same four badge types as the richer
 * `ProductCard` below the fold (match% / grade / verified / discount), but a small square thumb
 * instead of a full aspect-[4/3] photo. The fold-proof rule cares about badge completeness, not
 * photo size, and this repo's history shows the failure mode is a Hero stack tall enough to push
 * these cards past 1280-1920px viewport heights — so this card's own height is a design
 * constraint, not an afterthought. Image container still reserves a fixed size + background
 * color before load, and badges stay in their own row, never overlaid on the thumb.
 */
export function HeroProofCard({ product }: { product: ProductListing }) {
  const off = discountPct(product);

  return (
    <div className={`flex min-w-0 gap-3 rounded-xl border ${CARD_BORDER} bg-white/[0.02] p-3`}>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/5">
        <Image
          src={`https://images.unsplash.com/photo-${product.photoId}?q=80&w=160&auto=format&fit=crop`}
          alt={product.alt}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold ${INK_CLASS}`}>{product.title}</p>
        <p className={`truncate text-[11px] font-normal ${MUTED_TEXT}`}>{formatUsd(product.priceNow)} · {product.sellerLabel}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          <span className={`inline-flex items-center gap-0.5 rounded-full border ${ACCENT_BORDER} bg-blue-600/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${ACCENT_TINT_TEXT}`}>
            <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
            {product.matchPercent}%
          </span>
          <span className={`inline-flex items-center rounded-full border ${CARD_BORDER} px-1.5 py-0.5 text-[10px] font-semibold ${INK_CLASS}`}>
            Grade {product.grade}
          </span>
          <span className={`inline-flex items-center gap-0.5 rounded-full border ${CARD_BORDER} px-1.5 py-0.5 text-[10px] font-semibold ${INK_CLASS}`}>
            <ShieldCheck className="h-2.5 w-2.5" aria-hidden="true" />
            Verified
          </span>
          <span className={`inline-flex items-center rounded-full border ${CARD_BORDER} px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${INK_CLASS}`}>
            −{off}%
          </span>
        </div>
      </div>
    </div>
  );
}
