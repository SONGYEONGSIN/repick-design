"use client";

import { useId, useMemo, useState } from "react";
import {
  ShieldCheck,
  Percent,
  Tag,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Bookmark,
} from "lucide-react";
import Reveal from "./Reveal";
import Rationale from "./Rationale";
import ProductGlyph from "./ProductGlyph";
import {
  BUDGETS,
  CONDITIONS,
  CATEGORIES,
  BUDGET_LABEL,
  CONDITION_TOLERANCE_LABEL,
  CATEGORY_LABEL,
  ACTUAL_CONDITION_LABEL,
  getProduct,
  buildRationale,
  buildScoreLines,
  type Budget,
  type ConditionTolerance,
  type Category,
} from "./data";

/* ───────── tokens ─────────
   Light theme, orange accent family.
   ACCENT (#EA580C, orange-600) — contrast vs white = 3.56:1.
     → reserved for FILLED backgrounds/borders/bars and LARGE text (≥24px/≥19px bold).
   ACCENT_TEXT (#C2410C, orange-700) — contrast vs white = 5.18:1.
     → used for small accent text, icons, links and the focus ring (clears 4.5:1).
   INK (#111111) — contrast vs white = 18.88:1; contrast vs ACCENT fill = 5.31:1.
     → body ink AND the label color on ACCENT-filled buttons/pills (white-on-ACCENT
       is only 3.56:1 and fails 4.5:1 for small text, so ink is used instead, not white).
   MUTED (zinc-600, #52525B) — contrast vs white = 7.74:1; clears 4.5:1 on the
     light orange-tinted card surfaces too (checked against #FFF7ED-family tints).
-------------------------------------------------------------------------- */
const BG = "#FFFFFF";
const ACCENT = "#EA580C";
const ACCENT_TEXT = "#C2410C";
const INK = "#111111";
const MUTED = "text-zinc-600";

const DISPLAY = { fontFamily: "var(--font-display-wide)" } as const;

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]";

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
      {icon}
      {children}
    </span>
  );
}

function FacetGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const labelId = useId();
  return (
    <div>
      <p id={labelId} className="text-xs font-semibold tracking-[0.16em] text-zinc-600">
        {label.toUpperCase()}
      </p>
      <div role="group" aria-labelledby={labelId} className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.key === value;
          return (
            <button
              key={opt.key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.key)}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                active ? "" : "border border-orange-200 text-zinc-700 hover:border-orange-300"
              }`}
              style={active ? { backgroundColor: ACCENT, color: INK } : undefined}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const BUDGET_OPTIONS = BUDGETS.map((b) => ({ key: b, label: BUDGET_LABEL[b] }));
const CONDITION_OPTIONS = CONDITIONS.map((c) => ({ key: c, label: CONDITION_TOLERANCE_LABEL[c] }));
const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ key: c, label: CATEGORY_LABEL[c] }));

export default function Page() {
  const [budget, setBudget] = useState<Budget>("mid");
  const [tolerance, setTolerance] = useState<ConditionTolerance>("good");
  const [category, setCategory] = useState<Category>("electronics");
  const [scoreOpen, setScoreOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const scoreId = useId();

  const product = useMemo(() => getProduct(category, budget, tolerance), [category, budget, tolerance]);
  const rationale = useMemo(
    () => buildRationale(category, budget, tolerance, product),
    [category, budget, tolerance, product],
  );
  const scoreLines = useMemo(
    () => buildScoreLines(category, budget, tolerance, product),
    [category, budget, tolerance, product],
  );
  const signature = `${category}-${budget}-${tolerance}`;

  return (
    <main style={{ backgroundColor: BG, color: INK }} className="min-h-screen">
      {/* ───────── persistent header ───────── */}
      <header className="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4 sm:px-10">
          <p className="text-sm font-semibold tracking-[0.16em]" style={{ color: INK }}>
            REPICK
          </p>
          <nav className="hidden items-center gap-6 sm:flex">
            <a href="#hero-controls" className={`text-sm font-semibold text-zinc-700 rounded-md ${FOCUS_RING}`}>
              How matching works
            </a>
            <a href="#value" className={`text-sm font-semibold text-zinc-700 rounded-md ${FOCUS_RING}`}>
              Pricing logic
            </a>
          </nav>
          <a
            href="#hero-controls"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: INK }}
          >
            Start matching
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 pb-28 sm:px-10">
        {/* ───────── hero (headline + facets + live rationale + matched card, all one fold) ───────── */}
        <section className="mx-auto max-w-[640px] pt-14 sm:pt-20">
          <p
            className="text-xs font-semibold tracking-[0.28em]"
            style={{ color: ACCENT_TEXT }}
          >
            WHY THIS LISTING
          </p>
          <h1
            className="mt-4 text-[36px] font-extrabold leading-[1.08] tracking-[-0.02em] sm:text-[52px]"
            style={{ color: INK, ...DISPLAY }}
          >
            Your match, reasoned out loud.
          </h1>
          <p className={`mt-5 text-base font-normal leading-[1.6] ${MUTED}`}>
            Pick a budget, a condition tolerance, and a category. The paragraph
            and the listing below it reassemble to fit — new item, new seller,
            new reasoning, every time you change a filter.
          </p>

          <div id="hero-controls" className="mt-9 flex flex-col gap-5">
            <FacetGroup label="Budget" options={BUDGET_OPTIONS} value={budget} onChange={setBudget} />
            <FacetGroup label="Condition tolerance" options={CONDITION_OPTIONS} value={tolerance} onChange={setTolerance} />
            <FacetGroup label="Category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
          </div>

          {/* live rationale paragraph */}
          <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50/70 p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-zinc-600">WHY THIS IS YOUR TOP MATCH</p>
            <div className="mt-2">
              <Rationale signature={signature} text={rationale} />
            </div>
          </div>

          {/* matched product card — proof lives in the hero fold */}
          <div id="top-match" className="mt-5 rounded-2xl border border-orange-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
              <div className="sm:w-[168px] sm:flex-shrink-0">
                <ProductGlyph category={category} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-[0.16em]" style={{ color: ACCENT_TEXT }}>
                  TOP MATCH TODAY
                </p>
                <p className="mt-1 text-xl font-extrabold tracking-[-0.02em]" style={{ color: INK }}>
                  {product.name}
                </p>
                <p className="mt-1 flex items-baseline gap-2 tabular-nums">
                  <span className="text-2xl font-extrabold" style={{ color: ACCENT }}>
                    ${product.price}
                  </span>
                  <span className={`text-sm font-normal line-through ${MUTED}`}>${product.listPrice}</span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge icon={<Percent className="h-3.5 w-3.5" style={{ color: ACCENT_TEXT }} />}>
                    {product.matchPct}% match
                  </Badge>
                  <Badge icon={<Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT_TEXT }} />}>
                    {ACTUAL_CONDITION_LABEL[product.condition]} condition
                  </Badge>
                  <Badge icon={<ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_TEXT }} />}>
                    Verified · {product.sales} sales
                  </Badge>
                  <Badge icon={<Tag className="h-3.5 w-3.5" style={{ color: ACCENT_TEXT }} />}>
                    {product.discount}% off list
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href="#closing"
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-transform active:scale-[0.97] motion-reduce:transition-none ${FOCUS_RING}`}
                    style={{ backgroundColor: ACCENT, color: INK }}
                  >
                    See this match in full
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    aria-pressed={saved}
                    onClick={() => setSaved((s) => !s)}
                    className={`inline-flex items-center gap-1.5 rounded-full border border-orange-200 px-3.5 py-2 text-sm font-semibold text-zinc-700 transition-colors motion-reduce:transition-none ${FOCUS_RING}`}
                  >
                    <Bookmark
                      className="h-3.5 w-3.5"
                      style={{ color: ACCENT_TEXT }}
                      fill={saved ? ACCENT_TEXT : "none"}
                    />
                    {saved ? "Saved" : "Save this match"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-expanded={scoreOpen}
              aria-controls={scoreId}
              onClick={() => setScoreOpen((o) => !o)}
              className={`mt-5 flex w-full items-center justify-between rounded-lg border-t border-orange-100 pt-4 text-sm font-semibold text-zinc-700 ${FOCUS_RING}`}
            >
              How we scored this match
              <ChevronDown
                className={`h-4 w-4 transition-transform motion-reduce:transition-none ${scoreOpen ? "rotate-180" : ""}`}
                style={{ color: ACCENT_TEXT }}
              />
            </button>
            {scoreOpen && (
              <ul id={scoreId} className="mt-3 space-y-2">
                {scoreLines.map((line) => (
                  <li key={line.label} className={`text-sm font-normal leading-relaxed ${MUTED}`}>
                    <span className="font-semibold text-zinc-800">{line.label}</span> — {line.detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ───────── value 3-way split ───────── */}
        <Reveal className="mt-24 sm:mt-28">
          <section id="value">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl" style={{ color: INK }}>
              What&apos;s actually different here
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
                <Sparkles className="h-5 w-5" style={{ color: ACCENT_TEXT }} aria-hidden="true" />
                <p className="mt-3 text-base font-extrabold tracking-[-0.02em]" style={{ color: INK }}>
                  Graded by someone who looked
                </p>
                <p className={`mt-2 text-sm font-normal leading-[1.6] ${MUTED}`}>
                  Every condition grade comes from a specific inspection note, not a
                  single star rating guessed from a thumbnail.
                </p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
                <Tag className="h-5 w-5" style={{ color: ACCENT_TEXT }} aria-hidden="true" />
                <p className="mt-3 text-base font-extrabold tracking-[-0.02em]" style={{ color: INK }}>
                  Priced against what it used to cost
                </p>
                <p className={`mt-2 text-sm font-normal leading-[1.6] ${MUTED}`}>
                  Original retail price sits next to the asking price on every
                  listing, so the discount shown is arithmetic, not marketing.
                </p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
                <ShieldCheck className="h-5 w-5" style={{ color: ACCENT_TEXT }} aria-hidden="true" />
                <p className="mt-3 text-base font-extrabold tracking-[-0.02em]" style={{ color: INK }}>
                  Sellers who answer
                </p>
                <p className={`mt-2 text-sm font-normal leading-[1.6] ${MUTED}`}>
                  Response time is tracked per seller and factored into ranking —
                  being fast to reply counts for more than being first to list.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ───────── social proof ───────── */}
        <Reveal className="mt-24 sm:mt-28" delay={0.05}>
          <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl" style={{ color: INK }}>
            A few buyers who filtered their way here
          </h2>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2 tabular-nums">
            <p>
              <span className="text-3xl font-extrabold" style={{ color: ACCENT }}>
                4.8
              </span>{" "}
              <span className={`text-sm font-normal tracking-[0.12em] ${MUTED}`}>AVG. RATING · 12,400 REVIEWS</span>
            </p>
            <p>
              <span className="text-3xl font-extrabold" style={{ color: ACCENT }}>
                68%
              </span>{" "}
              <span className={`text-sm font-normal tracking-[0.12em] ${MUTED}`}>AVG. DISCOUNT VS. ORIGINAL RETAIL</span>
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {[
              {
                quote:
                  "I set Good or better and under $150 for a coat — the reasoning told me exactly why that one, not just a price.",
                who: "R. Annan, Chicago",
              },
              {
                quote:
                  "Switched to Any condition for a cheaper hub and the savings math actually changed with it, not just the headline.",
                who: "J. Park, Seattle",
              },
              {
                quote:
                  "The seller sales count next to the match made the discount feel earned, not suspicious.",
                who: "L. Ferreira, Austin",
              },
            ].map((t) => (
              <div key={t.who} className="rounded-2xl border border-orange-100 p-5">
                <p className="text-sm font-normal leading-[1.6] text-zinc-800">&ldquo;{t.quote}&rdquo;</p>
                <p className={`mt-3 text-xs font-semibold tracking-[0.16em] ${MUTED}`}>{t.who.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ───────── closing CTA — recaps the live facet state ───────── */}
        <Reveal className="mt-24 sm:mt-28" delay={0.05}>
          <div id="closing" className="rounded-3xl border border-orange-200 bg-orange-50/70 p-8 text-center sm:p-14">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl" style={{ color: INK }}>
              Ready when your filters are
            </h2>
            <p className={`mx-auto mt-3 max-w-[480px] text-sm font-normal ${MUTED}`}>
              Currently dialed to {CATEGORY_LABEL[category]} · {BUDGET_LABEL[budget]} ·{" "}
              {CONDITION_TOLERANCE_LABEL[tolerance]}.
            </p>
            <p className="mt-1 text-lg font-extrabold tracking-[-0.02em] tabular-nums" style={{ color: INK }}>
              Top match: {product.name} at ${product.price}
            </p>
            <p className={`mx-auto mt-2 max-w-[460px] text-xs font-normal ${MUTED}`}>
              This recap is pulled from whatever you selected above, not fixed
              copy — change a filter and it updates right where it sits.
            </p>
            <a
              href="#top-match"
              className={`mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform active:scale-[0.97] motion-reduce:transition-none ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT, color: INK }}
            >
              See more {CATEGORY_LABEL[category]} matches
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
