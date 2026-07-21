"use client";

import { useMemo, useState } from "react";
import {
  INCIDENTS,
  SEVERITY_META,
  STATUS_META,
  serviceLabel,
  type Incident,
  type ServiceId,
  type Severity,
} from "./data";
import { BORDER, DIVIDE, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, CardHeader, SegmentedControl, SortableTh, type SortDir } from "./ui";

type ColumnKey = "severity" | "title" | "service" | "started" | "duration" | "status";
type SeverityFilter = "all" | Severity;

const SEVERITY_OPTIONS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "1", label: "SEV1" },
  { id: "2", label: "SEV2" },
  { id: "3", label: "SEV3" },
  { id: "4", label: "SEV4" },
];

export default function IncidentTable({
  scope,
  selectedId,
  onSelect,
}: {
  scope: ServiceId | "all";
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [sortKey, setSortKey] = useState<ColumnKey>("started");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    return INCIDENTS.filter((inc) => (scope === "all" || inc.service === scope) && (severityFilter === "all" || inc.severity === severityFilter));
  }, [scope, severityFilter]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      switch (sortKey) {
        case "severity":
          return (a.severity - b.severity) * dir;
        case "title":
          return a.title.localeCompare(b.title) * dir;
        case "service":
          return serviceLabel(a.service).localeCompare(serviceLabel(b.service)) * dir;
        case "started":
          return (a.orderRank - b.orderRank) * dir;
        case "duration": {
          const da = a.durationMinutes ?? Number.POSITIVE_INFINITY;
          const db = b.durationMinutes ?? Number.POSITIVE_INFINITY;
          return (da - db) * dir;
        }
        case "status":
          return STATUS_META[a.status].label.localeCompare(STATUS_META[b.status].label) * dir;
        default:
          return 0;
      }
    });
    return rows;
  }, [filtered, sortKey, sortDir]);

  function onSort(key: ColumnKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "started" ? "desc" : "asc");
    }
  }

  return (
    <div>
      <CardHeader
        as="h2"
        titleId="incidents-heading"
        title="Incidents & alerts"
        description={`${sorted.length} matching ${scope === "all" ? "across all services" : `for ${scope}`}`}
        action={<SegmentedControl ariaLabel="Filter by severity" options={SEVERITY_OPTIONS} value={severityFilter === "all" ? "all" : String(severityFilter)} onChange={(v) => setSeverityFilter(v === "all" ? "all" : (Number(v) as Severity))} size="sm" />}
      />

      <div className="mt-4 w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="incidents-heading">
          <caption className="sr-only">Incident and alert history, sortable by column and filterable by severity and service</caption>
          <colgroup>
            <col style={{ width: "11%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <SortableTh<ColumnKey> columnKey="severity" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                Sev
              </SortableTh>
              <SortableTh<ColumnKey> columnKey="title" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                Incident
              </SortableTh>
              <SortableTh<ColumnKey> columnKey="service" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                Service
              </SortableTh>
              <SortableTh<ColumnKey> columnKey="started" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                Started
              </SortableTh>
              <SortableTh<ColumnKey> columnKey="duration" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                Duration
              </SortableTh>
              <SortableTh<ColumnKey> columnKey="status" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                Status
              </SortableTh>
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className={cx("px-3 py-8 text-center text-sm", TEXT_CAPTION)}>
                  No incidents match this filter.
                </td>
              </tr>
            ) : (
              sorted.map((inc) => <IncidentRow key={inc.id} incident={inc} selected={inc.id === selectedId} onSelect={onSelect} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IncidentRow({ incident, selected, onSelect }: { incident: Incident; selected: boolean; onSelect: (id: string) => void }) {
  const sev = SEVERITY_META[incident.severity];
  const status = STATUS_META[incident.status];
  return (
    <tr aria-selected={selected} className={cx(selected ? "bg-sky-50 dark:bg-sky-500/10" : HOVER_ROW, TRANSITION)}>
      <td className="py-2.5 pl-3 pr-2">
        <Badge tone={sev.tone}>{sev.label}</Badge>
      </td>
      <td className="py-2.5 pr-2">
        <button
          type="button"
          onClick={() => onSelect(incident.id)}
          aria-current={selected ? "true" : undefined}
          title={incident.title}
          className={cx(
            "block max-w-full truncate rounded text-left font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400",
            TEXT_PRIMARY,
          )}
        >
          {incident.title}
        </button>
        <span className={cx("block truncate text-xs", TEXT_CAPTION, NUM)}>{incident.id}</span>
      </td>
      <td className={cx("truncate py-2.5 pr-2 text-xs", TEXT_SECONDARY)}>{serviceLabel(incident.service)}</td>
      <td className={cx("whitespace-nowrap py-2.5 pr-2 text-xs", TEXT_SECONDARY, NUM)}>{incident.startedLabel}</td>
      <td className={cx("whitespace-nowrap py-2.5 pr-2 text-right text-xs", TEXT_SECONDARY, NUM)}>{incident.durationLabel}</td>
      <td className="py-2.5 pr-3">
        <Badge tone={status.tone}>{status.label}</Badge>
      </td>
    </tr>
  );
}
