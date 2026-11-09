"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Check,
  ClipboardCheck,
  Footprints,
  Glasses,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingDown,
  Truck,
  Watch,
} from "lucide-react";

/* ----------------------------------------------------------------------- */
/*  Design tokens (single accent, near-monochrome, light surface)          */
/* ----------------------------------------------------------------------- */
// Accent #6E56CF (default brief hue, used as-is — see self-report for math):
//   white-on-accent      = 5.39:1  -> legal for small text on an accent fill
//   dark-ink-on-accent    = 3.64:1  -> legal only >=24px / >=19px bold, or non-text fills
//   accent text on this page's bg (#FAF9F7) = ~5.1:1 -> legal for body-size accent text
const INK = "#15141A";
const MUTED = "#5B5864";
const BG = "#FAF9F7";
const SURFACE = "#F1EEEA";
const SURFACE_ALT = "#ECE7DE";
const ACCENT = "#6E56CF";
// Lighter tint of the same hue for small accent-colored text/icons on DARK surfaces, where the
// base accent only clears ~3.4:1 (fails AA body/small text). Reference value from brief: 9.1:1.
const ACCENT_TINT = "#B6A6F0";
const ACCENT_SOFT = "#EFEAFB";
const ACCENT_LINE = "rgba(110,86,207,0.28)";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6E56CF] focus-visible:rounded-sm";

/* ----------------------------------------------------------------------- */
/*  Fixed, deterministic data                                              */
/* ----------------------------------------------------------------------- */

type SignalId =
  | "verified"
  | "topSeller"
  | "fastShip"
  | "priceDrop"
  | "limited"
  | "flawsDisclosed";

const SIGNALS: { id: SignalId; label: string; icon: typeof ShieldCheck }[] = [
  { id: "verified", label: "Authentication Verified", icon: ShieldCheck },
  { id: "topSeller", label: "Top-Rated Seller", icon: Star },
  { id: "fastShip", label: "Ships This Week", icon: Truck },
  { id: "priceDrop", label: "Recent Price Drop", icon: TrendingDown },
  { id: "limited", label: "Limited / Rare Drop", icon: Sparkles },
  { id: "flawsDisclosed", label: "Full Condition Report", icon: ClipboardCheck },
];

const DEFAULT_SIGNALS: SignalId[] = ["verified", "topSeller"];

type Listing = {
  id: string;
  title: string;
  category: string;
  icon: typeof Footprints;
  price: number;
  originalPrice: number;
  matchScore: number;
  grade: string;
  signals: Record<SignalId, boolean>;
  tint: "neutral" | "warm" | "accent";
};

