import { CalendarClock, Gauge, LineChart } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import { CATEGORY_ORDER, averageDays, totalItemsAnalyzed, type CategoryId } from "./categories";

interface ValueSectionProps {
  selected: CategoryId[];
}

/**
 * The manipulation-survives recap: the first column is `averageDays`
 * recomputed from the hero's live `selected` state, not a static figure —
 * the other two are fixed operational facts about the data itself, not a
 * repeat of the catalog's usual "$ paid out" + "72 hrs" pair.
 */
export default function ValueSection({ selected }: ValueSectionProps) {
  const avg = averageDays(selected);
  const total = totalItemsAnalyzed(CATEGORY_ORDER);

  const columns = [
    {
      icon: Gauge,
      eyebrow: "LIVE",
      value: `${avg}d`,
      label: `average time-to-sale across the ${selected.length} ${selected.length === 1 ? "category" : "categories"} in your current mix, recalculated as you change it above`,
      live: true,
    },
    {
      icon: LineChart,
      eyebrow: "FIXED",
      value: total.toLocaleString("en-US"),
      label: "listings scored to build these medians, across all six categories, last quarter",
      live: false,
    },
    {
      icon: CalendarClock,
      eyebrow: "FIXED",
      value: "Weekly",
      label: "how often every median on this page recomputes, not once a quarter",
      live: false,
    },
  ] as const;

  return (
    <section id="value" className="border-b border-zinc-200 py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <Eyebrow>WHAT THE NUMBERS ADD UP TO</Eyebrow>
        <h2 className="mt-4 font-[var(--font-display-wide)] text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950">
          The arithmetic behind picking a category.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {columns.map((column, i) => {
            const Icon = column.icon;
            return (
              <Reveal key={column.label} delay={i * 0.08} className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 shrink-0 text-[#1D4ED8]" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600">
                    {column.eyebrow}
                  </span>
                </div>
                <p
                  aria-live={column.live ? "polite" : undefined}
                  className="mt-3 text-3xl font-extrabold tabular-nums tracking-[0.12em] text-zinc-950 sm:text-4xl"
                >
                  {column.value}
                </p>
                <p className="mt-2 max-w-[400px] text-sm font-normal leading-[1.6] text-zinc-600">{column.label}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
