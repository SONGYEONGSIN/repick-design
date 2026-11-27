import { ArrowUp } from "lucide-react";
import { FOCUS_RING, type TradeInResult } from "./lib";
import { Reveal } from "./Reveal";

type ClosingCTAProps = {
  result: TradeInResult;
};

/**
 * Cites the same `result` object the hero counter produced — never a re-typed literal. Move the
 * counter above and this section's numbers move with it.
 */
export function ClosingCTA({ result }: ClosingCTAProps) {
  const { count, tier, avgPayout, totalPayout } = result;

  return (
    <section id="closing-cta" className="border-t border-white/10 bg-[#0b0b0f] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-5xl">
            Ready when your box is.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed tabular-nums text-zinc-400 sm:text-base">
            Your current {count}-item trade-in is worth{" "}
            <span className="font-semibold tabular-nums text-green-400">
              ${totalPayout.toLocaleString("en-US")}
            </span>{" "}
            at the {tier.name} rate — ${avgPayout} per item.
          </p>
          <a
            href="#trade-in-counter"
            className={`mt-7 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 ${FOCUS_RING}`}
          >
            <ArrowUp aria-hidden="true" size={16} />
            Adjust your trade-in
          </a>
        </Reveal>
      </div>
    </section>
  );
}
