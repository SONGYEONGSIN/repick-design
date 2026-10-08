"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { REGIONS, regionStatus, type TimeRange } from "./data";
import { BORDER, FOCUS, HOVER_ROW, STATUS_LABEL, STATUS_TEXT, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx, fmtCompact, fmtMs, fmtPct } from "./tokens";
import { Card, CardHead } from "./ui";

type SortKey = "name" | "status" | "incidents" | "uptime" | "p50" | "reqps";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; widthPct: number; align: "left" | "right" }[] = [
  { key: "name", label: "Region", widthPct: 24, align: "left" },
  { key: "status", label: "Status", widthPct: 13, align: "left" },
  { key: "incidents", label: "Incidents", widthPct: 12, align: "right" },
  { key: "uptime", label: "Uptime", widthPct: 18, align: "right" },
  { key: "p50", label: "p50", widthPct: 16, align: "right" },
  { key: "reqps", label: "Req/s", widthPct: 17, align: "right" },
];

function sortValue(regionId: string, range: TimeRange, key: SortKey): string | number {
  const region = REGIONS.find((r) => r.id === regionId)!;
  const m = region.metrics[range];
  const values: Record<SortKey, string | number> = {
    name: region.name,
    status: regionStatus(region, range),
    incidents: m.incidents,
    uptime: m.uptimePct,
    p50: m.p50Ms,
    reqps: m.reqPerSec,
  };
  return values[key];
}

/** The required fallback for the choropleth: every value drawn on the map, in full, as a real
 * sortable and filterable table — not a decorative restatement. */
export function RegionTable({ range }: { range: TimeRange }) {
  const [sortKey, setSortKey] = useState<SortKey>("incidents");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "status" ? "asc" : "desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = REGIONS.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.code.toLowerCase().includes(query.toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
      const va = sortValue(a.id, range, sortKey);
      const vb = sortValue(b.id, range, sortKey);
      const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [query, range, sortKey, sortDir]);

  return (
    <Card id="region-table" padded={false}>
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 sm:p-5">
        <CardHead title="Region stats" hint={`Full dataset backing the map above — ${range} window, ${rows.length} of ${REGIONS.length} regions shown.`} />
        <label className={cx("flex h-9 w-full max-w-[220px] items-center gap-2 rounded-lg border px-2.5 text-xs", BORDER, TEXT_AUX)}>
          <Search size={13} aria-hidden="true" />
          <span className="sr-only">Filter regions by name or code</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter regions…"
            className={cx("h-full flex-1 bg-transparent placeholder:text-zinc-400", FOCUS)}
          />
        </label>
      </div>

      <div className={cx("border-t px-4 pb-4 sm:px-5 sm:pb-5", BORDER)}>
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: `${c.widthPct}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLUMNS.map((c) => {
                const active = c.key === sortKey;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th key={c.key} scope="col" aria-sort={ariaSort} className={cx("py-2", c.align === "right" ? "text-right" : "text-left")}>
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className={cx(
                        "inline-flex items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-[0.06em]",
                        TEXT_AUX,
                        TRANSITION,
                        FOCUS,
                        "hover:text-zinc-50",
                        c.align === "right" && "flex-row-reverse",
                      )}
                    >
                      {c.label}
                      {active ? sortDir === "asc" ? <ArrowUp size={11} aria-hidden="true" /> : <ArrowDown size={11} aria-hidden="true" /> : <ArrowUpDown size={11} aria-hidden="true" className="opacity-50" />}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((region) => {
              const m = region.metrics[range];
              const status = regionStatus(region, range);
              return (
                <tr key={region.id} className={cx("border-b last:border-b-0", BORDER, HOVER_ROW, TRANSITION)}>
                  <td className="py-2 pr-2 align-top">
                    <p className={cx("font-medium leading-snug", TEXT_PRIMARY)}>{region.name}</p>
                    <p className={cx("text-[11px] leading-snug", TEXT_AUX)}>{region.code}</p>
                  </td>
                  <td className="py-2 pr-2 align-top">
                    <span className={cx("text-xs font-medium tabular-nums", STATUS_TEXT[status])}>{STATUS_LABEL[status]}</span>
                  </td>
                  <td className="py-2 pr-2 text-right align-top tabular-nums">{m.incidents}</td>
                  <td className="py-2 pr-2 text-right align-top tabular-nums">{fmtPct(m.uptimePct)}</td>
                  <td className="py-2 pr-2 text-right align-top tabular-nums">{fmtMs(m.p50Ms)}</td>
                  <td className="py-2 text-right align-top tabular-nums">{fmtCompact(m.reqPerSec)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 ? <p className={cx("py-6 text-center text-sm", TEXT_AUX)}>No regions match &ldquo;{query}&rdquo;.</p> : null}
      </div>
    </Card>
  );
}
