"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronDown, ShieldAlert } from "lucide-react";
import { CONCERNS, COVER_THRESHOLD, type ConcernId, type Listing } from "./data";
import { coveredCount, discountPercent, formatUsd, overallMatch } from "./score-math";
import { FOCUS } from "./theme";

interface ListingCardProps {
  listing: Listing;
  selectedIds: ConcernId[];
}

/**
 * The product-preview interaction: hovering (or focusing into) a card
 * reveals its full per-concern breakdown in a panel that mirrors the ring
 * cluster's own selected/dim convention — WITHOUT hiding the baseline
 * numbers (overall match %, grade, verified badge, discount, and the
 * "Covers N/M" count) that are always visible regardless of hover state.
 *
 * `pinned` gives keyboard users an explicit, independent way to reach the
 * same panel a mouse user gets via hover — a dedicated disclosure button
 * toggled by click/Enter, not a focus-bubbling assumption.
 */
export default function ListingCard({ listing, selectedIds }: ListingCardProps) {
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hovered || pinned;

  const match = overallMatch(listing.scores);
  const discount = discountPercent(listing);
  const covered = coveredCount(listing.scores, selectedIds);
  const panelId = `breakdown-${listing.id}`;

  return (
    <div
      className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] w-full bg-zinc-100">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=480&h=600&q=70`}
          alt={`${listing.title}, secondhand, ${listing.grade.toLowerCase()} condition`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 320px"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <p className="truncate text-sm font-semibold text-zinc-950">{listing.title}</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-bold tabular-nums text-zinc-950">{formatUsd(listing.price)}</span>
            <span className="text-sm font-normal tabular-nums text-zinc-500 line-through">
              {formatUsd(listing.originalPrice)}
            </span>
            <span className="text-xs font-semibold tabular-nums text-emerald-700">&minus;{discount}%</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-emerald-700">
            {match}% overall match
          </span>
          <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-600">
            {listing.grade}
          </span>
          {listing.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-600">
              <BadgeCheck className="h-3 w-3 text-emerald-700" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-normal text-zinc-500">
              <ShieldAlert className="h-3 w-3" aria-hidden="true" />
              Pending
            </span>
          )}
        </div>

        <p className="text-xs font-normal text-zinc-600">
          {selectedIds.length === 0 ? (
            "No concerns selected above"
          ) : (
            <>
              Covers{" "}
              <span className="font-semibold tabular-nums text-zinc-950">
                {covered}/{selectedIds.length}
              </span>{" "}
              of your selected concerns
            </>
          )}
        </p>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setPinned((v) => !v)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={`mt-auto flex items-center gap-1.5 self-start rounded-md text-xs font-semibold text-zinc-600 transition-colors hover:text-zinc-950 ${FOCUS}`}
        >
          Per-concern breakdown
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <div id={panelId} className="flex flex-col gap-1 border-t border-zinc-100 pt-2.5">
            {CONCERNS.map((concern) => {
              const isSelected = selectedIds.includes(concern.id);
              const score = listing.scores[concern.id];
              const clears = score >= COVER_THRESHOLD;
              return (
                <div key={concern.id} className="flex items-center justify-between gap-2 text-xs">
                  <span
                    className={
                      isSelected
                        ? clears
                          ? "font-semibold text-emerald-700"
                          : "font-normal text-zinc-700"
                        : "font-normal text-zinc-500"
                    }
                  >
                    {concern.label}
                    {isSelected ? "" : " (not selected)"}
                  </span>
                  <span
                    className={`tabular-nums ${isSelected ? "font-semibold text-zinc-950" : "font-normal text-zinc-500"}`}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div id={panelId} className="sr-only" />
        )}
      </div>
    </div>
  );
}
