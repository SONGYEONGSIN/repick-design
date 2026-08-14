import { Sparkles, Award, BadgeCheck } from "lucide-react";
import CategoryArt from "./CategoryArt";
import { cx, formatUSD, NUM, type Product } from "./data";

/**
 * One rail card. All four proof facts (AI reasoning tag, condition grade,
 * seller verification, before/after discount) render as a badge row directly
 * beneath the art frame — never overlaid on top of it, per this candidate's
 * stricter-than-baseline rule (see CategoryArt.tsx and the writeup for why
 * that rule holds even though there's no photo here to fail loading).
 */
export default function ProductCard({ product: p }: { product: Product }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <span className="block aspect-[4/3] w-full shrink-0 overflow-hidden bg-zinc-100">
        <CategoryArt
          category={p.category}
          variant={p.variant}
          visualLabel={p.visualLabel}
          className="h-full w-full"
        />
      </span>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-100 px-4 pb-3 pt-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EDFC] px-2.5 py-1 text-[0.68rem] font-semibold text-[#5A3FC0]">
          <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
          {p.reasonTag}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-[0.68rem] font-semibold text-[#0B0B0F]">
          <Award className="h-3 w-3 shrink-0" aria-hidden />
          Grade {p.grade}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-[0.68rem] font-semibold text-[#0B0B0F]">
          <BadgeCheck className="h-3 w-3 shrink-0 text-[#5A3FC0]" aria-hidden />
          Verified seller
        </span>
        <span
          className={cx(
            "inline-flex items-center gap-1 rounded-full bg-[#6E56CF] px-2.5 py-1 text-[0.68rem] font-semibold text-white",
            NUM,
          )}
        >
          -{p.discount}%
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-zinc-600">
          {p.brand} · {p.categoryLabel}
        </p>
        <p className="text-[0.95rem] font-semibold leading-snug text-[#0B0B0F]">
          {p.title}
        </p>
        <p className="text-[0.75rem] font-normal leading-snug text-zinc-600">
          {p.conditionLabel} · Verified by {p.seller} · {p.sellerMeta}
        </p>

        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className={cx("text-lg font-extrabold text-[#0B0B0F]", NUM)}>
            {formatUSD(p.price)}
          </span>
          <span
            className={cx(
              "text-[0.75rem] font-normal text-zinc-600 line-through",
              NUM,
            )}
          >
            {formatUSD(p.original)}
          </span>
        </div>
      </div>
    </div>
  );
}
