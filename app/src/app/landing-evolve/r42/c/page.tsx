"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Scale, ShieldCheck, SlidersHorizontal, Star, Quote } from "lucide-react";
import {
  computeBracket,
  discountPct,
  formatMoney,
  MODE_LABEL,
  weightPct,
  type PriorityMode,
} from "./data";
import { ACCENT, FOCUS_RING, MUTED, MUTED_ON_TINT } from "./tokens";
import PriorityToggle from "./PriorityToggle";
import BracketTree from "./BracketTree";
import BracketStacked from "./BracketStacked";
import ChampionCard from "./ChampionCard";
import Reveal from "./Reveal";

const VALUE_PROPS = [
  {
    icon: SlidersHorizontal,
    title: "Grades become numbers",
    body:
      "Condition isn't a one-word guess. Every grade converts into the same fit score shown on the bracket, so Excellent and Fair are measured the same way for all eight listings, not just described.",
  },
  {
    icon: ShieldCheck,
    title: "Verification you can check",
    body:
      "A verified badge means a seller's sales history was confirmed against their listing activity — not a claim they typed into their own profile.",
  },
  {
    icon: Scale,
    title: "Weighting is not cosmetic",
    body:
      "Move the priority toggle and the bracket doesn't relabel the same winner. It recomputes every matchup, round by round, and can crown an entirely different listing.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I had four turntables open in tabs before this. The bracket put the two I actually cared about head-to-head and the price-weighted pick was the one I bought.",
    name: "Priya N.",
    role: "Buyer, Portland",
  },
  {
    quote:
      "Switching to condition-weighted knocked my first choice out in the semifinal. Fair, in hindsight — the winner's grade really was cleaner.",
    name: "Mateo R.",
    role: "Buyer, Austin",
  },
];

const STATS = [
  { value: "2,480", label: "Brackets run this season" },
  { value: "8", label: "Comparables scored per bracket" },
  { value: "3", label: "Priority modes to recompute from" },
];

