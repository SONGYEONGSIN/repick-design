"use client";

import { ArrowDown, GitBranch } from "lucide-react";
import { ReasoningTree } from "./ReasoningTree";
import type { Answers, Match, QuestionId } from "./data";
import { ACCENT_TEXT, BODY_WIDTH_BASE, DISPLAY, EYEBROW, FOCUS_RING } from "./tokens";

export function Hero({
  answers,
  onSelect,
  onRestart,
  match,
}: {
  answers: Answers;
  onSelect: (question: QuestionId, optionId: string) => void;
  onRestart: () => void;
  match: Match | null;
}) {
  return (
    <section id="tree" className="mx-auto max-w-[1440px] px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-10 lg:pb-20 lg:pt-16">
      <p className={`${EYEBROW} ${ACCENT_TEXT} flex items-center gap-2`}>
        <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
        Match reasoning, shown branch by branch
      </p>
      <h1
        className={`${DISPLAY} mt-3 max-w-3xl text-[clamp(2.1rem,4vw+1rem,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.01em] text-[#F5F5F6]`}
      >
        Watch which branch repick actually follows for you.
      </h1>
      <p className={`mt-5 text-base font-normal leading-[1.6] text-zinc-400 ${BODY_WIDTH_BASE}`}>
        Answer three short questions. Each one lights a real branch of our matching logic — not
        a mockup of one — until it lands on the exact shelf of active listings your item sells
        into.
      </p>
      <a
        href="#proof"
        className={`mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-600 px-5 text-sm font-semibold text-zinc-200 transition-colors duration-200 hover:border-[#FB7185]/60 hover:text-white ${FOCUS_RING}`}
      >
        See what sellers get matched into
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </a>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-10">
        <div className="min-w-0 lg:col-span-7">
          <ReasoningTree answers={answers} onSelect={onSelect} onRestart={onRestart} match={match} />
        </div>

        <div className="min-w-0 flex flex-col gap-4 lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm font-semibold text-zinc-200">Why a tree, not a filter list</p>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-400">
              A filter just hides rows. This tree shows the actual decision path your three
              answers take through the same reasoning repick runs for every visitor — the
              branch that lights is the branch that ran.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-sm font-semibold text-zinc-200">What the leaf reports</p>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-400">
              Active seller count and average days-to-sell for that exact archetype — both read
              straight off the same three-factor formula, every time, for any combination of
              answers.
            </p>
          </div>
        </div>
      </div>

      <p className="sr-only">
        This reasoning tree recalculates from a fixed three-factor formula over your budget,
        category, and condition answers. It never uses random numbers or the current date.
      </p>
    </section>
  );
}
