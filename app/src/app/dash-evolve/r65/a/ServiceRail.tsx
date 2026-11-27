"use client";

import { useState } from "react";
import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import Sparkline from "./Sparkline";
import { SERVICES, STATUS_LABEL, formatInt, type Service, type Status } from "./data";

const FILTERS: Array<Status | "all"> = ["all", "healthy", "degraded", "down"];

const STATUS_ICON: Record<Status, typeof CircleCheck> = {
  healthy: CircleCheck,
  degraded: CircleAlert,
  down: CircleX,
};

const STATUS_TEXT_CLASS: Record<Status, string> = {
  healthy: "text-emerald-400",
  degraded: "text-amber-400",
  down: "text-rose-400",
};

const STATUS_TONE: Record<Status, "violet" | "amber" | "rose"> = {
  healthy: "violet",
  degraded: "amber",
  down: "rose",
};

export default function ServiceRail({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Status | "all">("all");

  const visible = filter === "all" ? SERVICES : SERVICES.filter((s) => s.status === filter);

  return (
    <nav aria-label="Services" className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Services</h2>
        <div role="group" aria-label="Filter services by status" className="mt-2.5 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const count = f === "all" ? SERVICES.length : SERVICES.filter((s) => s.status === f).length;
            const pressed = filter === f;
            const label = f === "all" ? "All" : STATUS_LABEL[f];
            return (
              <button
                key={f}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilter(f)}
                className={`inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                  pressed
                    ? "border-violet-400/40 bg-violet-400/15 text-violet-200"
                    : "border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                {label}
                <span className={pressed ? "text-violet-300" : "text-zinc-400"}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {visible.length === 0 ? (
          <li className="px-4 py-6 text-sm text-zinc-400">No services match this filter.</li>
        ) : (
          visible.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              selected={service.id === selectedId}
              onSelect={onSelect}
            />
          ))
        )}
      </ul>
    </nav>
  );
}

function ServiceRow({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const Icon = STATUS_ICON[service.status];
  const sparkValues = service.hourly.map((b) => b.requests);
  const current = service.hourly[service.hourly.length - 1].requests;

  return (
    <li className="border-b border-white/5 last:border-b-0">
      <button
        type="button"
        onClick={() => onSelect(service.id)}
        aria-current={selected ? "true" : undefined}
        className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400 ${
          selected ? "border-violet-400 bg-violet-400/10" : "border-transparent hover:bg-white/5"
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium text-zinc-100">{service.name}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs">
            <Icon aria-hidden="true" className={`size-3.5 shrink-0 ${STATUS_TEXT_CLASS[service.status]}`} />
            <span className={STATUS_TEXT_CLASS[service.status]}>{STATUS_LABEL[service.status]}</span>
            <span className="tabular-nums text-zinc-400">· {formatInt(current)} req/hr</span>
          </div>
        </div>
        <Sparkline values={sparkValues} tone={STATUS_TONE[service.status]} />
      </button>
    </li>
  );
}
