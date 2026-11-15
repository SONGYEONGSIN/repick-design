"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Equal,
  Gauge,
  Percent,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Allocator } from "./Allocator";
import { Reveal } from "./Reveal";
import { BALANCED_SHARES, CATEGORIES, DEFAULT_SHARES, LISTINGS, STAT_CHIPS, TESTIMONIALS, type Listing } from "./data";
import {
  boundariesFromShares,
  computeModel,
  formatUsd,
  formatViews,
  sharesFromBoundaries,
  type AllocationModel,
} from "./model";
import {
  ACCENT_LARGE_HEX,
  ACCENT_SMALL_HEX,
  ACCENT_TEXT_SMALL,
  CAPTION,
  DISPLAY_FONT,
  EYEBROW,
  FOCUS_RING,
  INK,
  MUTED_ON_TINT,
  MUTED_ON_WHITE,
  PROSE_WIDTH_BODY,
  PROSE_WIDTH_CARD,
  PROSE_WIDTH_HERO,
  SEGMENT_COLORS,
  SURFACE_BORDER,
  SURFACE_TINT,
} from "./tokens";

/* ------------------------------------------------------------------------ */
/* Shared small pieces                                                      */
/* ------------------------------------------------------------------------ */

interface BadgeRowProps {
  matchPct: number;
  grade: string;
  verified: boolean;
  discountPct: number;
}

function BadgeRow({ matchPct, grade, verified, discountPct }: BadgeRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
        style={{ backgroundColor: ACCENT_LARGE_HEX, color: INK }}
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {matchPct}% match
      </span>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ color: INK, backgroundColor: SURFACE_TINT, border: `1px solid ${SURFACE_BORDER}` }}
      >
        Grade {grade}
      </span>
      {verified ? (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ color: ACCENT_SMALL_HEX, backgroundColor: SURFACE_TINT, border: `1px solid ${SURFACE_BORDER}` }}
        >
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified seller
        </span>
      ) : null}
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ color: INK, backgroundColor: SURFACE_TINT, border: `1px solid ${SURFACE_BORDER}` }}
      >
        <Percent className="h-3 w-3" aria-hidden="true" />
        {discountPct}% off
      </span>
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  spotlighted?: boolean;
  titleAs?: "h3" | "p";
}

