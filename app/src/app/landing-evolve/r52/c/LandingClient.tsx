"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Shirt,
  Footprints,
  ShoppingBag,
  Watch,
  Backpack,
  Glasses,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Percent,
  Quote,
  Star,
  SearchX,
  CheckCircle2,
  Users,
  Lock,
  type LucideIcon,
} from "lucide-react";
import {
  DEFAULT_BUDGET,
  MAX_BUDGET,
  MIN_LISTING_PRICE,
  computeForBudget,
  parseBudgetInput,
  type Listing,
  type BudgetResult,
} from "./data";

const ICONS: Record<Listing["icon"], LucideIcon> = {
  shirt: Shirt,
  footprints: Footprints,
  bag: ShoppingBag,
  watch: Watch,
  backpack: Backpack,
  glasses: Glasses,
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] rounded-sm";

function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/* ---------------------------------------------------------------------------
 * Reveal — CSS-keyframe entrance (not framer-motion initial/whileInView), so
 * content is visible by default: if JS never hydrates, the resting style IS
 * opacity:1 and nothing depends on a script to become visible. The keyframe
 * only donates the "from" offset. motion-reduce disables the animation and
 * leaves the resting (visible) style in place.
 * ------------------------------------------------------------------------- */
function Reveal({
  children,
  delayMs = 0,
  className = "",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-[rise_0.55s_ease-out_both] motion-reduce:animate-none ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

/* --------------------------------- Badges -------------------------------- */

function MatchBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-extrabold tracking-[-0.02em] text-[var(--accent)]">
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      {percent}% match
    </span>
  );
}

function GradeBadge({ grade }: { grade: Listing["grade"] }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#D9D4CB] bg-white px-2 py-0.5 text-xs font-semibold tracking-[0.12em] text-[#52525B]">
      GRADE {grade}
    </span>
  );
}

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#17171C] px-2 py-0.5 text-xs font-semibold text-white">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Verified seller
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#D9D4CB] px-2 py-0.5 text-xs font-semibold text-[#52525B]">
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Seller submitted
    </span>
  );
}

function DiscountBadge({ price, originalPrice }: { price: number; originalPrice: number }) {
  const pct = Math.round((1 - price / originalPrice) * 100);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF5F1] px-2 py-0.5 text-xs font-extrabold text-[var(--accent)]">
      <Percent className="h-3 w-3" aria-hidden="true" />
      {pct}% off
    </span>
  );
}

/* ------------------------------- Swatch art -------------------------------
 * Generated CSS/SVG stand-in art per listing: fixed aspect-ratio + reserved
 * background color, deterministic (no remote fetch, no random seed), so
 * there is no load-failure/alt-text-collision risk at all. Badges never sit
 * on top of it — they live in their own row underneath.
 * ------------------------------------------------------------------------- */
function ListingArt({ item, compact = false }: { item: Listing; compact?: boolean }) {
  const Icon = ICONS[item.icon];
  const iconTone = item.lightSwatch ? "text-[#17171C]/70" : "text-white/90";
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
      style={{ backgroundColor: item.swatch }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.35), transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="flex h-full w-full items-center justify-center">
        <Icon className={`${compact ? "h-9 w-9" : "h-12 w-12"} ${iconTone}`} strokeWidth={1.5} aria-hidden="true" />
      </div>
    </div>
  );
}

/* --------------------------------- Card ---------------------------------- */

