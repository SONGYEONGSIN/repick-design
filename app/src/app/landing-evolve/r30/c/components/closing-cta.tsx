import Link from "next/link";
import { computeOverall, dominantSignal, EXAMPLE_ITEM, type Weights } from "./data";
import { DISPLAY_FONT, Eyebrow, FOCUS } from "./ui";

export function ClosingCta({ weights }: { weights: Weights }) {
  const overall = computeOverall(weights);
  const dominant = dominantSignal(weights);

  return (
    <section id="closing" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>NOTHING HELD BACK</Eyebrow>
          <h2
            className="mt-4 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] font-bold leading-[1.03] tracking-[-0.02em] text-white"
            style={{ fontFamily: `${DISPLAY_FONT}, var(--font-sans)` }}
          >
            Nothing here is hidden — including this.
          </h2>
          <p className="mt-5 max-w-[493px] text-base leading-[1.6] text-zinc-300">
            Right now,{" "}
            <span className="font-semibold text-white">{dominant.label}</span> is carrying the
            most weight behind this {EXAMPLE_ITEM.name.toLowerCase()}&rsquo;s{" "}
            <span className="font-semibold tabular-nums text-white">{overall}%</span> match.
            Scroll back up, move the dial, and watch that number answer to you instead of the
            other way around.
          </p>
          <div className="mt-8">
            <Link
              href="/catalog"
              className={`inline-flex items-center justify-center rounded-full bg-[#0E7490] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#0B5E73] ${FOCUS}`}
            >
              Start your own breakdown
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
