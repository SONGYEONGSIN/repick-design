"use client";

import Image from "next/image";
import { Percent, ShieldCheck, Sparkles } from "lucide-react";
import { COLOR, type FeaturedProduct, type SimilarProduct } from "./data";
import { BASE_PRICE, RETAIL_PRICE, type WaterfallResult } from "./savings-math";

interface LiveProductCardProps {
  product: FeaturedProduct;
  waterfall: WaterfallResult;
  /** "hero" renders larger, with the photo; "compact" drops the photo for tight spaces. */
  variant?: "hero" | "compact";
}

/**
 * The hero-embedded proof card. Its price, discount pill, and "updates live" state all read
 * straight off the current toggle state via `waterfall` — nothing here is a static number. The
 * same component is reused in the device section so the featured listing reads identically
 * wherever it appears on the page.
 */
export function LiveProductCard({ product, waterfall, variant = "hero" }: LiveProductCardProps) {
  const Icon = product.icon;
  const { finalPrice, retailDiscountPct, enabledCount } = waterfall;

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      {variant === "hero" && (
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
          style={{ backgroundColor: COLOR.bgAlt }}
        >
          <Image
            src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=480&q=70`}
            alt={`${product.name}, a ${product.categoryLabel.toLowerCase()} listing on repick`}
            fill
            sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 85vw"
            className="object-cover"
          />
        </div>
      )}

      <div className={variant === "hero" ? "mt-4 flex items-start justify-between gap-3" : "flex items-start justify-between gap-3"}>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-zinc-900">{product.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: COLOR.muted }}>
            <Icon className="h-3 w-3" aria-hidden="true" />
            {product.categoryLabel}
          </p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: COLOR.accentSoft, color: COLOR.accentDark }}
        >
          <span className="tabular-nums">{product.matchPct}%</span> AI match
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-zinc-700">
        <span>Grade {product.conditionGrade}</span>
        {product.sellerVerified && (
          <span className="inline-flex items-center gap-1" style={{ color: COLOR.accentDark }}>
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified seller
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
        <p className="text-sm" style={{ color: COLOR.muted }}>
          <span className="tabular-nums line-through">{`$${RETAIL_PRICE}`}</span>{" "}
          <span className="tabular-nums text-base font-semibold text-zinc-900">
            {`$${finalPrice}`}
          </span>
        </p>
        <span
          className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums text-white"
          style={{ backgroundColor: COLOR.accentDark }}
        >
          <Percent className="h-3 w-3" aria-hidden="true" />
          {retailDiscountPct}
        </span>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs" style={{ color: COLOR.muted }}>
        <Sparkles className="h-3.5 w-3.5 motion-safe:animate-pulse motion-reduce:animate-none" style={{ color: COLOR.accent }} aria-hidden="true" />
        {enabledCount > 0
          ? `Price updates live — ${enabledCount} condition${enabledCount === 1 ? "" : "s"} applied`
          : `Base listing price of $${BASE_PRICE} — switch on conditions below`}
      </p>
    </div>
  );
}

interface SimilarCardProps {
  product: SimilarProduct;
}

export function SimilarCard({ product }: SimilarCardProps) {
  const Icon = product.icon;
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-4">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
        style={{ backgroundColor: COLOR.bgAlt }}
      >
        <Image
          src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=400&q=70`}
          alt={`${product.name}, a ${product.categoryLabel.toLowerCase()} listing on repick`}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 85vw"
          className="object-cover"
        />
      </div>

      <h4 className="mt-3 truncate text-sm font-semibold text-zinc-900">{product.name}</h4>
      <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: COLOR.muted }}>
        <Icon className="h-3 w-3" aria-hidden="true" />
        {product.categoryLabel}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-zinc-700">
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: COLOR.accentSoft, color: COLOR.accentDark }}>
          <span className="tabular-nums">{product.matchPct}%</span> match
        </span>
        <span>Grade {product.conditionGrade}</span>
        {product.sellerVerified && (
          <span className="inline-flex items-center gap-1" style={{ color: COLOR.accentDark }}>
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-100 pt-3">
        <p className="text-sm" style={{ color: COLOR.muted }}>
          <span className="tabular-nums line-through">{`$${product.priceBefore}`}</span>{" "}
          <span className="tabular-nums font-semibold text-zinc-900">{`$${product.priceAfter}`}</span>
        </p>
        <span
          className="inline-flex items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums text-white"
          style={{ backgroundColor: COLOR.accentDark }}
        >
          <Percent className="h-3 w-3" aria-hidden="true" />
          {product.discountPct}
        </span>
      </div>
    </article>
  );
}