function ListingCard({ listing, spotlighted = false, titleAs = "h3" }: ListingCardProps) {
  const titleClassName = "truncate text-[15px] font-extrabold";
  const titleStyle = { color: INK };
  return (
    <div
      className="flex min-w-0 flex-col overflow-hidden rounded-2xl"
      style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: "#FFFFFF" }}
    >
      <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: SURFACE_TINT }}>
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=640&q=80`}
          alt={listing.alt}
          fill
          sizes="(max-width: 768px) 90vw, 360px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          {titleAs === "h3" ? (
            <h3 className={titleClassName} style={titleStyle}>
              {listing.title}
            </h3>
          ) : (
            <p className={titleClassName} style={titleStyle}>
              {listing.title}
            </p>
          )}
          {spotlighted ? (
            <span
              className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold"
              style={{ color: ACCENT_SMALL_HEX }}
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Spotlighted
            </span>
          ) : null}
        </div>
        <p className="text-sm">
          <span className="font-extrabold" style={{ color: INK }}>
            {formatUsd(listing.currentPrice)}
          </span>{" "}
          <span className={`font-normal line-through ${MUTED_ON_WHITE}`}>{formatUsd(listing.originalPrice)}</span>
        </p>
        <BadgeRow matchPct={listing.matchPct} grade={listing.grade} verified={listing.verified} discountPct={listing.discountPct} />
        <ul className="space-y-1 pt-1">
          {listing.reasonTags.map((tag) => (
            <li key={tag} className={`flex items-start gap-1.5 text-[11px] ${MUTED_ON_WHITE}`}>
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0" style={{ color: ACCENT_SMALL_HEX }} aria-hidden="true" />
              <span>{tag}</span>
            </li>
          ))}
        </ul>
        <details className="group pt-1">
          <summary
            className={`flex w-fit cursor-pointer list-none items-center gap-1 rounded text-[11px] font-semibold ${ACCENT_TEXT_SMALL} ${FOCUS_RING}`}
          >
            Condition detail
            <ChevronDown className="h-3 w-3 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className={`mt-1.5 text-[11px] leading-[1.5] ${MUTED_ON_WHITE}`}>{listing.conditionNote}</p>
        </details>
      </div>
    </div>
  );
}

interface ScenarioCardProps {
  label: string;
  tagText: string;
  Icon: LucideIcon;
  shares: readonly number[];
  model: AllocationModel;
  isLive: boolean;
  onTry?: () => void;
}

function ScenarioCard({ label, tagText, Icon, shares, model, isLive, onTry }: ScenarioCardProps) {
  return (
    <div
      className="flex min-w-0 flex-col gap-3 rounded-2xl p-5"
      style={{
        border: `1px solid ${isLive ? ACCENT_LARGE_HEX : SURFACE_BORDER}`,
        backgroundColor: isLive ? SURFACE_TINT : "#FFFFFF",
      }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" style={{ color: ACCENT_SMALL_HEX }} aria-hidden="true" />
        <h3 className="text-[14px] font-extrabold" style={{ color: INK }}>
          {label}
        </h3>
      </div>
      <p className={`text-[11px] ${isLive ? MUTED_ON_TINT : MUTED_ON_WHITE}`}>{tagText}</p>

      <div className="flex items-baseline gap-1">
        <span className="font-extrabold" style={{ fontSize: "2.1rem", color: INK, fontVariantNumeric: "tabular-nums" }}>
          {model.fitScore}
        </span>
        <span className={`text-sm font-semibold ${isLive ? MUTED_ON_TINT : MUTED_ON_WHITE}`}>/100 fit</span>
      </div>
      <p className="text-[13px] font-semibold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
        {formatViews(model.projectedViews)} projected views this week
      </p>

      <div className="flex h-2 w-full overflow-hidden rounded-full" aria-hidden="true">
        {CATEGORIES.map((category, i) => (
          <div key={category.id} style={{ width: `${shares[i]}%`, backgroundColor: SEGMENT_COLORS[i] }} />
        ))}
      </div>
      <p className={`text-[11px] ${isLive ? MUTED_ON_TINT : MUTED_ON_WHITE}`} style={{ fontVariantNumeric: "tabular-nums" }}>
        {CATEGORIES.map((c, i) => `${c.shortLabel} ${shares[i]}%`).join(" · ")}
      </p>

      {onTry ? (
        <button
          type="button"
          onClick={onTry}
          className={`mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${FOCUS_RING}`}
          style={{ color: ACCENT_SMALL_HEX, backgroundColor: "#FFFFFF", border: `1px solid ${SURFACE_BORDER}` }}
        >
          Try this split
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </button>
      ) : (
        <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold" style={{ color: ACCENT_SMALL_HEX }}>
          Drag the bar above to change this
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */
export default function Client() {
  const [boundaries, setBoundaries] = useState<number[]>(() => boundariesFromShares(DEFAULT_SHARES));

  const shares = sharesFromBoundaries(boundaries);
  const model = computeModel(shares);
  const demandMatchedShares = CATEGORIES.map((category) => category.demandShare);
  const balancedModel = computeModel(BALANCED_SHARES);
  const demandMatchedModel = computeModel(demandMatchedShares);
  const spotlightListing = LISTINGS[model.dominantIndex];

  return (
    <main className="bg-white" style={{ color: INK }}>
      {/* ------------------------------------------------------------------ HERO (device + proof live inside) */}
      <section className="px-4 pb-14 pt-14 sm:px-6 sm:pt-20 lg:px-10 lg:pb-20 lg:pt-24" aria-labelledby="hero-heading">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Switchback · resale for used trail gear</p>
            <h1
              id="hero-heading"
              className="font-extrabold"
              style={{
                fontFamily: DISPLAY_FONT,
                letterSpacing: "-0.01em",
                lineHeight: 1.04,
                fontSize: "clamp(2.1rem, 4.6vw + 0.6rem, 3.75rem)",
                color: INK,
              }}
            >
              Your gear sells faster when the spotlight matches demand.
            </h1>
            <p className={`${PROSE_WIDTH_HERO} text-[18px] font-normal leading-[1.6]`} style={{ color: "#3F3F46" }}>
              Switchback splits your weekly spotlight pool across your listing categories. Drag
              the dividers below — your demand fit score and projected views recompute instantly.
            </p>
            <div>
              <a
                href="#start-selling"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT_LARGE_HEX, color: INK }}
              >
                Start selling on Switchback
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="rounded-3xl p-5 sm:p-6" style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: "#FFFFFF" }}>
              <p className={CAPTION} style={{ color: "#71717A" }}>
                Fig. 01 — live, updates as you drag
              </p>
              <div className="mt-3">
                <Allocator boundaries={boundaries} shares={shares} model={model} onChange={setBoundaries} />
              </div>

              <div className="mt-5 border-t pt-5" style={{ borderColor: SURFACE_BORDER }}>
                <p className={CAPTION} style={{ color: "#71717A" }}>
                  {model.isTie ? "Credits are evenly split — example listing below" : "Currently spotlighted listing"}
                </p>
                <div className="mt-3">
                  <ListingCard listing={spotlightListing} spotlighted={!model.isTie} titleAs="p" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ PRODUCT PREVIEW */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="preview-heading">
          <div className="mx-auto max-w-[1280px]">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Every listing, graded the same way</p>
            <h2
              id="preview-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.6rem, 2.4vw + 0.8rem, 2.5rem)", lineHeight: 1.08, color: INK }}
            >
              Match score, condition grade, and seller verification — before a buyer ever asks.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] leading-[1.6]`} style={{ color: "#3F3F46" }}>
              Four listings, one from each category in the allocator above. The reasoning tags
              come from the same comparable-sales model that drives your demand fit score.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {LISTINGS.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} spotlighted={i === model.dominantIndex && !model.isTie} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------------ VALUE, 3-WAY SPLIT */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: SURFACE_TINT }} aria-labelledby="value-heading">
          <div className="mx-auto max-w-[1280px]">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Same 100 credits, three outcomes</p>
            <h2
              id="value-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.6rem, 2.4vw + 0.8rem, 2.5rem)", lineHeight: 1.08, color: INK }}
            >
              Matching demand and maximizing views aren&apos;t always the same split.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] leading-[1.6]`} style={{ color: "#3F3F46" }}>
              A split that mirrors buyer demand exactly always scores 100 on fit — but a slightly
              uneven split can still reach more total views, if the right category is yielding
              well this week. Try both below.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <ScenarioCard
                label="Your split"
                tagText="Live — drag the bar in the hero above to change it"
                Icon={Sparkles}
                shares={shares}
                model={model}
                isLive
              />
              <ScenarioCard
                label="Evenly balanced"
                tagText="25% of the weekly pool to each category"
                Icon={Equal}
                shares={BALANCED_SHARES}
                model={balancedModel}
                isLive={false}
                onTry={() => setBoundaries(boundariesFromShares(BALANCED_SHARES))}
              />
              <ScenarioCard
                label="Demand-matched"
                tagText="Mirrors this week's real search volume exactly"
                Icon={Gauge}
                shares={demandMatchedShares}
                model={demandMatchedModel}
                isLive={false}
                onTry={() => setBoundaries(boundariesFromShares(demandMatchedShares))}
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------------ SOCIAL PROOF */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-[1280px]">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Sellers who stopped guessing</p>
            <h2
              id="proof-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.6rem, 2.4vw + 0.8rem, 2.5rem)", lineHeight: 1.08, color: INK }}
            >
              A few thousand sellers have already found their split.
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {STAT_CHIPS.map((stat, i) => {
                const Icon = i === 0 ? Users : i === 1 ? Gauge : Star;
                return (
                  <div
                    key={stat.id}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: "#FFFFFF" }}
                  >
                    <Icon className="h-4 w-4" style={{ color: ACCENT_SMALL_HEX }} aria-hidden="true" />
                    <span className="text-[13px] font-extrabold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
                      {stat.value}
                    </span>
                    <span className={`text-[13px] ${MUTED_ON_WHITE}`}>{stat.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex min-w-0 flex-col gap-4 rounded-2xl p-5"
                  style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: "#FFFFFF" }}
                >
                  <Quote className="h-5 w-5" style={{ color: ACCENT_SMALL_HEX }} aria-hidden="true" />
                  <blockquote className={`${PROSE_WIDTH_CARD} text-[14px] leading-[1.6]`} style={{ color: "#3F3F46" }}>
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
                      style={{ backgroundColor: SURFACE_TINT, color: ACCENT_SMALL_HEX, border: `1px solid ${SURFACE_BORDER}` }}
                      aria-hidden="true"
                    >
                      {testimonial.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-extrabold" style={{ color: INK }}>
                        {testimonial.name}
                      </span>
                      <span className={`block truncate text-[12px] ${MUTED_ON_WHITE}`}>{testimonial.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------------ CLOSING CTA (quotes the live score) */}
      <Reveal>
        <section
          id="start-selling"
          className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
          style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${SURFACE_BORDER}` }}
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto flex max-w-[860px] flex-col items-start gap-6">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Ready when your split is</p>
            <h2
              id="cta-heading"
              className="font-extrabold"
              style={{ fontFamily: DISPLAY_FONT, lineHeight: 1.05, fontSize: "clamp(1.9rem, 3.4vw + 0.8rem, 3.1rem)", color: INK }}
            >
              Your current split scores a {model.fitScore}/100 demand fit.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} text-[16px] leading-[1.6]`} style={{ color: "#3F3F46" }}>
              At that split, Switchback projects {formatViews(model.projectedViews)} featured
              views this week. Move a divider above and this number — and the one in the
              headline — updates immediately. List your first item and start tuning yours.
            </p>
            <a
              href="#hero-heading"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT_LARGE_HEX, color: INK }}
            >
              List your first item
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className={`text-[12px] ${MUTED_ON_WHITE}`}>No listing fee until it sells.</p>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
