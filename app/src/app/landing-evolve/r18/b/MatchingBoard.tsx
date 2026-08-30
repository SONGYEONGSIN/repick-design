"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Tag, ShieldCheck, MapPin, Link2 } from "lucide-react";
import { type MatchPair, discountPct } from "./data";
import { COLOR } from "./theme";
import { ConditionChip, VerifiedChip, DiscountChip } from "./ui";

function BuyerCard({ match }: { match: MatchPair }) {
  return (
    <article
      className="rounded-md border p-4"
      style={{ borderColor: COLOR.border, background: COLOR.bgCard }}
    >
      <p
        className="text-[11px] font-semibold uppercase"
        style={{ color: COLOR.muted, letterSpacing: "0.16em" }}
      >
        Buyer request
      </p>
      <h3 className="mt-2 text-[15px] font-semibold leading-snug" style={{ color: COLOR.fg }}>
        {match.buyer.title}
      </h3>
      <ul className="mt-3 space-y-1.5 text-[13px] font-normal" style={{ color: COLOR.muted }}>
        <li className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{match.buyer.budget}</span>
        </li>
        <li className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{match.buyer.conditionAsk}</span>
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{match.buyer.location}</span>
        </li>
      </ul>
      <p className="mt-3 text-[11px] font-normal" style={{ color: COLOR.mutedDim }}>
        {match.buyer.posted}
      </p>
    </article>
  );
}

function ListingCard({ match }: { match: MatchPair }) {
  const pct = discountPct(match.listing.price, match.listing.priceBefore);
  return (
    <article
      className="rounded-md border p-4"
      style={{ borderColor: COLOR.accentBorder, background: COLOR.bgCard }}
    >
      <p
        className="text-[11px] font-semibold uppercase"
        style={{ color: COLOR.accentBright, letterSpacing: "0.16em" }}
      >
        Matched listing
      </p>
      <h3 className="mt-2 text-[15px] font-semibold leading-snug" style={{ color: COLOR.fg }}>
        {match.listing.title}
      </h3>
      <p className="mt-3 flex items-baseline gap-2" style={{ fontFamily: "var(--font-display-mono)" }}>
        <span className="text-xl font-extrabold" style={{ color: COLOR.fg }}>
          ${match.listing.price}
        </span>
        <span className="text-[13px] font-normal line-through" style={{ color: COLOR.mutedDim }}>
          ${match.listing.priceBefore}
        </span>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ConditionChip grade={match.listing.conditionGrade} />
        <VerifiedChip label={match.listing.verification} />
        <DiscountChip pct={pct} />
      </div>
      <p className="mt-3 text-[12px] font-normal" style={{ color: COLOR.muted }}>
        {match.rationale[0]}
      </p>
    </article>
  );
}

function Connector({ match, index }: { match: MatchPair; index: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex items-center justify-center gap-2 py-1 md:flex-col md:py-0">
      <div className="hidden w-full md:block" aria-hidden="true">
        <svg viewBox="0 0 88 24" className="h-6 w-full" preserveAspectRatio="none">
          <motion.path
            d="M0 12 C 28 12, 60 12, 88 12"
            stroke={COLOR.accent}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            initial={reduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              delay: reduceMotion ? 0 : index * 0.12,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>
      <span
        className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-1 text-[11px] font-semibold"
        style={{ borderColor: COLOR.borderStrong, color: COLOR.accentBright, background: COLOR.accentSoftBg }}
      >
        <Link2 className="h-3 w-3" aria-hidden="true" />
        {match.priceFit}% fit
      </span>
    </div>
  );
}

export default function MatchingBoard({
  matches,
  categoryLabel,
}: {
  matches: MatchPair[];
  categoryLabel: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold" style={{ color: COLOR.fg }}>
        Live matches — <span style={{ color: COLOR.accentBright }}>{categoryLabel}</span>
      </h2>
      <p className="mt-1 text-[13px] font-normal" style={{ color: COLOR.mutedDim }}>
        Threaded pairs recompute the moment the filter above changes.
      </p>

      <div className="mt-4 flex flex-col gap-3 md:gap-4" role="list" aria-label={`Matched pairs for ${categoryLabel}`}>
        {matches.map((match, i) => (
          <div
            key={match.id}
            role="listitem"
            className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_88px_1fr] md:items-stretch md:gap-0"
          >
            <BuyerCard match={match} />
            <Connector match={match} index={i} />
            <ListingCard match={match} />
          </div>
        ))}
      </div>
    </div>
  );
}
