"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, TriangleAlert, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { EDGES, NODE_BY_ID, RELATIONSHIP_SHORT, type ServiceEdge, type TierId } from "./data";
import { BORDER, CODE, FOCUS, HOVER_ROW, NUM, STATUS_LABEL, TEXT_AUX, TEXT_PRIMARY, TRANSITION, type Status, cx } from "./tokens";

type SortKey = "source" | "target" | "relationship" | "latencyMs" | "callsPerMin" | "status";
type SortDir = "asc" | "desc";

const STATUS_RANK: Record<Status, number> = { down: 0, degraded: 1, healthy: 2 };
const STATUS_SHORT: Record<Status, string> = { healthy: "OK", degraded: "DEG", down: "DOWN" };
const STATUS_ICON: Record<Status, typeof CheckCircle2> = { healthy: CheckCircle2, degraded: TriangleAlert, down: XCircle };
const STATUS_ICON_COLOR: Record<Status, string> = { healthy: "text-emerald-400", degraded: "text-amber-400", down: "text-rose-400" };

const STATUS_OPTIONS: { id: "all" | Status; label: string }[] = [
  { id: "all", label: "All statuses" },
  { id: "healthy", label: "Healthy" },
  { id: "degraded", label: "Degraded" },
  { id: "down", label: "Down" },
];
const TIER_OPTIONS: { id: "all" | TierId; label: string }[] = [
  { id: "all", label: "All source tiers" },
  { id: "edge", label: "Edge" },
  { id: "service", label: "Service" },
  { id: "data", label: "Data" },
];

function sortValue(edge: ServiceEdge, key: SortKey) {
  switch (key) {
    case "source":
      return NODE_BY_ID.get(edge.source)?.name ?? edge.source;
    case "target":
      return NODE_BY_ID.get(edge.target)?.name ?? edge.target;
    case "relationship":
      return RELATIONSHIP_SHORT[edge.relationship];
    case "latencyMs":
      return edge.latencyMs;
    case "callsPerMin":
      return edge.callsPerMin;
    case "status":
      return STATUS_RANK[edge.status];
  }
}

/**
 * FIX #1 (second half): this table is the mandatory accessible fallback for the graph above,
 * and the ONLY place a keyboard user can reach a node's inspector. Each row is one edge
 * (source → target), and the Source/Target cells each carry their own real, 28px-tall
 * ("min-h-7", never left to shrink to its "View" label's own content box) `<button>` that opens
 * the exact same inspector a mouse click on the matching graph node would. Because every node
 * in data.ts is the source or target of at least one edge (verified by construction), all 16
 * nodes are reachable this way even though none of them are individually listed as a table row.
 *
 * FIX #2: colgroup percentages below were sized against the tightest real viewport (390px) and
 * this table's ACTUAL rendered width at that size, not against label character counts alone.
 * The table lives inside a Card (see fluxgraph-client.tsx) whose own horizontal padding this
 * wrapper cancels with a negative margin (`-mx-4 sm:-mx-5`) so the table gets the full card
 * width, not the card's padded content width. At 390px: page gutter 16px×2 (main wrapper's
 * `px-4`) leaves a 358px card; minus the card's ~1px border on each side, this table's own
 * content box is ≈356px. Cell padding is a uniform `px-2` (8px×2 = 16px) at every
 * breakpoint, deliberately NOT switched to a wider `px-3` at `sm:` and up — a breakpoint-
 * dependent padding swap combined with breakpoint-independent colgroup percentages is exactly
 * what left the prior attempt at this concept with a 2px cell-overlap even after it rebalanced
 * by label length. Content width = column% × 356 − 16, checked against the column's
 * actual longest FORMATTED value (not its header label, and not a pill/badge with its own
 * padding — the Status cell below was deliberately changed from a bordered Badge pill to a
 * bare icon+short-code pair for exactly this reason, after the badge's own internal padding
 * was found to blow the first draft of this budget):
 *   Source/Target 22% each → 78.3 − 16 = 62.3px (name truncates with `title=`, which is
 *     an intentional, expected table-cell degradation, not a structural overlap; the "View"
 *     button, ≈34px wide, fits inside this with room to spare)
 *   Type          10%      → 35.6 − 16 = 19.6px (short code truncates with `title=` if it
 *     doesn't fit — same accepted degradation as Source/Target, never an overlap)
 *   P50           12%      → 42.7 − 16 = 26.7px (longest value "305", ≈19.5px → ≈7px slack;
 *     no truncation needed, this is a real fit, not a fallback)
 *   Rpm           17%      → 60.5 − 16 = 44.5px (longest value "52,300", ≈35.5px → ≈9px
 *     slack; a real fit)
 *   Status        17%      → 60.5 − 16 = 44.5px (one 14px icon + a 4-letter code "DOWN",
 *     ≈14 + 4 + 24 = 42px → ≈2.5px slack; a real fit, no padding-bearing pill chrome left to
 *     eat into it)
 * Every column keeps real, positive slack at the tightest width tested — none of them are
 * negative or near-zero, so no column's content box can overlap its neighbor's.
 */
