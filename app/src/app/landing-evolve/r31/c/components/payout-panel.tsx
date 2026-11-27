import { Percent, Receipt, Wallet } from "lucide-react";
import { CATEGORIES, type Estimate, type Selections } from "./data";
import { ACCENT_SOFT_BG, ACCENT_SOFT_BORDER } from "./ui";

/**
 * Itemized, receipt-style breakdown. A real `<dl>` — each line item's icon
 * lives inside its `<dt>`, and the payout row is the one place `dd` gets a
 * second line (the per-item arithmetic) so a sighted or screen-reader user
 * can see the subtraction, not just the result.
 */
export function PayoutPanel({ selections, estimate }: { selections: Selections; estimate: Estimate }) {
  const category = CATEGORIES[selections.category];
  const feePct = Math.round(estimate.feeRate * 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <h2 className="text-base font-bold text-white">Your estimated payout</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Recalculated live from the four choices on the left — for this {category.label.toLowerCase()}.
      </p>

      <dl className="mt-5 divide-y divide-white/10">
        <div className="flex items-start justify-between gap-4 py-3.5">
          <dt className="flex items-center gap-2.5 text-sm font-semibold text-zinc-300">
            <Receipt className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            AI-suggested price range
          </dt>
          <dd className="shrink-0 text-right text-sm font-bold tabular-nums text-white">
            ${estimate.priceLow}–${estimate.priceHigh}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4 py-3.5">
          <dt className="flex items-center gap-2.5 text-sm font-semibold text-zinc-300">
            <Percent className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
            Our fee ({feePct}% of price)
          </dt>
          <dd className="shrink-0 text-right text-sm font-bold tabular-nums text-zinc-300">
            −${estimate.feeLow}–${estimate.feeHigh}
          </dd>
        </div>

        <div
          className="-mx-5 flex flex-col gap-2 rounded-xl px-5 py-4 sm:-mx-6 sm:flex-row sm:items-start sm:justify-between sm:px-6"
          style={{ backgroundColor: ACCENT_SOFT_BG, borderTop: `1px solid ${ACCENT_SOFT_BORDER}` }}
        >
          <dt className="flex items-center gap-2.5 text-sm font-bold text-white">
            <Wallet className="h-4 w-4 shrink-0 text-[#AE9BFF]" aria-hidden="true" />
            Your estimated payout
          </dt>
          <dd className="sm:shrink-0 sm:text-right">
            <span className="block text-2xl font-bold tabular-nums text-white">
              ${estimate.payoutLow}–${estimate.payoutHigh}
            </span>
            <span className="block text-[12px] tabular-nums text-zinc-400">
              ${estimate.priceLow}−${estimate.feeLow} and ${estimate.priceHigh}−${estimate.feeHigh}
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
