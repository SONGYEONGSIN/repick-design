"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  BadgeCheck,
  CircleDollarSign,
  Gauge,
  Layers,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  ACCESSORIES,
  CATEGORIES,
  CONDITIONS,
  DEFAULT_ACCESSORIES,
  DEFAULT_CATEGORY,
  DEFAULT_CONDITION,
  DEFAULT_PAYOUT,
  DEFAULT_PHOTOS,
  MATCHED_LISTINGS,
  PHOTOS,
  type AccessoriesId,
  type CategoryId,
  type ConditionId,
  type PayoutId,
  type PhotosId,
} from "./data";
import { appraise, formatUsd } from "./model";
import { Reveal } from "./Reveal";
import {
  ACCENT_FILL,
  ACCENT_TEXT_LARGE,
  ACCENT_TEXT_SMALL,
  EYEBROW,
  FOCUS_RING,
  MUTED_TEXT,
  ON_ACCENT_FILL_TEXT,
  PROSE_WIDTH,
  SURFACE,
} from "./tokens";

type PillGroupProps<T extends string> = {
  legend: string;
  name: string;
  options: { id: T; label: string; hint?: string }[];
  value: T;
  onChange: (next: T) => void;
};

function PillGroup<T extends string>({ legend, name, options, value, onChange }: PillGroupProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className={`${EYEBROW} ${MUTED_TEXT} mb-2`}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = opt.id === value;
          return (
            <label key={opt.id} className="relative min-w-0">
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={checked}
                onChange={() => onChange(opt.id)}
                className={`peer sr-only`}
              />
              <span
                className={`block cursor-pointer select-none rounded-full border px-3.5 py-2 text-[13px] font-semibold leading-tight transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#BE123C] ${
                  checked
                    ? `${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} border-transparent`
                    : `bg-white text-[#0B0B0F] border-[#E4E4E7] hover:border-[#BE123C]`
                }`}
              >
                {opt.label}
              </span>
              {opt.hint ? <span className="sr-only">{` (${opt.hint})`}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Client() {
  const payoutLabelId = useId();

  const [category, setCategory] = useState<CategoryId>(DEFAULT_CATEGORY);
  const [condition, setCondition] = useState<ConditionId>(DEFAULT_CONDITION);
  const [accessories, setAccessories] = useState<AccessoriesId>(DEFAULT_ACCESSORIES);
  const [photos, setPhotos] = useState<PhotosId>(DEFAULT_PHOTOS);
  const [payout, setPayout] = useState<PayoutId>(DEFAULT_PAYOUT);

  const result = appraise(category, condition, accessories, photos, payout);
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="bg-white text-[#0B0B0F]">
      {/* ---------------------------------------------------------------- HERO + live estimate */}
      <section className="px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="hero-heading">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Headline + questions -- asymmetric left column */}
          <div className="flex min-w-0 flex-col gap-7 lg:col-span-7">
            <p className={`${EYEBROW} ${MUTED_TEXT}`}>repick · instant appraisal</p>
            <h1
              id="hero-heading"
              className="text-[clamp(2.25rem,4.4vw+1rem,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0B0B0F]"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Answer four questions. Get a <span className={ACCENT_TEXT_LARGE}>real price</span>, not a guess.
            </h1>
            <p className={`${PROSE_WIDTH} text-[17px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
              repick&apos;s AI prices your item against thousands of comparable resale sales --
              and recomputes the moment you change an answer below.
            </p>

            <div className="grid grid-cols-1 gap-6 rounded-2xl border p-5" style={{ borderColor: "#E4E4E7" }}>
              <PillGroup
                legend="What are you selling?"
                name="category"
                value={category}
                onChange={setCategory}
                options={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
              />
              <PillGroup
                legend="Condition"
                name="condition"
                value={condition}
                onChange={setCondition}
                options={CONDITIONS.map((c) => ({ id: c.id, label: c.label, hint: c.hint }))}
              />
              <PillGroup
                legend="Accessories"
                name="accessories"
                value={accessories}
                onChange={setAccessories}
                options={ACCESSORIES.map((a) => ({ id: a.id, label: a.label }))}
              />
              <PillGroup
                legend="Photo quality"
                name="photos"
                value={photos}
                onChange={setPhotos}
                options={PHOTOS.map((p) => ({ id: p.id, label: p.label }))}
              />
            </div>
          </div>

          {/* Live estimate card -- inside the HERO component itself, not a separate section below
              the fold (this catalog's own L2 rule: the proof must be reachable without scrolling). */}
          <div className="min-w-0 lg:col-span-5">
            <div
              className="sticky top-24 rounded-2xl border p-6 shadow-sm"
              style={{ borderColor: "#E4E4E7", backgroundColor: SURFACE }}
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`${EYEBROW} ${MUTED_TEXT}`}>Your estimate</p>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0B0B0F]">
                  <Sparkles className={`h-3.5 w-3.5 ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                  {result.categoryLabel}
                </span>
              </div>

              <p
                className="mt-3 text-[clamp(2.4rem,4vw+1rem,3.1rem)] font-extrabold tabular-nums leading-none tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                {formatUsd(result.low)}
                <span className={`${MUTED_TEXT} mx-1 text-[1.5rem] font-normal`}>&ndash;</span>
                {formatUsd(result.high)}
              </p>
              <p id={payoutLabelId} className={`mt-1 text-[13px] font-normal ${MUTED_TEXT}`}>
                {payout === "cash" ? "Cash offer range, same-week payout" : "Trade-credit range, use toward your next buy"}
              </p>

              {/* Cash / credit toggle -- transforms the SAME center value, not a second dataset. */}
              <div className="mt-4" role="group" aria-labelledby={payoutLabelId}>
                <div className="inline-flex rounded-full border p-1" style={{ borderColor: "#E4E4E7" }}>
                  {(["cash", "credit"] as PayoutId[]).map((id) => {
                    const checked = id === payout;
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={checked}
                        onClick={() => setPayout(id)}
                        className={`${FOCUS_RING} rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                          checked ? `${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}` : "text-[#0B0B0F]"
                        }`}
                      >
                        {id === "cash" ? "Cash offer" : "Trade credit (+5% boost)"}
                      </button>
                    );
                  })}
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-4 border-t pt-4" style={{ borderColor: "#E4E4E7" }}>
                <div>
                  <dt className={`${STAT_LABEL_CLASS} ${MUTED_TEXT} flex items-center gap-1.5`}>
                    <Gauge className="h-3.5 w-3.5" aria-hidden="true" /> Confidence
                  </dt>
                  <dd className="mt-1 text-[20px] font-extrabold tabular-nums">{result.confidence}%</dd>
                </div>
                <div>
                  <dt className={`${STAT_LABEL_CLASS} ${MUTED_TEXT} flex items-center gap-1.5`}>
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" /> Comparable sales
                  </dt>
                  <dd className="mt-1 text-[20px] font-extrabold tabular-nums">{result.comparableCount}</dd>
                </div>
              </dl>

              <div
                className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "#E4E4E7" }}
                role="img"
                aria-label={`Confidence ${result.confidence} percent`}
              >
                <div className={`h-full ${ACCENT_FILL}`} style={{ width: `${result.confidence}%` }} />
              </div>

              <ul className="mt-5 flex flex-col gap-2">
                <li className="flex items-start gap-2 text-[13px] font-normal leading-[1.5]">
                  <Tag className={`mt-0.5 h-3.5 w-3.5 flex-none ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                  <span>{result.tagA}</span>
                </li>
                <li className="flex items-start gap-2 text-[13px] font-normal leading-[1.5]">
                  <Tag className={`mt-0.5 h-3.5 w-3.5 flex-none ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                  <span>{result.tagB}</span>
                </li>
              </ul>

              <a
                href="#start-listing"
                className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-6 flex w-full items-center justify-center rounded-full px-5 py-3 text-[14px] font-semibold`}
              >
                List it at this price
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- PRODUCT PREVIEW */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="matches-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <p className={`${EYEBROW} ${MUTED_TEXT}`}>Recently matched &amp; sold</p>
            <h2
              id="matches-heading"
              className="mt-2 text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              The same engine, working on real listings
            </h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MATCHED_LISTINGS.map((listing, i) => (
              <Reveal key={listing.id} delay={i * 0.08} className="min-w-0">
                <article className="flex h-full min-w-0 flex-col rounded-2xl border" style={{ borderColor: "#E4E4E7" }}>
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl"
                    style={{ backgroundColor: SURFACE }}
                  >
                    <Image
                      src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=800&q=70`}
                      alt={listing.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Badges in their own row, never overlaid on the photo -- a broken/alt-text
                      image must never collide with a match/grade/discount badge. */}
                  <div className="flex flex-wrap items-center gap-2 px-4 pt-3 text-[11px] font-semibold">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}`}>
                      <Sparkles className="h-3 w-3" aria-hidden="true" /> {listing.matchPct}% match
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E4E4E7" }}>
                      {listing.grade}
                    </span>
                    {listing.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E4E4E7" }}>
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Verified seller
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E4E4E7" }}>
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" /> {listing.discountPct}% off retail
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-1 px-4 pb-2 pt-3">
                    <h3 className="text-[15px] font-semibold leading-snug">{listing.title}</h3>
                    <p className={`text-[12px] font-normal ${MUTED_TEXT}`}>{listing.category}</p>
                    <p className="mt-1 text-[14px] font-normal tabular-nums">
                      <span className={`${MUTED_TEXT} line-through`}>{formatUsd(listing.retailPrice)}</span>{" "}
                      <span className="font-semibold">{formatUsd(listing.soldPrice)}</span>
                    </p>
                  </div>

                  <details className="group border-t px-4 py-3" style={{ borderColor: "#E4E4E7" }}>
                    <summary
                      className={`${FOCUS_RING} cursor-pointer list-none rounded text-[12px] font-semibold ${ACCENT_TEXT_SMALL}`}
                    >
                      Why repick matched this
                    </summary>
                    <p className={`mt-2 text-[13px] font-normal leading-[1.5] ${MUTED_TEXT}`}>{listing.reason}</p>
                  </details>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- VALUE TRIPTYCH */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" style={{ backgroundColor: SURFACE }} aria-labelledby="why-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2
              id="why-heading"
              className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Why the number above moves when you answer
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "Real comps, not a guess",
                body: "Every price band is built from recent sales of the same item, not a markdown formula.",
              },
              {
                icon: Gauge,
                title: "Condition sets the ceiling",
                body: "Like-new items clear closer to retail; heavy wear caps the band -- the slider above moves it directly.",
              },
              {
                icon: CircleDollarSign,
                title: "Photos change buyer trust",
                body: "Dim or blurry photos lower both the price band and our confidence in it, because buyers hesitate too.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className={`${PROSE_WIDTH} min-w-0 lg:max-w-none`}>
                <div className="flex min-w-0 flex-col gap-3 rounded-2xl border bg-white p-5" style={{ borderColor: "#E4E4E7" }}>
                  <item.icon className={`h-5 w-5 ${ACCENT_TEXT_SMALL}`} aria-hidden="true" />
                  <h3 className="text-[16px] font-semibold">{item.title}</h3>
                  <p className={`text-[14px] font-normal leading-[1.6] ${MUTED_TEXT}`}>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- SOCIAL PROOF */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="proof-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="proof-heading" className="sr-only">
              Seller results
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { stat: "12,400+", label: "items appraised this month" },
                { stat: "4.8 / 5", label: "average seller rating" },
                { stat: "68%", label: "list within an hour of their estimate" },
              ].map((row) => (
                <div key={row.label} className="rounded-2xl border p-5 text-center" style={{ borderColor: "#E4E4E7" }}>
                  <p className="text-[28px] font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display-grotesk)" }}>
                    {row.stat}
                  </p>
                  <p className={`mt-1 text-[13px] font-normal ${MUTED_TEXT}`}>{row.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { quote: "The estimate matched what it actually sold for within four dollars.", name: "Priya N." },
              { quote: "I changed the condition answer and watched the price drop in real time -- no surprise later.", name: "Marcus T." },
              { quote: "Trade credit option got me a better rate on my next buy than cashing out would have.", name: "Danielle O." },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border p-5" style={{ borderColor: "#E4E4E7" }}>
                <blockquote className={`${PROSE_WIDTH} text-[14px] font-normal leading-[1.6]`}>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className={`mt-3 text-[12px] font-semibold ${MUTED_TEXT}`}>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CLOSING CTA -- echoes the SAME live state */}
      <section id="start-listing" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="cta-heading">
        <motion.div
          className={`mx-auto flex max-w-[1320px] flex-col items-start gap-5 rounded-2xl border p-8 sm:p-12`}
          style={{ borderColor: "#E4E4E7", backgroundColor: SURFACE }}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="cta-heading"
            className="text-[clamp(1.6rem,2.6vw+1rem,2.6rem)] font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Your {result.categoryLabel.toLowerCase()} estimate is{" "}
            <span className={ACCENT_TEXT_LARGE}>
              {formatUsd(result.low)}&ndash;{formatUsd(result.high)}
            </span>
          </h2>
          <p className={`${PROSE_WIDTH} text-[15px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
            {result.confidence}% confidence from {result.comparableCount} comparable sales. List now and we&apos;ll hold this
            price band for 48 hours.
          </p>
          <a
            href="#hero-heading"
            className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold`}
          >
            Start your free listing
          </a>
        </motion.div>
      </section>
    </main>
  );
}

const STAT_LABEL_CLASS = "text-[11px] font-semibold uppercase tracking-[0.12em]";