const LISTINGS: Listing[] = [
  {
    id: "air-max-97",
    title: "Nike Air Max 97 “Silver Bullet”",
    category: "Sneakers",
    icon: Footprints,
    price: 148,
    originalPrice: 230,
    matchScore: 96,
    grade: "A-",
    signals: { verified: true, topSeller: true, fastShip: true, priceDrop: true, limited: false, flawsDisclosed: true },
    tint: "neutral",
  },
  {
    id: "levis-trucker",
    title: "Vintage Levi’s Trucker Jacket",
    category: "Outerwear",
    icon: Package,
    price: 64,
    originalPrice: 120,
    matchScore: 91,
    grade: "B+",
    signals: { verified: true, topSeller: true, fastShip: false, priceDrop: false, limited: false, flawsDisclosed: true },
    tint: "warm",
  },
  {
    id: "coach-crossbody",
    title: "Coach Vintage Crossbody Bag",
    category: "Bags",
    icon: ShoppingBag,
    price: 58,
    originalPrice: 95,
    matchScore: 88,
    grade: "A",
    signals: { verified: true, topSeller: false, fastShip: true, priceDrop: true, limited: false, flawsDisclosed: false },
    tint: "neutral",
  },
  {
    id: "seiko-5",
    title: "Seiko 5 Automatic SNK Series",
    category: "Watches",
    icon: Watch,
    price: 72,
    originalPrice: 110,
    matchScore: 94,
    grade: "A-",
    signals: { verified: true, topSeller: true, fastShip: true, priceDrop: false, limited: true, flawsDisclosed: true },
    tint: "accent",
  },
  {
    id: "canon-ae1",
    title: "Canon AE-1 35mm Film Camera",
    category: "Cameras",
    icon: Camera,
    price: 95,
    originalPrice: 160,
    matchScore: 90,
    grade: "B",
    signals: { verified: true, topSeller: false, fastShip: false, priceDrop: true, limited: true, flawsDisclosed: true },
    tint: "warm",
  },
  {
    id: "patagonia-retrox",
    title: "Patagonia Retro-X Fleece",
    category: "Outerwear",
    icon: Package,
    price: 54,
    originalPrice: 89,
    matchScore: 85,
    grade: "B+",
    signals: { verified: false, topSeller: true, fastShip: true, priceDrop: true, limited: false, flawsDisclosed: false },
    tint: "neutral",
  },
  {
    id: "rayban-wayfarer",
    title: "Ray-Ban Wayfarer Classic",
    category: "Accessories",
    icon: Glasses,
    price: 38,
    originalPrice: 70,
    matchScore: 82,
    grade: "A",
    signals: { verified: true, topSeller: true, fastShip: false, priceDrop: false, limited: false, flawsDisclosed: false },
    tint: "warm",
  },
  {
    id: "carhartt-detroit",
    title: "Carhartt WIP Detroit Jacket",
    category: "Outerwear",
    icon: Package,
    price: 70,
    originalPrice: 115,
    matchScore: 89,
    grade: "B",
    signals: { verified: false, topSeller: false, fastShip: true, priceDrop: true, limited: false, flawsDisclosed: true },
    tint: "neutral",
  },
  {
    id: "supreme-boxlogo",
    title: "Supreme Box Logo Hoodie FW19",
    category: "Streetwear",
    icon: Package,
    price: 210,
    originalPrice: 340,
    matchScore: 97,
    grade: "A-",
    signals: { verified: true, topSeller: true, fastShip: true, priceDrop: false, limited: true, flawsDisclosed: true },
    tint: "accent",
  },
];

const TINT_BG: Record<Listing["tint"], string> = {
  neutral: SURFACE,
  warm: SURFACE_ALT,
  accent: ACCENT_SOFT,
};

function discountPct(l: Listing) {
  return Math.round((1 - l.price / l.originalPrice) * 100);
}

function signalsMatched(l: Listing, selected: SignalId[]) {
  return selected.filter((s) => l.signals[s]).length;
}

function formatUsd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

/* ----------------------------------------------------------------------- */
/*  Motion helpers — content is always visible without JS; only a small    */
/*  translate offset is animated out, never opacity, so reduced-motion and */
/*  no-JS fallbacks both render fully-visible content.                     */
/* ----------------------------------------------------------------------- */

const revealVariants: Variants = {
  hidden: { opacity: 1, y: 18 },
  shown: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      variants={revealVariants}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Shared bits                                                            */
/* ----------------------------------------------------------------------- */

function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span
      className="text-[11px] font-bold uppercase tracking-[0.28em]"
      style={{ color: tone === "dark" ? ACCENT_TINT : ACCENT }}
    >
      {children}
    </span>
  );
}

function Caption({ children, color = MUTED }: { children: ReactNode; color?: string }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color }}>
      {children}
    </span>
  );
}

