import Link from "next/link";
import { Eyebrow } from "./ui";
import { CONTAINER, FOCUS } from "./theme";
import type { StepId } from "./data";
import { trustScoreState } from "./score-math";

interface ClosingCtaProps {
  inspected: ReadonlySet<StepId>;
}

/**
 * Closing CTA. The sentence reads the exact same `trustScoreState` call the
 * hero card and the value section use — the figure that followed a viewer
 * down the page is literally the same number, never a restated placeholder.
 */
export default function ClosingCTA({ inspected }: ClosingCtaProps) {
  const state = trustScoreState(inspected);

  return (
    <section id="closing" className="py-20 sm:py-28">
      <div className={CONTAINER}>
        <div className="max-w-2xl">
          <Eyebrow>YOUR SCORE, NOT A DEMO NUMBER</Eyebrow>
          <h2
            className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            That score followed you all the way down here.
          </h2>
          <p className="mt-5 max-w-[480px] text-base font-normal leading-[1.6] text-zinc-700">
            {state.score === null ? (
              <>
                You haven&rsquo;t opened a step yet, so there is no honest trust score to show you
                here either. The walk is back at the top of this page, and the full catalog is
                open to browse either way.
              </>
            ) : state.resolved ? (
              <>
                You opened all four steps — the same{" "}
                <span className="font-extrabold tabular-nums text-zinc-950">{state.score}%</span>{" "}
                you built above is what every listing in the catalog has already cleared.
              </>
            ) : (
              <>
                You&rsquo;ve opened {state.inspectedCount} of 4 steps, and the trust score sitting
                at <span className="font-extrabold tabular-nums text-zinc-950">{state.score}%</span>{" "}
                is real, not rounded up. Every listing in the catalog carries the same pipeline,
                whether or not you open each step on it.
              </>
            )}
          </p>
          <div className="mt-8">
            <Link
              href="#preview"
              className={`inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS}`}
            >
              Browse verified listings
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
