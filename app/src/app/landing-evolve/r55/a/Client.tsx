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
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Hero } from "./Hero";
import { Reveal } from "./Reveal";
import { HERO_ITEM, LISTINGS, STAT_CHIPS, TESTIMONIALS, type Listing } from "./data";
import { clampStep, discountPercent, estimatedPrice, formatUsd, gradeAt, GRADES } from "./model";
import {
  ACCENT_LARGE_HEX,
  ACCENT_TEXT_SMALL,
  EYEBROW,
  FG,
  FG_SOFT,
  FOCUS_RING,
  MUTED,
  ON_ACCENT_FILL_TEXT,
  PROSE_WIDTH_BODY,
  PROSE_WIDTH_CARD,
  SURFACE,
  SURFACE_BORDER,
  SURFACE_TINT,
} from "./tokens";

/* ------------------------------------------------------------------------ */
/* Shared small pieces                                                      */
/* ------------------------------------------------------------------------ */

interface ListingBadgeRowProps {
  gradeName: string;
  verified: boolean;
  discountPct: number;
}

function ListingBadgeRow({ gradeName, verified, discountPct }: ListingBadgeRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ backgroundColor: ACCENT_LARGE_HEX }}
      >
        <span className={ON_ACCENT_FILL_TEXT}>Grade: {gradeName}</span>
      </span>
      {verified ? (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ACCENT_TEXT_SMALL}`}
          style={{ border: `1px solid ${SURFACE_BORDER}` }}
        >
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Verified seller
        </span>
      ) : null}
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{ color: FG, border: `1px solid ${SURFACE_BORDER}`, fontVariantNumeric: "tabular-nums" }}
      >
        <Percent className="h-3 w-3" aria-hidden="true" />
        {discountPct}% off
      </span>
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const grade = gradeAt(listing.step);
  const price = estimatedPrice(listing.basePrice, listing.step);
  const discount = discountPercent(listing.basePrice, listing.step);

  return (
    <div
      className="flex min-w-0 flex-col overflow-hidden rounded-2xl"
      style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: SURFACE }}
    >
      <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: SURFACE_TINT }}>
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=640&q=80`}
          alt={listing.alt}
          fill
          sizes="(max-width: 768px) 90vw, 300px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-2 p-4">
        <h3 className="truncate text-[15px] font-extrabold" style={{ color: FG }}>
          {listing.title}
        </h3>
        <p className="text-sm">
          <span className="font-extrabold" style={{ color: FG, fontVariantNumeric: "tabular-nums" }}>
            {formatUsd(price)}
          </span>{" "}
          <span className={`font-normal line-through ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatUsd(listing.basePrice)}
          </span>
        </p>
        <ListingBadgeRow gradeName={grade.name} verified={listing.verified} discountPct={discount} />
        <ul className="space-y-1 pt-1">
          {listing.reasonTags.map((tag) => (
            <li key={tag} className={`flex items-start gap-1.5 text-[11px] font-normal ${MUTED}`}>
              <Sparkles className={`mt-0.5 h-3 w-3 shrink-0 ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
              <span>{tag}</span>
            </li>
          ))}
        </ul>
        <details className="group pt-1">
          <summary
            className={`inline-flex w-fit cursor-pointer list-none items-center gap-1 rounded px-1 py-1.5 text-[11px] font-semibold ${ACCENT_TEXT_SMALL} ${FOCUS_RING}`}
          >
            Condition detail
            <ChevronDown className="h-3 w-3 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className={`mt-1.5 text-[11px] font-normal leading-[1.6] ${MUTED}`}>{grade.buyerNote}</p>
        </details>
      </div>
    </div>
  );
}

interface ValueCardProps {
  label: string;
  Icon: LucideIcon;
  children: React.ReactNode;
}

function ValueCard({ label, Icon, children }: ValueCardProps) {
  return (
    <div
      className="flex min-w-0 flex-col gap-3 rounded-2xl p-5"
      style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: SURFACE }}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
        <h3 className="text-[14px] font-extrabold" style={{ color: FG }}>
          {label}
        </h3>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Page                                                                      */
/* ------------------------------------------------------------------------ */

