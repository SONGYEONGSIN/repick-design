import { SectionIntro } from "./ui";
import { CONTAINER } from "./theme";
import type { StepId } from "./data";
import { trustScoreState } from "./score-math";

interface ValueSectionProps {
  inspected: ReadonlySet<StepId>;
}

/**
 * The required value 3-split. Column one is explicitly LIVE — the same
 * `trustScoreState` call the hero card and the closing CTA use, so the
 * figure a viewer built by clicking steps keeps following them down the
 * page. Columns two and three are FIXED catalog-wide facts, labeled as
 * such so the contrast with column one is legible rather than implied.
 */
export default function ValueSection({ inspected }: ValueSectionProps) {
  const state = trustScoreState(inspected);

  return (
    <section id="value" className="border-b border-zinc-200 py-20 sm:py-28">
      <div className={CONTAINER}>
        <SectionIntro
          eyebrow="WHY THE NUMBER CAN BE TRUSTED"
          heading="A score you built is worth more than one we asserted."
          body="Every listing in the catalog clears the same pipeline the walk above showed you. These are the facts that don't change no matter which steps you open."
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-800">Live</p>
            <p className="mt-2 text-4xl font-extrabold tabular-nums tracking-[0.02em] text-zinc-950">
              {state.score === null ? "—" : `${state.score}%`}
            </p>
            <p className="mt-1 max-w-[280px] text-sm font-normal leading-[1.6] text-zinc-600">
              Your trust score so far, from {state.inspectedCount}/4 steps you&rsquo;ve opened
              above.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Fixed</p>
            <p className="mt-2 text-4xl font-extrabold tabular-nums tracking-[0.02em] text-zinc-950">
              11 min
            </p>
            <p className="mt-1 max-w-[280px] text-sm font-normal leading-[1.6] text-zinc-600">
              Average time a listing spends inside the verification walk before it goes live.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Fixed</p>
            <p className="mt-2 text-4xl font-extrabold tabular-nums tracking-[0.02em] text-zinc-950">
              1 in 6
            </p>
            <p className="mt-1 max-w-[280px] text-sm font-normal leading-[1.6] text-zinc-600">
              Listings that fail a check inside the walk and never reach the catalog at all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
