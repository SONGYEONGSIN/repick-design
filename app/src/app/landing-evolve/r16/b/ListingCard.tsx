"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Award, ShieldCheck, ShieldOff, Tag } from "lucide-react";
import { formatPrice, type Listing } from "./data";

type ListingCardProps = {
  listing: Listing;
};

export default function ListingCard({ listing }: ListingCardProps) {
  const reduce = useReducedMotion();
  const {
    title,
    category,
    imageId,
    distanceKm,
    matchPct,
    grade,
    verified,
    price,
    originalPrice,
    discountPct,
  } = listing;

  return (
    <motion.li
      layout
      transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
      className="flex min-w-0 flex-col rounded-lg border border-zinc-800 bg-zinc-950/40 p-2.5 transition-colors hover:border-zinc-600"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-zinc-800">
        <Image
          src={`https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=480&q=60`}
          alt={`${title}, ${category.toLowerCase()} listing`}
          fill
          sizes="(min-width: 1024px) 220px, 45vw"
          className="object-cover"
        />
      </div>

      <p className="mt-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">
        {category} &middot; <span className="tabular-nums">{distanceKm}</span> km
      </p>
      <h3 className="mt-0.5 text-[14px] font-medium leading-snug text-white">{title}</h3>
      <p className="mt-1 tabular-nums text-[14px]">
        <span className="font-bold text-white">{formatPrice(price)}</span>{" "}
        <span className="text-zinc-400 line-through">{formatPrice(originalPrice)}</span>
      </p>

      <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label={`Proof details for ${title}`}>
        <li className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] tabular-nums text-zinc-200">
          <Target aria-hidden="true" className="h-3 w-3 text-lime-400" />
          {matchPct}% match
        </li>
        <li className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-200">
          <Award aria-hidden="true" className="h-3 w-3 text-zinc-300" />
          Grade {grade}
        </li>
        <li className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-200">
          {verified ? (
            <ShieldCheck aria-hidden="true" className="h-3 w-3 text-lime-400" />
          ) : (
            <ShieldOff aria-hidden="true" className="h-3 w-3 text-zinc-400" />
          )}
          {verified ? "Verified" : "Unverified"}
        </li>
        <li className="inline-flex items-center gap-1 rounded-full bg-lime-400 px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#0B0B0F]">
          <Tag aria-hidden="true" className="h-3 w-3" />
          -{discountPct}%
        </li>
      </ul>
    </motion.li>
  );
}
