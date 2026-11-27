import { ArrowRight } from "lucide-react";
import { LISTING_PRICE, describeFilters, type FilterState, type LedgerStats } from "./data";
import Reveal from "./Reveal";

interface ClosingCTAProps {
  filters: FilterState;
  stats: LedgerStats;
}

export default function ClosingCTA({ filters, stats }: ClosingCTAProps) {
  const { count, beatsPct } = stats;
  const filterDescription = describeFilters(filters);
  const beatsLabel = beatsPct !== null ? `${beatsPct}%` : "no comps";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12">
          <div className="max-w-[40rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#176B41]">
              Start selling
            </p>
            <h2
              className="mt-4 text-zinc-900"
              style={{
                fontFamily: "var(--font-display-wide)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                fontSize: "clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)",
              }}
            >
              List at a price the ledger already backs.
            </h2>
            <p className="mt-4 max-w-[31rem] text-base leading-relaxed text-zinc-600">
              Counting {filterDescription}, repick found{" "}
              <span className="font-semibold tabular-nums text-zinc-900">{count}</span>{" "}
              comparable sales, and this{" "}
              <span className="font-semibold tabular-nums text-zinc-900">
                {`$${LISTING_PRICE}`}
              </span>{" "}
              listing still beats{" "}
              <span className="font-semibold tabular-nums text-[#176B41]">{beatsLabel}</span>{" "}
              of them. Your next listing opens with the same ledger attached.
            </p>
            <a
              href="#listings"
              className={[
                "mt-8 inline-flex items-center gap-2 rounded-full bg-[#1E7A4C] px-6 py-3",
                "text-sm font-semibold text-white transition-colors hover:bg-[#176B41]",
                "focus-visible:outline-2 focus-visible:outline-[#176B41] focus-visible:outline-offset-2",
              ].join(" ")}
            >
              List a listing that beats {beatsLabel} of comps
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
