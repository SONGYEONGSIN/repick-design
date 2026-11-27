"use client";

import Image from "next/image";
import { Check, CheckCircle2, ChevronDown, Gem, Percent, ShieldAlert, ShieldCheck, Sparkles, X } from "lucide-react";
import type { Listing } from "./data";
import { CRITERIA, checksFor, discountPct, formatUsd, isEligible } from "./model";
import { ACCENT, BORDER, FAIL, FG, FOCUS_RING, INK, MUTED, STAT_TRACKING, SURFACE, SURFACE_RAISED } from "./tokens";

interface ListingCardProps {
  listing: Listing;
  min: number;
  max: number;
  compact?: boolean;
}

/**
 * Rich preview card: AI match-reason tags, condition grade, seller-verification badge, and the
 * before/after discount % all live in a row BELOW the photo, never as an absolute overlay on top
 * of it — so if the image fails to load, the browser's default alt text can reflow freely without
 * colliding with a badge. The "eligible now" chip and the "which checks passed" disclosure both
 * read the live min/max range via checksFor()/isEligible() — the same functions the checklist
 * table and the hero use — so a card can never show a stale pass/fail state.
 */
export function ListingCard({ listing, min, max, compact = false }: ListingCardProps) {
  const pct = discountPct(listing);
  const eligible = isEligible(listing, min, max);
  const rows = checksFor(listing, min, max);

  return (
    <div
      className={compact ? "flex min-w-0 items-start gap-3 overflow-hidden rounded-2xl p-3" : "flex min-w-0 flex-col overflow-hidden rounded-2xl"}
      style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
    >
      <div
        className={compact ? "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl" : "relative aspect-[4/3] w-full"}
        style={{ backgroundColor: SURFACE_RAISED }}
      >
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=640&q=80`}
          alt={listing.alt}
          fill
          sizes={compact ? "80px" : "(max-width: 768px) 90vw, 320px"}
          className="object-cover"
        />
      </div>

      <div className={compact ? "flex min-w-0 flex-1 flex-col gap-1.5" : "flex min-w-0 flex-col gap-2 p-4"}>
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-extrabold" style={{ color: FG }}>
            {listing.title}
          </p>
          <span className="shrink-0 text-[11px] font-semibold" style={{ color: MUTED }}>
            {listing.condition}
          </span>
        </div>

        <p className="text-sm">
          <span className="font-extrabold tabular-nums" style={{ color: FG }}>
            {formatUsd(listing.price)}
          </span>{" "}
          <span className="font-normal tabular-nums line-through" style={{ color: MUTED }}>
            {formatUsd(listing.originalPrice)}
          </span>
        </p>

        {/* The four required proof badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums"
            style={{ backgroundColor: SURFACE_RAISED, color: FG, border: `1px solid ${BORDER}` }}
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {listing.matchPct}% match
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: SURFACE_RAISED, color: FG, border: `1px solid ${BORDER}` }}
          >
            <Gem className="h-3 w-3" aria-hidden="true" />
            {listing.condition}
          </span>
          {listing.verifiedSeller ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: SURFACE_RAISED, color: FG, border: `1px solid ${BORDER}` }}
            >
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: SURFACE_RAISED, color: MUTED, border: `1px solid ${BORDER}` }}
            >
              <ShieldAlert className="h-3 w-3" aria-hidden="true" />
              Unverified
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${STAT_TRACKING}`}
            style={{ backgroundColor: ACCENT, color: INK }}
          >
            <Percent className="h-3 w-3" aria-hidden="true" />
            {pct}% off
          </span>
        </div>

        {!compact ? (
          <ul className="space-y-1 pt-1">
            {listing.reasonTags.map((tag) => (
              <li key={tag} className="flex items-start gap-1.5 text-[11px]" style={{ color: MUTED }}>
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0" style={{ color: ACCENT }} aria-hidden="true" />
                <span>{tag}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Live eligibility chip for the range currently set above — recomputed from the same
            isEligible() the checklist table uses, never a separate hardcoded verdict. */}
        {eligible ? (
          <span
            className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold"
            style={{ color: ACCENT }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Eligible at your current range
          </span>
        ) : (
          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold" style={{ color: MUTED }}>
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Not eligible at your current range
          </span>
        )}

        {!compact ? (
          <details className="group pt-1">
            <summary
              className={`inline-flex w-fit cursor-pointer list-none items-center gap-1 rounded px-1 py-1.5 text-[11px] font-semibold ${FOCUS_RING}`}
              style={{ color: ACCENT }}
            >
              Which checks passed
              <ChevronDown className="h-3 w-3 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ul className="mt-1.5 space-y-1">
              {CRITERIA.map((criterion) => {
                const passed = rows[criterion.id];
                return (
                  <li
                    key={criterion.id}
                    className="flex items-center gap-1.5 text-[11px]"
                    style={{ color: passed ? FG : MUTED }}
                  >
                    <span
                      className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: passed ? ACCENT : "transparent",
                        border: passed ? "none" : `1px solid ${FAIL}`,
                      }}
                      aria-hidden="true"
                    >
                      {passed ? <Check className="h-2.5 w-2.5" style={{ color: INK }} /> : <X className="h-2.5 w-2.5" style={{ color: FAIL }} />}
                    </span>
                    {criterion.label}
                  </li>
                );
              })}
            </ul>
          </details>
        ) : null}
      </div>
    </div>
  );
}
