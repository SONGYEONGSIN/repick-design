"use client";

import Image from "next/image";
import { BadgeCheck, Clock, Sparkles } from "lucide-react";
import type { Product } from "./data";

interface ProductCardProps {
  product: Product;
  variant?: "compact" | "full";
}

export default function ProductCard({ product, variant = "full" }: ProductCardProps) {
  const isCompact = variant === "compact";
  const discountPct = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <div className={["relative w-full bg-zinc-800", isCompact ? "aspect-[16/9]" : "aspect-[4/3]"].join(" ")}>
        <Image
          src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={product.alt}
          fill
          sizes={isCompact ? "(min-width: 1024px) 360px, 92vw" : "(min-width: 1024px) 320px, 92vw"}
          className="object-cover"
        />
      </div>

      {/* Proof row lives below the photo, never overlaid on top of it. */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-800/80 px-4 pt-3 pb-2.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/40 bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-300">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          <span className="tabular-nums">{product.match}%</span> match
        </span>
        <span className="inline-flex items-center rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
          {product.condition} condition
        </span>
        {product.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
            <BadgeCheck className="h-3 w-3 text-teal-400" aria-hidden="true" />
            Verified seller
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] font-semibold text-zinc-400">
            <Clock className="h-3 w-3" aria-hidden="true" />
            Verification pending
          </span>
        )}
      </div>

      <div className="px-4 pt-3 pb-4">
        <p className="truncate text-sm font-semibold text-zinc-100">{product.name}</p>
        <p className="mt-1 text-xs font-normal text-zinc-400">{product.category}</p>

        {!isCompact && (
          <ul className="mt-3 flex flex-col gap-1">
            {product.tags.map((tag) => (
              <li key={tag} className="text-xs font-normal leading-[1.5] text-zinc-400">
                &middot; {tag}
              </li>
            ))}
          </ul>
        )}
        {isCompact && (
          <p className="mt-3 text-xs font-normal leading-[1.5] text-zinc-400">&middot; {product.tags[0]}</p>
        )}

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold tabular-nums tracking-[-0.02em] text-teal-400">
            ${product.price}
          </span>
          <span className="text-xs font-normal tabular-nums text-zinc-400 line-through">
            ${product.originalPrice}
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-zinc-400">
            &minus;{discountPct}%
          </span>
        </div>
      </div>
    </article>
  );
}
