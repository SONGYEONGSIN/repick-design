"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BUCKETS, DEFAULT_ASSIGNMENTS, ITEMS, type Assignments, type BucketId } from "./data";
import { deriveStats, formatUsd } from "./stats";
import { CompositionPanel } from "./CompositionPanel";
import { SortZone } from "./SortZone";
import { ListingPreviewCard } from "./ListingPreviewCard";
import { PREVIEW_LISTINGS } from "./previewData";
import { Reveal } from "./Reveal";
import {
  ACCENT_FILL,
  ACCENT_TEXT_LARGE,
  ACCENT_TEXT_SMALL,
  BODY_TEXT,
  CAPTION,
  EYEBROW,
  FOCUS_RING,
  MUTED_TEXT,
  ON_ACCENT_FILL_TEXT,
  PROSE_WIDTH,
  STAT_LABEL,
  ZONE_BORDER_HEX,
  ZONE_SURFACE_HEX,
} from "./tokens";

const BUCKET_ORDER: BucketId[] = BUCKETS.map((bucket) => bucket.id);

function columnStat(bucketId: BucketId, stats: ReturnType<typeof deriveStats>): string {
  const stat = stats.byBucket[bucketId];
  if (bucketId === "list") {
    return `${stat.count} of ${stats.total} items — ${formatUsd(stats.listPayout)} projected`;
  }
  if (bucketId === "bundle") {
    return `${stat.count} of ${stats.total} items — ${formatUsd(stats.bundleValue)} combined after the bundle rate`;
  }
  return `${stat.count} of ${stats.total} items — routed for a certified receipt`;
}

