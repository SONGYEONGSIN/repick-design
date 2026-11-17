"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  SearchCheck,
  Gauge,
  ShieldCheck,
  ShieldQuestion,
  Tag,
} from "lucide-react";
import {
  rankListings,
  discountPct,
  formatPrice,
  GRADE_META,
  DEFAULT_QUERY,
  type RankedListing,
  type RankResult,
} from "./match";

const QUICK_PICKS = ["Sony", "Fujifilm", "Leica", "35mm lens", "Film"];

const STEPS = [
  {
    title: "Token overlap, not vibes",
    body: `Every keyword you type is checked against each listing's title, brand, model, and category. A hit on brand or model counts for more than a hit on the general title — that's why "a7" ranks the A7 bodies first, not just any camera.`,
  },
  {
    title: "Condition is graded, not guessed",
    body: "Each listing carries one of four fixed grades — Like New, Excellent, Good, or Fair — assigned from the seller's written condition report before it ever goes live.",
  },
  {
    title: "Verification is yes or no",
    body: "A verified badge means the seller's identity and payout account passed review. Unverified listings are never hidden, only labeled plainly so you can decide.",
  },
];

const TESTIMONIALS = [
  {
    name: "Mariko T.",
    role: "Wedding photographer",
    quote: `I typed "50mm" and the first result told me exactly why — a model match, not a guess. Checked out in under five minutes.`,
  },
  {
    name: "Devon R.",
    role: "Street photographer",
    quote: "The grade matched the camera exactly when it arrived. No surprise scuffs, no upsell call.",
  },
  {
    name: "Priya K.",
    role: "Film shooter",
    quote: "The verified badge meant I didn't have to chase the seller for proof of ownership. It was already done.",
  },
];

const HEADING_FACE: CSSProperties = { fontFamily: "var(--font-display-grotesk)" };

