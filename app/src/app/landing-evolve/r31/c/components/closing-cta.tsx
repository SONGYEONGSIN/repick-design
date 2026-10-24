import Link from "next/link";
import { CATEGORIES, computeEstimate, type Selections } from "./data";
import { Eyebrow, FOCUS } from "./ui";

export function ClosingCta({ selections }: { selections: Selections }) {
  const estimate = computeEstimate(selections);
  const category = CATEGORIES[selections.category];

  return (
    <section id="closing" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>YOUR NUMBERS, NOT A DEMO</Eyebrow>
          <h2
            className="mt-4 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] font-bold leading-[1.03] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display-grotesk), var(--font-sans)" }}
          >
            That payout above is yours to claim.
          </h2>
          <p className="mt-5 max-w-[480px] text-base leading-[1.6] text-zinc-300">
            List your {category.ctaNoun} at the settings you chose above and keep an
            estimated{" "}
            <span className="font-semibold tabular-nums text-white">
              ${estimate.payoutLow}–${estimate.payoutHigh}
            </span>{" "}
            after our fee — the exact arithmetic from the breakdown above, with nothing added
            at checkout.
          </p>
          <div className="mt-8">
            <Link
              href="/catalog"
              className={`inline-flex items-center justify-center rounded-full bg-[#6D4AE0] px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#5B3BC4] ${FOCUS}`}
            >
              List your {category.ctaNoun}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
