"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Gem, ShieldCheck, Star, Camera, Tag } from "lucide-react";

const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366f1]";

type CriterionKey = "condition" | "authenticity" | "trust" | "photos" | "price";

const CRITERIA: { key: CriterionKey; label: string; weight: number }[] = [
  { key: "condition", label: "Condition", weight: 0.28 },
  { key: "authenticity", label: "Authenticity", weight: 0.26 },
  { key: "trust", label: "Seller trust", weight: 0.2 },
  { key: "photos", label: "Photo quality", weight: 0.14 },
  { key: "price", label: "Price fairness", weight: 0.12 },
];

const DEFAULT_RATINGS: Record<CriterionKey, number> = {
  condition: 4,
  authenticity: 5,
  trust: 3,
  photos: 4,
  price: 5,
};

function tierOf(score: number): { name: "Bronze" | "Silver" | "Gold"; fill: string; text: string } {
  if (score >= 80) return { name: "Gold", fill: "bg-[#4f46e5]", text: "text-white" };
  if (score >= 60) return { name: "Silver", fill: "bg-zinc-700", text: "text-zinc-100" };
  return { name: "Bronze", fill: "bg-zinc-800", text: "text-zinc-300" };
}

function daysToSellFor(score: number): number {
  if (score >= 85) return 2;
  if (score >= 70) return 3;
  if (score >= 55) return 6;
  return 11;
}

const PEERS = [
  { name: "Mint-condition tripod kit", match: 91, grade: "A", verified: true, off: 18 },
  { name: "Studio strobe set", match: 84, grade: "B+", verified: true, off: 12 },
  { name: "Vintage lens bundle", match: 76, grade: "B", verified: false, off: 9 },
];

export default function Page() {
  const [ratings, setRatings] = useState<Record<CriterionKey, number>>(DEFAULT_RATINGS);

  const score = useMemo(() => {
    const raw = CRITERIA.reduce((sum, c) => sum + ratings[c.key] * c.weight, 0);
    return Math.round((raw / 5) * 100);
  }, [ratings]);

  const tier = tierOf(score);
  const days = daysToSellFor(score);

  function setRating(key: CriterionKey, value: number) {
    setRatings((r) => ({ ...r, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#4f46e5] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em]">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#scorecard" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}>
              The scorecard
            </a>
            <a href="#proof" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}>
              Reviews
            </a>
          </nav>
          <a
            href="#scorecard"
            className={`rounded-md bg-[#4f46e5] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4338ca] ${FOCUS_RING}`}
          >
            Try the scorecard
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* Hero + live scorecard, first fold */}
        <section id="scorecard" className="px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">AI APPRAISAL</p>
              <h1
                style={DISPLAY}
                className="mt-4 text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] lg:max-w-xl"
              >
                Grade it before you list it.
              </h1>
              <p className="mt-6 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-400">
                Rate five criteria and watch the composite score, resale tier, and
                time-to-sell estimate recalculate on the same listing, live.
              </p>

              <div className="mt-10 max-w-[500px] space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                {CRITERIA.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-normal text-zinc-300">{c.label}</span>
                    <div className="flex items-center gap-1.5" role="group" aria-label={`${c.label} rating`}>
                      {[1, 2, 3, 4, 5].map((n) => {
                        const active = n <= ratings[c.key];
                        return (
                          <button
                            key={n}
                            type="button"
                            aria-pressed={active}
                            aria-label={`${c.label}: set to ${n} of 5`}
                            onClick={() => setRating(c.key, n)}
                            className={`rounded-sm p-0.5 transition-colors duration-200 ${FOCUS_RING}`}
                          >
                            <Star
                              className={`h-4 w-4 ${active ? "fill-[#818cf8] text-[#818cf8]" : "fill-transparent text-zinc-600"}`}
                              strokeWidth={1.5}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8">
                <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">YOUR LISTING</p>
                <div className="mt-5 flex items-end justify-between">
                  <span style={DISPLAY} className="text-6xl font-bold tabular-nums tracking-[-0.02em]">
                    {score}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.12em] ${tier.fill} ${tier.text}`}
                  >
                    {tier.name.toUpperCase()}
                  </span>
                </div>
                <div
                  className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10"
                  role="meter"
                  aria-valuenow={score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Composite appraisal score"
                >
                  <motion.div
                    className="h-full rounded-full bg-[#818cf8]"
                    initial={false}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-6 flex items-center gap-2 text-sm font-normal text-zinc-300">
                  <Gem className="h-4 w-4 text-[#818cf8]" aria-hidden="true" />
                  Estimated time to sell:{" "}
                  <span className="font-semibold tabular-nums text-white">{days} days</span>
                </p>
                <div className="mt-6 h-40 w-full rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Product preview — comparable peers, static reference */}
        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">COMPARABLE LISTINGS</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em]">Graded the same way, every time.</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {PEERS.map((p) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-200 hover:border-white/20"
                >
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-white/[0.05]">
                    <Camera className="h-8 w-8 text-zinc-500" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-semibold">{p.name}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-normal text-zinc-400">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-1">
                      <BadgeCheck className="h-3.5 w-3.5 text-[#818cf8]" aria-hidden="true" />
                      {p.match}% match
                    </span>
                    <span className="rounded-full bg-white/[0.06] px-2 py-1">Grade {p.grade}</span>
                    {p.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#818cf8]" aria-hidden="true" />
                        Verified
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-1">
                      <Tag className="h-3.5 w-3.5 text-[#818cf8]" aria-hidden="true" />
                      -{p.off}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value split */}
        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
            {[
              { title: "Weighted, not averaged", body: "Condition and authenticity carry more of the score than photo quality — the way a real buyer reads a listing." },
              { title: "One score, two numbers", body: "The tier and the days-to-sell estimate are both derived from the same composite, so they never disagree." },
              { title: "Your call, every row", body: "Nothing is auto-rated. The five criteria stay editable until you publish." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.04 }}
                className="rounded-xl border border-white/10 p-6"
              >
                <h3 className="text-base font-semibold">{v.title}</h3>
                <p className="mt-2 max-w-[420px] text-sm font-normal leading-[1.6] text-zinc-400">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section id="proof" className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">FROM SELLERS</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <blockquote className="rounded-xl border border-white/10 p-6 text-sm font-normal leading-[1.6] text-zinc-300">
                <span aria-hidden="true" className="text-2xl text-zinc-500">&ldquo;</span>
                I moved my rating from Silver to Gold just by re-photographing the item. The score told me exactly what was cheap to fix.
                <footer className="mt-4 text-xs font-semibold text-zinc-400">— Priya N., camera gear seller</footer>
              </blockquote>
              <blockquote className="rounded-xl border border-white/10 p-6 text-sm font-normal leading-[1.6] text-zinc-300">
                <span aria-hidden="true" className="text-2xl text-zinc-500">&ldquo;</span>
                The days-to-sell number matched reality within a day. That alone got me to trust the grade.
                <footer className="mt-4 text-xs font-semibold text-zinc-400">— Marco D., reseller</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Closing CTA, reflects live state */}
        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 style={DISPLAY} className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
              Right now, your listing scores{" "}
              <span className="tabular-nums text-[#818cf8]">{score}</span> — {tier.name} tier, about{" "}
              <span className="tabular-nums">{days} days</span> to sell.
            </h2>
            <p className="mt-4 text-sm font-normal text-zinc-400">
              Publish with this grade, or go back and adjust a row above.
            </p>
            <a
              href="#scorecard"
              className={`mt-8 inline-flex items-center rounded-md bg-[#4f46e5] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4338ca] ${FOCUS_RING}`}
            >
              Publish this listing
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