function Pill({
  children,
  tone = "outline",
}: {
  children: ReactNode;
  tone?: "outline" | "ink" | "accent";
}) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold";
  if (tone === "ink") {
    return (
      <span className={base} style={{ backgroundColor: INK, color: "#FFFFFF" }}>
        {children}
      </span>
    );
  }
  if (tone === "accent") {
    return (
      <span className={base} style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}>
        {children}
      </span>
    );
  }
  return (
    <span
      className={base}
      style={{ border: `1px solid ${ACCENT_LINE}`, color: INK, backgroundColor: "transparent" }}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------------- */
/*  Listing card — badges live in a row below the art block, never         */
/*  overlaid on top of it.                                                 */
/* ----------------------------------------------------------------------- */

function ListingCard({
  listing,
  reasons,
  compact = false,
}: {
  listing: Listing;
  reasons: string[];
  compact?: boolean;
}) {
  const pct = discountPct(listing);
  const Icon = listing.icon;
  return (
    <div className="min-w-0 flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div
        className="relative flex aspect-[4/3] w-full min-w-0 flex-col items-center justify-center gap-2"
        style={{ backgroundColor: TINT_BG[listing.tint] }}
      >
        <Icon aria-hidden="true" size={compact ? 32 : 40} style={{ color: INK, opacity: 0.55 }} />
        <Caption color={MUTED}>{listing.category}</Caption>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <p className="min-w-0 text-[15px] font-bold leading-snug" style={{ color: INK }}>
          {listing.title}
        </p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Pill tone="accent">{listing.matchScore}% match</Pill>
          <Pill tone="outline">Grade {listing.grade}</Pill>
          {listing.signals.verified && (
            <Pill tone="ink">
              <ShieldCheck aria-hidden="true" size={12} /> Verified
            </Pill>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-[17px] font-extrabold tabular-nums" style={{ color: INK }}>
            {formatUsd(listing.price)}
          </span>
          <span className="text-[13px] line-through" style={{ color: MUTED }}>
            {formatUsd(listing.originalPrice)}
          </span>
          <span className="text-[11px] font-bold tracking-[0.12em]" style={{ color: ACCENT }}>
            {pct}% OFF
          </span>
        </div>

        {!compact && (
          <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-black/10 pt-3">
            <Sparkles aria-hidden="true" size={12} style={{ color: MUTED }} />
            <span className="text-[11px] font-bold tracking-[0.02em]" style={{ color: MUTED }}>
              Matches:
            </span>
            {reasons.length > 0 ? (
              reasons.map((r) => (
                <span
                  key={r}
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{ backgroundColor: SURFACE, color: INK }}
                >
                  {r}
                </span>
              ))
            ) : (
              <span className="text-[11px] font-bold" style={{ color: MUTED }}>
                general fit
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Main page                                                              */
/* ----------------------------------------------------------------------- */

export default function LandingClient() {
  const [selected, setSelected] = useState<SignalId[]>(DEFAULT_SIGNALS);

  function toggleSignal(id: SignalId) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function resetSignals() {
    setSelected(DEFAULT_SIGNALS);
  }

  const { filtered, isFallback } = useMemo(() => {
    if (selected.length === 0) {
      return { filtered: LISTINGS, isFallback: false };
    }
    const strict = LISTINGS.filter((l) => selected.every((s) => l.signals[s]));
    if (strict.length > 0) {
      return { filtered: strict, isFallback: false };
    }
    const ranked = LISTINGS.map((l, i) => ({ l, i, score: signalsMatched(l, selected) }))
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .slice(0, 4)
      .map((x) => x.l);
    return { filtered: ranked, isFallback: true };
  }, [selected]);

  const stats = useMemo(() => {
    const n = filtered.length;
    if (n === 0) return { count: 0, avgMatch: 0, avgDiscount: 0 };
    const avgMatch = Math.round(filtered.reduce((s, l) => s + l.matchScore, 0) / n);
    const avgDiscount = Math.round(filtered.reduce((s, l) => s + discountPct(l), 0) / n);
    return { count: n, avgMatch, avgDiscount };
  }, [filtered]);

  const reasonsFor = (l: Listing) => {
    const fromSelected = SIGNALS.filter((s) => selected.includes(s.id) && l.signals[s.id]).map((s) => s.label);
    if (fromSelected.length > 0) return fromSelected;
    return SIGNALS.filter((s) => l.signals[s.id])
      .slice(0, 2)
      .map((s) => s.label);
  };

  const heroCards = filtered.slice(0, 3);
  const topMatches = useMemo(
    () => LISTINGS.filter((l) => ["supreme-boxlogo", "seiko-5", "canon-ae1"].includes(l.id)),
    []
  );

  const selectedCount = selected.length;

  return (
    <main className="min-w-0" style={{ backgroundColor: BG, color: INK }}>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden border-b border-black/10 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <Eyebrow>AI-Matched Resale</Eyebrow>
              <h1
                className="mt-4 font-extrabold"
                style={{
                  fontFamily: "var(--font-display-wide)",
                  color: INK,
                  letterSpacing: "-0.02em",
                  lineHeight: 0.98,
                  fontSize: "clamp(2.6rem, 1rem + 6.2vw, 5.1rem)",
                }}
              >
                Secondhand,
                <br />
                matched like it
                <br />
                was made for you.
              </h1>
              <p
                className="mt-6 text-[17px] leading-[1.6]"
                style={{ color: MUTED, maxWidth: "525px" }}
              >
                Repick&rsquo;s matching engine reads condition, authenticity and fit signals across
                thousands of seller listings, then shows only the ones built for how you actually
                shop. Tell it what matters below — the match score and savings recompute instantly.
              </p>

              {/* ---- live multi-select control (single source of truth) ----
                   Rendered before anything that cites the numbers it produces, so a
                   single-column mobile stack never shows a cited figure above its control. */}
              <div className="mt-8 min-w-0 rounded-2xl border border-black/10 bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Caption color={MUTED}>Tell us what matters &middot; re-matches instantly</Caption>
                  <button
                    type="button"
                    onClick={resetSignals}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${FOCUS_RING}`}
                    style={{ color: MUTED }}
                  >
                    <RotateCcw aria-hidden="true" size={12} />
                    Reset
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SIGNALS.map((signal) => {
                    const active = selected.includes(signal.id);
                    const Icon = signal.icon;
                    return (
                      <button
                        key={signal.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleSignal(signal.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-bold transition-colors duration-150 ${FOCUS_RING} ${
                          active ? "border-transparent text-white" : "border-black/15 bg-white"
                        }`}
                        style={active ? { backgroundColor: ACCENT } : { color: INK }}
                      >
                        {active ? (
                          <Check aria-hidden="true" size={13} />
                        ) : (
                          <Icon aria-hidden="true" size={13} />
                        )}
                        {signal.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-[12px] leading-[1.6]" style={{ color: MUTED }}>
                  {selectedCount === 0
                    ? `Showing all ${LISTINGS.length} listings — select a signal to narrow your match.`
                    : isFallback
                      ? `No listing clears every one of your ${selectedCount} signals yet — showing the ${stats.count} closest by signals met.`
                      : `${stats.count} of ${LISTINGS.length} listings clear all ${selectedCount} of your signals.`}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <a
                  href="#live-matches"
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
                  style={{ backgroundColor: ACCENT }}
                >
                  See your {stats.count} live matches
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
                <span className="text-[13px] font-bold" style={{ color: MUTED }}>
                  avg {stats.avgMatch}% match &middot; avg {stats.avgDiscount}% below retail
                </span>
              </div>
            </div>

            {/* ---- hero proof cards: visible without scrolling, full badge set ---- */}
            <div className="min-w-0 lg:col-span-5">
              <Caption color={MUTED}>Your live matches right now</Caption>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {heroCards.map((l) => (
                  <div key={l.id} className="min-w-0">
                    <ListingCard listing={l} reasons={reasonsFor(l)} compact />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: product preview (static, curated) ================= */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <Eyebrow>Curated by the match engine</Eyebrow>
            <h2
              className="mt-3 font-extrabold"
              style={{ color: INK, letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 1rem + 2vw, 2.5rem)" }}
            >
              This week&rsquo;s top matches
            </h2>
            <p className="mt-3 text-[16px] leading-[1.6]" style={{ color: MUTED, maxWidth: "525px" }}>
              A hand-checked sample of what the engine is surfacing most often this week, each one
              carrying the same proof your own matches get: condition grade, seller verification and
              the real discount against retail.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topMatches.map((l, i) => (
              <Reveal key={l.id} delay={i * 0.05} className="min-w-0">
                <ListingCard
                  listing={l}
                  reasons={SIGNALS.filter((s) => l.signals[s.id])
                    .slice(0, 2)
                    .map((s) => s.label)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: value in three parts (live) ================= */}
      <section id="live-matches" className="scroll-mt-10 border-y border-black/10 px-5 py-16 sm:px-8 lg:px-12" style={{ backgroundColor: BG }}>
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <Eyebrow>Value, recomputed live</Eyebrow>
            <h2
              className="mt-3 font-extrabold"
              style={{ color: INK, letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 1rem + 2vw, 2.5rem)" }}
            >
              Three numbers, driven by your {selectedCount} signal{selectedCount === 1 ? "" : "s"}.
            </h2>
            <p className="mt-3 text-[16px] leading-[1.6]" style={{ color: MUTED, maxWidth: "525px" }}>
              Every toggle above this line changes what you see below it. Nothing here is a mock-up
              — it&rsquo;s the same filter running against the same nine listings.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { label: "Matches found", value: `${stats.count}`, sub: `of ${LISTINGS.length} total listings` },
              { label: "Avg. match score", value: `${stats.avgMatch}%`, sub: "across your current matches" },
              { label: "Avg. you save", value: `${stats.avgDiscount}%`, sub: "below original retail" },
            ].map((tile, i) => (
              <Reveal key={tile.label} delay={i * 0.05} className="min-w-0">
                <div className="min-w-0 rounded-2xl border border-black/10 bg-white p-6">
                  <Caption color={MUTED}>{tile.label}</Caption>
                  <div
                    className="mt-2 font-extrabold tabular-nums tracking-[0.12em]"
                    style={{ color: ACCENT, fontSize: "clamp(2.25rem, 1rem + 3vw, 3.25rem)" }}
                  >
                    {tile.value}
                  </div>
                  <div className="mt-1 text-[12px] font-bold" style={{ color: MUTED }}>
                    {tile.sub}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 min-w-0" delay={0.12}>
            <Caption color={MUTED}>All matching listings right now</Caption>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((l) => (
                <div key={l.id} className="min-w-0">
                  <ListingCard listing={l} reasons={reasonsFor(l)} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION 4: social proof ================= */}
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <Reveal>
            <Eyebrow>What resellers say</Eyebrow>
            <h2
              className="mt-3 font-extrabold"
              style={{ color: INK, letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 1rem + 2vw, 2.5rem)" }}
            >
              Proof, from people who already bought.
            </h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                initials: "MA",
                name: "M. Alvarez",
                item: "bought the Seiko 5 Automatic",
                quote:
                  "The match score wasn’t fluff. It flagged the one listing where the seller had actually disclosed every scratch.",
              },
              {
                initials: "JO",
                name: "J. Okafor",
                item: "bought the Supreme Box Logo Hoodie",
                quote:
                  "I only toggle authentication and seller rating. Everything that clears both has never let me down.",
              },
              {
                initials: "TL",
                name: "T. Lindqvist",
                item: "bought the Canon AE-1",
                quote:
                  "Turned on price-drop and limited-drop together and watched the list shrink to exactly the camera I wanted.",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05} className="min-w-0">
                <div className="min-w-0 flex h-full flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6">
                  <div className="flex items-center gap-1" aria-label="Rated 4.9 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} aria-hidden="true" size={14} fill={ACCENT} stroke={ACCENT} />
                    ))}
                    <span className="ml-1 text-[12px] font-bold tabular-nums" style={{ color: MUTED }}>
                      4.9
                    </span>
                  </div>
                  <p className="min-w-0 flex-1 text-[15px] leading-[1.6]" style={{ color: INK }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-black/10 pt-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold text-white"
                      style={{ backgroundColor: INK }}
                      aria-hidden="true"
                    >
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-bold" style={{ color: INK }}>
                        {t.name}
                      </div>
                      <div className="truncate text-[12px]" style={{ color: MUTED }}>
                        {t.item}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: closing CTA ================= */}
      <section className="border-t border-black/10 px-5 py-16 sm:px-8 lg:px-12" style={{ backgroundColor: INK }}>
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="min-w-0 lg:col-span-8">
              <Eyebrow tone="dark">Ready when you are</Eyebrow>
              <h2
                className="mt-3 font-extrabold text-white"
                style={{
                  fontFamily: "var(--font-display-wide)",
                  letterSpacing: "-0.02em",
                  fontSize: "clamp(2rem, 1rem + 3.4vw, 3.25rem)",
                  lineHeight: 1.02,
                }}
              >
                Your matches are already waiting.
              </h2>
              <p className="mt-4 text-[16px] leading-[1.6] text-white/70" style={{ maxWidth: "525px" }}>
                {stats.count} listing{stats.count === 1 ? "" : "s"} clear{stats.count === 1 ? "s" : ""}{" "}
                your {selectedCount} selected signal{selectedCount === 1 ? "" : "s"} right now, averaging{" "}
                {stats.avgMatch}% match and {stats.avgDiscount}% off retail. These three numbers update
                the instant you change a signal above.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-4 lg:text-right">
              <a
                href="#live-matches"
                className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT }}
              >
                Browse your {stats.count} matches
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
