"use client";

import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Armchair,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Coffee,
  Disc3,
  LampDesk,
  Library,
  MapPin,
  Music2,
  Radar,
  Shirt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Speaker,
  Table2,
  Target,
  TrendingDown,
  Watch,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------------ *
 * Design tokens
 * ---------------------------------------------------------------------- *
 * accent = #FF7A1A (vivid orange). Contrast computed against WCAG relative
 * luminance (not eyeballed):
 *   accent on bg #0B0B0F              -> 7.53:1  (passes body-size AA)
 *   white  on accent fill             -> 2.61:1  (FAILS — do not use)
 *   dark ink (#0B0B0F) on accent fill -> 7.53:1  (passes body-size AA)
 * Because the base tone already clears body-text AA against the page
 * background, it is used directly for small text/icons — no separate tint
 * token is needed the way the #6E56CF default requires one. Filled chips
 * and badges always pair accent with dark-ink text, never white.
 * ---------------------------------------------------------------------- */
const ACCENT = "#FF7A1A";
const INK = "#0B0B0F";

/* ------------------------------------------------------------------------ *
 * Fixed dataset — coordinates live on a 480x400 map plane, center = the
 * viewer's pin at (240, 200). Distance is derived once, deterministically,
 * from those coordinates (24px = 1km). Nothing here is random or time-based.
 * ---------------------------------------------------------------------- */
type Category = "furniture" | "electronics" | "fashion";
type Condition = "Excellent" | "Good" | "Fair";

interface Listing {
  id: string;
  title: string;
  category: Category;
  x: number;
  y: number;
  price: number;
  original: number;
  match: number;
  condition: Condition;
  verified: boolean;
  neighborhood: string;
  icon: LucideIcon;
  tags: [string, string];
}

const CENTER = { x: 240, y: 200 };
const PX_PER_KM = 24;

const LISTINGS: Listing[] = [
  { id: "L01", title: "Mid-Century Lounge Chair", category: "furniture", x: 231, y: 197, price: 340, original: 480, match: 96, condition: "Excellent", verified: true, neighborhood: "Center Row", icon: Armchair, tags: ["Matches your saved style", "High-rated seller match"] },
  { id: "L02", title: "Analog Turntable Deck", category: "electronics", x: 251, y: 218, price: 210, original: 320, match: 91, condition: "Good", verified: true, neighborhood: "Center Row", icon: Disc3, tags: ["Trending in your radius", "Similar to recent purchases"] },
  { id: "L03", title: "Leather Weekender Bag", category: "fashion", x: 255, y: 175, price: 145, original: 220, match: 88, condition: "Excellent", verified: false, neighborhood: "Harborline", icon: ShoppingBag, tags: ["Matches your saved style", "Priced below neighborhood average"] },
  { id: "L04", title: "Oak Dining Table", category: "furniture", x: 210, y: 225, price: 460, original: 650, match: 85, condition: "Good", verified: true, neighborhood: "West Bank", icon: Table2, tags: ["New listing this week", "High-rated seller match"] },
  { id: "L05", title: "Vintage Film Camera", category: "electronics", x: 286, y: 217, price: 275, original: 390, match: 93, condition: "Excellent", verified: true, neighborhood: "Eastgate", icon: Camera, tags: ["Matches your saved style", "Similar to recent purchases"] },
  { id: "L06", title: "Wool Overcoat", category: "fashion", x: 221, y: 146, price: 120, original: 210, match: 79, condition: "Good", verified: false, neighborhood: "North Ridge", icon: Shirt, tags: ["Priced below neighborhood average", "Trending in your radius"] },
  { id: "L07", title: "Modular Bookshelf", category: "furniture", x: 252, y: 267, price: 95, original: 160, match: 82, condition: "Fair", verified: true, neighborhood: "South Pier", icon: Library, tags: ["Priced below neighborhood average", "New listing this week"] },
  { id: "L08", title: "Espresso Machine", category: "electronics", x: 300, y: 150, price: 230, original: 340, match: 90, condition: "Good", verified: true, neighborhood: "Eastgate", icon: Coffee, tags: ["High-rated seller match", "Similar to recent purchases"] },
  { id: "L09", title: "Ceramic Table Lamp", category: "furniture", x: 157, y: 230, price: 60, original: 95, match: 74, condition: "Good", verified: false, neighborhood: "West Bank", icon: LampDesk, tags: ["Priced below neighborhood average", "New listing this week"] },
  { id: "L10", title: "Mechanical Watch", category: "fashion", x: 322, y: 269, price: 380, original: 520, match: 87, condition: "Excellent", verified: true, neighborhood: "South Pier", icon: Watch, tags: ["Matches your saved style", "High-rated seller match"] },
  { id: "L11", title: "Vinyl Record Set", category: "electronics", x: 144, y: 120, price: 45, original: 70, match: 71, condition: "Fair", verified: false, neighborhood: "North Ridge", icon: Music2, tags: ["Trending in your radius", "Priced below neighborhood average"] },
  { id: "L12", title: "Rattan Armchair", category: "furniture", x: 215, y: 341, price: 130, original: 190, match: 68, condition: "Fair", verified: false, neighborhood: "Harborline", icon: Armchair, tags: ["Priced below neighborhood average", "Similar to recent purchases"] },
  { id: "L13", title: "Denim Jacket", category: "fashion", x: 268, y: 38, price: 55, original: 90, match: 76, condition: "Good", verified: true, neighborhood: "Outer Loop", icon: Shirt, tags: ["New listing this week", "Trending in your radius"] },
  { id: "L14", title: "Bluetooth Speaker", category: "electronics", x: 424, y: 232, price: 40, original: 65, match: 65, condition: "Fair", verified: false, neighborhood: "Outer Loop", icon: Speaker, tags: ["Priced below neighborhood average", "Trending in your radius"] },
];

const LISTINGS_WITH_DISTANCE = LISTINGS.map((l) => ({
  ...l,
  distanceKm: Math.sqrt((l.x - CENTER.x) ** 2 + (l.y - CENTER.y) ** 2) / PX_PER_KM,
}));

type ListingWithDistance = (typeof LISTINGS_WITH_DISTANCE)[number];

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "furniture", label: "Furniture" },
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
];

