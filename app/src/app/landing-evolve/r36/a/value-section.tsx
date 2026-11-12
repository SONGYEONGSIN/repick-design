import { Gauge, LineChart, ShieldCheck } from "lucide-react";
import { categoryById, formatDelta, money, type CategoryId, type SlopeRow } from "./data";
import { Reveal } from "./reveal";
import { EYEBROW, NUM } from "./tokens";

interface ValueSectionProps {
  categoryId: CategoryId;
  selectedRow: SlopeRow;
}

/**
 * Recap, further down the page, of the exact same selection the hero's device just computed --
 * `selectedRow` is passed down from the one shared `landing-client` state, never re-derived or
 * hardcoded here.
 */
export function ValueSection({ categoryId, selectedRow }: ValueSectionProps) {
  const category = categoryById(categoryId);
  const verb = selectedRow.direction === "up" ? "underpriced" : selectedRow.direction === "down" ? "overpriced" : "priced right";

  return (
    <section id="how-it-works" className="border-b border-zinc-200">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className={`${EYEBROW} text-teal-700`}>Behind the number</p>
          <h2 className="mt-3 max-w-xl font-[var(--font-display-wide)] text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-zinc-950">
            What actually moves a price correction
          </h2>
          <p className="mt-4 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-600">
            Right now the device above is reading a {selectedRow.grade.label.toLowerCase()}-grade{" "}
            {category.singular}: listed at{" "}
            <span className={`font-semibold text-zinc-950 ${NUM}`}>{money(selectedRow.listedPrice)}</span>, AI-priced
            at <span className={`font-semibold text-zinc-950 ${NUM}`}>{money(selectedRow.aiPrice)}</span> &mdash;{" "}
            <span className="font-semibold text-teal-700">{formatDelta(selectedRow.delta)}</span>, meaning it was{" "}
            {verb} by the asking price alone.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          <Reveal delay={0}>
            <div className="min-w-0">
              <Gauge className="h-6 w-6 text-teal-700" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-extrabold text-zinc-950">Condition, scored before it&rsquo;s a grade</h3>
              <p className="mt-2 max-w-[400px] text-sm font-normal leading-[1.6] text-zinc-600">
                Wear, finish and completeness are scored on a 0&ndash;100 scale first. &ldquo;
                {selectedRow.grade.label}&rdquo; is the label that score earns &mdash; not the other
                way around.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="min-w-0">
              <LineChart className="h-6 w-6 text-teal-700" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-extrabold text-zinc-950">Category demand, weighted in</h3>
              <p className="mt-2 max-w-[400px] text-sm font-normal leading-[1.6] text-zinc-600">
                The same condition score is worth more in a category buyers are actively chasing.
                {" "}{category.label} is currently trading at a {category.demandIndex}/100 demand read.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="min-w-0">
              <ShieldCheck className="h-6 w-6 text-teal-700" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-extrabold text-zinc-950">A verdict, not a suggestion</h3>
              <p className="mt-2 max-w-[400px] text-sm font-normal leading-[1.6] text-zinc-600">
                The two signals resolve to one AI price per listing, shown next to the asking price
                every time &mdash; never a range you have to interpret yourself.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
