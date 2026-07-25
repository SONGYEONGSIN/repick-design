"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useMemo, useRef, useState } from "react";
import {
  INCIDENTS,
  SERVICES,
  SEVERITY_META,
  STATUS_META,
  engineerById,
  serviceIcon,
  serviceLabel,
  type Incident,
  type IncidentStatus,
} from "./data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, Dropdown, SegmentedControl } from "./ui";

type StatusFilter = "all" | IncidentStatus;
type SortMode = "newest" | "oldest" | "severity";
type ServiceFilter = "all" | Incident["service"];

const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "triggered", label: "Triggered" },
  { id: "acknowledged", label: "Acked" },
  { id: "resolved", label: "Resolved" },
];

const SORT_OPTIONS: { id: SortMode; label: string }[] = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "severity", label: "Severity (high→low)" },
];

const SERVICE_OPTIONS: { id: ServiceFilter; label: string }[] = [{ id: "all", label: "All services" }, ...SERVICES.map((s) => ({ id: s.id, label: s.label }))];

export default function IncidentRail({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const rows = useMemo(() => {
    const filtered = INCIDENTS.filter((i) => (statusFilter === "all" || i.status === statusFilter) && (serviceFilter === "all" || i.service === serviceFilter));
    const sorted = [...filtered].sort((a, b) => {
      if (sortMode === "newest") return b.orderRank - a.orderRank;
      if (sortMode === "oldest") return a.orderRank - b.orderRank;
      return a.severity - b.severity || b.orderRank - a.orderRank;
    });
    return sorted;
  }, [statusFilter, serviceFilter, sortMode]);

  function focusRow(i: number) {
    refs.current[i]?.focus();
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(i + 1, rows.length - 1);
      focusRow(next);
      onSelect(rows[next].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(i - 1, 0);
      focusRow(prev);
      onSelect(rows[prev].id);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>Incident rail</h2>
          <span className={cx("text-xs", TEXT_CAPTION, NUM)}>
            {rows.length} of {INCIDENTS.length}
          </span>
        </div>
        <SegmentedControl ariaLabel="Filter by status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} size="sm" />
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown label="Service" ariaLabel="Filter by service" options={SERVICE_OPTIONS} value={serviceFilter} onChange={setServiceFilter} />
          <Dropdown label="Sort" ariaLabel="Sort incidents" options={SORT_OPTIONS} value={sortMode} onChange={setSortMode} />
        </div>
      </div>

      <ul role="listbox" aria-label="Incidents" className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]" style={{ maxHeight: 560 }}>
        {rows.length === 0 ? (
          <li className={cx("rounded-xl border border-dashed p-4 text-center text-sm", BORDER, TEXT_CAPTION)}>No incidents match these filters.</li>
        ) : (
          rows.map((inc, i) => {
            const sev = SEVERITY_META[inc.severity];
            const status = STATUS_META[inc.status];
            const ServiceIcon = serviceIcon(inc.service);
            const selected = inc.id === selectedId;
            return (
              <li key={inc.id} role="presentation">
                <button
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onSelect(inc.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cx(
                    "block w-full rounded-xl border p-3 text-left",
                    TRANSITION,
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900",
                    selected ? "border-teal-400/40 bg-teal-500/10" : cx(BORDER, "bg-zinc-950 hover:bg-white/5"),
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge tone={sev.tone}>{sev.label}</Badge>
                    <span className={cx("whitespace-nowrap text-[11px]", TEXT_CAPTION, NUM)}>{inc.sinceLabel}</span>
                  </div>
                  <p className={cx("mt-1.5 line-clamp-2 text-sm font-medium leading-snug", TEXT_PRIMARY)}>{inc.title}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className={cx("inline-flex min-w-0 items-center gap-1 truncate text-xs", TEXT_SECONDARY)}>
                      <ServiceIcon size={12} aria-hidden="true" className="shrink-0" />
                      <span className="truncate">{serviceLabel(inc.service)}</span>
                    </span>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                  <p className={cx("mt-1.5 truncate text-[11px]", TEXT_CAPTION)}>{engineerById(inc.responder).name}</p>
                </button>
              </li>
            );
          })
        )}
      </ul>

      {/* Screen-reader-only semantic table — a table-form alternative with the same filter/sort results as the visual list */}
      <div className="sr-only">
        <table>
          <caption>Incident list filtered by status ({statusFilter}) and service ({serviceFilter}), sorted {sortMode}</caption>
          <thead>
            <tr>
              <th scope="col">Incident</th>
              <th scope="col">Severity</th>
              <th scope="col">Title</th>
              <th scope="col">Service</th>
              <th scope="col">Status</th>
              <th scope="col">Triggered</th>
              <th scope="col">Responder</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((inc) => (
              <tr key={inc.id}>
                <td>{inc.id}</td>
                <td>{SEVERITY_META[inc.severity].label}</td>
                <td>{inc.title}</td>
                <td>{serviceLabel(inc.service)}</td>
                <td>{STATUS_META[inc.status].label}</td>
                <td>
                  {inc.dateLabel}, {inc.triggeredClock} ({inc.sinceLabel})
                </td>
                <td>{engineerById(inc.responder).name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
