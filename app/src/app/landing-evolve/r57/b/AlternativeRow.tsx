"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ShieldCheck, BadgeCheck, TrendingDown } from "lucide-react";
import {
  discountPercent,
  gradeLabel,
  type Listing,
} from "./lib";
import { ACCENT_TINT } from "./ui";

/**
 * A compact alternative-listing row for the proof wall's narrower column.
 * Badges sit beside the thumbnail, never as an overlay on top of it, and
 * the thumbnail reserves its aspect-ratio + background color before the
 * photo loads.
 */
export default function AlternativeRow({ listing, rank }: { listing: Listing; rank: number }) {
  const discount = discountPercent(listing);
  const grade = gradeLabel(listing.conditionScore);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex min-w-0 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800 sm:h-20 sm:w-20">
        <Image
          src={`https://images.unsplash.com/${listing.photoId}?w=240&q=80`}
          alt={`${listing.title}, condition grade ${grade}`}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-semibold text-white">{listing.title}</p>
          <span className="shrink-0 text-xs font-semibold text-zinc-400 tabular-nums">
            #{rank}
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline gap-2 tabular-nums">
          <span className="text-sm font-extrabold text-white">${listing.price}</span>
          <span className="text-[11px] text-zinc-400 line-through">${listing.originalPrice}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <span
            className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
            style={{ backgroundColor: "rgba(47,111,237,0.1)", color: ACCENT_TINT }}
          >
            <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
            {listing.matchPercent}%
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-200">
            <ShieldCheck className="h-2.5 w-2.5" aria-hidden="true" />
            {grade}
          </span>
          {listing.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-200">
              <BadgeCheck className="h-2.5 w-2.5" aria-hidden="true" />
              Verified
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">
            <TrendingDown className="h-2.5 w-2.5" aria-hidden="true" />
            -{discount}%
          </span>
        </div>
      </div>
    </motion.li>
  );
}
