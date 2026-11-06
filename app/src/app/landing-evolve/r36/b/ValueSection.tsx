import { Gauge, ShieldCheck, Users } from "lucide-react";
import Reveal from "./Reveal";
import { Eyebrow } from "./ui";
import { CONCERNS, FEATURED_LISTING, GRID_LISTINGS, type ConcernId } from "./data";
import { aggregateForSelection, catalogAverageCoverage } from "./score-math";

interface ValueSectionProps {
  selected: ReadonlySet<ConcernId>;
}

/**
 * The value-section recap the brief's "manipulation survives to CTA"
 * doctrine asks for: column one is the exact same `aggregateForSelection`
 * call the hero's ring cluster makes, against the same featured listing
 * and the same `selected` state — not a second, independently-typed
 * figure. Columns two and three are fixed, selection-independent facts,
 * labelled FIXED to make the contrast explicit.
 */
export default function ValueSection({ selected }: ValueSectionProps) {
  const selectedIds = CONCERNS.filter((c) => selected.has(c.id)).map((c) => c.id);
  const aggregate = aggregateForSelection(FEATURED_LISTING.scores, selectedIds);
  const catalogAvg = catalogAverageCoverage(GRID_LISTINGS);

  const columns = [
    {
      icon: Gauge,
      eyebrow: "LIVE",
      value: aggregate === null ? "—" : `${aggregate}%`,
      label: `match confidence for the Leica M6 above, recalculated from the ${selectedIds.length} concern${
        selectedIds.length === 1 ? "" : "s"
      } you picked`,
      live: true,
    },
    {
      icon: ShieldCheck,
      eyebrow: "FIXED",
      value: `${catalogAvg.toFixed(1)} / 5`,
      label: "average number of concerns a listing on this catalog fully clears, independent of which ones you toggle",
      live: false,
    },
    {
      icon: Users,
      eyebrow: "FIXED",
      value: "14",
      label: "independent inspection partners who can countersign a verified badge — none are self-issued",
      live: false,
    },
  ] as const;

  return (
    <section id="value" className="border-b border-zinc-200 py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <Eyebrow>STILL YOUR SELECTION</Eyebrow>
        <h2
          className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-zinc-950"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          This number doesn&rsquo;t reset once you leave the rings.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {columns.map((column, i) => {
            const Icon = column.icon;
            return (
              <Reveal key={column.label} delay={i * 0.08} className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Icon className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                    {column.eyebrow}
                  </span>
                </div>
                <p
                  aria-live={column.live ? "polite" : undefined}
                  className="mt-3 text-3xl font-bold tabular-nums tracking-[0.12em] text-zinc-950 sm:text-4xl"
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
