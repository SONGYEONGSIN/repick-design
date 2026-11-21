"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  BadgeCheck,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AXIS_LABEL } from "./data";
import type { RankedListing } from "./ui";
import { useMounted } from "./ui";
import { ACCENT, ACCENT_FILL } from "./tokens";

function RankDeltaBadge({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span
        className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums"
        style={{ color: ACCENT }}
      >
        <ArrowUp className="h-3.5 w-3.5 flex-none" aria-hidden="true" strokeWidth={2.5} />
        {delta}
        <span className="sr-only">ranks up since you last moved a dial</span>
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-zinc-300">
        <ArrowDown className="h-3.5 w-3.5 flex-none" aria-hidden="true" strokeWidth={2.5} />
        {Math.abs(delta)}
        <span className="sr-only">ranks down since you last moved a dial</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums text-zinc-400">
      <Minus className="h-3.5 w-3.5 flex-none" aria-hidden="true" strokeWidth={2.5} />
      <span aria-hidden="true">–</span>
      <span className="sr-only">No change in rank</span>
    </span>
  );
}

function RankBadge({ rank, delta }: { rank: number; delta: number }) {
  return (
    <div className="flex w-12 flex-none flex-col items-center gap-1 sm:w-14">
      <span
        className="text-2xl font-extrabold leading-none tabular-nums text-zinc-50"
        style={{ fontFamily: "var(--font-display-mono)" }}
      >
        {rank}
      </span>
      <RankDeltaBadge delta={delta} />
    </div>
  );
}

function MatchPill({ match }: { match: number }) {
  return (
    <span
      className="inline-flex flex-none items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: ACCENT_FILL }}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
      {match}% weighted match
    </span>
  );
}

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className="inline-flex flex-none items-center gap-1 rounded-full border border-[#242430] px-2.5 py-1 text-xs font-semibold text-zinc-300">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
      {grade}
    </span>
  );
}

function TrustBadge({ tier }: { tier: string }) {
  if (tier === "New seller") {
    return (
      <span className="inline-flex flex-none items-center rounded-full border border-[#242430] px-2.5 py-1 text-xs font-semibold text-zinc-400">
        New seller
      </span>
    );
  }
  return (
    <span className="inline-flex flex-none items-center gap-1 rounded-full border border-[#242430] px-2.5 py-1 text-xs font-semibold text-zinc-300">
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
      {tier} seller
    </span>
  );
}

function reasonLine(item: RankedListing): string {
  const primaryLabel = AXIS_LABEL[item.primaryFactor];
  const primaryValue = item.factors[item.primaryFactor];
  return `${primaryLabel} is doing the most work here, ${primaryValue} of 100, alongside a ${item.baseMatch}% profile match.`;
}

function FactorBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
        <span className="truncate">{label}</span>
        <span className="flex-none tabular-nums text-zinc-300">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1C1C22]">
        <div
          className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500"
          style={{ width: `${value}%`, backgroundColor: ACCENT }}
        />
      </div>
    </div>
  );
}

/** One row of the live leaderboard. `detailed` adds the per-factor
 *  breakdown bars; the compact form (used in the hero) still states the
 *  single factor doing the most work, so even the condensed view never
 *  shows a bare rank number with no reasoning attached. */
export function LeaderboardRow({ item, detailed = false }: { item: RankedListing; detailed?: boolean }) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const canAnimate = mounted && !reduceMotion;

  return (
    <motion.li
      layout={canAnimate}
      transition={{ duration: canAnimate ? 0.5 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="min-w-0 rounded-2xl border border-[#1C1C22] bg-[#121217] p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <RankBadge rank={item.rank} delta={item.delta} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              {item.category}
            </p>
          </div>
          <p className="mt-0.5 truncate text-base font-semibold tracking-[-0.01em] text-zinc-50">
            {item.name}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <GradeBadge grade={item.grade} />
            <TrustBadge tier={item.sellerTier} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">{reasonLine(item)}</p>
        </div>

        <div className="flex flex-none items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
          <MatchPill match={Math.round(item.score)} />
          <p className="flex items-baseline gap-2 tabular-nums">
            <span className="text-sm text-zinc-400 line-through">
              ${item.priceOriginal.toLocaleString("en-US")}
            </span>
            <span className="text-lg font-extrabold text-zinc-50">
              ${item.priceNow.toLocaleString("en-US")}
            </span>
          </p>
        </div>
      </div>

      {detailed && (
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#1C1C22] pt-4 sm:grid-cols-4">
          <FactorBar label="AI profile match" value={item.baseMatch} />
          <FactorBar label="Price fit" value={item.factors.price} />
          <FactorBar label="Ship speed" value={item.factors.speed} />
          <FactorBar label="Seller trust" value={item.factors.trust} />
        </div>
      )}
    </motion.li>
  );
}

/** Photo-forward card for the product-preview grid. Badges always sit in
 *  their own row below the photo, never overlaid on it, so a failed image
 *  load's alt text never collides with a badge. */
export function ListingCard({ item, preload = false }: { item: RankedListing; preload?: boolean }) {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();
  const canAnimate = mounted && !reduceMotion;
  const discount = Math.round((1 - item.priceNow / item.priceOriginal) * 100);

  return (
    <motion.li
      layout={canAnimate}
      transition={{ duration: canAnimate ? 0.5 : 0, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#1C1C22] bg-[#121217]"
    >
      <div className="flex items-center justify-between gap-2 px-4 pt-4">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          Rank {item.rank}
        </span>
        <RankDeltaBadge delta={item.delta} />
      </div>

      <div className="relative mt-3 aspect-[4/3] w-full flex-none overflow-hidden bg-[#1C1C22]">
        <Image
          src={`${item.image}?auto=format&fit=crop&w=800&q=70`}
          alt={`${item.name}, ${item.grade.toLowerCase()} condition, listed on Caliper`}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
          preload={preload}
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {item.category}
        </p>
        <p className="mt-1 text-lg font-semibold tracking-[-0.01em] text-zinc-50">{item.name}</p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-sm tabular-nums text-zinc-400 line-through">
            ${item.priceOriginal.toLocaleString("en-US")}
          </span>
          <span className="text-xl font-extrabold tabular-nums text-zinc-50">
            ${item.priceNow.toLocaleString("en-US")}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-[#242430] px-2 py-0.5 text-xs font-semibold"
            style={{ color: ACCENT }}
          >
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}% off
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <MatchPill match={Math.round(item.score)} />
          <GradeBadge grade={item.grade} />
          <TrustBadge tier={item.sellerTier} />
        </div>

        <p className="mt-4 text-xs leading-relaxed text-zinc-400">{reasonLine(item)}</p>
      </div>
    </motion.li>
  );
}