function ListingCard({ item, rich = false }: { item: Listing; rich?: boolean }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[#E7E2D8] bg-white p-3"
    >
      <ListingArt item={item} compact={!rich} />
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 truncate text-sm font-extrabold tracking-[-0.02em] text-[#17171C]">
            {item.title}
          </p>
          <MatchBadge percent={item.matchPercent} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52525B]">
          {item.category}
        </p>
        {rich && (
          <ul className="flex flex-col gap-1">
            {item.tags.map((tag) => (
              <li key={tag} className="flex items-center gap-1.5 text-xs text-[#52525B]">
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[var(--accent)]" aria-hidden="true" />
                <span className="truncate">{tag}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap items-center gap-1.5">
          <GradeBadge grade={item.grade} />
          <VerifiedBadge verified={item.verified} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold text-[#17171C]">{formatUsd(item.price)}</span>
          <span className="text-xs font-normal text-[#52525B] line-through">
            {formatUsd(item.originalPrice)}
          </span>
          <DiscountBadge price={item.price} originalPrice={item.originalPrice} />
        </div>
      </div>
    </motion.article>
  );
}

/* ---------------------------------- Hero ---------------------------------- */

function Hero({
  raw,
  onRawChange,
  budget,
  result,
  prefersReducedMotion,
}: {
  raw: string;
  onRawChange: (v: string) => void;
  budget: number;
  result: BudgetResult;
  prefersReducedMotion: boolean;
}) {
  const blobRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: blobRef, offset: ["start start", "end start"] });
  const blobY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 60]);

  const isEmpty = raw.trim() === "";
  const isInvalid = !isEmpty && parseBudgetInput(raw) === null;

  return (
    <section id="hero" ref={blobRef} className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-28">
      <motion.div
        aria-hidden="true"
        style={{ y: blobY, backgroundColor: "var(--accent)" }}
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.16] blur-3xl"
      />
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-6">
          {/* Left: headline, typed control, single CTA */}
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              AI-matched resale
            </p>
            <h1
              className="max-w-[16ch] text-[clamp(2.6rem,1.6rem+5vw,5.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#17171C]"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Type your budget.
              <br />
              Meet your match.
            </h1>
            <p className="max-w-[500px] text-base font-normal leading-[1.6] text-[#52525B] sm:text-lg">
              repick reads condition, fit and brand signals across every listing, then narrows
              them down to the exact number you type below — no slider, no guessing.
            </p>

            <form
              className="flex flex-col gap-2 rounded-2xl border border-[#E7E2D8] bg-white p-4 sm:max-w-[420px]"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="budget-input" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52525B]">
                Your budget
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[#D9D4CB] bg-[#FAFAF8] px-3 py-2">
                <span className="text-lg font-extrabold text-[#17171C]" aria-hidden="true">
                  $
                </span>
                <input
                  id="budget-input"
                  name="budget"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={raw}
                  onChange={(e) => onRawChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                  aria-describedby="budget-helper"
                  placeholder="180"
                  className={`w-full min-w-0 bg-transparent text-lg font-extrabold text-[#17171C] ${focusRing}`}
                />
              </div>
              <p id="budget-helper" className="text-xs font-normal text-[#52525B]" aria-live="polite">
                {isEmpty || isInvalid
                  ? `Keep typing a number — showing matches for ${formatUsd(budget)} for now.`
                  : `Showing matches for ${formatUsd(budget)}${budget >= MAX_BUDGET ? " and up" : ""}.`}
              </p>
            </form>

            <a
              href="#preview"
              className={`inline-flex w-fit items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
            >
              {result.count > 0
                ? `See ${result.count} match${result.count === 1 ? "" : "es"} under ${formatUsd(budget)}`
                : "Raise your budget to see matches"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* Right: live proof — count / top match / savings, then the cards themselves */}
          <div className="flex min-w-0 flex-col gap-5 lg:col-span-5">
            <div
              aria-live="polite"
              className="grid grid-cols-3 gap-3 rounded-2xl border border-[#E7E2D8] bg-white p-4"
            >
              <Stat label="Matches" value={String(result.count)} />
              <Stat label="Top match" value={result.topMatch ? `${result.topMatch.matchPercent}%` : "—"} />
              <Stat label="Avg. saved" value={result.count > 0 ? `${result.avgDiscountPercent}%` : "—"} />
            </div>

            {result.featured.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {result.featured.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState budget={budget} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="text-xl font-extrabold tracking-[-0.02em] text-[#17171C] sm:text-2xl">{value}</span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52525B]">{label}</span>
    </div>
  );
}

function EmptyState({ budget }: { budget: number }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#D9D4CB] bg-white p-6 text-center">
      <SearchX className="h-6 w-6 text-[#52525B]" aria-hidden="true" />
      <p className="text-sm font-semibold text-[#17171C]">
        Nothing under {formatUsd(budget)} yet.
      </p>
      <p className="text-xs font-normal text-[#52525B]">
        The lowest-priced match on repick right now is {formatUsd(MIN_LISTING_PRICE)} — try typing a higher number.
      </p>
    </div>
  );
}

/* ----------------------------- Product preview ----------------------------- */

function ProductPreview({ result, budget }: { result: BudgetResult; budget: number }) {
  const shown = result.matches.slice(0, 6);
  return (
    <section id="preview" className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-10 flex flex-col gap-3 sm:max-w-[560px]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Matched to {formatUsd(budget)}
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-[#17171C] sm:text-4xl">
              Why repick picked these
            </h2>
            <p className="max-w-[480px] text-base font-normal leading-[1.6] text-[#52525B]">
              Every card below is filtered and ranked by the number you typed — only listings at
              or under your budget appear, closest match first.
            </p>
          </div>
        </Reveal>

        {shown.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((item, i) => (
              <Reveal key={item.id} delayMs={Math.min(i, 7) * 60} className="min-w-0">
                <ListingCard item={item} rich />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState budget={budget} />
        )}
      </div>
    </section>
  );
}

/* ------------------------------- Value section ------------------------------- */

function ValueTile({
  folio,
  label,
  value,
  caption,
}: {
  folio: string;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[#E7E2D8] bg-white p-6">
      <span className="text-xs font-semibold tracking-[0.12em] text-[#52525B]">{folio}</span>
      <span className="text-4xl font-extrabold tracking-[-0.02em] text-[#17171C] sm:text-5xl">
        {value}
      </span>
      <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
        {label}
      </span>
      <p className="text-sm font-normal leading-[1.6] text-[#52525B]">{caption}</p>
    </div>
  );
}

function ValueSection({ result, budget }: { result: BudgetResult; budget: number }) {
  return (
    <section
      id="value"
      className="bg-[#F3F1EC] px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-10 flex flex-col gap-3 sm:max-w-[520px]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Value, three ways
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-[#17171C] sm:text-4xl">
              What {formatUsd(budget)} actually gets you
            </h2>
            <p className="max-w-[480px] text-base font-normal leading-[1.6] text-[#52525B]">
              These three numbers move the instant you edit the budget field up in the hero —
              they are read straight off the same listing pool as the cards above.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Reveal className="min-w-0">
            <ValueTile
              folio="01"
              label="Matches found"
              value={String(result.count)}
              caption={
                result.count > 0
                  ? `Listings at or under ${formatUsd(budget)} right now.`
                  : `Nothing clears ${formatUsd(budget)} yet — try a higher number.`
              }
            />
          </Reveal>
          <Reveal delayMs={60} className="min-w-0">
            <ValueTile
              folio="02"
              label="Top match"
              value={result.topMatch ? `${result.topMatch.matchPercent}%` : "—"}
              caption={
                result.topMatch
                  ? `${result.topMatch.title}, the closest fit in your range.`
                  : "No candidate to rank yet at this budget."
              }
            />
          </Reveal>
          <Reveal delayMs={120} className="min-w-0">
            <ValueTile
              folio="03"
              label="Average you save"
              value={result.count > 0 ? `${result.avgDiscountPercent}%` : "—"}
              caption="Average discount off original retail across your matches."
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Social proof -------------------------------- */

const TESTIMONIALS: { initials: string; name: string; quote: string; tone: string }[] = [
  {
    initials: "JM",
    name: "Jordan M.",
    quote: "I typed $120 expecting nothing and got a verified jacket at 94% match. Sold.",
    tone: "#556052",
  },
  {
    initials: "RK",
    name: "Riya K.",
    quote: "The condition grade on my boots was exact — no surprise scuffs at the door.",
    tone: "#8B4A2B",
  },
  {
    initials: "DT",
    name: "Devon T.",
    quote: "Typing a number felt faster than dragging a slider I never trusted anyway.",
    tone: "#2F4858",
  },
];

function SocialProof() {
  return (
    <section id="proof" className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-10 flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
              Trusted by resellers
            </p>
            <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-[#17171C] sm:text-4xl">
              Verified buyers, verified sellers
            </h2>
          </div>
        </Reveal>

        <Reveal>
          <dl className="mb-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {[
              { icon: Users, value: "42,000+", label: "Verified sellers" },
              { icon: ShieldCheck, value: "180,000", label: "Items authenticated" },
              { icon: Star, value: "4.8 / 5", label: "Average buyer rating" },
              { icon: Lock, value: "100%", label: "Escrow-held payments" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex min-w-0 flex-col items-start gap-1">
                <Icon className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <dt className="order-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#52525B]">
                  {label}
                </dt>
                <dd className="order-1 text-2xl font-extrabold tracking-[-0.02em] text-[#17171C]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.initials} delayMs={i * 60} className="min-w-0">
              <figure className="flex h-full flex-col gap-4 rounded-2xl border border-[#E7E2D8] bg-white p-6">
                <Quote className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <blockquote className="text-sm font-normal leading-[1.6] text-[#3F3F46]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: t.tone }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </span>
                  <span className="text-sm font-semibold text-[#17171C]">{t.name}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Closing CTA --------------------------------- */

function ClosingCta({ result, budget }: { result: BudgetResult; budget: number }) {
  return (
    <section id="closing" className="bg-[#17171C] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-6">
        <Reveal>
          <h2 className="max-w-[18ch] text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-white sm:text-5xl">
            {result.count > 0
              ? `${result.count} matches are waiting under ${formatUsd(budget)}.`
              : `Try a higher number — nothing clears ${formatUsd(budget)} yet.`}
          </h2>
        </Reveal>
        <Reveal delayMs={80}>
          <p className="max-w-[480px] text-base font-normal leading-[1.6] text-[#A1A1AA]">
            That count, the top match percentage and the average savings all come from the
            budget field at the top of this page — change it and they change with it.
          </p>
        </Reveal>
        <Reveal delayMs={140}>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#budget-input"
              className={`inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${focusRing}`}
            >
              Jump back to your budget
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#preview"
              className={`inline-flex items-center gap-2 rounded-full border border-[#3F3F46] px-6 py-3 text-sm font-semibold text-white ${focusRing}`}
            >
              Browse this budget&rsquo;s matches
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------- Page ----------------------------------- */

export default function LandingClient() {
  const [raw, setRaw] = useState<string>(String(DEFAULT_BUDGET));
  const [budget, setBudget] = useState<number>(DEFAULT_BUDGET);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const parsed = parseBudgetInput(raw);
    if (parsed === null) return; // empty/invalid mid-typing: keep last valid budget on screen
    const handle = setTimeout(() => setBudget(parsed), 250);
    return () => clearTimeout(handle);
  }, [raw]);

  const result = useMemo(() => computeForBudget(budget), [budget]);

  return (
    <MotionConfig reducedMotion="user">
    <div className="[--accent:#B5461B] min-h-screen bg-[#FAFAF8] font-sans text-[#17171C]">
      <header className="px-5 py-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1200px] items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          <span className="text-sm font-extrabold tracking-[-0.02em] text-[#17171C]">repick</span>
        </div>
      </header>

      <main>
        <Hero
          raw={raw}
          onRawChange={setRaw}
          budget={budget}
          result={result}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
        />
        <ProductPreview result={result} budget={budget} />
        <ValueSection result={result} budget={budget} />
        <SocialProof />
        <ClosingCta result={result} budget={budget} />
      </main>

      <footer className="border-t border-[#E7E2D8] px-5 py-8 text-center sm:px-8 lg:px-10">
        <p className="text-xs font-normal text-[#52525B]">
          repick is a concept resale marketplace. Listing data on this page is illustrative.
        </p>
      </footer>
    </div>
    </MotionConfig>
  );
}