const TESTIMONIALS = [
  {
    quote: "The radius slider alone sold me — I could see exactly how many good chairs were a ten-minute walk away.",
    name: "Jordan M.",
    role: "Repeat buyer",
  },
  {
    quote: "Every listing already comes graded and verified. I stopped negotiating condition and started just picking.",
    name: "Priya K.",
    role: "Verified seller",
  },
  {
    quote: "I widened my radius by two clicks and found a turntable I had been hunting for a month.",
    name: "Sam T.",
    role: "Buyer",
  },
  {
    quote: "Match scores against my saved style made browsing feel curated instead of endless.",
    name: "Dana L.",
    role: "Buyer",
  },
] as const;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7A1A]";

/* ------------------------------------------------------------------------ *
 * Small building blocks
 * ---------------------------------------------------------------------- */

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const hiddenState = reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 };
  return (
    <motion.div
      className={className}
      initial={hiddenState}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function RadiusSlider({
  id,
  value,
  onChange,
}: {
  id: string;
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          Search radius
        </label>
        <span className="text-sm font-bold tabular-nums text-white">{value.toFixed(1)} km</span>
      </div>
      <input
        id={id}
        type="range"
        min={0.3}
        max={8}
        step={0.1}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
        aria-valuetext={`${value.toFixed(1)} kilometer radius`}
        className={`h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 ${focusRing} [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FF7A1A] [&::-webkit-slider-thumb]:shadow-[0_0_0_5px_rgba(255,122,26,0.18)] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#FF7A1A]`}
      />
      <div className="mt-1.5 flex justify-between text-[11px] tabular-nums text-zinc-400">
        <span>0.3 km</span>
        <span>8 km</span>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Icon aria-hidden className="h-3.5 w-3.5" style={{ color: ACCENT }} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}

function ConditionPill({ condition }: { condition: Condition }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
      {condition} condition
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) {
    return <span className="text-[11px] text-zinc-400">Seller pending verification</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: ACCENT }}>
      <BadgeCheck aria-hidden className="h-3.5 w-3.5" />
      Verified seller
    </span>
  );
}

