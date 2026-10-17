"use client";

import {
  Camera as CameraIcon,
  CircleCheckBig,
  Footprints,
  Shirt,
  ShieldCheck,
  Sparkles,
  Swords,
  Tag,
  Truck,
  Watch as WatchIcon,
} from "lucide-react";
import {
  AXES,
  LISTINGS,
  type AxisKey,
  type Listing,
  type ListingId,
  aggregateScore,
  axisWinner,
  discountPct,
  overallWinner,
  winCount,
} from "./data";
import { ThumbArt } from "./ThumbArt";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

const CATEGORY_ICON: Record<string, typeof Shirt> = {
  Outerwear: Shirt,
  Watches: WatchIcon,
  Sneakers: Footprints,
  Cameras: CameraIcon,
};

const AXIS_ICON: Record<AxisKey, typeof Tag> = {
  price: Tag,
  condition: CircleCheckBig,
  trust: ShieldCheck,
  delivery: Truck,
};

interface HeroProps {
  aId: ListingId;
  bId: ListingId;
  onSelectA: (id: ListingId) => void;
  onSelectB: (id: ListingId) => void;
  onAddToDuel: (id: ListingId) => void;
  a: Listing;
  b: Listing;
}

export function Hero({ aId, bId, onSelectA, onSelectB, onAddToDuel, a, b }: HeroProps) {
  const { winner, loser, winnerScore, loserScore } = overallWinner(a, b);
  const counts = winCount(a, b);

  return (
    <section className="relative overflow-hidden border-b border-white/10 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          {/* Headline block */}
          <div className="min-w-0 lg:col-span-5">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-rose-500">
              <Swords className="h-3.5 w-3.5" aria-hidden="true" />
              AI resale matching
            </p>

            <h1 className="mt-4 tracking-[-0.02em] text-white">
              <span
                className="block font-semibold"
                style={{ fontSize: "clamp(1.4rem, 1.05rem + 1.4vw, 2.1rem)", lineHeight: 1.15 }}
              >
                Don&rsquo;t take the listing&rsquo;s word for it.
              </span>
              <span
                className="mt-1 block font-extrabold"
                style={{ fontSize: "clamp(2.5rem, 1.7rem + 4.6vw, 5.4rem)", lineHeight: 1.02 }}
              >
                Put two of them <span className="text-rose-500">in the ring.</span>
              </span>
            </h1>

            <p
              className="mt-6 text-[18px] leading-[1.6] text-zinc-300"
              style={{ maxWidth: "34.5rem" }}
            >
              Repick scores two competing listings side by side — price, condition,
              seller trust, and delivery speed — recalculated the moment you swap
              either one.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#scoring"
                className={`inline-flex items-center justify-center gap-2 rounded-md bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-500 ${FOCUS}`}
              >
                See how {winner.name} pulled ahead
              </a>
            </div>

            <p className="mt-5 text-[13px] font-semibold text-zinc-400">
              Right now:{" "}
              <span className="text-white">{winner.name}</span> leads{" "}
              <span className="tabular-nums text-rose-500">{winnerScore}</span> to{" "}
              <span className="tabular-nums">{loserScore}</span> over {loser.name}.
            </p>
          </div>

          {/* Duel device */}
          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/[2%] p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  <Swords className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                  Head-to-head duel
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  4 weighted criteria
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="duel-a"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400"
                  >
                    Challenger A
                  </label>
                  <select
                    id="duel-a"
                    value={aId}
                    onChange={(e) => onSelectA(e.target.value as ListingId)}
                    className={`w-full rounded-md border border-white/15 bg-white/[3%] px-3 py-2.5 text-sm font-semibold text-white ${FOCUS}`}
                  >
                    {LISTINGS.map((l) => (
                      <option key={l.id} value={l.id} className="bg-[#0B0B0F] text-white">
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="min-w-0">
                  <label
                    htmlFor="duel-b"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400"
                  >
                    Challenger B
                  </label>
                  <select
                    id="duel-b"
                    value={bId}
                    onChange={(e) => onSelectB(e.target.value as ListingId)}
                    className={`w-full rounded-md border border-white/15 bg-white/[3%] px-3 py-2.5 text-sm font-semibold text-white ${FOCUS}`}
                  >
                    {LISTINGS.map((l) => (
                      <option key={l.id} value={l.id} className="bg-[#0B0B0F] text-white">
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 divide-y divide-white/[6%]">
                {AXES.map(({ key, label, weightLabel }) => (
                  <AxisRow key={key} axisKey={key} label={label} weightLabel={weightLabel} a={a} b={b} />
                ))}
              </div>

              <div className="mt-2 rounded-xl border border-rose-500/25 bg-rose-500/[6%] p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-300">
                    <Swords className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                    Overall verdict
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    {counts.a} – {counts.b} criteria
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-right text-base font-extrabold tabular-nums text-white sm:w-24">
                    {aggregateScore(a)}
                  </div>
                  <VerdictBar a={a} b={b} />
                  <div className="w-20 text-base font-extrabold tabular-nums text-white sm:w-24">
                    {aggregateScore(b)}
                  </div>
                </div>
                <p className="mt-3 text-[13px] font-semibold text-zinc-300">
                  <span className="text-white">{winner.name}</span> wins the duel,{" "}
                  <span className="tabular-nums text-rose-500">{winnerScore}</span> to{" "}
                  <span className="tabular-nums">{loserScore}</span>, over {loser.name}.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product preview — same hero section, same outer element */}
        <div id="listings" className="mt-14 scroll-mt-24 sm:mt-16">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Product preview
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              4 live matches
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LISTINGS.map((listing) => (
              <ProductCard
                key={listing.id}
                listing={listing}
                isActive={listing.id === aId || listing.id === bId}
                onAddToDuel={onAddToDuel}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AxisRow({
  axisKey,
  label,
  weightLabel,
  a,
  b,
}: {
  axisKey: AxisKey;
  label: string;
  weightLabel: string;
  a: Listing;
  b: Listing;
}) {
  const scoreA = a.axis[axisKey];
  const scoreB = b.axis[axisKey];
  const win = axisWinner(a, b, axisKey);
  const Icon = AXIS_ICON[axisKey];

  return (
    <div className="py-3 first:pt-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
          {weightLabel} weight
        </span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex w-16 shrink-0 items-center justify-end gap-1 sm:w-20">
          {win === "a" && <CircleCheckBig className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />}
          <span
            className={
              win === "a"
                ? "text-sm font-extrabold tabular-nums text-white"
                : "text-sm font-semibold tabular-nums text-zinc-400"
            }
          >
            {scoreA}
          </span>
        </div>

        <div className="relative h-2.5 min-w-0 flex-1">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[-3px] h-[14px] w-px -translate-x-1/2 bg-zinc-600"
          />
          <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-full bg-zinc-800">
            <div
              className="h-full origin-right rounded-l-full transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform: `scaleX(${scoreA / 100})`,
                backgroundColor: win === "a" ? "#E11D48" : "#3f3f46",
              }}
            />
          </div>
          <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-full bg-zinc-800">
            <div
              className="h-full origin-left rounded-r-full transition-transform duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform: `scaleX(${scoreB / 100})`,
                backgroundColor: win === "b" ? "#E11D48" : "#3f3f46",
              }}
            />
          </div>
        </div>

        <div className="flex w-16 shrink-0 items-center gap-1 sm:w-20">
          <span
            className={
              win === "b"
                ? "text-sm font-extrabold tabular-nums text-white"
                : "text-sm font-semibold tabular-nums text-zinc-400"
            }
          >
            {scoreB}
          </span>
          {win === "b" && <CircleCheckBig className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}

function VerdictBar({ a, b }: { a: Listing; b: Listing }) {
  const scoreA = aggregateScore(a);
  const scoreB = aggregateScore(b);
  const aWins = scoreA >= scoreB;
  return (
    <div className="relative h-3.5 min-w-0 flex-1">
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[-3px] h-[20px] w-px -translate-x-1/2 bg-zinc-600"
      />
      <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-full bg-zinc-800">
        <div
          className="h-full origin-right rounded-l-full transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${scoreA / 100})`, backgroundColor: aWins ? "#E11D48" : "#3f3f46" }}
        />
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-full bg-zinc-800">
        <div
          className="h-full origin-left rounded-r-full transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ transform: `scaleX(${scoreB / 100})`, backgroundColor: !aWins ? "#E11D48" : "#3f3f46" }}
        />
      </div>
    </div>
  );
}

function ProductCard({
  listing,
  isActive,
  onAddToDuel,
}: {
  listing: Listing;
  isActive: boolean;
  onAddToDuel: (id: ListingId) => void;
}) {
  const pct = discountPct(listing);
  const CategoryIcon = CATEGORY_ICON[listing.category] ?? Tag;

  return (
    <div
      className={`min-w-0 rounded-xl border p-3 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none ${
        isActive ? "border-rose-500/70 bg-rose-500/[5%]" : "border-white/10 bg-white/[2%]"
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#15151b]">
        <ThumbArt variant={listing.id} />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <CategoryIcon className="h-9 w-9 text-white/60" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-3 min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {listing.brand}
        </p>
        <p className="mt-0.5 truncate text-sm font-extrabold text-white">{listing.name}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[6%] px-2 py-1 text-[11px] font-semibold text-zinc-200">
          <Sparkles className="h-3 w-3 text-rose-500" aria-hidden="true" />
          {listing.matchScore}% match
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[6%] px-2 py-1 text-[11px] font-semibold text-zinc-200">
          Grade {listing.grade}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/[6%] px-2 py-1 text-[11px] font-semibold text-zinc-200">
          <ShieldCheck className="h-3 w-3 text-rose-500" aria-hidden="true" />
          Verified seller
        </span>
      </div>

      <p className="mt-2 text-[12px] leading-[1.5] text-zinc-400">{listing.matchReason}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-base font-extrabold text-white">${listing.price}</span>
        <span className="text-xs font-semibold text-zinc-400 line-through">${listing.listPrice}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white">
          <Tag className="h-3 w-3" aria-hidden="true" />
          -{pct}%
        </span>
      </div>

      <div className="mt-3">
        {isActive ? (
          <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-rose-600 px-3 py-2.5 text-xs font-semibold text-white">
            <Swords className="h-3.5 w-3.5" aria-hidden="true" />
            Dueling now
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onAddToDuel(listing.id)}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/15 px-3 py-2.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-rose-500/60 hover:text-white ${FOCUS}`}
          >
            <Swords className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
            Add to duel
            <span className="sr-only"> — {listing.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}
