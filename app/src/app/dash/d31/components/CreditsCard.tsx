import { CreditCard } from "lucide-react";
import { CREDITS } from "../lib/data";
import { formatDate, formatKRW, formatNumber } from "../lib/format";
import ProgressBar from "./ProgressBar";

export default function CreditsCard() {
  const pct = (CREDITS.used / CREDITS.total) * 100;
  const nearLimit = pct >= 90;

  return (
    <section aria-labelledby="credits-card-heading" className="rounded-xl border border-white/10 bg-zinc-900/60 p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between">
        <h2 id="credits-card-heading" className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
          <CreditCard className="size-4 text-zinc-500" aria-hidden="true" />
          Credit usage
        </h2>
        {nearLimit && (
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
            Near limit
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-xl font-semibold tabular-nums text-zinc-50">
          {formatNumber(CREDITS.used)}
        </span>
        <span className="text-sm tabular-nums text-zinc-500">/ {formatNumber(CREDITS.total)}</span>
      </div>

      <div className="mt-3">
        <ProgressBar
          value={CREDITS.used}
          max={CREDITS.total}
          label={`Credit usage for this billing cycle ${pct.toFixed(0)}%`}
          toneClassName={nearLimit ? "bg-amber-400" : "bg-indigo-400"}
        />
      </div>

      <dl className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
        <div>
          <dt className="text-zinc-500">Next billing date</dt>
          <dd className="mt-0.5 tabular-nums text-zinc-300">{formatDate(CREDITS.renewalDate)}</dd>
        </div>
        <div className="text-right">
          <dt className="text-zinc-500">Estimated charge</dt>
          <dd className="mt-0.5 tabular-nums text-zinc-300">{formatKRW(CREDITS.estimatedBillingKRW)}</dd>
        </div>
      </dl>
    </section>
  );
}
