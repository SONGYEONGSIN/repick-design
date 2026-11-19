import { Trophy, Flame, MinusCircle } from "lucide-react";
import Reveal from "./Reveal";
import { getRankResult, criterionDisplay, type CriterionId } from "./lib";
import { ACCENT_TINT } from "./ui";

/**
 * Section 3: three stat tiles that all read the exact same getRankResult()
 * call the hero device and the closing CTA read — the top pick, and the
 * two priorities (rank 1 and rank 4) that the narrative sentence names.
 * Nothing here is a second, independently-typed restatement: every number
 * is pulled live from `order`.
 */
export default function ValueSplit({ order }: { order: CriterionId[] }) {
  const result = getRankResult(order);
  const primaryDisplay = criterionDisplay(result.top, result.primary.id);
  const deprioritizedDisplay = criterionDisplay(result.top, result.deprioritized.id);

  return (
    <section id="value" aria-labelledby="value-heading" className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-[480px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            03 — Three numbers, one ranking
          </p>
          <h2
            id="value-heading"
            className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl"
          >
            This stays live past the hero.
          </h2>
          <p className="mt-3 text-base leading-[1.6] text-zinc-300">
            All three tiles below are read from the rank order you last set
            above — reorder the chips and all three change together, right
            down to which two priorities get named.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Reveal className="min-w-0" delay={0}>
            <div className="h-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <Trophy className="h-5 w-5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Top recomputed pick
              </p>
              <p className="mt-1 truncate text-lg font-extrabold text-white">{result.top.title}</p>
              <p className="mt-1 text-sm font-extrabold tabular-nums text-white">
                ${result.top.price}
              </p>
              <p className="mt-1 text-xs text-zinc-400">at your current weights</p>
            </div>
          </Reveal>

          <Reveal className="min-w-0" delay={0.08}>
            <div className="h-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <Flame className="h-5 w-5" style={{ color: ACCENT_TINT }} aria-hidden="true" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Driving the pick — {result.primary.label}
              </p>
              <p className="mt-1 text-lg font-extrabold tabular-nums text-white">
                {primaryDisplay.value}
              </p>
              <p className="mt-1 text-xs text-zinc-400 tabular-nums">{primaryDisplay.detail}</p>
            </div>
          </Reveal>

          <Reveal className="min-w-0" delay={0.16}>
            <div className="h-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <MinusCircle className="h-5 w-5 text-zinc-400" aria-hidden="true" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                Sacrificed — {result.deprioritized.label}
              </p>
              <p className="mt-1 text-lg font-extrabold tabular-nums text-white">
                {deprioritizedDisplay.value}
              </p>
              <p className="mt-1 text-xs text-zinc-400 tabular-nums">{deprioritizedDisplay.detail}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
