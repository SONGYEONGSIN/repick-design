import Link from "next/link";
import CategoryChips from "./CategoryChips";
import BubbleCluster from "./BubbleCluster";
import { Eyebrow } from "./ui";
import { ACCENT_SOFT_BG, ACCENT_SOFT_BORDER, FOCUS } from "./theme";
import { averageDays, fastestOf, type CategoryId } from "./categories";

interface HeroProps {
  selected: CategoryId[];
  onToggle: (id: CategoryId) => void;
}

/**
 * Headline, subhead, CTA, the category chip input and the bubble cluster
 * output all live inside this one component/section — nothing the device
 * produces is pushed to a section below. The headline's first line, the
 * live readout panel, and the CTA button label are all read fresh from
 * `selected` on every render via `fastestOf`/`averageDays` — there is no
 * hardcoded fallback number anywhere in this file.
 *
 * Grid: on large screens this is a 12-column row with the headline block
 * at columns 1–5 and the chips + cluster device at columns 6–12, in the
 * *same* row — a different split from a 7/5 headline-plus-proof-card row
 * with a full-width device underneath.
 */
export default function Hero({ selected, onToggle }: HeroProps) {
  const fastest = fastestOf(selected);
  const avg = averageDays(selected);
  const fastestLabel = fastest?.label ?? "your category";

  return (
    <section id="hero" className="relative border-b border-zinc-200 pb-16 pt-14 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-5">
            <Eyebrow>SELL-THROUGH BY CATEGORY</Eyebrow>

            <h1 className="mt-5 font-[var(--font-display-wide)] text-[clamp(2.1rem,1.7rem+1.9vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-zinc-950">
              {fastestLabel} sells in {fastest ? fastest.daysToSell : "—"} days.
            </h1>
            <p className="mt-2 font-[var(--font-display-wide)] text-[clamp(1.5rem,1.2rem+1.2vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-500">
              Know the rest before you price anything.
            </p>

            <p className="mt-6 text-base font-normal leading-[1.6] text-zinc-600 sm:text-lg" style={{ maxWidth: "480px" }}>
              Pick the categories you actually sell below. The cluster repacks itself around real
              30&#8209;day sell&#8209;through data for each one &mdash; no estimate hidden until
              checkout, no wizard before the numbers show up.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/catalog"
                className={`inline-flex items-center justify-center rounded-full bg-[#2563EB] px-7 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90 ${FOCUS}`}
              >
                Check {fastestLabel} payout timing
              </Link>
            </div>

            <div
              className="mt-8 rounded-2xl border p-5"
              style={{ borderColor: ACCENT_SOFT_BORDER, backgroundColor: ACCENT_SOFT_BG }}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1D4ED8]">
                Your live mix
              </p>
              <p
                aria-live="polite"
                className="mt-3 text-sm font-normal leading-[1.6] text-zinc-700"
                style={{ maxWidth: "400px" }}
              >
                <span className="font-extrabold tabular-nums text-zinc-950">{selected.length}</span>{" "}
                {selected.length === 1 ? "category" : "categories"} selected &middot; fastest is{" "}
                <span className="font-extrabold text-zinc-950">{fastestLabel}</span> at{" "}
                <span className="font-extrabold tabular-nums text-zinc-950">{fastest?.daysToSell ?? "—"} days</span>{" "}
                &middot; your mix averages{" "}
                <span className="font-extrabold tabular-nums text-zinc-950">{avg} days</span> to sell.
              </p>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-600">
              Categories you sell
            </p>
            <div className="mt-3">
              <CategoryChips selected={selected} onToggle={onToggle} />
            </div>

            <div className="mt-6">
              <BubbleCluster selected={selected} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
