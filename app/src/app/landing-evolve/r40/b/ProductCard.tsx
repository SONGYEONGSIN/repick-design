"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { formatPrice, type Item } from "./data";

/**
 * A single listing card. Match %, condition grade, verification and discount all live in a
 * row BELOW the photo — never as an overlay on top of it — so a broken-image alt fallback can
 * never sit over and block them. Purely presentational (no focusable wrapper); the only
 * interactive controls on this page are the sweep handles themselves.
 */
export default function ProductCard({ item }: { item: Item }) {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition-colors duration-200 hover:border-emerald-500/40">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-800">
        <Image
          src={`https://images.unsplash.com/photo-${item.photoId}?q=80&w=480&auto=format&fit=crop`}
          alt={`${item.name}, a secondhand ${item.category.toLowerCase()} listing on repick`}
          fill
          sizes="(min-width: 1024px) 220px, 45vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="truncate text-sm font-semibold text-white">{item.name}</p>
        <p className="text-xs font-normal text-zinc-400">{item.category}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-emerald-400">
          {item.matchPct}% match
        </span>
        <span className="inline-flex items-center rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
          {item.grade}
        </span>
        {item.verified && (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
            <BadgeCheck className="h-3 w-3 text-emerald-400" aria-hidden="true" />
            Verified
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-sm font-semibold tabular-nums text-white">{formatPrice(item.price)}</span>
        <span className="text-xs font-normal tabular-nums text-zinc-400 line-through">
          {formatPrice(item.originalPrice)}
        </span>
        <span className="rounded-md bg-emerald-500 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-[#0B0B0F]">
          -{item.discountPct}%
        </span>
      </div>
    </div>
  );
}
