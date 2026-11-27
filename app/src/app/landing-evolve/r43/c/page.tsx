"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Tag, Package, Camera } from "lucide-react";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]";

type StageKey = "listed" | "inspected" | "authenticated" | "shipped";

const STAGES: { key: StageKey; label: string; confidence: number; eta: number; badges: number }[] = [
  { key: "listed", label: "Listed", confidence: 40, eta: 9, badges: 1 },
  { key: "inspected", label: "Inspected", confidence: 65, eta: 6, badges: 2 },
  { key: "authenticated", label: "Authenticated", confidence: 88, eta: 3, badges: 3 },
  { key: "shipped", label: "Shipped", confidence: 97, eta: 1, badges: 4 },
];

const BADGE_POOL = [
  { icon: BadgeCheck, label: "AI match 94%" },
  { icon: ShieldCheck, label: "Seller verified" },
  { icon: Package, label: "Condition checked" },
  { icon: Tag, label: "Price fair" },
];

export default function Page() {
  const [stageIndex, setStageIndex] = useState(2); // non-trivial default: "Authenticated", not stage 0

  const stage = STAGES[stageIndex];
  const visibleBadges = useMemo(() => BADGE_POOL.slice(0, stage.badges), [stage.badges]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#0369a1] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em]">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#timeline" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}>
              The timeline
            </a>
            <a href="#proof" className={`text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS_RING} rounded-sm`}>
              Reviews
            </a>
          </nav>
          <a
            href="#timeline"
            className={`rounded-md bg-[#0369a1] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#075985] ${FOCUS_RING}`}
          >
            Track an order
          </a>
        </div>
      </header>

      <main id="main-content">
        <section id="timeline" className="px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">ORDER CONFIDENCE</p>
            <h1 className="mt-4 max-w-2xl text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em]">
              Click any stage to see what buyers see.
            </h1>
            <p className="mt-6 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-400">
              Every stage of the pipeline updates the same confidence score,
              badge count, and delivery estimate — not just a progress bar.
            </p>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div>
                <ol className="flex items-center gap-2" aria-label="Verification stages">
                  {STAGES.map((s, i) => {
                    const active = i === stageIndex;
                    const reached = i <= stageIndex;
                    return (
                      <li key={s.key} className="flex min-w-0 flex-1 items-center gap-2">
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => setStageIndex(i)}
                          className={`min-w-0 w-full rounded-lg border px-3 py-3 text-left transition-colors duration-200 ${FOCUS_RING} ${
                            active
                              ? "border-[#38bdf8] bg-[#38bdf8]/10"
                              : reached
                                ? "border-white/20 bg-white/[0.04]"
                                : "border-white/10 bg-transparent"
                          }`}
                        >
                          <span className={`block text-xs font-semibold ${active ? "text-[#7dd3fc]" : "text-zinc-400"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="mt-1 block break-words text-sm font-semibold">{s.label}</span>
                        </button>
                        {i < STAGES.length - 1 && (
                          <div
                            className={`hidden h-px flex-1 sm:block ${reached ? "bg-[#38bdf8]/60" : "bg-white/10"}`}
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-10 max-w-[480px] space-y-4">
                  {[
                    { title: "Three surfaces, one click", body: "Confidence, badges, and delivery estimate all read from the same stage index — pick any stage and all three move together." },
                    { title: "Not just forward progress", body: "Stages stay clickable in any order, so you can compare what Listed looks like against what Shipped looks like." },
                  ].map((v) => (
                    <motion.div
                      key={v.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="rounded-xl border border-white/10 p-5"
                    >
                      <h2 className="text-sm font-semibold">{v.title}</h2>
                      <p className="mt-1.5 text-sm font-normal leading-[1.6] text-zinc-400">{v.body}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="lg:sticky lg:top-24">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-white/[0.05]">
                    <Camera className="h-8 w-8 text-zinc-500" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-semibold">Canon AE-1, fully serviced</p>
                  <div className="mt-3 flex flex-wrap gap-2" aria-live="polite">
                    {visibleBadges.map((b) => {
                      const Icon = b.icon;
                      return (
                        <span
                          key={b.label}
                          className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-1 text-xs font-normal text-zinc-300"
                        >
                          <Icon className="h-3.5 w-3.5 text-[#7dd3fc]" aria-hidden="true" />
                          {b.label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400">CONFIDENCE</p>
                      <p className="mt-1 text-3xl font-bold tabular-nums">{stage.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400">EST. ARRIVAL</p>
                      <p className="mt-1 text-3xl font-bold tabular-nums">{stage.eta}d</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">FROM BUYERS</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2" id="proof">
              <blockquote className="rounded-xl border border-white/10 p-6 text-sm font-normal leading-[1.6] text-zinc-300">
                <span aria-hidden="true" className="text-2xl text-zinc-500">&ldquo;</span>
                I clicked through all four stages before buying. Seeing Listed next to Authenticated side by side sold me.
                <footer className="mt-4 text-xs font-semibold text-zinc-400">— Owen T., buyer</footer>
              </blockquote>
              <blockquote className="rounded-xl border border-white/10 p-6 text-sm font-normal leading-[1.6] text-zinc-300">
                <span aria-hidden="true" className="text-2xl text-zinc-500">&ldquo;</span>
                The delivery estimate actually changed with the stage instead of being a flat &quot;3-5 days&quot; everywhere.
                <footer className="mt-4 text-xs font-semibold text-zinc-400">— Lina F., buyer</footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
              At <span className="text-[#7dd3fc]">{stage.label}</span>, confidence is{" "}
              <span className="tabular-nums">{stage.confidence}%</span> with{" "}
              <span className="tabular-nums">{stage.eta} days</span> to arrival.
            </h2>
            <p className="mt-4 text-sm font-normal text-zinc-400">
              Move through the stages above, then track your own order the same way.
            </p>
            <a
              href="#timeline"
              className={`mt-8 inline-flex items-center rounded-md bg-[#0369a1] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#075985] ${FOCUS_RING}`}
            >
              Track an order
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
