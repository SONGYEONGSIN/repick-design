import { Clock, TrendingUp, Wallet } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import { computeBreakdown, formatUsd, type CategoryCounts } from "./payout-math";

interface ValueSectionProps {
  counts: CategoryCounts;
}

/**
 * Three-way value split. The first stat is a live recomputation from the
 * current counter state (not a static figure) — the other two are fixed
 * operational facts that do not change with the counters.
 */
export default function ValueSection({ counts }: ValueSectionProps) {
  const { totalPayout, totalItems } = computeBreakdown(counts);
  const itemWord = totalItems === 1 ? "item" : "items";

  const columns = [
    {
      icon: Wallet,
      eyebrow: "LIVE",
      value: formatUsd(totalPayout),
      label: `your estimated payout today, for the ${totalItems} ${itemWord} set in the calculator above`,
      live: true,
    },
    {
      icon: Clock,
      eyebrow: "FIXED",
      value: "2 days",
      label: "average time from a confirmed sale to money in your linked account",
      live: false,
    },
    {
      icon: TrendingUp,
      eyebrow: "FIXED",
      value: "83%",
      label: "average share of the final sale price repick sellers keep, after fees",
      live: false,
    },
  ] as const;

  return (
    <section id="value" className="border-b border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Eyebrow>WHAT SELLING HERE ACTUALLY GETS YOU</Eyebrow>
        <h2 className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
          Three numbers, none of them a sales pitch.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {columns.map((column, i) => {
            const Icon = column.icon;
            return (
              <Reveal key={column.label} delay={i * 0.08} className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 shrink-0 text-sky-300" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                    {column.eyebrow}
                  </span>
                </div>
                <p
                  aria-live={column.live ? "polite" : undefined}
                  className="mt-3 text-3xl font-extrabold tabular-nums tracking-[0.12em] text-white sm:text-4xl"
                >
                  {column.value}
                </p>
                <p className="mt-2 max-w-[400px] text-sm leading-[1.6] text-zinc-400">{column.label}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
