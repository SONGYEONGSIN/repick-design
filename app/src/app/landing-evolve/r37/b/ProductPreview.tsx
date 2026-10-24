import { BadgeCheck, Clock } from "lucide-react";
import ProductArt from "./ProductArt";
import { GRADE_LABEL, PRODUCTS } from "./data";
import { discountPercent, formatUsd } from "./score-math";

/**
 * The 3-4 product-preview cards, rendered directly inside Hero.tsx (not a
 * separate section below it). Each image is a fixed-aspect-ratio container
 * with a reserved background color holding a hand-built SVG illustration —
 * never a raster photo. Badges (match reason, condition grade, seller
 * verification, discount) sit in a row BELOW the art, never as an
 * absolutely-positioned overlay on top of it.
 */
export default function ProductPreview() {
  return (
    <div className="mt-14 lg:mt-16">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">
        Four live listings, walked through the same pipeline
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => {
          const discount = discountPercent(p);
          return (
            <div
              key={p.id}
              className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="aspect-[4/5] w-full shrink-0 bg-slate-100">
                <ProductArt kind={p.artKind} />
              </div>

              <div className="flex flex-1 flex-col gap-2.5 p-4">
                <p className="text-sm font-semibold text-zinc-950">{p.title}</p>

                <p className="flex flex-wrap items-baseline gap-2">
                  <span className="text-base font-extrabold tabular-nums text-zinc-950">
                    {formatUsd(p.price)}
                  </span>
                  <span className="text-sm font-normal tabular-nums text-zinc-500 line-through">
                    {formatUsd(p.originalPrice)}
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-blue-800">&minus;{discount}%</span>
                </p>

                <p className="text-xs font-normal leading-[1.5] text-zinc-600">{p.matchReason}</p>

                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-zinc-700">
                    {p.grade}/100 &middot; {GRADE_LABEL(p.grade)}
                  </span>
                  {p.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-600">
                      <BadgeCheck className="h-3 w-3 text-blue-800" aria-hidden="true" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-500">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
