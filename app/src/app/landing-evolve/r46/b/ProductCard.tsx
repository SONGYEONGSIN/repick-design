import { ShieldCheck, ShieldQuestion, Target } from "lucide-react";
import { ItemArt } from "./ItemArt";
import { discountPercent, type Product } from "./data";

/**
 * A single sample listing card. The photo area stays clean — all four badges (match, condition
 * grade, verification, discount) live in the row below the image, never overlaid on it, so the
 * art is never obscured and every badge gets room for a visible text label next to its icon.
 */
export function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product);

  return (
    <li className="min-w-0 list-none">
      <div className="min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <div className="relative aspect-square w-full bg-zinc-200">
          <ItemArt category={product.category} />
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-3 py-2.5">
          <p className="truncate text-[13px] font-semibold text-zinc-900">{product.name}</p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0f766e] px-2 py-0.5 text-[11px] font-semibold text-white">
              <Target className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
              <span className="tabular-nums">{product.matchPercent}%</span> match
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
              Grade {product.grade}
            </span>

            {product.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-700">
                <ShieldCheck className="h-3 w-3 text-[#0f766e]" aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-zinc-300 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                <ShieldQuestion className="h-3 w-3" aria-hidden="true" />
                Unverified
              </span>
            )}
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-[13px] text-zinc-500 line-through tabular-nums">
              ${product.originalPrice}
            </span>
            <span className="text-[15px] font-semibold text-zinc-900 tabular-nums">
              ${product.resalePrice}
            </span>
            <span className="text-[11px] font-semibold text-[#0f766e] tabular-nums">
              −{discount}%
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