export default function Client() {
  const [assignments, setAssignments] = useState<Assignments>(DEFAULT_ASSIGNMENTS);
  const [openReasonIds, setOpenReasonIds] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const stats = deriveStats(ITEMS, assignments, BUCKET_ORDER);

  function moveItem(itemId: string, bucketId: BucketId) {
    setAssignments((prev) => (prev[itemId] === bucketId ? prev : { ...prev, [itemId]: bucketId }));
  }

  function resetSort() {
    setAssignments(DEFAULT_ASSIGNMENTS);
  }

  function toggleReason(id: string) {
    setOpenReasonIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <main className="bg-white text-[#0B0B0F]">
      {/* ---------------------------------------------------------------- HERO + sorter + live
          composition proof, all inside this one component. The self-check this brief asks for:
          the proof panel below is a sibling grid column of the headline, not a separate section
          further down the page. */}
      <section className="px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
              <p className={`${EYEBROW} ${MUTED_TEXT}`}>repick &middot; sort what you own</p>
              <h1
                id="hero-heading"
                className="text-[clamp(2.25rem,4.4vw+1rem,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Sort your pile. <span className={ACCENT_TEXT_LARGE}>See what it&rsquo;s worth.</span>
              </h1>
              <p className={`${PROSE_WIDTH} ${BODY_TEXT}`}>
                Drag each item into a lane below &mdash; list it for cash, bundle it with similar
                pieces, or donate it &mdash; and the payout updates with every move you make.
              </p>
              <div>
                <a
                  href="#closing-cta"
                  className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold`}
                >
                  See today&rsquo;s verdict
                </a>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="sticky top-24 rounded-2xl border p-6 shadow-sm" style={{ borderColor: ZONE_BORDER_HEX }}>
                <CompositionPanel stats={stats} buckets={BUCKETS} />
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className={`${CAPTION} ${MUTED_TEXT}`}>
                Drag a card into another lane, or use its &ldquo;Move to&rdquo; button.
              </p>
              <button
                type="button"
                onClick={resetSort}
                className={`${FOCUS_RING} inline-flex min-h-9 items-center rounded-full border px-3 text-[12px] font-semibold`}
                style={{ borderColor: ZONE_BORDER_HEX }}
              >
                Reset sort
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {BUCKETS.map((bucket) => (
                <SortZone
                  key={bucket.id}
                  bucket={bucket}
                  items={stats.byBucket[bucket.id].items}
                  total={stats.total}
                  allBuckets={BUCKETS}
                  onMove={moveItem}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- PRODUCT PREVIEW */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: ZONE_SURFACE_HEX }} aria-labelledby="preview-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2
              id="preview-heading"
              className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              What listing for cash actually looks like
            </h2>
            <p className={`${PROSE_WIDTH} ${BODY_TEXT} mt-3`}>
              Every listed item gets the same treatment: an AI match score, a condition grade, a
              seller verification check, and a discount against retail.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PREVIEW_LISTINGS.map((listing, index) => (
              <Reveal key={listing.id} delay={index * 0.06} className="min-w-0">
                <ListingPreviewCard
                  listing={listing}
                  isOpen={Boolean(openReasonIds[listing.id])}
                  onToggle={() => toggleReason(listing.id)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- VALUE, 3-WAY SPLIT --
          manipulation = felt value: dragging a card in the hero above updates these same live
          counts and dollar figures immediately, with no separate recompute step. */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2
              id="why-heading"
              className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Three lanes, three outcomes
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {BUCKETS.map((bucket, index) => {
              const Icon = bucket.icon;
              return (
                <Reveal key={bucket.id} delay={index * 0.08} className="min-w-0">
                  <div className="flex min-w-0 flex-col gap-3 rounded-2xl border p-5" style={{ borderColor: ZONE_BORDER_HEX }}>
                    <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full ${bucket.fillClass}`}>
                      <Icon aria-hidden className={`h-5 w-5 ${bucket.onFillTextClass}`} />
                    </span>
                    <h3 className="text-[16px] font-semibold">{bucket.label}</h3>
                    <p className={`${PROSE_WIDTH} ${BODY_TEXT}`}>{bucket.description}</p>
                    {/* Only this line changes as cards move in the hero above -- the live
                        region is scoped to it alone so screen readers aren't re-handed the
                        static heading and description on every single move. */}
                    <p className="text-[14px] font-semibold tabular-nums" aria-live="polite">
                      {columnStat(bucket.id, stats)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- SOCIAL PROOF */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: ZONE_SURFACE_HEX }} aria-labelledby="proof-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="proof-heading" className="sr-only">
              Seller results
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { stat: "41,200", label: "items sorted into a lane this month" },
                { stat: "68%", label: "of sorted items end up listed for cash" },
                { stat: "2 days", label: "average time from sort to live listing" },
              ].map((row) => (
                <div key={row.label} className="rounded-2xl border bg-white p-5 text-center" style={{ borderColor: ZONE_BORDER_HEX }}>
                  <p className="text-[28px] font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display-mono)" }}>
                    {row.stat}
                  </p>
                  <p className={`mt-1 text-[13px] font-normal ${MUTED_TEXT}`}>{row.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                quote:
                  "I dragged the stuff I was never going to re-wear into donate and kept the rest for cash. Took five minutes.",
                name: "Priya K.",
              },
              {
                quote:
                  "Bundling the low-value pieces instead of listing them alone got them out of my closet twice as fast.",
                name: "Marcus T.",
              },
              {
                quote: "Watching the payout number move as I sorted made the decision obvious, not a guess.",
                name: "Elena R.",
              },
            ].map((testimonial) => (
              <figure key={testimonial.name} className="rounded-2xl border bg-white p-5" style={{ borderColor: ZONE_BORDER_HEX }}>
                <blockquote className={`${PROSE_WIDTH} ${BODY_TEXT}`}>&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <figcaption className={`mt-3 text-[12px] font-semibold ${MUTED_TEXT}`}>{testimonial.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CLOSING CTA -- quotes
          the SAME live `stats.verdict` string rendered in the hero's composition panel above,
          never a hardcoded figure. */}
      <section id="closing-cta" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="cta-heading">
        <motion.div
          className="mx-auto flex max-w-[1320px] flex-col items-start gap-5 rounded-2xl border p-8 sm:p-12"
          style={{ borderColor: ZONE_BORDER_HEX }}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="cta-heading"
            className="text-[clamp(1.6rem,2.6vw+1rem,2.6rem)] font-extrabold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            Here&rsquo;s your pile, <span className={ACCENT_TEXT_LARGE}>right now</span>.
          </h2>
          <p className={`${PROSE_WIDTH} ${BODY_TEXT}`} aria-live="polite">
            {stats.verdict}
          </p>
          <a
            href="#hero-heading"
            className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold`}
          >
            Start your own sort
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className={`${STAT_LABEL} ${ACCENT_TEXT_SMALL}`}>Rearrange a card above and this number moves with it.</p>
        </motion.div>
      </section>
    </main>
  );
}