export default function Page() {
  const [mode, setMode] = useState<PriorityMode>("balanced");
  const [showScore, setShowScore] = useState(true);

  const bracket = useMemo(() => computeBracket(mode), [mode]);
  const champion = bracket.champion;
  const championScore =
    bracket.final.winner.id === bracket.final.a.id ? bracket.final.scoreA : bracket.final.scoreB;
  const runnerUp = bracket.final.winner.id === bracket.final.a.id ? bracket.final.b : bracket.final.a;
  const runnerUpScore =
    bracket.final.winner.id === bracket.final.a.id ? bracket.final.scoreB : bracket.final.scoreA;
  const weights = weightPct(mode);

  return (
    <main style={{ backgroundColor: "#FFFFFF" }} className="min-h-screen text-zinc-950">
      {/* ───────── persistent header ───────── */}
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <p className="text-sm font-semibold tracking-[0.12em]">REPICK</p>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#champion" className={`text-sm font-normal text-zinc-700 rounded-md ${FOCUS_RING}`}>
              Why it won
            </a>
            <a href="#value" className={`text-sm font-normal text-zinc-700 rounded-md ${FOCUS_RING}`}>
              How scoring works
            </a>
            <a href="#proof" className={`text-sm font-normal text-zinc-700 rounded-md ${FOCUS_RING}`}>
              Buyer notes
            </a>
          </nav>
          <a
            href="#closing"
            className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT }}
          >
            Add a listing to the bracket
          </a>
        </div>
      </header>

      {/* ───────── hero ───────── */}
      <section className="w-full bg-white">
        <div className="mx-auto max-w-[1600px] px-4 pt-10 pb-16 sm:px-6 lg:px-10">
          <div className="max-w-[640px]">
            <p
              className="text-xs font-semibold tracking-[0.28em]"
              style={{ color: ACCENT }}
            >
              THE BRACKET · TURNTABLES
            </p>
            <h1 className="mt-4 text-[38px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[52px]">
              Eight comparable turntables. One bracket decides the buy.
            </h1>
            <p className={`mt-5 max-w-[520px] text-base font-normal leading-[1.6] ${MUTED}`}>
              Pick how you want price weighed against condition, and the whole
              bracket recalculates underneath you — round of eight, both
              semifinals, the final — until a single champion listing is
              left standing.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#closing"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT }}
              >
                Add a listing to the bracket
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                aria-pressed={showScore}
                onClick={() => setShowScore((s) => !s)}
                className={`rounded-full border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400 ${FOCUS_RING}`}
              >
                {showScore ? "Hide fit scores" : "Show fit scores"}
              </button>
            </div>
          </div>

          <div className="mt-10" id="priority">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Bracket priority
            </p>
            <PriorityToggle mode={mode} onChange={setMode} id="priority" />
            <p className={`mt-3 max-w-[560px] text-sm font-normal leading-[1.6] ${MUTED}`}>
              {MODE_LABEL[mode]} blends each listing&apos;s price score and
              condition grade at {weights.price}% price / {weights.condition}%
              condition — and every matchup below is scored with that exact
              blend, live.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <BracketTree bracket={bracket} showScore={showScore} />
          </div>
          <div className="mt-8">
            <BracketStacked bracket={bracket} showScore={showScore} />
          </div>
        </div>
      </section>

      {/* ───────── product preview / why it won ───────── */}
      <section id="champion" className="border-t border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
              <div>
                <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Why it won</h2>
                <p className={`mt-3 max-w-[560px] text-sm font-normal leading-[1.6] ${MUTED_ON_TINT}`}>
                  Under {MODE_LABEL[mode].toLowerCase()} priority, the{" "}
                  <span className="font-semibold text-zinc-950">
                    {champion.brand} {champion.name}
                  </span>{" "}
                  scored {Math.round(championScore)} and beat the final&apos;s
                  runner-up, the {runnerUp.brand} {runnerUp.name}, who scored{" "}
                  {Math.round(runnerUpScore)} under the same {weights.price}/
                  {weights.condition} price-to-condition split.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex gap-2 text-sm font-normal leading-[1.6] text-zinc-800">
                    <span aria-hidden="true" className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                    Listed at {formatMoney(champion.price)}, {discountPct(champion)}% below its
                    original {formatMoney(champion.originalPrice)} asking price.
                  </li>
                  <li className="flex gap-2 text-sm font-normal leading-[1.6] text-zinc-800">
                    <span aria-hidden="true" className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                    Graded {champion.conditionLabel.toLowerCase()} condition, backed by{" "}
                    {champion.sellerSales} prior sales from the same seller.
                  </li>
                  <li className="flex gap-2 text-sm font-normal leading-[1.6] text-zinc-800">
                    <span aria-hidden="true" className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                    Switch to a different priority above and this card can
                    change — three modes, three different winners.
                  </li>
                </ul>
              </div>
              <ChampionCard listing={champion} score={championScore} size="large" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── value split ───────── */}
      <section id="value" className="border-t border-zinc-100">
        <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em]">What the fit score weighs</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {VALUE_PROPS.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-zinc-200 p-5">
                  <v.icon className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
                  <h3 className="mt-4 text-base font-extrabold tracking-[-0.02em]">{v.title}</h3>
                  <p className={`mt-2 text-sm font-normal leading-[1.6] ${MUTED}`}>{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── social proof ───────── */}
      <section id="proof" className="border-t border-zinc-100 bg-zinc-50">
        <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
          <Reveal>
            <h2 className="text-2xl font-extrabold tracking-[-0.02em]">What buyers are finding</h2>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.04}>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <p className="text-3xl font-extrabold tabular-nums tracking-[0.12em]">{s.value}</p>
                  <p className={`mt-1 text-xs font-normal ${MUTED_ON_TINT}`}>{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={0.08 + i * 0.04}>
                <figure className="h-full rounded-2xl border border-zinc-200 bg-white p-5">
                  <Quote className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                  <blockquote className={`mt-3 text-sm font-normal leading-[1.6] ${MUTED_ON_TINT}`}>
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 flex items-center gap-2 text-xs font-semibold text-zinc-950">
                    <Star className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                    {t.name} <span className={`font-normal ${MUTED_ON_TINT}`}>· {t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── closing cta ───────── */}
      <section className="border-t border-zinc-100">
        <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
          <Reveal>
            <div id="closing" className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-center sm:p-14">
              <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Start your own bracket</h2>
              <p className={`mx-auto mt-3 max-w-[560px] text-sm font-normal leading-[1.6] ${MUTED_ON_TINT}`}>
                {MODE_LABEL[mode]} priority just crowned the{" "}
                <span className="font-semibold text-zinc-950">
                  {champion.brand} {champion.name}
                </span>{" "}
                — {formatMoney(champion.price)}, {discountPct(champion)}% off,{" "}
                {champion.conditionLabel.toLowerCase()} condition. Flip the
                toggle above and a different listing can take the title.
              </p>
              <a
                href="#"
                className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT }}
              >
                Add a listing to the bracket
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
