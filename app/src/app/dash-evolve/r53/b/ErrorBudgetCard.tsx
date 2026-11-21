"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardHeader, FOCUS_RING } from "./ui";
import { SERVICES, consumedBudgetPct, type Service } from "./data";

function toneFor(pct: number): "green" | "amber" | "red" {
  if (pct < 70) return "green";
  if (pct <= 100) return "amber";
  return "red";
}

const DAYS_IN_WINDOW = 30;
const MINUTES_IN_WINDOW = DAYS_IN_WINDOW * 24 * 60;

export function ErrorBudgetCard() {
  // Hover preview here is a second, independent interaction axis: a self-contained ephemeral
  // detail that nothing else on the page reads or writes. It is deliberately NOT wired to the
  // page's shared `selectedServiceId` selection (see LatencyTrendCard / ServiceHealthCard) — the
  // brief asks for two axes that never mirror each other, and this is the un-pinned one.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = hoveredId ? SERVICES.find((s) => s.id === hoveredId) ?? null : null;

  return (
    <Card colSpan="col-span-1 md:col-span-2 lg:col-span-5" rowSpan="lg:row-span-2">
      <CardHeader title="Error budget" description="30-day rolling window, consumed vs. allotted" />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <ul className="flex flex-col gap-2.5">
          {SERVICES.map((s) => (
            <BudgetRow key={s.id} service={s} onHover={setHoveredId} />
          ))}
        </ul>
      </div>
      <div className="flex-shrink-0 border-t border-zinc-100 px-4 py-2.5 text-xs text-zinc-600" aria-live="polite">
        {hovered ? (
          <p>
            <span className="font-medium text-zinc-900">{hovered.name}</span>: budget allows{" "}
            <span className="tabular-nums">{Math.round(((100 - hovered.uptimeTargetPct) / 100) * MINUTES_IN_WINDOW)} min</span> down this
            window, burned{" "}
            <span className="tabular-nums">{Math.round(((100 - hovered.uptimeActualPct) / 100) * MINUTES_IN_WINDOW)} min</span> so far.
          </p>
        ) : (
          <p>Hover a row for the minute-level budget breakdown.</p>
        )}
      </div>
    </Card>
  );
}

function BudgetRow({ service, onHover }: { service: Service; onHover: (id: string | null) => void }) {
  const pct = consumedBudgetPct(service);
  const tone = toneFor(pct);
  const fillPct = Math.min(100, (pct / 150) * 100);
  const thresholdPct = (100 / 150) * 100;
  const Icon = tone === "green" ? CheckCircle2 : tone === "amber" ? AlertTriangle : XCircle;

  return (
    <li onMouseEnter={() => onHover(service.id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(service.id)} onBlur={() => onHover(null)}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-xs font-medium text-zinc-900">{service.name}</span>
        <span className="flex flex-shrink-0 items-center gap-1 text-xs">
          <Icon className={`h-3.5 w-3.5 ${tone === "green" ? "text-green-600" : tone === "amber" ? "text-amber-600" : "text-red-600"}`} aria-hidden="true" />
          <span className="tabular-nums font-medium text-zinc-900">{pct.toFixed(1)}%</span>
        </span>
      </div>
      <div
        className={`relative h-2 w-full rounded-full bg-zinc-100 ${FOCUS_RING}`}
        tabIndex={0}
        role="img"
        aria-label={`${service.name}: ${pct.toFixed(1)} percent of error budget consumed, target ${service.uptimeTargetPct} percent uptime, actual ${service.uptimeActualPct} percent`}
      >
        <div
          className={`h-2 rounded-full ${tone === "green" ? "bg-green-600" : tone === "amber" ? "bg-amber-500" : "bg-red-600"}`}
          style={{ width: `${fillPct}%` }}
        />
        <div className="absolute top-0 h-2 w-px bg-zinc-400" style={{ left: `${thresholdPct}%` }} aria-hidden="true" />
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Target {service.uptimeTargetPct}%</span>
        <span className="tabular-nums">Actual {service.uptimeActualPct}%</span>
      </div>
    </li>
  );
}
