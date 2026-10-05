import { DEFAULT_WEIGHTS, SIGNALS, computeShares, type Weights } from "./data";
import { Reveal } from "./reveal";
import { SectionIntro } from "./ui";

export function ValueSplit({ weights }: { weights: Weights }) {
  const shares = computeShares(weights);
  const neutral = computeShares(DEFAULT_WEIGHTS);

  return (
    <section id="value" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="WHAT'S ACTUALLY BEING WEIGHED"
          heading="One score, three signals, zero mystery."
          body="Each of the three dials above scales a real, fixed signal score for this jacket. Here's what each one is actually measuring, and how hard it's pulling on the score at your current settings."
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {SIGNALS.map((signal, i) => {
            const delta = Math.round((shares[signal.id] - neutral[signal.id]) * 10) / 10;
            const sign = delta > 0 ? "+" : "";
            return (
              <Reveal key={signal.id} delay={i * 0.08} className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: signal.fill }}
                  />
                  <h3 className="text-base font-bold text-white">{signal.label}</h3>
                </div>
                <p className="mt-3 max-w-[431px] text-sm leading-[1.6] text-zinc-400">
                  {signal.description}
                </p>
                <p className="mt-4 text-sm text-zinc-300">
                  Right now:{" "}
                  <span className="font-semibold tabular-nums text-white">
                    {shares[signal.id]}%
                  </span>{" "}
                  of the score ·{" "}
                  <span className="tabular-nums text-[#67E8F9]">
                    {sign}
                    {delta} pts
                  </span>{" "}
                  vs repick's neutral 1.0× weighting
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
