"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck, Users, TrendingDown } from "lucide-react";
import type { Listing } from "./zones";
import { discountPercent } from "./zones";

export default function ProductCard({ listing }: { listing: Listing }) {
  const discount = discountPercent(listing);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex w-[72%] min-w-[220px] flex-shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 snap-start sm:w-auto sm:min-w-0 sm:flex-shrink"
    >
      <div className="relative aspect-[4/3] w-full bg-zinc-800">
        <Image
          src={`https://images.unsplash.com/${listing.photoId}?w=800&q=80`}
          alt={`${listing.title}, condition grade ${listing.grade}`}
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 240px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <p className="text-sm font-semibold leading-snug text-white">{listing.title}</p>
          <p className="text-xs text-zinc-400">{listing.size}</p>
        </div>

        <div className="flex items-baseline gap-2 tabular-nums">
          <span className="text-base font-extrabold text-white">${listing.price}</span>
          <span className="text-xs text-zinc-400 line-through">${listing.originalPrice}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold text-indigo-300 tabular-nums">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {listing.matchPercent}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-200">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            {listing.grade}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-200">
            <Users className="h-3 w-3" aria-hidden="true" />
            {listing.sellerLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-600 bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-white tabular-nums">
            <TrendingDown className="h-3 w-3" aria-hidden="true" />
            -{discount}%
          </span>
        </div>

        <p className="text-[11px] leading-snug text-zinc-400">{listing.matchReason}</p>
      </div>
    </motion.li>
  );
}
