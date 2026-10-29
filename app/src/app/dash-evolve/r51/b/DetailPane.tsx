"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, CircleCheck, CircleX, Clock3 } from "lucide-react";
import type { Exchange, FeedEvent } from "./data";
import { CURRENCY, INTEGER } from "./data";
import { Card, StatusBadge, ProgressBar, Sparkline, Tabs } from "./ui";

type Tab = "overview" | "feed";

const FEED_META: Record<FeedEvent["type"], { label: string; text: string; icon: typeof CircleCheck }> = {
  win: { label: "Win", text: "text-emerald-700", icon: CircleCheck },
  loss: { label: "Loss", text: "text-zinc-500", icon: CircleX },
  timeout: { label: "Timeout", text: "text-amber-700", icon: Clock3 },
};

function FeedRow({ event }: { event: FeedEvent }) {
  const m = FEED_META[event.type];
  const Icon = m.icon;
  return (
    <li className="flex items-start gap-2.5 px-4 py-2.5 sm:px-5">
      <Icon className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${m.text}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-medium ${m.text}`}>{m.label}</span>
          <span className="flex-shrink-0 whitespace-nowrap text-[11px] font-normal tabular-nums text-zinc-500">{event.time}</span>
        </div>
        <p className="mt-0.5 truncate text-xs font-normal text-zinc-700">{event.lineItem}</p>
      </div>
      <span className="flex-shrink-0 whitespace-nowrap tabular-nums text-xs font-normal text-zinc-900">{event.cpm > 0 ? CURRENCY.format(event.cpm) : "—"}</span>
    </li>
  );
}

/** Pinned exclusively by the watchlist/table selection (see page.tsx) — a single narrow axis that
 *  touches only this pane. It never recomputes the market chart, the legend or the directory
 *  table, and it is not reset by the chart's separate hover/scrub inspector. */
export function DetailPane({ exchange }: { exchange: Exchange }) {
  const [tab, setTab] = useState<Tab>("overview");
  // Reset the tab when a new exchange is pinned -- adjusted during render (React's documented
  // pattern for resetting state on a prop change) rather than in an effect, which would cause an
  // extra cascading render (react-hooks/set-state-in-effect).
  const [prevExchangeId, setPrevExchangeId] = useState(exchange.id);
  if (exchange.id !== prevExchangeId) {
    setPrevExchangeId(exchange.id);
    setTab("overview");
  }

  const up = exchange.deltaPct >= 0;

  return (
    <Card as="section" aria-labelledby="detail-pane-title" className="flex h-full min-h-0 w-full flex-col lg:w-72">
      <div className="flex-shrink-0 border-b border-zinc-200 px-4 py-4 sm:px-5">
        <div className="flex items-start justify-between gap-2">
          <h2 id="detail-pane-title" className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900">
            {exchange.name}
          </h2>
          <StatusBadge status={exchange.status} />
        </div>
        <p className="mt-1 truncate text-xs font-normal text-zinc-600">
          {exchange.type} &middot; {exchange.region}
        </p>
      </div>

      <Tabs
        ariaLabel="Exchange detail view"
        value={tab}
        onChange={setTab}
        idBase="exchange-detail"
        options={[
          { value: "overview", label: "Overview" },
          { value: "feed", label: "Live feed" },
        ]}
      />

      {tab === "overview" ? (
        <div
          role="tabpanel"
          id="exchange-detail-panel-overview"
          aria-labelledby="exchange-detail-tab-overview"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5"
        >
          <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">Delivery performance</h3>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="tabular-nums text-2xl font-semibold text-zinc-900">{CURRENCY.format(exchange.currentCpm)}</p>
              <p className={`mt-0.5 inline-flex items-center gap-1 tabular-nums text-xs font-normal ${up ? "text-emerald-700" : "text-red-700"}`}>
                {up ? <ArrowUp className="h-3 w-3 flex-shrink-0" aria-hidden="true" /> : <ArrowDown className="h-3 w-3 flex-shrink-0" aria-hidden="true" />}
                {Math.abs(exchange.deltaPct)}% in 24h
              </p>
            </div>
            <Sparkline values={exchange.seriesByPeriod["24H"]} width={96} height={32} className={up ? "text-emerald-600" : "text-red-600"} />
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-normal text-zinc-700">
                <span>Win rate</span>
                <span className="tabular-nums">{exchange.winRate}%</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={exchange.winRate} label="Win rate" barClassName={exchange.winRate < 30 ? "bg-red-600" : exchange.winRate < 45 ? "bg-amber-600" : "bg-sky-600"} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-normal text-zinc-700">
                <span>Fill rate</span>
                <span className="tabular-nums">{exchange.fillRate}%</span>
              </div>
              <div className="mt-1.5">
                <ProgressBar value={exchange.fillRate} label="Fill rate" barClassName="bg-sky-600" />
              </div>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4">
            <div className="min-w-0">
              <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">Latency</dt>
              <dd className="mt-0.5 tabular-nums text-sm font-normal text-zinc-900">{exchange.latencyMs} ms</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-zinc-600">Bids / min</dt>
              <dd className="mt-0.5 tabular-nums text-sm font-normal text-zinc-900">{INTEGER.format(exchange.bidsPerMin)}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div
          role="tabpanel"
          id="exchange-detail-panel-feed"
          aria-labelledby="exchange-detail-tab-feed"
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <h3 className="sr-only">Recent auctions</h3>
          <ul className="divide-y divide-zinc-100">
            {exchange.feed.map((f) => (
              <FeedRow key={f.id} event={f} />
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
