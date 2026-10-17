import { BadgeCheck, Headphones } from "lucide-react";
import { Eyebrow } from "./ui";
import { SOLD_COMP } from "./data";
import { ACCENT_SOFT_BG, ACCENT_SOFT_BORDER, FOCUS } from "./theme";
import { computeBreakdown, formatUsd, type CategoryCounts } from "./payout-math";

interface HeroProps {
  counts: CategoryCounts;
}

/**
 * Hero carries the mandatory proof card, physically inside this section —
 * not a separate section below it. Match % and discount % — the two
 * canonical proof elements this catalog otherwise shows — are deliberately
 * left out here: a seller doesn't have a "match %" or a "discount" on
 * their own prospective listing. In their place is a real sold comparable
 * (fixed data) with the two proof elements that *do* transfer to a seller
 * audience — condition grade and a verified-sale badge — next to the live
 * payout panel.
 *
 * Nothing in this component is mount-gated: the headline, subhead, CTA and
 * both proof cards render their final visible state on the very first
 * paint, server-rendered, with no `opacity:0` anywhere.
 */
export default function Hero({ counts }: HeroProps) {
  const { totalPayout, totalItems } = computeBreakdown(counts);
  const itemWord = totalItems === 1 ? "item" : "items";

  return (
    <section id="hero" className="relative border-b border-zinc-200 pb-16 pt-14 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[640px]">
          <Eyebrow>SELLER PAYOUT CALCULATOR</Eyebrow>

          <h1 className="mt-5 text-[clamp(2.25rem,1.85rem+2.1vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-zinc-950">
            Three counters.
            <br />
            One real payout.
          </h1>

          <p className="mt-6 text-base leading-[1.6] text-zinc-600 sm:text-lg" style={{ maxWidth: "505px" }}>
            Set how many items you&rsquo;re listing in Electronics, Fashion and Home below. This
            same screen &mdash; the total, the itemized rows, the category mix &mdash;
            recalculates live, before you click anything else.
          </p>

          <div className="mt-8">
            <a
              href="#calculator"
              className={`inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3.5 text-base font-bold text-[#0B0B0F] transition-opacity hover:opacity-90 ${FOCUS}`}
            >
              Start counting your items
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:max-w-[780px] lg:gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-600">
              Recently sold comparable
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-sky-100"
                style={{ aspectRatio: "1 / 1" }}
                aria-hidden="true"
              >
                <Headphones className="h-6 w-6 text-sky-700" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-zinc-950">{SOLD_COMP.name}</p>
                <p className="truncate text-xs text-zinc-600">
                  {SOLD_COMP.category} &middot; Grade {SOLD_COMP.grade}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
              <span className="text-lg font-bold tabular-nums text-zinc-950">
                {formatUsd(SOLD_COMP.soldPrice)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                Verified sale
              </span>
            </div>
            <p className="mt-2 text-xs leading-[1.5] text-zinc-600">
              Sold in {SOLD_COMP.daysToSell} days. Condition grade is what the buyer saw before
              paying &mdash; the same grading your own items go through.
            </p>
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: ACCENT_SOFT_BORDER, backgroundColor: ACCENT_SOFT_BG }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700">
              Your live estimate
            </p>
            <p
              aria-live="polite"
              className="mt-3 text-[clamp(2rem,1.6rem+1.6vw,3rem)] font-extrabold tabular-nums leading-none text-zinc-950"
            >
              {formatUsd(totalPayout)}
            </p>
            <p className="mt-3 text-sm leading-[1.6] text-zinc-700">
              Estimated payout for {totalItems} {itemWord} across the three counters below.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
