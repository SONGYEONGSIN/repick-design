import { ArrowRight } from "lucide-react";

import { type Active, CATEGORIES, LISTINGS, PASS_THRESHOLD, activeCount, computeScore, median } from "./data";
import { FOCUS_RING } from "./ui";

const monoFont = { fontFamily: "var(--font-display-mono)" };

interface ClosingCtaProps {
  active: Active;
}

export default function ClosingCta({ active }: ClosingCtaProps) {
  const scores = LISTINGS.map((l) => computeScore(l, active));
  const passCount = scores.filter((s) => s >= PASS_THRESHOLD).length;
  const med = median(scores);
  const nActive = activeCount(active);
  const activeLabels = CATEGORIES.filter((c) => active[c.id]).map((c) => c.label);

  return (
    <section id="get-started" className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase text-amber-300" style={{ letterSpacing: "0.28em", ...monoFont }}>
                Right now, on your settings
              </p>
              <h2 className="mt-4 max-w-[540px] text-[30px] font-extrabold leading-[1.15] tracking-tight text-white sm:text-[38px]">
                {passCount} of 6 listings clear {nActive} active {nActive === 1 ? "check" : "checks"}, median trust {med}.
              </h2>
              <p className="mt-4 max-w-[460px] text-[15px] leading-[1.6] text-zinc-400">
                {nActive === CATEGORIES.length
                  ? "That's the full pipeline — authenticity, condition, price, and seller history all weighing in."
                  : `Running on ${activeLabels.join(", ")}. Switch the rest back on above for the full read.`}{" "}
                Start a listing and it runs the same six steps, in the same order, every time.
              </p>

              <a
                href="#pipeline"
                className={`mt-8 inline-flex items-center gap-2 rounded-full bg-amber-700 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-amber-600 ${FOCUS_RING}`}
              >
                Run the pipeline again
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`rounded-xl border px-4 py-4 ${
                    active[cat.id] ? "border-amber-700 bg-amber-700/10" : "border-zinc-800 bg-zinc-900/40"
                  }`}
                >
                  <p className={`text-[13px] font-semibold ${active[cat.id] ? "text-white" : "text-zinc-400"}`}>
                    {cat.label}
                  </p>
                  <p className="mt-1 text-[12px] text-zinc-400">{active[cat.id] ? "Weighing in" : "Sitting out"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-zinc-800/80 pt-8 text-[13px] text-zinc-400 sm:flex-row sm:items-center">
          <span className="font-semibold text-zinc-300" style={monoFont}>
            ASSAY
          </span>
          <span>© 2026 Assay. Verification runs on fixed rules, reviewed by people.</span>
        </footer>
      </div>
    </section>
  );
}
