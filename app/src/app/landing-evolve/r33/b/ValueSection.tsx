import { LISTING_PRICE, describeFilters, type FilterState, type LedgerStats } from "./data";
import Reveal from "./Reveal";

interface ValueSectionProps {
  filters: FilterState;
  stats: LedgerStats;
}

export default function ValueSection({ filters, stats }: ValueSectionProps) {
  const { count, medianPrice, beatsPct, grid } = stats;
  const filterDescription = describeFilters(filters);

  return (
    <section className="border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="max-w-[40rem]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#176B41]">
            Value, recounted
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
            Manipulating the ledger is the point
          </h2>
          <p className="mt-3 max-w-[31rem] text-base leading-relaxed text-zinc-600">
            Switch a filter in the hero above and these three numbers recompute
            from the same 96 sales — nothing here is a separate lookup.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Reveal>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Comps counted
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
              >
                {count}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Closed sales meeting {filterDescription}, out of 96 on file.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                Median comp price
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
              >
                {medianPrice !== null ? `$${medianPrice}` : "—"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Midpoint of every counted sale&rsquo;s closing price.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                This listing beats
              </p>
              <p
                className="mt-3 text-4xl tabular-nums text-[#176B41]"
                style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800 }}
              >
                {beatsPct !== null ? `${beatsPct}%` : "—"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Share of counted comps priced above this listing&rsquo;s{" "}
                <span className="tabular-nums">{`$${LISTING_PRICE}`}</span>.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16} className="mt-8 max-w-[31rem]">
          <p className="text-base leading-relaxed text-zinc-700">
            Counting {filterDescription}, the ledger holds{" "}
            <span className="font-semibold tabular-nums text-zinc-900">{count}</span>{" "}
            closed sales across{" "}
            <span className="font-semibold tabular-nums text-zinc-900">
              {grid.nonzeroCells}
            </span>{" "}
            of its {grid.totalCells} month-by-band cells. Its median sits at{" "}
            <span className="font-semibold tabular-nums text-zinc-900">
              {medianPrice !== null ? `$${medianPrice}` : "—"}
            </span>
            , and this <span className="tabular-nums">{`$${LISTING_PRICE}`}</span> listing
            beats{" "}
            <span className="font-semibold tabular-nums text-[#176B41]">
              {beatsPct !== null ? `${beatsPct}%` : "—"}
            </span>{" "}
            of them on price.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