export default function Client() {
  // The ONE piece of state the whole page cares about: an index into GRADES. Every number and
  // sentence tied to the hero item — in the hero card, the value section below, and the closing
  // CTA's headline — is re-derived from this same index through model.ts's pure functions on
  // every render. Nothing downstream holds its own copy.
  const [step, setStep] = useState(0);
  const currentStep = clampStep(step);

  const grade = gradeAt(currentStep);
  const price = estimatedPrice(HERO_ITEM.basePrice, currentStep);
  const discount = discountPercent(HERO_ITEM.basePrice, currentStep);

  const goPrev = () => setStep((s) => clampStep(s - 1));
  const goNext = () => setStep((s) => clampStep(s + 1));

  return (
    <div style={{ backgroundColor: "#0B0B0F", color: FG }}>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:px-4 focus:py-2 focus:text-sm focus:font-semibold ${FOCUS_RING}`}
        style={{ backgroundColor: ACCENT_LARGE_HEX, color: FG }}
      >
        Skip to content
      </a>

      <header className="px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
          <span className="text-[15px] font-extrabold" style={{ color: FG }}>
            Regrade
          </span>
          <a
            href="#start-selling"
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-semibold ${ACCENT_TEXT_SMALL} ${FOCUS_RING}`}
            style={{ border: `1px solid ${SURFACE_BORDER}` }}
          >
            Start selling
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* ------------------------------------------------------------------ HERO (device + product + proof live inside) */}
        <Hero step={currentStep} onPrev={goPrev} onNext={goNext} />

      {/* ------------------------------------------------------------------ PRODUCT PREVIEW */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="preview-heading">
          <div className="mx-auto max-w-[1280px]">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Every listing, graded the same way</p>
            <h2
              id="preview-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.6rem, 2.4vw + 0.8rem, 2.5rem)", lineHeight: 1.08, color: FG }}
            >
              Match reasons, condition grade, and seller verification — before you ever ask.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] font-normal leading-[1.6]`} style={{ color: FG_SOFT }}>
              Four listings across four categories, each already graded, priced off the same
              formula as the walkthrough above, and matched to a reason you can check yourself.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {LISTINGS.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------------ VALUE, THREE WAYS (recap of the hero's live state) */}
      <Reveal>
        <section
          className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20"
          style={{ backgroundColor: SURFACE_TINT }}
          aria-labelledby="value-heading"
        >
          <div className="mx-auto max-w-[1280px]">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>One grade, three ways to see it</p>
            <h2
              id="value-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.6rem, 2.4vw + 0.8rem, 2.5rem)", lineHeight: 1.08, color: FG }}
            >
              Step the grade in the hero above — every card here moves with it.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} mt-4 text-[16px] font-normal leading-[1.6]`} style={{ color: FG_SOFT }}>
              This is the same condition index, read three different ways: what the badge says,
              what it&apos;s worth, and what it means for the person buying it.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <ValueCard label="The badge" Icon={ShieldCheck}>
                <p className={`text-[11px] ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                  Step {currentStep + 1} of {GRADES.length}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold" style={{ fontSize: "1.8rem", color: FG }}>
                    {grade.name}
                  </span>
                </div>
                <ol className="flex items-center gap-1.5" aria-hidden="true">
                  {GRADES.map((g, i) => (
                    <li key={g.id} className="flex items-center gap-1.5">
                      <span
                        className="block h-1.5 w-6 rounded-full"
                        style={{ backgroundColor: i <= currentStep ? ACCENT_LARGE_HEX : SURFACE_BORDER }}
                      />
                    </li>
                  ))}
                </ol>
                <a
                  href="#hero-heading"
                  className={`mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold ${ACCENT_TEXT_SMALL} ${FOCUS_RING}`}
                  style={{ border: `1px solid ${SURFACE_BORDER}` }}
                >
                  Adjust the grade above
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </ValueCard>

              <ValueCard label="The price" Icon={Wallet}>
                <p className={`text-[11px] ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatUsd(HERO_ITEM.basePrice)} original retail
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-extrabold"
                    style={{ fontSize: "1.8rem", color: FG, fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatUsd(price)}
                  </span>
                  <span className={`text-sm font-semibold ${MUTED}`}>estimated</span>
                </div>
                <p className={`text-[12px] font-normal ${MUTED}`} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatUsd(HERO_ITEM.basePrice)} × {Math.round(grade.multiplier * 100)}% condition value, rounded —
                  {" "}
                  {discount}% off original.
                </p>
              </ValueCard>

              <ValueCard label="For the buyer" Icon={Sparkles}>
                <p className={`text-[13px] font-normal leading-[1.6] ${FG_SOFT}`}>{grade.buyerNote}</p>
              </ValueCard>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------------ SOCIAL PROOF */}
      <Reveal>
        <section className="px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-[1280px]">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Buyers and sellers who trust the grade</p>
            <h2
              id="proof-heading"
              className="mt-3 font-extrabold"
              style={{ fontSize: "clamp(1.6rem, 2.4vw + 0.8rem, 2.5rem)", lineHeight: 1.08, color: FG }}
            >
              Thousands of trades, graded the same way every time.
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {STAT_CHIPS.map((stat, i) => {
                const Icon = i === 0 ? Users : i === 1 ? Star : Gauge;
                return (
                  <div
                    key={stat.id}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                    style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: SURFACE }}
                  >
                    <Icon className={`h-4 w-4 ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                    <span className="text-[13px] font-extrabold" style={{ color: FG, fontVariantNumeric: "tabular-nums" }}>
                      {stat.value}
                    </span>
                    <span className={`text-[13px] font-normal ${MUTED}`}>{stat.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {TESTIMONIALS.map((testimonial) => (
                <figure
                  key={testimonial.id}
                  className="flex min-w-0 flex-col gap-4 rounded-2xl p-5"
                  style={{ border: `1px solid ${SURFACE_BORDER}`, backgroundColor: SURFACE }}
                >
                  <Quote className={`h-5 w-5 ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                  <blockquote className={`${PROSE_WIDTH_CARD} text-[14px] font-normal leading-[1.6]`} style={{ color: FG_SOFT }}>
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${ACCENT_TEXT_SMALL}`}
                      style={{ backgroundColor: SURFACE_TINT, border: `1px solid ${SURFACE_BORDER}` }}
                      aria-hidden="true"
                    >
                      {testimonial.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-extrabold" style={{ color: FG }}>
                        {testimonial.name}
                      </span>
                      <span className={`block truncate text-[12px] font-normal ${MUTED}`}>{testimonial.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------------ CLOSING CTA (quotes the SAME live grade/price) */}
      <Reveal>
        <section
          id="start-selling"
          className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24"
          style={{ borderTop: `1px solid ${SURFACE_BORDER}` }}
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto flex max-w-[860px] flex-col items-start gap-6">
            <p className={`${EYEBROW} ${ACCENT_TEXT_SMALL}`}>Ready when your grade is</p>
            <h2
              id="cta-heading"
              className="font-extrabold"
              style={{ fontFamily: "var(--font-display-wide)", lineHeight: 1.05, fontSize: "clamp(1.9rem, 3.4vw + 0.8rem, 3.1rem)", color: FG }}
            >
              A {grade.name.toLowerCase()} {HERO_ITEM.title.toLowerCase()} lists around {formatUsd(price)}.
            </h2>
            <p className={`${PROSE_WIDTH_BODY} text-[16px] font-normal leading-[1.6]`} style={{ color: FG_SOFT }}>
              That is this grade&apos;s real resale estimate — {discount}% off the {formatUsd(HERO_ITEM.basePrice)}{" "}
              original retail price, computed the same way for every listing on Regrade. Step the
              grade above and this number, and the one in the hero, move together. List your own
              item and get a grade in two minutes.
            </p>
            <a
              href="#hero-heading"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-[0.98] ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT_LARGE_HEX }}
            >
              <span className={ON_ACCENT_FILL_TEXT}>List your first item</span>
              <ArrowRight className="h-4 w-4" style={{ color: FG }} aria-hidden="true" />
            </a>
            <p className={`text-[12px] font-normal ${MUTED}`}>No listing fee until it sells.</p>
          </div>
        </section>
      </Reveal>
      </main>
    </div>
  );
}
