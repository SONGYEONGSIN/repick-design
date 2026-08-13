"use client";

import { useRef, type KeyboardEvent } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useOps } from "../context";
import {
  FLEET_FORECAST_HIGH,
  FLEET_FORECAST_LOW,
  FLEET_PERIOD_START,
  FLEET_TODAY_PCT,
  FORECAST_DAYS,
  formatPercent,
  getCarrier,
  getCarrierOverlaySeries,
  getFleetSeries,
  getShipment,
  round2,
} from "../data";
import { Card } from "./ui";
import { EtaChart } from "./EtaChart";
import { cn } from "../utils";
import type { Period } from "../types";

const PERIODS: Period[] = ["30D", "60D", "90D"];
const PERIOD_LABEL: Record<Period, string> = { "30D": "30 days", "60D": "60 days", "90D": "90 days" };

function PeriodTabs({ period, onChange, panelId }: { period: Period; onChange: (p: Period) => void; panelId: string }) {
  const refs = useRef<Partial<Record<Period, HTMLButtonElement | null>>>({});

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      const next = PERIODS[(idx + delta + PERIODS.length) % PERIODS.length];
      onChange(next);
      refs.current[next]?.focus();
    }
  }

  return (
    <div role="tablist" aria-label="Select trend period" className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-1">
      {PERIODS.map((p, idx) => (
        <button
          key={p}
          ref={(el) => {
            refs.current[p] = el;
          }}
          role="tab"
          type="button"
          id={`period-tab-${p}`}
          aria-selected={p === period}
          aria-controls={panelId}
          tabIndex={p === period ? 0 : -1}
          onClick={() => onChange(p)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={cn(
            "min-h-9 rounded-md px-3 text-xs font-medium tabular-nums outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
            p === period ? "bg-white/10 text-zinc-50" : "text-zinc-400 hover:text-zinc-200",
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function DeltaBadge({ pts }: { pts: number }) {
  const isZero = Math.abs(pts) < 0.05;
  const isUp = pts > 0;
  const Icon = isZero ? Minus : isUp ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium tabular-nums",
        isZero ? "bg-zinc-500/10 text-zinc-300" : isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400",
      )}
    >
      <Icon aria-hidden="true" className="size-3" />
      {pts > 0 ? "+" : ""}
      {pts.toFixed(1)} pts
    </span>
  );
}

export function EtaTrendCard() {
  const { period, setPeriod, selectedShipmentId } = useOps();
  const panelId = "eta-trend-panel";

  const shipment = getShipment(selectedShipmentId);
  const carrier = shipment ? getCarrier(shipment.carrierId) : null;

  const fleetSeries = getFleetSeries(period);
  const carrierOverlay = carrier ? getCarrierOverlaySeries(carrier.id, period) : null;
  const carrierCurrent = carrierOverlay ? carrierOverlay[carrierOverlay.length - 1].value : null;

  const deltaPts = round2(FLEET_TODAY_PCT - FLEET_PERIOD_START[period]);

  return (
    <Card
      id="eta-trend"
      title="On-time trend"
      description={
        shipment && carrier
          ? `Fleet average vs ${carrier.shortName} — highlighted from ${shipment.id} (${shipment.originCode} → ${shipment.destCode})`
          : `${PERIOD_LABEL[period]} history + ${FORECAST_DAYS}-day forecast`
      }
      action={<PeriodTabs period={period} onChange={setPeriod} panelId={panelId} />}
      bodyClassName="px-5 pb-5"
    >
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <p className="min-w-0 text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          {formatPercent(FLEET_TODAY_PCT)}
        </p>
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <DeltaBadge pts={deltaPts} />
          <span className="whitespace-nowrap text-xs tabular-nums text-zinc-400">on time today · {PERIOD_LABEL[period]} trend</span>
        </div>
      </div>

      <p className="mt-1.5 text-xs tabular-nums text-zinc-400">
        {FORECAST_DAYS}-day forecast: {formatPercent(FLEET_FORECAST_LOW)}–{formatPercent(FLEET_FORECAST_HIGH)} projected on-time
        {carrier && carrierCurrent !== null ? (
          <>
            {" · "}
            <span className="text-zinc-300">{carrier.shortName} today: {formatPercent(carrierCurrent)}</span>
          </>
        ) : null}
      </p>

      <div id={panelId} role="tabpanel" aria-labelledby={`period-tab-${period}`} className="mt-4">
        <EtaChart fleet={fleetSeries} carrierOverlay={carrierOverlay} carrierLabel={carrier ? carrier.shortName : null} periodLabel={PERIOD_LABEL[period]} />
      </div>

      <ul aria-hidden="true" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-400">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded-full bg-zinc-100" /> Fleet actual
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded-full bg-rose-400" style={{ backgroundImage: "repeating-linear-gradient(90deg, #fb7185 0 4px, transparent 4px 7px)" }} /> Forecast + confidence band
        </li>
        {carrier && (
          <li className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded-full bg-zinc-400" style={{ backgroundImage: "repeating-linear-gradient(90deg, #a1a1aa 0 4px, transparent 4px 7px)" }} />
            {carrier.shortName} (this lane)
          </li>
        )}
      </ul>
    </Card>
  );
}
