"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Percent, ShieldQuestion, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import { discountPercent, type Listing } from "./data";
import { CRITERION_MAP, type CriterionId, type RankedItem } from "./rank-model";
import { ACCENT_FILL, ACCENT_TEXT, ACCENT_TINT_BG, ACCENT_TINT_BORDER, BORDER, GHOST, INK, MEASURE_17, MUTED, SURFACE } from "./tokens";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

function ListingCard({ ranked, leadId }: { ranked: RankedItem<Listing>; leadId: CriterionId }) {
  const { item, score, place } = ranked;
  const discount = discountPercent(item);
  const reduce = useReducedMotion();
  const leadLabel = CRITERION_MAP[leadId].label;

  return (
    <motion.article
      layout
      transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group min-w-0 overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none"
      style={{ border: `1px solid ${place === 1 ? ACCENT_TINT_BORDER : BORDER}`, backgroundColor: "#FFFFFF" }}
    >
      {place === 1 ? (
        <div
          className="px-3 py-1.5 text-[10.5px] font-semibold uppercase"
          style={{ backgroundColor: ACCENT_TINT_BG, color: ACCENT_TEXT, letterSpacing: "0.08em" }}
        >
          Leading your current ranking
        </div>
      ) : null}

      {/* Fixed aspect-ratio + reserved background so a failed load never
          collapses layout; badges live in their own row below, never
          overlaid on the photo, so a broken-image alt fallback can never
          collide with one. */}
      <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: SURFACE }}>
        <Image
          src={`https://images.unsplash.com/photo-${item.photoId}?auto=format&fit=crop&w=720&q=80`}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 320px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 space-y-3 p-4">
        <div className="flex min-w-0 items-baseline justify-between gap-2">
          <p className="truncate text-[11px] font-normal" style={{ color: MUTED }}>
            {item.category}
          </p>
          <p className="tabular-nums shrink-0 text-[11px] font-semibold" style={{ color: MUTED }}>
            #{place} of 4
          </p>
        </div>

        <p className="truncate text-[17px] font-extrabold" style={{ color: INK }}>
          {item.title}
        </p>

        <p className="text-[15px]">
          <span className="font-extrabold" style={{ color: INK }}>
            {formatCurrency(item.priceAfter)}
          </span>{" "}
          <span className="font-normal line-through" style={{ color: MUTED }}>
            {formatCurrency(item.priceBefore)}
          </span>
        </p>

        {/* Badge row — a separate row, never positioned over the photo. */}
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
            style={{ backgroundColor: ACCENT_FILL }}
          >
            {score}% match
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-normal"
            style={{ color: INK, backgroundColor: "#F4F4F5" }}
          >
            Grade {item.conditionGrade}
          </span>
          {item.verified ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-normal"
              style={{ color: INK, backgroundColor: "#F4F4F5" }}
            >
              <BadgeCheck className="h-3 w-3" style={{ color: ACCENT_TEXT }} aria-hidden="true" />
              Verified seller
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-normal"
              style={{ color: MUTED, backgroundColor: "#F4F4F5" }}
            >
              <ShieldQuestion className="h-3 w-3" aria-hidden="true" />
              Verification pending
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-normal"
            style={{ color: INK, backgroundColor: "#F4F4F5" }}
          >
            <Percent className="h-3 w-3" aria-hidden="true" />
            {discount}% off
          </span>
        </div>

        {/* AI-match-reasoning tag — tied to whichever criterion is
            currently ranked #1, derived live from `leadId`, never a fixed
            string pinned to one criterion. */}
        <p
          className="flex items-start gap-1.5 rounded-lg p-2 text-[11.5px] font-normal leading-[1.5]"
          style={{ backgroundColor: ACCENT_TINT_BG, color: INK }}
        >
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_TEXT }} aria-hidden="true" />
          <span>
            <span className="font-semibold">{leadLabel}:</span> {item.reasoningByLead[leadId]}
          </span>
        </p>
      </div>
    </motion.article>
  );
}

export default function ListingGrid({ ranked, leadId }: { ranked: RankedItem<Listing>[]; leadId: CriterionId }) {
  return (
    <section id="listings" className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex items-end gap-4">
          <span
            aria-hidden="true"
            className="pointer-events-none select-none shrink-0 font-semibold"
            style={{ color: GHOST, fontSize: "clamp(2.25rem, 6vw, 4rem)", lineHeight: 1, letterSpacing: "0.04em" }}
          >
            02
          </span>
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-extrabold" style={{ fontFamily: "var(--font-display-wide)", color: INK, letterSpacing: "-0.02em" }}>
              Every listing, scored against your order
            </h2>
          </Reveal>
        </div>
        <p className="mt-3 font-normal leading-[1.6]" style={{ color: MUTED, maxWidth: MEASURE_17, fontSize: "17px" }}>
          Condition grade, seller verification, and the before/after discount are shown up front on
          every listing — along with the one reasoning line tied to your current top priority.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ranked.map((entry) => (
            <ListingCard key={entry.item.id} ranked={entry} leadId={leadId} />
          ))}
        </div>
      </div>
    </section>
  );
}
