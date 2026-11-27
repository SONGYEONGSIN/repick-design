"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { ACCENT_FILL, ACCENT_TINT_TEXT, CAPTION, FOCUS_RING, GHOST_TEXT, INK_CLASS, MUTED_TEXT, ON_ACCENT_TEXT, PROSE_WIDTH_14 } from "./tokens";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
  initials: string;
};

const BUYER_TESTIMONIALS: Testimonial[] = [
  {
    id: "b1",
    quote:
      "I scrubbed back to the week I actually bought my lens and the match percentage matched what I remembered seeing — nothing had been quietly re-scored after the fact.",
    name: "Priya N.",
    context: "Bought a Sony A7 III",
    initials: "PN",
  },
  {
    id: "b2",
    quote:
      "Dragging the playhead to a slow week showed fewer matches but the same average payout — that told me the drop was seasonal, not a quality problem.",
    name: "Marcus D.",
    context: "Bought a lens kit",
    initials: "MD",
  },
  {
    id: "b3",
    quote:
      "Every other resale page shows you one snapshot and asks you to trust it. Being able to scrub the last 12 weeks myself is what got me to actually check out.",
    name: "Elena R.",
    context: "Bought a verified camera body",
    initials: "ER",
  },
];

const SELLER_TESTIMONIALS: Testimonial[] = [
  {
    id: "s1",
    quote:
      "I dragged the playhead across a full quarter before listing, just to see when payouts peaked. Listed the same week the chart was climbing and did better than I expected.",
    name: "Daniel K.",
    context: "Sold a drone kit",
    initials: "DK",
  },
  {
    id: "s2",
    quote:
      "Watching items-sold move with the playhead made the slow weeks make sense — they weren't about my listing, the whole category dipped that week.",
    name: "Hana S.",
    context: "Sold a lens bundle",
    initials: "HS",
  },
  {
    id: "s3",
    quote:
      "The 12-week window never resets on you. I can scrub back to the exact week I listed and the numbers still match what I saw at the time.",
    name: "Owen T.",
    context: "Sold a camera backpack",
    initials: "OT",
  },
];

const STATS = [
  { value: "12", label: "weeks of fixed marketplace history on every playhead scrub" },
  { value: "1", label: "point in time selected at once — never a blended range" },
  { value: "48k+", label: "scrub sessions run across repick to date" },
];

/**
 * Social proof, plus this section's own interaction: a Buyers/Sellers tab toggle over the
 * testimonial set — distinct from the hero's playhead drag, and distinct from the carousel
 * pattern used elsewhere in this catalog (this never auto-advances; it only changes on a
 * deliberate click or keypress and stays on whichever tab was chosen).
 */
export function SocialProof() {
  const [tab, setTab] = useState<"buyers" | "sellers">("buyers");
  const buyersId = useId();
  const sellersId = useId();
  const buyersTabId = useId();
  const sellersTabId = useId();
  const active = tab === "buyers" ? BUYER_TESTIMONIALS : SELLER_TESTIMONIALS;
  const buyersBtnRef = useRef<HTMLButtonElement>(null);
  const sellersBtnRef = useRef<HTMLButtonElement>(null);

  // Standard ARIA tabs keyboard pattern: Left/Right/Home/End move AND activate the tab,
  // matching the native <input type="range"> above (arrow keys act immediately there too).
  function handleTablistKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next = e.key === "ArrowLeft" || e.key === "Home" ? "buyers" : "sellers";
    setTab(next);
    (next === "buyers" ? buyersBtnRef : sellersBtnRef).current?.focus();
  }

  return (
    <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="proof-heading">
      <Quote aria-hidden="true" className={`pointer-events-none absolute right-6 top-6 h-20 w-20 ${GHOST_TEXT}`} strokeWidth={1} />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={`${CAPTION} ${ACCENT_TINT_TEXT}`}>Trusted by buyers and sellers</p>
            <h2
              id="proof-heading"
              className={`mt-2 text-[clamp(1.6rem,6vw,1.9rem)] lg:text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] ${INK_CLASS}`}
            >
              People who scrubbed before they committed.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Show testimonials from"
            onKeyDown={handleTablistKeyDown}
            className="flex shrink-0 gap-1.5 rounded-full border border-white/10 bg-white/[0.03] p-1"
          >
            <button
              ref={buyersBtnRef}
              type="button"
              role="tab"
              id={buyersTabId}
              aria-selected={tab === "buyers"}
              aria-controls={buyersId}
              tabIndex={tab === "buyers" ? 0 : -1}
              onClick={() => setTab("buyers")}
              className={`min-h-7 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${FOCUS_RING} ${
                tab === "buyers" ? `${ACCENT_FILL} ${ON_ACCENT_TEXT}` : `${MUTED_TEXT} hover:text-white`
              }`}
            >
              Buyers
            </button>
            <button
              ref={sellersBtnRef}
              type="button"
              role="tab"
              id={sellersTabId}
              aria-selected={tab === "sellers"}
              aria-controls={sellersId}
              tabIndex={tab === "sellers" ? 0 : -1}
              onClick={() => setTab("sellers")}
              className={`min-h-7 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${FOCUS_RING} ${
                tab === "sellers" ? `${ACCENT_FILL} ${ON_ACCENT_TEXT}` : `${MUTED_TEXT} hover:text-white`
              }`}
            >
              Sellers
            </button>
          </div>
        </div>

        <div
          id={tab === "buyers" ? buyersId : sellersId}
          role="tabpanel"
          aria-labelledby={tab === "buyers" ? buyersTabId : sellersTabId}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {active.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06} className="min-w-0">
              <figure className="flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-1">
                  <span aria-hidden="true" className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
                    ))}
                  </span>
                  <span className="sr-only">Rated 5 out of 5 stars</span>
                </div>
                <blockquote className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${INK_CLASS}`}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/25 text-xs font-semibold text-white">
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-sm font-semibold ${INK_CLASS}`}>{t.name}</span>
                    <span className={`block truncate text-xs font-normal ${MUTED_TEXT}`}>{t.context}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0">
              <p className={`text-3xl font-extrabold tabular-nums ${INK_CLASS}`}>{s.value}</p>
              <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
