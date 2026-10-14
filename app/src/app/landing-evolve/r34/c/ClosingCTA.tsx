import Link from "next/link";
import { Eyebrow } from "./ui";
import { FOCUS } from "./theme";
import { computeBreakdown, formatUsd, type CategoryCounts } from "./payout-math";

interface ClosingCtaProps {
  counts: CategoryCounts;
}

/**
 * Closing CTA. The headline figure here is `computeBreakdown(counts)`
 * read fresh on every render — never a hardcoded number — so a seller who
 * changed the counters just above still sees the matching total down
 * here, not a stale demo figure.
 */
export default function ClosingCTA({ counts }: ClosingCtaProps) {
  const { totalPayout, totalItems } = computeBreakdown(counts);
  const itemWord = totalItems === 1 ? "item" : "items";

  return (
    <section id="closing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>YOUR NUMBER, NOT A DEMO NUMBER</Eyebrow>
          <h2 className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
            That estimate above is yours to claim.
          </h2>
          <p className="mt-5 text-base leading-[1.6] text-zinc-300" style={{ maxWidth: "505px" }}>
            List the {totalItems} {itemWord} you just counted and keep an estimated{" "}
            <span className="font-bold tabular-nums text-white">{formatUsd(totalPayout)}</span>{" "}
            after repick&rsquo;s fee &mdash; the exact arithmetic from the breakdown above, with
            nothing new added at checkout.
          </p>
          <div className="mt-8">
            <Link
              href="/catalog"
              className={`inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3.5 text-base font-bold text-[#0B0B0F] transition-opacity hover:opacity-90 ${FOCUS}`}
            >
              List your {itemWord} now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
