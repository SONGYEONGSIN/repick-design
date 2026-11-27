"use client";

import Image from "next/image";
import { Check, ChevronDown, Percent, ShieldCheck, Sparkles } from "lucide-react";
import { CHECKS, discountPct, formatUsd, summarize, type Listing } from "./model";
import { ACCENT, BORDER, FOCUS_RING, INK, MUTED, STAT_TRACKING, SURFACE, SURFACE_RAISED } from "./tokens";

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

/**
 * Rich preview card: AI-match-reason tags, condition grade, a seller-verification badge, and the
 * before/after discount %. The badge and its "N of 4 checks" strip are computed from the SAME
 * summarize() function the hero meter uses — this listing's badge is never a hardcoded string,
 * it is this listing's own fixed check combination run through the real scoring function.
 * Badge sits in its own row below the photo (never an absolute overlay on the image), so an
 * image-load failure leaves the alt text free to reflow without colliding with it.
 */
export function ListingCard({ listing, compact = false }: ListingCardProps) {
  const { score, band } = summarize(listing.checks);
  const pct = discountPct(listing);

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: SURFACE_RAISED }}>
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=640&q=80`}
          alt={listing.alt}
          fill
          sizes="(max-width: 768px) 90vw, 320px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-extrabold" style={{ color: "#FFFFFF" }}>
            {listing.title}
          </p>
          <span className="shrink-0 text-[11px] font-semibold" style={{ color: MUTED }}>
            Grade {listing.grade}
          </span>
        </div>
        <p className="text-sm">
          <span className="font-extrabold tabular-nums" style={{ color: "#FFFFFF" }}>
            {formatUsd(listing.currentPrice)}
          </span>{" "}
          <span className="font-normal tabular-nums line-through" style={{ color: MUTED }}>
            {formatUsd(listing.originalPrice)}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums"
            style={{ backgroundColor: SURFACE_RAISED, color: "#FFFFFF", border: `1px solid ${BORDER}` }}
          >
            <Percent className="h-3 w-3" aria-hidden="true" />
            {pct}% off
          </span>
          {band.badgeworthy ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STAT_TRACKING}`}
              style={{ color: ACCENT, border: `1px solid ${ACCENT}` }}
            >
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              {band.label} seller
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STAT_TRACKING}`}
              style={{ color: MUTED, border: `1px solid ${BORDER}` }}
            >
              {band.label}
            </span>
          )}
          <span className="text-[10px] font-semibold tabular-nums" style={{ color: MUTED }}>
            {score}/100 trust
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

        <details className="group pt-1">
          <summary
            className={`inline-flex w-fit cursor-pointer list-none items-center gap-1 rounded px-1 py-1.5 text-[11px] font-semibold ${FOCUS_RING}`}
            style={{ color: ACCENT }}
          >
            Which checks passed
            <ChevronDown className="h-3 w-3 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <ul className="mt-1.5 space-y-1">
            {CHECKS.map((check, i) => {
              const active = listing.checks[i];
              return (
                <li key={check.id} className="flex items-center gap-1.5 text-[11px]" style={{ color: active ? "#FFFFFF" : MUTED }}>
                  <span
                    className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: active ? ACCENT : "transparent", border: active ? "none" : `1px solid ${BORDER}` }}
                    aria-hidden="true"
                  >
                    {active ? <Check className="h-2.5 w-2.5" style={{ color: INK }} /> : null}
                  </span>
                  {check.label}
                </li>
              );
            })}
          </ul>
        </details>
      </div>
    </div>
  );
}
