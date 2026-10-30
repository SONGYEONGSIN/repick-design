"use client";

import { useState } from "react";
import { ArrowRight, Quote } from "lucide-react";
import Hero from "./Hero";
import Reveal from "./Reveal";
import { STAGES } from "./data";
import { FOCUS_RING, PROSE_14 } from "./theme";

const TESTIMONIALS = [
  {
    quote:
      "I clicked through all four stages before buying. Seeing Listed next to Authenticated side by side sold me.",
    name: "Owen T.",
    role: "buyer",
  },
  {
    quote:
      'The delivery estimate actually changed with the stage instead of being a flat "3-5 days" everywhere.',
    name: "Lina F.",
    role: "buyer",
  },
];

export default function Page() {
  // Non-trivial default: starts on "Authenticated" (index 2), never the
  // empty/zero stage on first paint — and there's no reset action at all, so
  // the doctrine never needs to re-apply after a reset either.
  const [stageIndex, setStageIndex] = useState(2);
  const stage = STAGES[stageIndex];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
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
            <a
              href="#hero"
              className={`rounded-sm text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
            >
              The timeline
            </a>
            <a
              href="#proof"
              className={`rounded-sm text-sm font-semibold text-zinc-400 transition-colors duration-200 hover:text-white ${FOCUS_RING}`}
            >
              Reviews
            </a>
          </nav>
          <a
            href="#hero"
            className={`rounded-md bg-[#0369a1] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#075985] ${FOCUS_RING}`}
          >
            Track an order
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero stageIndex={stageIndex} onSelectStage={setStageIndex} />

        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-zinc-400">FROM BUYERS</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2" id="proof">
              {TESTIMONIALS.map((t, i) => (
                <Reveal
                  key={t.name}
                  delay={i * 0.08}
                  className="min-w-0 rounded-xl border border-white/10 p-6"
                >
                  <Quote className="h-5 w-5 text-zinc-500" aria-hidden="true" />
                  <p className={`mt-3 text-sm font-normal leading-[1.6] text-zinc-300 ${PROSE_14}`}>
                    {t.quote}
                  </p>
                  <p className="mt-4 text-xs font-semibold text-zinc-400">
                    — {t.name}, {t.role}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10">
          <Reveal className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-white sm:text-3xl">
              At <span className="text-[#7dd3fc]">{stage.label}</span>, confidence is{" "}
              <span className="tabular-nums">{stage.confidence}%</span> with{" "}
              <span className="tabular-nums">{stage.badges}</span> proof badges confirmed and{" "}
              <span className="tabular-nums">{stage.eta}</span> days to arrival.
            </h2>
            <p className="mt-4 text-sm font-normal text-zinc-400">
              Move through the stages above, then track your own order the same way.
            </p>
            <a
              href="#hero"
              className={`mt-8 inline-flex items-center gap-2 rounded-md bg-[#0369a1] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#075985] ${FOCUS_RING}`}
            >
              Track an order
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
