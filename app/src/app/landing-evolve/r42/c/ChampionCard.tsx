import Image from "next/image";
import { BadgeCheck, Trophy } from "lucide-react";
import { discountPct, formatMoney, thumbDataUri, type Listing } from "./data";
import { ACCENT, MUTED_ON_TINT } from "./tokens";

/**
 * The rich champion leaf: the one card every proof badge lives on. Shown
 * both inside the bracket tree and, larger, in the "Why it won" section —
 * same data, same component, so the two never disagree.
 */
export default function ChampionCard({
  listing,
  score,
  size = "default",
}: {
  listing: Listing;
  score: number;
  size?: "default" | "large";
}) {
  const large = size === "large";
  return (
    <div
      className={`w-full rounded-2xl border-2 bg-white p-4 shadow-sm ${large ? "sm:p-6" : ""}`}
      style={{ borderColor: ACCENT }}
    >
      <p
        className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: ACCENT }}
      >
        <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
        Champion
      </p>

      <div className={`mt-3 flex gap-3 ${large ? "sm:gap-5" : ""}`}>
        <div
          className={`relative flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 ${
            large ? "h-28 w-28 sm:h-32 sm:w-32" : "h-16 w-16"
          }`}
        >
          <Image
            src={thumbDataUri(listing.swatch)}
            alt={`${listing.brand} ${listing.name}`}
            fill
            sizes={large ? "128px" : "64px"}
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`font-extrabold leading-tight tracking-[-0.02em] text-zinc-950 ${large ? "text-xl" : "text-base"}`}>
            {listing.brand} {listing.name}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg font-extrabold tabular-nums text-zinc-950">
              {formatMoney(listing.price)}
            </span>
            <span className={`text-xs font-normal tabular-nums line-through ${MUTED_ON_TINT}`}>
              {formatMoney(listing.originalPrice)}
            </span>
            <span
              className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-white"
              style={{ backgroundColor: ACCENT }}
            >
              −{discountPct(listing)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums"
          style={{ borderColor: ACCENT, color: ACCENT }}
        >
          {Math.round(score)} fit score
        </span>
        <span className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
          {listing.conditionLabel} condition
        </span>
        {listing.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
            <BadgeCheck className="h-3 w-3" style={{ color: ACCENT }} aria-hidden="true" />
            Verified seller
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
            Unverified seller
          </span>
        )}
        <span className="inline-flex items-center rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-zinc-700">
          {listing.sellerSales} sales
        </span>
      </div>
    </div>
  );
}
