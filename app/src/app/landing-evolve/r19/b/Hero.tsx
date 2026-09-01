import Link from "next/link";
import { socialStats } from "./data";
import Ledger from "./Ledger";
import type { Weights } from "./scoring";
import { ACCENT_SOLID, cx, DISPLAY_STYLE, FOCUS, MUTED, NUM, TRACK_EYEBROW, TRACK_STAT, TRANSITION } from "./tokens";

export default function Hero({ weights, onWeightsChange }: { weights: Weights; onWeightsChange: (w: Weights) => void }) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-28 lg:pt-16">
      <div className="flex items-baseline justify-between gap-4">
        <span className={cx("text-[11px] font-semibold uppercase text-zinc-600", TRACK_EYEBROW)}>Reverse auction ledger</span>
        <span className={cx("hidden font-mono text-[11px] uppercase text-zinc-600 sm:inline", TRACK_STAT)}>01 — Ledger</span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-5">
          <h1
            style={DISPLAY_STYLE}
            className="text-[clamp(2.75rem,1.7rem+3.4vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-zinc-900"
          >
            <span className="block">Six sellers.</span>
            <span className="block">One item.</span>
            <span className="block">Ranked live.</span>
          </h1>
          <p className={cx("mt-5 max-w-[480px] text-base leading-relaxed", MUTED)}>
            repick&rsquo;s AI compares condition, verified trust, and shipping speed across every equivalent listing — then reorders the
            board the instant you change what matters most to you.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link
              href="/catalog"
              className={cx("rounded-full px-5 py-3 text-sm font-semibold", ACCENT_SOLID, TRANSITION, FOCUS)}
            >
              See your ranked offers
            </Link>
            <span className={cx(NUM, "text-xs", MUTED)}>{socialStats[0].value} paid to sellers this year</span>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Ledger weights={weights} onWeightsChange={onWeightsChange} />
        </div>
      </div>
    </section>
  );
}
