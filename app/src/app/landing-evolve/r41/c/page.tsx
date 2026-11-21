"use client";

import { useState } from "react";
import Hero from "./Hero";
import MatchQuiz from "./MatchQuiz";
import ValueProp from "./ValueProp";
import SocialProof from "./SocialProof";
import ClosingCTA from "./ClosingCTA";
import Reveal from "./Reveal";
import {
  DEFAULT_BUDGET,
  DEFAULT_CATEGORY,
  DEFAULT_TOLERANCE,
  findMatch,
  type Budget,
  type Category,
  type Tolerance,
} from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700";

export default function Page() {
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [budget, setBudget] = useState<Budget>(DEFAULT_BUDGET);
  const [tolerance, setTolerance] = useState<Tolerance>(DEFAULT_TOLERANCE);

  const { best } = findMatch(category, budget, tolerance);

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-orange-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS}`}
      >
        Skip to content
      </a>

      <header className="border-b border-zinc-100 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">repick</span>
          <a
            href="#quiz"
            className={`text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950 ${FOCUS} rounded-sm`}
          >
            Find my match
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero />

        <section
          id="quiz"
          aria-labelledby="quiz-heading"
          className="border-t border-zinc-100 bg-zinc-50 px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-orange-700">
                build your match
              </span>
              <h2
                id="quiz-heading"
                className="mt-4 max-w-[30rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-4xl"
              >
                Three questions. One real match.
              </h2>
              <p className="mt-5 max-w-[30rem] text-base font-normal leading-[1.6] text-zinc-600">
                Pick your category, your budget and the lowest condition
                you&rsquo;d accept — the match on the right recalculates after
                every answer, pulled from today&rsquo;s live-graded inventory.
              </p>
            </Reveal>

            <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8">
              <MatchQuiz
                category={category}
                budget={budget}
                tolerance={tolerance}
                onCategory={setCategory}
                onBudget={setBudget}
                onTolerance={setTolerance}
              />
            </div>
          </div>
        </section>

        <ValueProp category={category} matchLabel={best ? best.name : "No match yet"} />
        <SocialProof />
        <ClosingCTA best={best} />
      </main>

      <footer className="border-t border-zinc-100 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs font-normal text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 repick. Resale, graded.</span>
          <span>Prices shown are sample listings for illustration.</span>
        </div>
      </footer>
    </div>
  );
}
