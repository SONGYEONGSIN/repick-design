import {
  DAYS_TO_SELL,
  PAYOUT_PCT,
  categoryInfo,
  getTopCompanion,
  type CategoryId,
} from "./data";
import Reveal from "./Reveal";

interface ValueSectionProps {
  selected: CategoryId;
}

export default function ValueSection({ selected }: ValueSectionProps) {
  const info = categoryInfo(selected);
  const { companion, n } = getTopCompanion(selected);
  const days = DAYS_TO_SELL[selected];
  const payout = PAYOUT_PCT[selected];

  return (
    <section className="border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-[40rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-700">
            Value, by category
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-4xl">
            What changes when you switch categories
          </h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600">
            These three numbers are pulled from repick&rsquo;s closed-sale history for{" "}
            <span className="font-semibold text-zinc-900">{info.label}</span>, the
            category selected above &mdash; pick a different one and the whole row
            updates.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Reveal>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Companion demand
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)", fontWeight: 800 }}
              >
                {n}/10
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {info.label} buyers who also bought {companion.label} within 30 days.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Time to sell
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)", fontWeight: 800 }}
              >
                {days}d
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Median days a graded {info.label.toLowerCase()} listing takes to sell.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Seller payout
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)", fontWeight: 800 }}
              >
                {payout}%
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Average share of original retail returned to the seller, after fees.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="mt-8 max-w-[31rem]">
          <p className="text-base leading-relaxed text-zinc-700">
            A <span className="font-semibold text-zinc-900">{info.label}</span>{" "}
            listing reaches{" "}
            <span className="font-semibold tabular-nums text-rose-700">{n}</span> of
            10 {companion.label} buyers, sells in about{" "}
            <span className="font-semibold tabular-nums text-zinc-900">{days}</span>{" "}
            days, and returns roughly{" "}
            <span className="font-semibold tabular-nums text-zinc-900">{payout}%</span>{" "}
            of retail to the seller.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
