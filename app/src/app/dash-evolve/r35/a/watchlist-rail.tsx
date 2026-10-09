import { formatPercent, formatPrice, WATCHLIST_ENTRIES } from "./data";
import { cx, DOWN_HEX, NUM, TEXT_AUX, TEXT_PRIMARY, UP_HEX } from "./tokens";
import { Card, ChangeBadge, Sparkline } from "./ui";

/**
 * Independent of every selection in the rest of the page on purpose — see the
 * "selection→multi-widget sync" note in fluxgate-client.tsx. Pinning a feed signal must change
 * exactly one KPI figure in the risk panel; this rail is the control that proves it did not also
 * reach in here. It always shows the full tracked set, live prices and all.
 */
export function WatchlistRail() {
  return (
    <Card id="watchlist" title="Watchlist" description={`${WATCHLIST_ENTRIES.length} instruments tracked`}>
      <ul className="divide-y divide-white/5 px-2 pb-2">
        {WATCHLIST_ENTRIES.map(({ instrument, price, changePct, sparkline }) => {
          const isUp = changePct >= 0;
          return (
            <li key={instrument.id} className="flex items-center gap-3 px-3 py-3">
              <div className="min-w-0 flex-1">
                <p title={instrument.name} className={cx("truncate text-[13px] font-medium", TEXT_PRIMARY)}>
                  {instrument.name}
                </p>
                <p className={cx("truncate text-[11px]", TEXT_AUX)}>
                  {instrument.ticker} &middot; {instrument.category}
                </p>
              </div>
              <Sparkline values={sparkline} color={isUp ? UP_HEX : DOWN_HEX} />
              <div className="shrink-0 text-right">
                <p className={cx("text-[13px] font-medium", NUM, TEXT_PRIMARY)}>{formatPrice(price)}</p>
                <div className="mt-0.5 flex justify-end">
                  <ChangeBadge value={changePct} size="sm" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="sr-only">
        Watchlist changes:{" "}
        {WATCHLIST_ENTRIES.map((e) => `${e.instrument.name} ${formatPercent(e.changePct)}`).join(", ")}
      </p>
    </Card>
  );
}
