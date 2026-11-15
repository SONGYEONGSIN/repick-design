import type { BucketDef } from "./data";
import type { Stats } from "./stats";
import { formatUsd } from "./stats";
import { MUTED_TEXT, STAT_LABEL } from "./tokens";

type CompositionPanelProps = {
  stats: Stats;
  buckets: BucketDef[];
};

/**
 * The live proof: a proportional stacked bar (segment width = that bucket's current share of all
 * 8 items) plus a legend that repeats every segment's meaning in icon + text + number -- color is
 * never the only carrier. Recomputes on every render straight from `stats`, which is itself
 * derived fresh from wherever the cards currently sit, so there is nothing cached or stale here.
 */
export function CompositionPanel({ stats, buckets }: CompositionPanelProps) {
  return (
    <div aria-live="polite">
      <p className={`${STAT_LABEL} ${MUTED_TEXT}`}>Current split, by item count</p>

      {/* Decorative -- the legend list right below carries the same breakdown as real text, so
          this bar is hidden from the accessibility tree rather than exposed as a confusing
          role="img" whose children would otherwise leak partial text to some screen readers. */}
      <div aria-hidden="true" className="mt-2 flex h-6 w-full overflow-hidden rounded-full border border-[#E4E4E7]">
        {buckets.map((bucket) => {
          const stat = stats.byBucket[bucket.id];
          if (stat.count === 0) return null;
          return (
            <div
              key={bucket.id}
              className={`flex items-center justify-center text-[11px] font-semibold tabular-nums ${bucket.fillClass} ${bucket.onFillTextClass}`}
              style={{ width: `${stat.pct}%` }}
            >
              {stat.pct >= 10 ? stat.count : ""}
            </div>
          );
        })}
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {buckets.map((bucket) => {
          const stat = stats.byBucket[bucket.id];
          const Icon = bucket.icon;
          return (
            <li key={bucket.id} className="flex items-center gap-2 text-[13px]">
              <span className={`flex h-4 w-4 flex-none items-center justify-center rounded-full ${bucket.fillClass}`}>
                <Icon aria-hidden className={`h-2.5 w-2.5 ${bucket.onFillTextClass}`} />
              </span>
              <span className="font-semibold">{bucket.label}</span>
              <span className={`font-normal tabular-nums ${MUTED_TEXT}`}>
                {stat.count} of {stats.total}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[22px] font-extrabold tabular-nums leading-tight" style={{ fontFamily: "var(--font-display-mono)" }}>
        {formatUsd(stats.listPayout)}
      </p>
      <p className={`${MUTED_TEXT} text-[13px] font-normal leading-[1.6]`}>projected cash payout right now</p>

      <p className="mt-3 text-[14px] font-normal leading-[1.6]">{stats.verdict}</p>
    </div>
  );
}
