import { COLOR } from "./data";
import type { WaterfallResult } from "./savings-math";
import Reveal from "./Reveal";

interface ValueSectionProps {
  waterfall: WaterfallResult;
}

export default function ValueSection({ waterfall }: ValueSectionProps) {
  const { finalPrice, totalSavings, savingsPct, enabledCount } = waterfall;

  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-[31rem]">
          <p
            className="text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: COLOR.accentDark }}
          >
            Value, recomputed
          </p>
          <h2
            className="mt-3 text-zinc-900"
            style={{
              fontFamily: "var(--font-display-wide)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              fontSize: "clamp(1.75rem, 1.5rem + 1vw, 2.5rem)",
            }}
          >
            Two of these numbers move when you do
          </h2>
          <p className="mt-3 text-base leading-relaxed" style={{ color: COLOR.muted }}>
            Switch a condition above and the first two stats here update with
            it. The third is a catalog-wide figure, shown for scale.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Reveal>
            <div className="min-w-0 rounded-2xl border border-zinc-200 p-6" style={{ backgroundColor: COLOR.bg }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: COLOR.muted }}>
                Your price right now
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
              >
                {`$${finalPrice}`}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                Listing price minus every condition you currently have on.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="min-w-0 rounded-2xl border border-zinc-200 p-6" style={{ backgroundColor: COLOR.bg }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: COLOR.muted }}>
                You&rsquo;re saving
              </p>
              <p
                className="mt-3 text-4xl tabular-nums"
                style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800, color: COLOR.accentDark }}
              >
                {`$${totalSavings}`}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                {enabledCount > 0
                  ? `That's ${savingsPct}% off the listing price, from ${enabledCount} active condition${enabledCount === 1 ? "" : "s"}.`
                  : "Switch a condition on above to start counting."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="min-w-0 rounded-2xl border border-zinc-200 p-6" style={{ backgroundColor: COLOR.bg }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: COLOR.muted }}>
                Buyers stacking conditions, catalog-wide
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
              >
                68%
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                Share of repick buyers who qualify for at least one condition
                on checkout, across every category.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
