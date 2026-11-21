import Link from "next/link";
import { Eyebrow } from "./ui";
import { FOCUS } from "./theme";
import { averageDays, fastestOf, type CategoryId } from "./categories";

interface ClosingCtaProps {
  selected: CategoryId[];
}

/**
 * Closing CTA. Both the recap sentence and the button's own label read
 * `fastestOf(selected)` fresh on every render — the same derived value
 * the hero headline and live readout already show — so a visitor who
 * changed the chip selection still sees a closing section that agrees
 * with what they just toggled, not a stale demo category.
 */
export default function ClosingCTA({ selected }: ClosingCtaProps) {
  const fastest = fastestOf(selected);
  const avg = averageDays(selected);
  const label = fastest?.label ?? "your category";

  return (
    <section id="closing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>YOUR MIX, NOT A DEMO MIX</Eyebrow>
          <h2 className="mt-4 font-[var(--font-display-wide)] text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950">
            {label} is already the one to price first.
          </h2>
          <p className="mt-5 text-base font-normal leading-[1.6] text-zinc-700" style={{ maxWidth: "480px" }}>
            At a <span className="font-extrabold tabular-nums text-zinc-950">{fastest?.daysToSell ?? "—"}-day</span>{" "}
            median and an{" "}
            <span className="font-extrabold tabular-nums text-zinc-950">{avg}-day</span> average across your whole
            mix, {label.toLowerCase()} is the fastest lever you have in the selection above &mdash; the exact bubble
            you were just looking at, not a separate number.
          </p>
          <div className="mt-8">
            <Link
              href="/catalog"
              className={`inline-flex items-center justify-center rounded-full bg-[#2563EB] px-7 py-3.5 text-base font-bold text-white transition-opacity hover:opacity-90 ${FOCUS}`}
            >
              Check {label} payout timing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
