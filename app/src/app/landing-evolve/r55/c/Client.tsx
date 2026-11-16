"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Gauge,
  Percent,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Negotiator, type HandleId } from "./Negotiator";
import { Reveal } from "./Reveal";
import { HERO_LISTING, LISTINGS, SELLER_PRESETS, STAT_CHIPS, TESTIMONIALS, type Listing } from "./data";
import {
  DEFAULT_ASK,
  DEFAULT_OFFER,
  clampPrice,
  computeNegotiation,
  discountPct,
  formatUsd,
  outcomeLabel,
  outcomeSummary,
  type Negotiation,
} from "./model";
import {
  ACCENT_HEX,
  ACCENT_TEXT,
  BG,
  CAPTION,
  COPY_HEX,
  DARK_INK,
  EYEBROW,
  FOCUS_RING,
  FOLIO,
  INK,
  MUTED,
  PANEL,
  PANEL_BORDER,
  PROSE_WIDTH_BODY,
  PROSE_WIDTH_CARD,
  PROSE_WIDTH_HERO,
} from "./tokens";

/* ------------------------------------------------------------------------ */
/* Shared small pieces                                                      */
/* ------------------------------------------------------------------------ */

function SectionHeader({ eyebrow, folio }: { eyebrow: string; folio: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className={`${EYEBROW} ${ACCENT_TEXT}`}>{eyebrow}</p>
      <p className={FOLIO} style={{ color: "#A1A1AA" }} aria-hidden="true">
        {folio}
      </p>
    </div>
  );
}

interface BadgeRowProps {
  matchPct: number;
  grade: string;
  verified: boolean;
  discount: number;
}

function BadgeRow({ matchPct, grade, verified, discount }: BadgeRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold"
        style={{ backgroundColor: ACCENT_HEX, color: DARK_INK }}
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {matchPct}% match
      </span>
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ color: INK, backgroundColor: PANEL, border: `1px solid ${PANEL_BORDER}` }}
      >
        Grade {grade}
      </span>
      {verified ? (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{ color: ACCENT_HEX, backgroundColor: PANEL, border: `1px solid ${PANEL_BORDER}` }}
        >
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified seller
        </span>
      ) : null}
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ color: INK, backgroundColor: PANEL, border: `1px solid ${PANEL_BORDER}` }}
      >
        <Percent className="h-3 w-3" aria-hidden="true" />
        {discount}% off
      </span>
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  /** Hero variant only: overrides listing.askPrice so the card restates the live ask handle. */
  liveAsk?: number;
  titleAs?: "h3" | "p";
}