/* ------------------------------------------------------------------------ *
 * Map widget — decorative SVG, aria-hidden. All the information it shows
 * (counts, match average, neighborhoods, listed items) is also rendered as
 * real text elsewhere on the page, so hiding the graphic from assistive
 * tech loses no information.
 * ---------------------------------------------------------------------- */
function MapWidget({ radiusKm, listings }: { radiusKm: number; listings: ListingWithDistance[] }) {
  const radiusPx = radiusKm * PX_PER_KM;
  const gridLines = [80, 160, 240, 320, 400];

  return (
    <div className="relative aspect-[6/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#100f14]">
      <svg viewBox="0 0 480 400" className="h-full w-full" aria-hidden="true">
        {gridLines.map((pos) => (
          <line key={`v-${pos}`} x1={pos} y1={0} x2={pos} y2={400} stroke="#ffffff" strokeOpacity={0.04} strokeWidth={1} />
        ))}
        {gridLines.map((pos) => (
          <line key={`h-${pos}`} x1={0} y1={pos} x2={480} y2={pos} stroke="#ffffff" strokeOpacity={0.04} strokeWidth={1} />
        ))}

        <circle cx={CENTER.x} cy={CENTER.y} r={radiusPx} fill={ACCENT} fillOpacity={0.1} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="5 5" />

        {listings.map((listing) => {
          const inRange = listing.distanceKm <= radiusKm;
          return inRange ? (
            <circle key={listing.id} cx={listing.x} cy={listing.y} r={6} fill={ACCENT} stroke={INK} strokeWidth={1.5} />
          ) : (
            <circle key={listing.id} cx={listing.x} cy={listing.y} r={4} fill="none" stroke="#71717a" strokeWidth={1.5} />
          );
        })}

        <circle cx={CENTER.x} cy={CENTER.y} r={14} fill="none" stroke="#ffffff" strokeOpacity={0.3} strokeWidth={1} />
        <circle cx={CENTER.x} cy={CENTER.y} r={9} fill="#ffffff" />
        <circle cx={CENTER.x} cy={CENTER.y} r={9} fill="none" stroke={INK} strokeWidth={2} />
      </svg>
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0B0B0F]/70 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 backdrop-blur">
        <MapPin aria-hidden className="h-3 w-3" style={{ color: ACCENT }} />
        Your location
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ *
 * Product preview card
 * ---------------------------------------------------------------------- */
const TONE_BY_CATEGORY: Record<Category, string> = {
  furniture: "linear-gradient(135deg, rgba(255,122,26,0.16), rgba(255,255,255,0.02))",
  electronics: "linear-gradient(135deg, rgba(113,113,122,0.28), rgba(255,255,255,0.02))",
  fashion: "linear-gradient(135deg, rgba(255,122,26,0.08), rgba(113,113,122,0.18))",
};

function ProductCard({ listing }: { listing: ListingWithDistance }) {
  const Icon = listing.icon;
  const discountPct = Math.round((1 - listing.price / listing.original) * 100);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div
        className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-white/10"
        style={{ background: TONE_BY_CATEGORY[listing.category] }}
      >
        <Icon aria-hidden className="h-12 w-12 text-white/80" strokeWidth={1.5} />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{listing.category}</p>
        <h3 className="mt-1 text-lg font-bold text-white">{listing.title}</h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {listing.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-zinc-300">
            <Sparkles aria-hidden className="h-3 w-3" style={{ color: ACCENT }} />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <ConditionPill condition={listing.condition} />
        <VerifiedBadge verified={listing.verified} />
      </div>

      <div className="mt-auto flex items-end justify-between border-t border-white/10 pt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tabular-nums text-white">${listing.price}</span>
          <span className="text-sm tabular-nums text-zinc-400 line-through">${listing.original}</span>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums"
          style={{ backgroundColor: ACCENT, color: INK }}
        >
          <TrendingDown aria-hidden className="h-3 w-3" />
          Save {discountPct}%
        </span>
      </div>
      <div className="flex justify-between text-[11px] text-zinc-400">
        <span className="tabular-nums">{listing.distanceKm.toFixed(1)} km away</span>
        <span className="font-semibold tabular-nums" style={{ color: ACCENT }}>
          {listing.match}% match
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ *
 * Page
 * ---------------------------------------------------------------------- */
export default function RadiusExperience() {
  const [radiusKm, setRadiusKm] = useState(3.0);
  const [category, setCategory] = useState<Category | "all">("all");
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const reduce = useReducedMotion();

  const inRange = useMemo(
    () => LISTINGS_WITH_DISTANCE.filter((l) => l.distanceKm <= radiusKm),
    [radiusKm],
  );
  const avgMatch = inRange.length
    ? Math.round(inRange.reduce((sum, l) => sum + l.match, 0) / inRange.length)
    : 0;
  const neighborhoodsInRange = useMemo(() => new Set(inRange.map((l) => l.neighborhood)).size, [inRange]);
  const verifiedInRange = inRange.filter((l) => l.verified).length;
  const verifiedPct = inRange.length ? Math.round((verifiedInRange / inRange.length) * 100) : 0;
  const topMatches = useMemo(() => [...inRange].sort((a, b) => b.match - a.match).slice(0, 3), [inRange]);
  const conditionCounts = useMemo(() => {
    const counts: Record<Condition, number> = { Excellent: 0, Good: 0, Fair: 0 };
    inRange.forEach((l) => {
      counts[l.condition] += 1;
    });
    return counts;
  }, [inRange]);

  const filteredProducts = useMemo(
    () => (category === "all" ? LISTINGS_WITH_DISTANCE : LISTINGS_WITH_DISTANCE.filter((l) => l.category === category)),
    [category],
  );

  const testimonial = TESTIMONIALS[testimonialIndex];
  const goToTestimonial = (next: number) => setTestimonialIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0F] text-white">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0B0B0F] ${focusRing}`}
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-10">
          <a href="#main-content" className={`flex items-center gap-2 rounded-md ${focusRing}`}>
            <MapPin aria-hidden className="h-5 w-5" style={{ color: ACCENT }} />
            <span className="text-lg font-bold tracking-tight">Repick</span>
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-semibold text-zinc-300 md:flex">
            <a href="#listings" className={`inline-block rounded-md py-2 ${focusRing}`}>
              Listings
            </a>
            <a href="#how-it-works" className={`inline-block rounded-md py-2 ${focusRing}`}>
              How it works
            </a>
            <a href="#reviews" className={`inline-block rounded-md py-2 ${focusRing}`}>
              Reviews
            </a>
          </nav>
          <a
            href="#listings"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${focusRing}`}
            style={{ backgroundColor: ACCENT, color: INK }}
          >
            Get matched
          </a>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* ---------------------------------------------------------------- */}
        {/* HERO — headline, CTA, and the radius-matching proof all live in  */}
        {/* this one component, not a separate section.                     */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,122,26,0.16), transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
                  Radius-matched resale
                </p>
                <h1
                  className="mt-4 text-[clamp(2.25rem,1.6rem+3.2vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  Drag your radius.
                  <br />
                  Watch the matches follow.
                </h1>
                <p className="mt-6 max-w-[500px] text-base leading-[1.6] text-zinc-300">
                  Repick scans verified resale listings around any point you choose. Expand the
                  circle and every match count, quality score, and nearby seller updates before
                  you finish dragging.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href="#listings"
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold ${focusRing}`}
                    style={{ backgroundColor: ACCENT, color: INK }}
                  >
                    Browse matches near you
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </a>
                  <a
                    href="#how-it-works"
                    className={`inline-block rounded-md py-2 text-sm font-semibold text-zinc-300 underline decoration-white/30 underline-offset-4 ${focusRing}`}
                  >
                    See how radius matching works
                  </a>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-3">
                  <StatTile icon={Target} label="Listings in range" value={String(inRange.length)} />
                  <StatTile icon={MapPin} label="Neighborhoods" value={String(neighborhoodsInRange)} />
                  <StatTile icon={Sparkles} label="Avg. match" value={`${avgMatch}%`} />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
                  <MapWidget radiusKm={radiusKm} listings={LISTINGS_WITH_DISTANCE} />
                  <div className="mt-5">
                    <RadiusSlider id="hero-radius" value={radiusKm} onChange={setRadiusKm} />
                  </div>

                  <div className="mt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      Top matches in range
                    </p>
                    <ul className="mt-2.5 flex flex-col gap-2">
                      {topMatches.length === 0 ? (
                        <li className="flex items-center gap-3 rounded-xl border border-dashed border-white/15 p-4 text-sm text-zinc-400">
                          <Radar aria-hidden className="h-5 w-5 shrink-0" style={{ color: ACCENT }} />
                          No matches inside this radius yet — drag the slider wider.
                        </li>
                      ) : (
                        topMatches.map((listing) => {
                          const Icon = listing.icon;
                          return (
                            <li key={listing.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                                <Icon aria-hidden className="h-5 w-5 text-white/80" strokeWidth={1.5} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="truncate text-sm font-semibold text-white">{listing.title}</p>
                                  <p className="shrink-0 text-sm font-bold tabular-nums" style={{ color: ACCENT }}>
                                    {listing.match}%
                                  </p>
                                </div>
                                <p className="mt-0.5 truncate text-xs text-zinc-400">
                                  <span className="tabular-nums">{listing.distanceKm.toFixed(1)}</span> km ·{" "}
                                  {listing.condition}
                                  {listing.verified ? " · Verified" : ""}
                                </p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-sm font-bold tabular-nums text-white">${listing.price}</p>
                                <p className="text-[11px] tabular-nums text-zinc-400 line-through">${listing.original}</p>
                              </div>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* PRODUCT PREVIEW                                                   */}
        {/* ---------------------------------------------------------------- */}
        <section id="listings" className="border-b border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
                Why Repick picked these
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
                Every listing arrives pre-vetted
              </h2>
              <p className="mt-4 max-w-[500px] text-base leading-[1.6] text-zinc-300">
                Each card ships with the reasoning behind the match, a condition grade a human
                confirmed, and a verified-seller check — no guessing once you click in.
              </p>
            </Reveal>

            <div role="group" aria-label="Filter listings by category" className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const active = c.id === category;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(c.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${focusRing} ${
                      active
                        ? "border-transparent font-semibold"
                        : "border-white/15 font-normal text-zinc-300 hover:border-white/30"
                    }`}
                    style={active ? { backgroundColor: ACCENT, color: INK } : undefined}
                  >
                    {active && <CheckCircle2 aria-hidden className="h-3.5 w-3.5" />}
                    {c.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((listing, i) => (
                <Reveal key={listing.id} delay={reduce ? 0 : (i % 3) * 0.06}>
                  <ProductCard listing={listing} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* VALUE 3-SPLIT — same radius state, live everywhere               */}
        {/* ---------------------------------------------------------------- */}
        <section id="how-it-works" className="border-b border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
                Radius, live
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
                Everything below moves with the slider
              </h2>
              <p className="mt-4 max-w-[500px] text-base leading-[1.6] text-zinc-300">
                Drag it again — the same circle recalculates range, quality, and seller trust
                across the page.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Reveal className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Radar aria-hidden className="h-4 w-4" style={{ color: ACCENT }} />
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em]">Search radius</h3>
                </div>
                <p className="mt-3 text-4xl font-bold tabular-nums text-white">{radiusKm.toFixed(1)} km</p>
                <p className="mt-2 text-sm text-zinc-400">Covering {neighborhoodsInRange} of 7 mapped neighborhoods.</p>
                <div className="mt-5">
                  <RadiusSlider id="value-radius" value={radiusKm} onChange={setRadiusKm} />
                </div>
              </Reveal>

              <Reveal delay={reduce ? 0 : 0.08} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Target aria-hidden className="h-4 w-4" style={{ color: ACCENT }} />
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em]">Match quality</h3>
                </div>
                <p className="mt-3 text-4xl font-bold tabular-nums text-white">{avgMatch}%</p>
                <p className="mt-2 text-sm text-zinc-400">Average match score across every listing in range.</p>
                <ul className="mt-5 flex flex-col gap-1.5 text-sm text-zinc-300">
                  <li className="flex justify-between">
                    <span>Excellent</span>
                    <span className="tabular-nums font-semibold text-white">{conditionCounts.Excellent}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Good</span>
                    <span className="tabular-nums font-semibold text-white">{conditionCounts.Good}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Fair</span>
                    <span className="tabular-nums font-semibold text-white">{conditionCounts.Fair}</span>
                  </li>
                </ul>
              </Reveal>

              <Reveal delay={reduce ? 0 : 0.16} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center gap-2 text-zinc-400">
                  <ShieldCheck aria-hidden className="h-4 w-4" style={{ color: ACCENT }} />
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em]">Verified network</h3>
                </div>
                <p className="mt-3 text-4xl font-bold tabular-nums text-white">
                  {verifiedInRange}/{inRange.length || 0}
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  {inRange.length === 0
                    ? "No listings in range yet."
                    : `${verifiedPct}% of nearby sellers are verified.`}
                </p>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${verifiedPct}%`, backgroundColor: ACCENT }}
                  />
                </div>
                <p className="mt-2 text-sm leading-[1.6] text-zinc-300">
                  Every listing is checked for authenticity before it ever reaches your radius.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* SOCIAL PROOF                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section id="reviews" className="border-b border-white/10 py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
                Trusted by the neighborhood
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
                Buyers and sellers who felt the difference
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-9">
                  <AnimatePresence mode="wait">
                    <motion.figure
                      key={testimonialIndex}
                      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                      transition={{ duration: reduce ? 0 : 0.3 }}
                    >
                      <blockquote className="max-w-[500px] text-lg leading-[1.6] text-white">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-4 text-sm text-zinc-400">
                        <span className="font-semibold text-white">{testimonial.name}</span> · {testimonial.role}
                      </figcaption>
                    </motion.figure>
                  </AnimatePresence>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div className="flex gap-2">
                      {TESTIMONIALS.map((t, i) => (
                        <button
                          key={t.name}
                          type="button"
                          aria-label={`Show testimonial from ${t.name}`}
                          aria-current={i === testimonialIndex}
                          onClick={() => goToTestimonial(i)}
                          className={`flex h-7 w-7 items-center justify-center rounded-full ${focusRing}`}
                        >
                          <span
                            className={
                              i === testimonialIndex
                                ? "block h-2.5 w-2.5 rounded-full border-2 border-white/50"
                                : "block h-1.5 w-1.5 rounded-full"
                            }
                            style={{ backgroundColor: i === testimonialIndex ? ACCENT : "#71717a" }}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Previous testimonial"
                        onClick={() => goToTestimonial(testimonialIndex - 1)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:border-white/30 ${focusRing}`}
                      >
                        <ChevronLeft aria-hidden className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next testimonial"
                        onClick={() => goToTestimonial(testimonialIndex + 1)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:border-white/30 ${focusRing}`}
                      >
                        <ChevronRight aria-hidden className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={reduce ? 0 : 0.08} className="flex flex-col gap-4 lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-2xl font-bold tabular-nums text-white">9,200+</p>
                  <p className="mt-1 text-sm text-zinc-400">Matched pickups completed</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-2xl font-bold tabular-nums text-white">4.8 / 5</p>
                  <p className="mt-1 text-sm text-zinc-400">Average buyer rating</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-2xl font-bold tabular-nums text-white">58</p>
                  <p className="mt-1 text-sm text-zinc-400">Neighborhoods with active listings</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* CLOSING CTA — reads the same live radius state from the hero     */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <Reveal className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center md:p-14">
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
                Your radius is already working
              </h2>
              <p className="mx-auto mt-4 max-w-[560px] text-lg leading-[1.6] text-zinc-300">
                Right now, that&apos;s{" "}
                <span className="font-bold tabular-nums text-white">{inRange.length} listings</span>{" "}
                averaging{" "}
                <span className="font-bold tabular-nums" style={{ color: ACCENT }}>
                  {avgMatch}% match
                </span>{" "}
                within{" "}
                <span className="font-bold tabular-nums text-white">{radiusKm.toFixed(1)} km</span> of you.
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href="#listings"
                  className={`inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold ${focusRing}`}
                  style={{ backgroundColor: ACCENT, color: INK }}
                >
                  Start matching now
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-3 px-6 text-sm text-zinc-400 md:flex-row md:px-10">
          <span>© 2026 Repick. Built for resale that fits your radius.</span>
          <div className="flex gap-5">
            <a href="#listings" className={`inline-block rounded-md py-2 ${focusRing}`}>
              Listings
            </a>
            <a href="#how-it-works" className={`inline-block rounded-md py-2 ${focusRing}`}>
              How it works
            </a>
            <a href="#reviews" className={`inline-block rounded-md py-2 ${focusRing}`}>
              Reviews
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