export default function AdjacencyTable({ onOpenInspector }: { onOpenInspector: (nodeId: string, triggerEl: Element) => void }) {
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [tierFilter, setTierFilter] = useState<"all" | TierId>("all");
  const [sortKey, setSortKey] = useState<SortKey>("callsPerMin");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const list = EDGES.filter((e) => (statusFilter === "all" || e.status === statusFilter) && (tierFilter === "all" || NODE_BY_ID.get(e.source)?.tier === tierFilter));
    list.sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [statusFilter, tierFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const columns: { key: SortKey; label: string; width: string; numeric?: boolean }[] = [
    { key: "source", label: "Source", width: "22%" },
    { key: "target", label: "Target", width: "22%" },
    { key: "relationship", label: "Type", width: "10%" },
    { key: "latencyMs", label: "P50", width: "12%", numeric: true },
    { key: "callsPerMin", label: "Rpm", width: "17%", numeric: true },
    { key: "status", label: "Status", width: "17%" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <FilterSelect id="table-filter-status" label="Status" value={statusFilter} onChange={(v) => setStatusFilter(v as "all" | Status)} options={STATUS_OPTIONS} />
        <FilterSelect id="table-filter-tier" label="Source tier" value={tierFilter} onChange={(v) => setTierFilter(v as "all" | TierId)} options={TIER_OPTIONS} />
        <p className={cx("ml-auto text-xs font-normal", TEXT_AUX)}>
          {rows.length} of {EDGES.length} dependencies
        </p>
      </div>

      {/* Negative margin cancels the parent Card's own horizontal padding so this table gets
          the Card's full outer width — see the FIX #2 comment above for why that exact
          width matters to the colgroup math. */}
      <div className="-mx-4 overflow-hidden rounded-xl border border-white/10 sm:-mx-5">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only font-normal">
            Service dependency adjacency list: every call between services, its relationship type, p50 latency, call volume and
            health status. {EDGES.length} total dependencies across {new Set(EDGES.flatMap((e) => [e.source, e.target])).size} services.
            Each row&apos;s Source and Target cell has a &ldquo;View&rdquo; button that opens that service&apos;s details.
          </caption>
          <colgroup>
            {columns.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              {columns.map((col) => {
                const active = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    // `<th>` is bold by default in every browser's UA stylesheet and Tailwind's
                    // preflight does not reset it (only h1-h6 and the button/input/select/
                    // textarea group get a `font: inherit` reset) — font-medium here makes the
                    // actual rendered weight explicit rather than relying on the nested
                    // button's own font-medium to mask it.
                    className={cx("px-2 py-2 align-middle font-medium", col.numeric && "text-right")}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cx(
                        "flex min-h-7 w-full min-w-0 items-center gap-1 rounded-md text-[10px] font-medium uppercase tracking-[0.06em]",
                        col.numeric ? "flex-row-reverse text-right" : "text-left",
                        active ? "text-amber-300" : TEXT_AUX,
                        TRANSITION,
                        FOCUS,
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{col.label}</span>
                      {active ? (
                        sortDir === "asc" ? (
                          <ArrowUp size={11} aria-hidden="true" className="shrink-0" />
                        ) : (
                          <ArrowDown size={11} aria-hidden="true" className="shrink-0" />
                        )
                      ) : (
                        <ArrowUpDown size={11} aria-hidden="true" className="shrink-0 opacity-50" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((edge) => (
              <EdgeRow key={edge.id} edge={edge} onOpenInspector={onOpenInspector} />
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={cx("px-2 py-8 text-center text-sm font-normal", TEXT_AUX)}>
                  No dependencies match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointCell({ id, label, onOpenInspector }: { id: string; label: string; onOpenInspector: (nodeId: string, triggerEl: Element) => void }) {
  const node = NODE_BY_ID.get(id);
  const name = node?.name ?? id;
  return (
    <td className="px-2 py-2 align-middle">
      <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)} title={node?.hostname}>
        {name}
      </span>
      <span className={cx("hidden truncate sm:block", CODE, TEXT_AUX)}>{node?.hostname}</span>
      {/* Real, focusable, 28px-tall action button — never a graph node itself. This is the
          keyboard-operable equivalent of clicking that node on the canvas above. The visible
          text "View" is a literal substring of the aria-label below, so there is no
          accessible-name / visible-text mismatch. */}
      <button
        type="button"
        data-inspector-trigger="true"
        data-view-for={id}
        aria-label={`View details for ${name}`}
        aria-haspopup="dialog"
        onClick={(e) => onOpenInspector(id, e.currentTarget)}
        className={cx("mt-1 inline-flex min-h-7 items-center rounded-md border px-2 text-[11px] font-medium", BORDER, TEXT_AUX, "hover:text-zinc-50 hover:bg-white/5", TRANSITION, FOCUS)}
      >
        View
      </button>
      <span className="sr-only">{`, ${label} of this dependency`}</span>
    </td>
  );
}

function EdgeRow({ edge, onOpenInspector }: { edge: ServiceEdge; onOpenInspector: (nodeId: string, triggerEl: Element) => void }) {
  const StatusIcon = STATUS_ICON[edge.status];
  return (
    <tr className={cx("border-b border-white/5 last:border-b-0", HOVER_ROW, TRANSITION)}>
      <EndpointCell id={edge.source} label="source" onOpenInspector={onOpenInspector} />
      <EndpointCell id={edge.target} label="target" onOpenInspector={onOpenInspector} />
      <td className="px-2 py-2 align-middle">
        <span className={cx("block truncate text-xs font-normal", TEXT_AUX)} title={RELATIONSHIP_SHORT[edge.relationship]}>
          {RELATIONSHIP_SHORT[edge.relationship]}
        </span>
      </td>
      <td className={cx("px-2 py-2 text-right align-middle text-sm font-medium", NUM, TEXT_PRIMARY)}>{edge.latencyMs}</td>
      <td className={cx("px-2 py-2 text-right align-middle text-sm font-medium", NUM, TEXT_PRIMARY)}>{edge.callsPerMin.toLocaleString("en-US")}</td>
      <td className="px-2 py-2 align-middle">
        {/* Bare icon + short code, no pill chrome — a bordered Badge's own internal padding
            (px-2 py-0.5 on both sides) was the actual cause of the first draft's overlap risk
            in this narrow column; see the FIX #2 comment above. Shape (via the icon) plus
            color, never color alone, for status — same channel pairing as the graph canvas. */}
        <span className={cx("inline-flex items-center gap-1 text-[11px] font-semibold", STATUS_ICON_COLOR[edge.status])} title={STATUS_LABEL[edge.status]}>
          <StatusIcon size={13} aria-hidden="true" className="shrink-0" />
          <span aria-hidden="true">{STATUS_SHORT[edge.status]}</span>
          <span className="sr-only">{STATUS_LABEL[edge.status]}</span>
        </span>
      </td>
    </tr>
  );
}

function FilterSelect<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cx("h-9 rounded-lg border bg-zinc-950 px-2.5 text-sm font-medium", BORDER, TEXT_PRIMARY, FOCUS, TRANSITION)}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
