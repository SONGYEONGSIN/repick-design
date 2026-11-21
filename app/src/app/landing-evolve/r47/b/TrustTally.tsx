import { ShieldAlert, ShieldCheck } from "lucide-react";
import { formatRange, type Verdict } from "./checkpoint-math";
import { ACCENT_TINT_BG, ACCENT_TINT_TEXT, DISPLAY, MUTED_TEXT_ON_TINT, STAT_LABEL } from "./tokens";

/**
 * The persistent, always-on tally — never gated behind a toggle, never zero at rest. It reads
 * the same Verdict object the deck just recomputed, so every confirm/flag/undo above moves
 * these two numbers immediately, in the same frame.
 */
export function TrustTally({ verdict }: { verdict: Verdict }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
      <div className="min-w-0">
        <p className={`${STAT_LABEL} ${MUTED_TEXT_ON_TINT}`}>Trust score</p>
        <p className={`${DISPLAY} text-xl font-extrabold tabular-nums text-zinc-900`}>
          {verdict.avgScore}
          <span className="text-sm font-semibold text-zinc-500">/100</span>
        </p>
      </div>
      <div className="min-w-0">
        <p className={`${STAT_LABEL} ${MUTED_TEXT_ON_TINT}`}>Est. resale</p>
        <p className={`${DISPLAY} text-xl font-extrabold tabular-nums text-zinc-900`}>
          {formatRange(verdict.priceLow, verdict.priceHigh)}
        </p>
      </div>
      <div className="col-span-2 flex items-center justify-between gap-2 border-t border-zinc-200 pt-1.5">
        <span className={`inline-flex items-center gap-1.5 rounded-full ${ACCENT_TINT_BG} px-2 py-1 text-[11px] font-semibold ${ACCENT_TINT_TEXT}`}>
          {verdict.statusLabel === "Trending Verified" ? (
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {verdict.statusLabel}
        </span>
        <span className={`${MUTED_TEXT_ON_TINT} text-[11px] font-normal tabular-nums`}>
          {verdict.resolvedCount} of {verdict.total} checkpoints resolved
        </span>
      </div>
    </div>
  );
}