export default function Client() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const rank = useMemo(() => rankListings(query), [query]);
  const top = rank.results[0];

  return (
    <main className="bg-white">
      <a
        href="#match-search"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#0891B2] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#09090B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
      >
        Skip to live search
      </a>

      <header className="border-b border-[#E4E4E7]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 sm:px-8 lg:px-12">
          <span
            className="text-lg font-extrabold tracking-[-0.02em] text-[#18181B]"
            style={HEADING_FACE}
          >
            repick
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[#71717A] sm:inline">
            Camera &amp; Lens Resale
          </span>
        </div>
      </header>

      <section aria-label="Live match search" className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5 motion-safe:animate-[rise_0.5s_ease-out] motion-reduce:animate-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0E7490]">
              Live match search · no guessing
            </p>
            <h1
              className="mt-5 text-[clamp(2.1rem,8vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#18181B] lg:text-[clamp(3rem,4vw,4.75rem)]"
              style={HEADING_FACE}
            >
              Type what you want. We show exactly why it matched.
            </h1>
            <p className="mt-6 max-w-[500px] text-base font-normal leading-[1.6] text-[#3F3F46]">
              Search a brand, model, or keyword below. repick ranks every listing live and tells
              you which words earned the match — plus the condition grade, seller check, and
              discount on every result.
            </p>
            <div className="mt-8">
              <a
                href="#match-search"
                className="inline-flex items-center gap-2 rounded-full bg-[#0891B2] px-6 py-3 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#0E7490] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
              >
                Try the live search
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7 motion-safe:animate-[rise_0.6s_ease-out] motion-reduce:animate-none">
            <SearchDevice query={query} onQueryChange={setQuery} rank={rank} />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="how-it-works-heading"
        className="border-t border-[#E4E4E7] bg-[#FAFAFA] px-6 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-[1400px]">
          <h2
            id="how-it-works-heading"
            className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#18181B]"
            style={HEADING_FACE}
          >
            How the match reasoning works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="min-w-0">
                <p className="text-xs font-semibold tabular-nums tracking-[0.16em] text-[#71717A]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-lg font-extrabold tracking-[-0.02em] text-[#18181B]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[500px] text-base font-normal leading-[1.6] text-[#3F3F46]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="social-proof-heading" className="px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="social-proof-heading"
              className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.02em] text-[#18181B]"
              style={HEADING_FACE}
            >
              What sellers and buyers say
            </h2>
            <p className="text-xs font-normal text-[#71717A]">
              Snapshot — fixed examples, not updated by the search above.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="min-w-0 border-t border-[#E4E4E7] pt-6">
                <span
                  aria-hidden="true"
                  className="block text-[2.5rem] leading-none text-[#71717A]"
                  style={HEADING_FACE}
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 max-w-[500px] text-base font-normal leading-[1.6] text-[#3F3F46]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#71717A]">
                  {t.name} · {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="closing-heading"
        className="border-t border-[#E4E4E7] px-6 py-16 sm:px-8 lg:px-12 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-8">
            <h2
              id="closing-heading"
              className="text-[clamp(1.9rem,3.4vw,3rem)] font-extrabold tracking-[-0.02em] text-[#18181B]"
              style={HEADING_FACE}
            >
              Ready when you are.
            </h2>
            <p className="mt-4 max-w-[500px] text-base font-normal leading-[1.6] text-[#3F3F46]">
              {rank.fallbackReason === "empty-query" ? (
                <>
                  No search typed — repick is currently leading with{" "}
                  <strong className="font-extrabold text-[#18181B]">{top.listing.title}</strong>,
                  our most popular listing.
                </>
              ) : rank.fallbackReason === "no-hits" ? (
                <>
                  &ldquo;{query.trim()}&rdquo; didn&apos;t hit a keyword yet, so repick is showing{" "}
                  <strong className="font-extrabold text-[#18181B]">{top.listing.title}</strong>{" "}
                  from the full catalog while you keep typing.
                </>
              ) : (
                <>
                  Right now, &ldquo;{query.trim()}&rdquo; surfaces{" "}
                  <strong className="font-extrabold text-[#18181B]">{top.listing.title}</strong>{" "}
                  as the top match —{" "}
                  <span className="font-extrabold tabular-nums text-[#18181B]">
                    {top.matchedTokenCount}
                  </span>{" "}
                  keyword {top.matchedTokenCount === 1 ? "hit" : "hits"} on its {top.reason}.
                </>
              )}
            </p>
          </div>
          <div className="min-w-0 lg:col-span-4 lg:text-right">
            <a
              href="#match-search"
              className="inline-flex items-center gap-2 rounded-full bg-[#0891B2] px-6 py-3 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#0E7490] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
            >
              Start your own search
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E4E4E7] px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-extrabold tracking-[-0.02em] text-[#18181B]" style={HEADING_FACE}>
            repick
          </span>
          <p className="text-xs font-normal text-[#71717A]">
            © 2026 repick · Camera &amp; lens resale, graded and verified before it&apos;s listed.
          </p>
        </div>
      </footer>
    </main>
  );
}

function SearchDevice({
  query,
  onQueryChange,
  rank,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  rank: RankResult;
}) {
  const resultsToShow = rank.results.slice(0, 3);
  const trimmed = query.trim();

  return (
    <div>
      <label
        htmlFor="match-input"
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717A]"
      >
        Search listings
      </label>
      <div
        id="match-search"
        className="relative mt-2 flex items-center rounded-2xl border border-[#D4D4D8] bg-white px-4 py-3 focus-within:border-[#0E7490] focus-within:shadow-[0_0_0_3px_rgba(14,116,144,0.18)]"
      >
        <Search className="h-4 w-4 shrink-0 text-[#71717A]" aria-hidden="true" />
        <input
          id="match-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder='Try "Sony a7", "Leica Q2", or "35mm lens"'
          autoComplete="off"
          spellCheck={false}
          aria-describedby="match-status"
          aria-label="Search listings by brand, model, or keyword"
          className="ml-3 w-full min-w-0 bg-transparent text-base font-normal text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-2 focus:outline-offset-2 focus:outline-[#0E7490]"
        />
      </div>

      <div role="group" aria-label="Quick search suggestions" className="mt-3 flex flex-wrap gap-2">
        {QUICK_PICKS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onQueryChange(label)}
            className="rounded-full border border-[#D4D4D8] bg-[#F4F4F5] px-3 py-1.5 text-xs font-semibold text-[#52525B] transition-colors hover:border-[#0E7490] hover:text-[#0E7490] focus-visible:border-[#0E7490] focus-visible:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
          >
            {label}
          </button>
        ))}
      </div>

      <p id="match-status" aria-live="polite" className="mt-3 text-xs font-normal text-[#71717A]">
        {rank.isFallback ? (
          rank.fallbackReason === "empty-query" ? (
            "Showing the full catalog, sorted by popularity."
          ) : (
            <>No keyword in &ldquo;{trimmed}&rdquo; matched — showing the full catalog by popularity.</>
          )
        ) : (
          <>
            <span className="font-semibold tabular-nums text-[#3F3F46]">{rank.results.length}</span>{" "}
            listing{rank.results.length === 1 ? "" : "s"} matched &ldquo;{trimmed}&rdquo;.
          </>
        )}
      </p>

      <p className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
        Fig. 01 — Live results, ranked as you type
      </p>
      <ul className="flex flex-col gap-3">
        {resultsToShow.map((r) => (
          <ListingProofCard key={r.listing.id} ranked={r} />
        ))}
      </ul>
    </div>
  );
}

function ListingProofCard({ ranked }: { ranked: RankedListing }) {
  const { listing, reason } = ranked;
  const grade = GRADE_META[listing.grade];

  return (
    <li className="flex min-w-0 gap-4 rounded-2xl border border-[#E4E4E7] bg-white p-4">
      <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-[#F4F4F5] sm:w-24">
        <Image
          src={`https://images.unsplash.com/${listing.imageId}?w=400&q=80`}
          alt={listing.imageAlt}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#18181B]">{listing.title}</p>
        <p className="mt-1 text-xs font-normal text-[#71717A]">
          {listing.brand} · {listing.category}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <span className="font-extrabold tabular-nums text-[#18181B]">{formatPrice(listing.price)}</span>
          <span className="font-normal tabular-nums text-[#71717A] line-through">
            {formatPrice(listing.originalPrice)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-[#0E7490] px-2.5 py-1 text-[11px] font-semibold text-[#0E7490]">
            <SearchCheck className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{reason}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D4D4D8] px-2.5 py-1 text-[11px] font-semibold text-[#3F3F46]">
            <Gauge className="h-3 w-3" aria-hidden="true" />
            {grade.letter} · {grade.label}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D4D4D8] px-2.5 py-1 text-[11px] font-semibold text-[#3F3F46]">
            {listing.verified ? (
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ShieldQuestion className="h-3 w-3" aria-hidden="true" />
            )}
            {listing.verified ? "Verified seller" : "Not yet verified"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#0891B2] px-2.5 py-1 text-[11px] font-extrabold tabular-nums text-[#09090B]">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {discountPct(listing)}% off
          </span>
        </div>
      </div>
    </li>
  );
}
