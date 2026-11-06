"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { formatPrice, type PoolItem } from "./data";

/**
 * Proof card. Match %, grade, verified and discount all live in a row BELOW
 * the photo — never as an overlay on top of it — so a broken-image alt
 * fallback can never sit over and block them. Purely presentational.
 */
export default function ProductCard({ item }: { item: PoolItem }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={`https://images.unsplash.com/photo-${item.photoId}?q=80&w=480&auto=format&fit=crop`}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 260px, 45vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-zinc-950">{item.name}</p>
        <p className="text-xs font-normal text-zinc-600">{item.category}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-full border border-orange-700/30 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-orange-700">
          {item.matchBase}% match
        </span>
        <span className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
          {item.grade}
        </span>
        {item.verified && (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
            <BadgeCheck className="h-3 w-3 text-orange-700" aria-hidden="true" />
            Verified
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-sm font-semibold tabular-nums text-zinc-950">{formatPrice(item.price)}</span>
        <span className="text-xs font-normal tabular-nums text-zinc-600 line-through">
          {formatPrice(item.originalPrice)}
        </span>
        <span className="rounded-md bg-orange-700 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white">
          -{item.discountPct}%
        </span>
      </div>
    </div>
  );
}
