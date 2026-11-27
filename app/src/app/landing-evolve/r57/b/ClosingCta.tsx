import { ArrowUp } from "lucide-react";
import { getRankResult, discountPercent, type CriterionId } from "./lib";
import { FOCUS_RING, DISPLAY_FONT_STYLE, ACCENT } from "./ui";

/**
 * Section 5. Calls the exact same getRankResult() the hero device, the
 * proof wall and the value-prop tiles call — the listing name, price and
 * named priorities here can never drift from whatever order is currently
 * selected.
 */
export default function ClosingCta({ order }: { order: CriterionId[] }) {
  const result = getRankResult(order);
  const discount = discountPercent(result.top);

  return (
    <section id="cta" aria-labelledby="cta-heading" className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[480px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
              05 — Ready when you are
            </p>
            <h2
              id="cta-heading"
              style={DISPLAY_FONT_STYLE}
              className="mt-2 text-[clamp(1.75rem,5.5vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white"
            >
              Reserve the {result.top.title}.
            </h2>
            <p className="mt-3 max-w-[420px] text-sm leading-[1.6] text-zinc-300 tabular-nums">
              ${result.top.price} · {discount}% under market · ranked for{" "}
              {result.primary.label.toLowerCase()} over {result.deprioritized.label.toLowerCase()}
            </p>
          </div>

          <a
            href="#hero"
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110 ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT }}
          >
            Back to the rank chips
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
