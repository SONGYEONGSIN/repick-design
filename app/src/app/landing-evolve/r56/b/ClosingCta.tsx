import { ArrowUp } from "lucide-react";
import { getZoneResult } from "./zones";
import { FOCUS_RING, DISPLAY_FONT_STYLE } from "./ui";

export default function ClosingCta({ selectedZoneId }: { selectedZoneId: string }) {
  // Same derivation function as the hero device — the name and the numbers
  // quoted here can never drift from whatever zone is actually selected.
  const result = getZoneResult(selectedZoneId);

  return (
    <section id="cta" aria-labelledby="cta-heading" className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[500px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              05 — Ready when you are
            </p>
            <h2
              id="cta-heading"
              style={DISPLAY_FONT_STYLE}
              className="mt-2 text-[clamp(1.75rem,6vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white"
            >
              Reserve pickup in {result.zone.name}.
            </h2>
            <p className="mt-3 text-sm leading-[1.6] text-zinc-300 tabular-nums">
              {result.listings.length} items ready now · {result.etaLabel} ·{" "}
              {result.feeLabel}
            </p>
          </div>

          <a
            href="#hero"
            className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 ${FOCUS_RING}`}
          >
            Back to the zone grid
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
