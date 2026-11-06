// Thin, non-interactive context strip. Deliberately subordinate to the
// word-cloud + frequency-table explorer below it — four read-only stats, no
// click handlers, no state.
import { TrendingUp } from "lucide-react";
import { KPI_TOTAL, KPI_SENTIMENT, MENTIONS_TREND, SECTION_IDS, type Sentiment } from "./data";
import { Card, Sparkline, Progress } from "./ui";
import { SENTIMENT_ICON, SENTIMENT_TEXT_CLASS, SENTIMENT_FILL_CLASS } from "./sentiment-meta";

const NUMBER_FORMAT = new Intl.NumberFormat("en-US");

function sentimentShare(key: Sentiment): number {
  return Math.round((KPI_SENTIMENT[key] / KPI_TOTAL) * 1000) / 10;
}

const trendFirst = MENTIONS_TREND[0];
const trendLast = MENTIONS_TREND[MENTIONS_TREND.length - 1];
const trendDeltaPct = Math.round(((trendLast - trendFirst) / trendFirst) * 1000) / 10;

const SENTIMENT_ORDER: Sentiment[] = ["positive", "neutral", "negative"];

export function KpiStrip() {
  return (
    <section id={SECTION_IDS.overview} aria-labelledby="overview-heading" className="min-w-0">
      <h2
        id="overview-heading"
        className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-400"
      >
        Overview · Last 30 days
      </h2>
      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        <Card className="col-span-6 min-w-0 sm:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Total mentions</p>
          <div className="mt-2 flex flex-col gap-1.5">
            <p className="text-2xl font-bold tabular-nums text-zinc-50">{NUMBER_FORMAT.format(KPI_TOTAL)}</p>
            <Sparkline
              data={MENTIONS_TREND}
              width={80}
              height={22}
              summary={`Weekly mention volume trend, ${trendDeltaPct >= 0 ? "up" : "down"} ${Math.abs(trendDeltaPct)}% over 12 weeks`}
            />
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-normal tabular-nums text-zinc-400">
            <TrendingUp aria-hidden="true" className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-medium text-emerald-400">+{trendDeltaPct}%</span> vs. 12 weeks ago
          </p>
        </Card>

        {SENTIMENT_ORDER.map((key) => {
          const Icon = SENTIMENT_ICON[key];
          const pct = sentimentShare(key);
          return (
            <Card key={key} className="col-span-6 min-w-0 sm:col-span-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                <Icon aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${SENTIMENT_TEXT_CLASS[key]}`} />
                <span className="truncate">{key}</span>
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-zinc-50">{pct.toFixed(1)}%</p>
              <p className="mt-1.5 text-xs font-normal tabular-nums text-zinc-400">
                {NUMBER_FORMAT.format(KPI_SENTIMENT[key])} mentions
              </p>
              <Progress
                className="mt-2"
                segments={[{ pct, colorClass: SENTIMENT_FILL_CLASS[key], label: `${pct.toFixed(1)}% ${key}` }]}
              />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