function ListingCard({ listing, liveAsk, titleAs = "h3" }: ListingCardProps) {
  const askPrice = liveAsk ?? listing.askPrice;
  const discount = discountPct(listing.originalPrice, askPrice);
  const titleClassName = "min-w-0 flex-1 truncate text-[15px] font-extrabold";

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl" style={{ border: `1px solid ${PANEL_BORDER}`, backgroundColor: PANEL }}>
      <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: "#1F1F26" }}>
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
          <span className="flex min-w-0 items-center gap-1.5">
            <listing.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT_HEX }} aria-hidden="true" />
            {titleAs === "h3" ? (
              <h3 className={titleClassName} style={{ color: INK }}>
                {listing.title}
              </h3>
            ) : (
              <p className={titleClassName} style={{ color: INK }}>
                {listing.title}
              </p>
            )}
          </span>
          {liveAsk !== undefined ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold" style={{ color: ACCENT_HEX }}>
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Live ask
            </span>
          ) : null}
        </div>
        <p className="text-sm">
          <span className="font-extrabold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
            {formatUsd(askPrice)}
          </span>{" "}
          <span className={`font-normal line-through ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatUsd(listing.originalPrice)}
          </span>
        </p>
        <BadgeRow matchPct={listing.matchPct} grade={listing.grade} verified={listing.verified} discount={discount} />
        <ul className="space-y-1 pt-1">
          {listing.reasonTags.map((tag) => (
            <li key={tag} className={`flex items-start gap-1.5 text-[11px] ${MUTED}`}>
              <Sparkles className="mt-0.5 h-3 w-3 shrink-0" style={{ color: ACCENT_HEX }} aria-hidden="true" />
              <span>{tag}</span>
            </li>
          ))}
        </ul>
        <details className="group pt-1">
          <summary className={`inline-flex w-fit cursor-pointer list-none items-center gap-1 rounded px-1 py-1.5 text-[11px] font-semibold ${ACCENT_TEXT} ${FOCUS_RING}`}>
            Condition detail
            <ChevronDown className="h-3 w-3 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className={`mt-1.5 text-[11px] leading-[1.5] ${MUTED}`}>{listing.conditionNote}</p>
        </details>
      </div>
    </div>
  );
}

interface SellerCardProps {
  label: string;
  tagText: string;
  result: Negotiation;
  isLive: boolean;
  onTry: () => void;
}

function SellerCard({ label, tagText, result, isLive, onTry }: SellerCardProps) {
  return (
    <div
      className="flex min-w-0 flex-col gap-3 rounded-2xl p-5"
      style={{ border: `1px solid ${isLive ? ACCENT_HEX : PANEL_BORDER}`, backgroundColor: PANEL }}
    >
      <h3 className="text-[14px] font-extrabold" style={{ color: INK }}>
        {label}
      </h3>
      <p className={`text-[11px] ${MUTED}`}>{tagText}</p>

      <div className="flex items-baseline gap-1">
        <span className="font-extrabold" style={{ fontSize: "1.9rem", color: INK, fontVariantNumeric: "tabular-nums" }}>
          {formatUsd(result.gap)}
        </span>
        <span className={`text-sm font-semibold ${MUTED}`}>gap</span>
      </div>
      <p className="text-[13px] font-semibold" style={{ color: ACCENT_HEX }}>
        {outcomeLabel(result.outcome)}
      </p>
      <p className={`text-[12px] leading-[1.5] ${MUTED}`}>{outcomeSummary(result)}</p>

      <button
        type="button"
        onClick={onTry}
        className={`mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold ${FOCUS_RING}`}
        style={{ color: ACCENT_HEX, backgroundColor: BG, border: `1px solid ${PANEL_BORDER}` }}
      >
        Try this seller
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */
export default function Client() {
  const [offer, setOffer] = useState<number>(DEFAULT_OFFER);
  const [ask, setAsk] = useState<number>(DEFAULT_ASK);

  const result = computeNegotiation(offer, ask);

  const handleChange = (id: HandleId, value: number) => {
    const clamped = clampPrice(value);
    if (id === "offer") setOffer(clamped);
    else setAsk(clamped);
  };

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-extrabold ${FOCUS_RING}`}
        style={{ backgroundColor: ACCENT_HEX, color: DARK_INK }}
      >
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1} style={{ backgroundColor: BG, color: INK }}>
        {/* ------------------------------------------------------------- HERO (device + proof live inside) */}
      <section className="px-4 pb-14 pt-8 sm:px-6 sm:pt-20 lg:px-10 lg:pb-20 lg:pt-24" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-[1280px]">
          <SectionHeader eyebrow="Meetpoint · negotiate on every listing" folio="01 / 05" />

          <div className="mt-5 grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10">
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-7 lg:gap-6">
              <h1
                id="hero-heading"
                className="font-extrabold"
                style={{ letterSpacing: "-0.02em", lineHeight: 1.04, fontSize: "clamp(2rem, 4.8vw + 0.6rem, 3.9rem)", color: INK }}
              >
                Know your gap before you send an offer.
              </h1>
              <p className={`${PROSE_WIDTH_HERO} text-[18px] font-normal leading-[1.6]`} style={{ color: COPY_HEX }}>
                Drag your offer and your best guess at the seller&apos;s floor onto the same scale.
                Meetpoint turns the distance between them into a straight answer — send it, or move
                a handle first.
              </p>
              <div>
                <a
                  href="#send-offer"
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
                  style={{ backgroundColor: ACCENT_HEX, color: DARK_INK }}
                >
                  Start negotiating
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-3xl p-5 sm:p-6" style={{ border: `1px solid ${PANEL_BORDER}`, backgroundColor: PANEL }}>
                <p className={CAPTION} style={{ color: "#A1A1AA" }}>
                  Fig. 01 — live, updates as you drag
                </p>
                <div className="mt-3">
                  <Negotiator offer={offer} ask={ask} result={result} onChange={handleChange} />
                </div>

                <div className="mt-5 border-t pt-5" style={{ borderColor: PANEL_BORDER }}>
                  <p className={CAPTION} style={{ color: "#A1A1AA" }}>
                    The listing you&apos;re negotiating
                  </p>
                  <div className="mt-3">
                    <ListingCard listing={HERO_LISTING} liveAsk={ask} titleAs="p" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- PRODUCT PREVIEW */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: PANEL }} aria-labelledby="preview-heading">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeader eyebrow="Every listing, graded the same way" folio="02 / 05" />
            <h2
              id="preview-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.7rem, 2.6vw + 0.8rem, 2.6rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: INK }}
            >
              Match score, condition grade, and seller verification — before you ever type an offer.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] leading-[1.6]`} style={{ color: COPY_HEX }}>
              Four listings across four categories. The comp reasoning behind each tag is the same
              model that estimates the seller&apos;s floor in the negotiator above.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {LISTINGS.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------- VALUE, THREE WAYS */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="value-heading">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeader eyebrow="Same offer, three sellers" folio="03 / 05" />
            <h2
              id="value-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.7rem, 2.6vw + 0.8rem, 2.6rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: INK }}
            >
              The same {formatUsd(DEFAULT_OFFER)} offer lands differently depending on the seller.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] leading-[1.6]`} style={{ color: COPY_HEX }}>
              Your offer doesn&apos;t move — only where you think their floor sits does. Try a
              seller below and watch the hero negotiator above pick up the same two numbers.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {SELLER_PRESETS.map((preset) => {
                const presetResult = computeNegotiation(preset.offer, preset.ask);
                const isLive = offer === preset.offer && ask === preset.ask;
                return (
                  <SellerCard
                    key={preset.id}
                    label={preset.label}
                    tagText={preset.tagText}
                    result={presetResult}
                    isLive={isLive}
                    onTry={() => {
                      setOffer(preset.offer);
                      setAsk(preset.ask);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------- SOCIAL PROOF */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: PANEL }} aria-labelledby="proof-heading">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeader eyebrow="Buyers who stopped guessing" folio="04 / 05" />
            <h2
              id="proof-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.7rem, 2.6vw + 0.8rem, 2.6rem)", lineHeight: 1.08, letterSpacing: "-0.02em", color: INK }}
            >
              Tens of thousands of offers sent with the gap already known.
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {STAT_CHIPS.map((stat, i) => {
                const Icon = i === 0 ? Users : i === 1 ? Gauge : Star;
                return (
                  <div
                    key={stat.id}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{ border: `1px solid ${PANEL_BORDER}`, backgroundColor: BG }}
                  >
                    <Icon className="h-4 w-4" style={{ color: ACCENT_HEX }} aria-hidden="true" />
                    <span className="text-[13px] font-extrabold" style={{ color: INK, fontVariantNumeric: "tabular-nums" }}>
                      {stat.value}
                    </span>
                    <span className={`text-[13px] ${MUTED}`}>{stat.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex min-w-0 flex-col gap-4 rounded-2xl p-5"
                  style={{ border: `1px solid ${PANEL_BORDER}`, backgroundColor: BG }}
                >
                  <Quote className="h-5 w-5" style={{ color: ACCENT_HEX }} aria-hidden="true" />
                  <blockquote className={`${PROSE_WIDTH_CARD} text-[14px] leading-[1.6]`} style={{ color: COPY_HEX }}>
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
                      style={{ backgroundColor: PANEL, color: ACCENT_HEX, border: `1px solid ${PANEL_BORDER}` }}
                      aria-hidden="true"
                    >
                      {testimonial.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-extrabold" style={{ color: INK }}>
                        {testimonial.name}
                      </span>
                      <span className={`block truncate text-[12px] ${MUTED}`}>{testimonial.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------- CLOSING CTA (cites the live gap) */}
      <Reveal>
        <section
          id="send-offer"
          className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
          style={{ backgroundColor: BG, borderTop: `1px solid ${PANEL_BORDER}` }}
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-[860px]">
            <SectionHeader eyebrow="Ready when your gap is" folio="05 / 05" />
            <div className="mt-6 flex flex-col items-start gap-6">
              <h2
                id="cta-heading"
                className="font-extrabold"
                style={{ lineHeight: 1.05, fontSize: "clamp(2rem, 3.6vw + 0.8rem, 3.2rem)", letterSpacing: "-0.02em", color: INK }}
              >
                {outcomeSummary(result)}
              </h2>
              <p className={`${PROSE_WIDTH_BODY} text-[16px] leading-[1.6]`} style={{ color: COPY_HEX }}>
                At {formatUsd(offer)} against a {formatUsd(ask)} floor, Meetpoint calls this{" "}
                <span className="font-extrabold" style={{ color: ACCENT_HEX }}>
                  {outcomeLabel(result.outcome).toLowerCase()}
                </span>
                . Move a handle in the negotiator above and this sentence — and the headline above
                it — updates immediately.
              </p>
              <a
                href="#hero-heading"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT_HEX, color: DARK_INK }}
              >
                Adjust and send this offer
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <p className={`text-[12px] ${MUTED}`}>No fee to send an offer. Only pay when a seller accepts.</p>
            </div>
          </div>
        </section>
      </Reveal>
      </main>
    </>
  );
}
