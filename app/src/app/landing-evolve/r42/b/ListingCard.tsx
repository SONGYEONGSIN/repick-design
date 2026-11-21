"use client";

import { useId, useState } from "react";
import { BadgeCheck, Camera, ChevronDown, ShieldCheck } from "lucide-react";
import {
  discountPct,
  formatPrice,
  priceScore,
  shipScore,
  DISPLAY,
  FOCUS_RING,
  type Listing,
  type Weights,
} from "./data";

function Pill({ children, icon: Icon }: { children: React.ReactNode; icon?: typeof ShieldCheck }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
      {Icon && <Icon className="h-3.5 w-3.5 text-[#15803d]" aria-hidden="true" />}
      {children}
    </span>
  );
}

export default function ListingCard({
  listing,
  weights,
  score,
  isLeader,
  side,
}: {
  listing: Listing;
  weights: Weights;
  score: number;
  isLeader: boolean;
  side: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pScore = priceScore(listing);
  const sScore = shipScore(listing);
  const total = weights.price + weights.condition + weights.ship + weights.trust;

  const rows = [
    { label: "Price priority", raw: pScore, w: weights.price },
    { label: "Condition priority", raw: listing.conditionScore, w: weights.condition },
    { label: "Ship-speed priority", raw: sScore, w: weights.ship },
    { label: "Seller-trust priority", raw: listing.trustScore, w: weights.trust },
  ];

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border p-4 transition-colors duration-200 sm:p-5 ${
        isLeader ? "border-[#15803d] bg-[#15803d]/[0.04]" : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
          {side === "left" ? "Listing A" : "Listing B"}
        </span>
        {isLeader && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#15803d] px-2.5 py-1 text-[11px] font-semibold text-white">
            Currently leading
          </span>
        )}
      </div>

      <div className="relative flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-zinc-100">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#15803d]/10">
          <Camera className="h-7 w-7 text-[#15803d]" aria-hidden="true" />
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-base font-semibold leading-snug text-zinc-950">{listing.name}</p>
        <p className="text-sm font-normal text-zinc-600">Sold by {listing.seller}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Pill icon={ShieldCheck}>{listing.conditionGrade}</Pill>
        <Pill icon={BadgeCheck}>Verified · {listing.salesCount} sales</Pill>
        <span className="inline-flex items-center rounded-full bg-[#15803d] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">
          −{discountPct(listing)}%
        </span>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-xl font-extrabold tabular-nums text-zinc-950">{formatPrice(listing.price)}</span>
        <span className="text-sm font-normal tabular-nums text-zinc-600 line-through">
          {formatPrice(listing.originalPrice)}
        </span>
        <span className="text-sm font-normal text-zinc-600">· ships in {listing.shipDays} day{listing.shipDays === 1 ? "" : "s"}</span>
      </div>

      <div className="flex items-end justify-between gap-3 border-t border-zinc-100 pt-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">Weighted score</span>
        <span
          className={`text-3xl font-extrabold tabular-nums ${isLeader ? "text-[#15803d]" : "text-zinc-950"}`}
          style={DISPLAY}
        >
          {score.toFixed(1)}
        </span>
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-lg px-1 py-1 text-xs font-semibold text-zinc-600 transition-colors motion-reduce:transition-none ${FOCUS_RING}`}
      >
        Show the math
        <ChevronDown
          className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div id={panelId} className="-mt-2 flex flex-col gap-1.5 border-t border-zinc-100 pt-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-xs font-normal text-zinc-600">
              <span>{r.label}</span>
              <span className="tabular-nums text-zinc-950">
                {r.raw} × {r.w} = {(r.raw * r.w).toFixed(0)}
              </span>
            </div>
          ))}
          <div className="mt-1 flex items-center justify-between border-t border-zinc-100 pt-1.5 text-xs font-semibold text-zinc-950">
            <span>Sum ÷ total weight ({total})</span>
            <span className="tabular-nums">{score.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
