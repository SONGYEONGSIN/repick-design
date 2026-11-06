"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Bell,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
  Download,
  GitMerge,
  LayoutGrid,
  Settings,
} from "lucide-react";

/* ───────────────────────── palette (AA verified, single accent) ─────────────────────────
 * Dark surface: zinc-950/900, border white/10, text zinc-50 / zinc-400 floor (7.76:1).
 * Accent: orange. orange-400 on zinc-950 = 8.79:1 (icons/text). orange-700 + white text = 5.18:1 (buttons) —
 * orange-600 was checked and measured only 3.56:1, so buttons use -700, decorative-only fills may use -400/-500.
 * Severity uses a separate semantic scale (rose/amber/zinc), paired with text, not color alone.
 * No display font on this candidate — Pretendard throughout (deliberate face choice for this round's diversity).
 */
const BORDER = "border-white/10";
const MUTED = "text-zinc-400"; // 7.76:1 on zinc-950
const ACCENT_TEXT = "text-orange-400";
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400";

/* ───────────────────────── deterministic data ───────────────────────── */

type Severity = "Sev1" | "Sev2" | "Sev3";
type StatusId = "Open" | "Investigating" | "Remediation" | "Closed";

type Incident = {
  id: string;
  title: string;
  severity: Severity;
  status: StatusId;
  owner: string;
  opened: string;
  shapeIdx: 0 | 1 | 2;
};

const INCIDENTS: Incident[] = [
  { id: "inc1", title: "Checkout latency spike — EU region", severity: "Sev1", status: "Open", owner: "RK", opened: "Oct 21", shapeIdx: 0 },
  { id: "inc2", title: "Webhook delivery duplicate events", severity: "Sev2", status: "Open", owner: "TM", opened: "Oct 22", shapeIdx: 1 },
  { id: "inc3", title: "Auth token refresh storm", severity: "Sev1", status: "Investigating", owner: "AV", opened: "Oct 19", shapeIdx: 2 },
  { id: "inc4", title: "Nightly export job stalled", severity: "Sev3", status: "Investigating", owner: "RK", opened: "Oct 18", shapeIdx: 0 },
  { id: "inc5", title: "Search index lag — APAC", severity: "Sev2", status: "Remediation", owner: "TM", opened: "Oct 15", shapeIdx: 1 },
  { id: "inc6", title: "Billing retry loop overcharge", severity: "Sev3", status: "Closed", owner: "AV", opened: "Oct 10", shapeIdx: 2 },
];

const COLUMNS: StatusId[] = ["Open", "Investigating", "Remediation", "Closed"];

function incidentById(id: string) {
  return INCIDENTS.find((i) => i.id === id)!;
}

const SEVERITY_RANK: Record<Severity, number> = { Sev1: 0, Sev2: 1, Sev3: 2 };

function severityColor(sev: Severity) {
  if (sev === "Sev1") return "text-rose-400";
  if (sev === "Sev2") return "text-amber-400";
  return "text-zinc-400";
}
function severityDot(sev: Severity) {
  if (sev === "Sev1") return "#fb7185";
  if (sev === "Sev2") return "#fbbf24";
  return "#a1a1aa";
}

/* Decomposition-tree percentages — three shapes, each category's leaves sum to its own total,
   and the three category totals sum to exactly 100. Ids are shape-invariant: selecting a factor
   type is independent of which incident is active, and its value simply re-reads for that incident. */
type FactorId = "infra" | "infra-capacity" | "infra-network" | "code" | "code-nullcheck" | "code-race" | "process" | "process-alerting" | "process-runbook";

const SHAPES: Record<0 | 1 | 2, Record<FactorId, number>> = {
  0: { infra: 58, "infra-capacity": 34, "infra-network": 24, code: 22, "code-nullcheck": 14, "code-race": 8, process: 20, "process-alerting": 12, "process-runbook": 8 },
  1: { infra: 18, "infra-capacity": 10, "infra-network": 8, code: 61, "code-nullcheck": 37, "code-race": 24, process: 21, "process-alerting": 11, "process-runbook": 10 },
  2: { infra: 25, "infra-capacity": 15, "infra-network": 10, code: 24, "code-nullcheck": 16, "code-race": 8, process: 51, "process-alerting": 29, "process-runbook": 22 },
};

const FACTOR_LABEL: Record<FactorId, string> = {
  infra: "Infrastructure",
  "infra-capacity": "Capacity",
  "infra-network": "Network",
  code: "Code",
  "code-nullcheck": "Null-check gap",
  "code-race": "Race condition",
  process: "Process",
  "process-alerting": "Alerting gap",
  "process-runbook": "Runbook staleness",
};

const FACTOR_DESC: Record<FactorId, string> = {
  infra: "Infrastructure-side contributing factors.",
  "infra-capacity": "Autoscaling lagged behind a traffic spike.",
  "infra-network": "Cross-AZ network latency exceeded budget.",
  code: "Code-level contributing factors.",
  "code-nullcheck": "Missing null-check on a newly nullable field.",
  "code-race": "Race condition between two async writers.",
  process: "Process-side contributing factors.",
  "process-alerting": "Alerting threshold was too coarse to catch this early.",
  "process-runbook": "Runbook steps were stale for this failure mode.",
};

const CATEGORIES: { id: FactorId; leaves: FactorId[] }[] = [
  { id: "infra", leaves: ["infra-capacity", "infra-network"] },
  { id: "code", leaves: ["code-nullcheck", "code-race"] },
  { id: "process", leaves: ["process-alerting", "process-runbook"] },
];

const Icon = { Search, Bell, ArrowUpDown, ChevronUp, ChevronDown, ChevronRight, X, Download, GitMerge, LayoutGrid, Settings };

/* ───────────────────────── small building blocks ───────────────────────── */

function InlineStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className={`text-[11px] font-medium uppercase tracking-[0.08em] ${MUTED}`}>{label}</span>
      <span className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">{value}</span>
    </div>
  );
}

/* ───────────────────────── decomposition tree (dominant visualization, accessible-native) ───────────────────────── */

function DecompositionTree({
  incident,
  selectedFactor,
  onSelectFactor,
}: {
  incident: Incident;
  selectedFactor: FactorId;
  onSelectFactor: (id: FactorId) => void;
}) {
  const [expanded, setExpanded] = useState<Record<FactorId, boolean>>({
    infra: true,
    "infra-capacity": true,
    "infra-network": true,
    code: true,
    "code-nullcheck": true,
    "code-race": true,
    process: true,
    "process-alerting": true,
    "process-runbook": true,
  });
  const [hovered, setHovered] = useState<FactorId | null>(null);
  const pcts = SHAPES[incident.shapeIdx];
  const topFactor = useMemo(() => {
    const all: FactorId[] = CATEGORIES.flatMap((c) => c.leaves);
    return all.reduce((best, f) => (pcts[f] > pcts[best] ? f : best), all[0]);
  }, [pcts]);

  const readout = hovered ?? selectedFactor;

  return (
    <div>
      <p className="text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl">{pcts[topFactor]}%</p>
      <p className={`mt-1 text-sm font-normal ${MUTED}`}>
        Top contributing factor for &ldquo;{incident.title}&rdquo;: {FACTOR_LABEL[topFactor]}
      </p>

      <ul className="mt-4 space-y-1">
        {CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpanded((e) => ({ ...e, [cat.id]: !e[cat.id] }))}
                aria-expanded={expanded[cat.id]}
                aria-label={`${expanded[cat.id] ? "Collapse" : "Expand"} ${FACTOR_LABEL[cat.id]}`}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${FOCUS_RING}`}
              >
                <Icon.ChevronRight
                  className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${expanded[cat.id] ? "rotate-90" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={() => onSelectFactor(cat.id)}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(cat.id)}
                onBlur={() => setHovered(null)}
                aria-pressed={selectedFactor === cat.id}
                className={`flex flex-1 items-center justify-between rounded-lg px-2 py-1.5 text-left ${FOCUS_RING} ${
                  selectedFactor === cat.id ? "bg-orange-500/15" : ""
                }`}
              >
                <span className="text-sm font-semibold text-zinc-50">{FACTOR_LABEL[cat.id]}</span>
                <span className="text-sm font-semibold tabular-nums text-orange-400">{pcts[cat.id]}%</span>
              </button>
            </div>
            {expanded[cat.id] && (
              <ul className="ml-8 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                {cat.leaves.map((leaf) => (
                  <li key={leaf}>
                    <button
                      type="button"
                      onClick={() => onSelectFactor(leaf)}
                      onMouseEnter={() => setHovered(leaf)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(leaf)}
                      onBlur={() => setHovered(null)}
                      aria-pressed={selectedFactor === leaf}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left ${FOCUS_RING} ${
                        selectedFactor === leaf ? "bg-orange-500/15" : ""
                      }`}
                    >
                      <span className="text-sm font-normal text-zinc-300">{FACTOR_LABEL[leaf]}</span>
                      <span className="text-sm font-normal tabular-nums text-zinc-50">{pcts[leaf]}%</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <p className={`mt-4 min-h-[1.25rem] text-sm font-normal ${MUTED}`} aria-live="polite">
        {FACTOR_LABEL[readout]}: {FACTOR_DESC[readout]}
      </p>
    </div>
  );
}

/* ───────────────────────── kanban board (macro shell) ───────────────────────── */

function KanbanBoard({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const items = INCIDENTS.filter((i) => i.status === col);
        return (
          <div key={col} className={`rounded-xl border ${BORDER} bg-zinc-900/60 p-3`}>
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-zinc-300">{col}</h3>
              <span className="text-xs font-normal tabular-nums text-zinc-500">{items.length}</span>
            </div>
            <ul className="mt-2 max-h-80 space-y-2 overflow-y-auto">
              {items.map((inc) => (
                <li key={inc.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(inc.id)}
                    aria-pressed={inc.id === selectedId}
                    className={`w-full rounded-lg border p-3 text-left ${FOCUS_RING} ${
                      inc.id === selectedId ? "border-orange-400 bg-orange-500/10" : "border-white/10 bg-zinc-900"
                    }`}
                  >
                    <p className="text-sm font-medium leading-snug text-zinc-50">{inc.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${severityColor(inc.severity)}`}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: severityDot(inc.severity) }} aria-hidden="true" />
                        {inc.severity}
                      </span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-medium text-zinc-300">
                        {inc.owner}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
              {items.length === 0 && <li className={`px-1 py-2 text-xs font-normal ${MUTED}`}>No incidents in this stage.</li>}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────── incidents register (required register table + real sort/filter) ───────────────────────── */

type SortKey = "title" | "severity" | "status" | "opened";
type SevFilter = "all" | Severity;

function IncidentsTable() {
  const [sortKey, setSortKey] = useState<SortKey>("severity");
  const [asc, setAsc] = useState(true);
  const [filter, setFilter] = useState<SevFilter>("all");

  const rows = useMemo(() => {
    let list = filter === "all" ? INCIDENTS : INCIDENTS.filter((i) => i.severity === filter);
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "severity") cmp = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else cmp = a.opened.localeCompare(b.opened);
      return asc ? cmp : -cmp;
    });
    return list;
  }, [filter, sortKey, asc]);

  function toggle(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }
  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return asc ? "ascending" : "descending";
  }
  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <Icon.ArrowUpDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />;
    return asc ? <Icon.ChevronUp className="h-3 w-3" aria-hidden="true" /> : <Icon.ChevronDown className="h-3 w-3" aria-hidden="true" />;
  }

  function downloadCsv() {
    const header = "Title,Severity,Status,Owner,Opened\n";
    const body = rows.map((i) => `${i.title},${i.severity},${i.status},${i.owner},${i.opened}`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "incidents.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={`rounded-xl border ${BORDER} bg-zinc-900`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-50">Incidents register</h2>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Filter by severity" className="flex rounded-lg border border-white/10 p-0.5 text-xs font-medium">
            {(["all", "Sev1", "Sev2", "Sev3"] as SevFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-md px-2.5 py-1 ${FOCUS_RING} ${filter === f ? "bg-orange-700 text-white" : "text-zinc-400"}`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={downloadCsv}
            className={`flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <Icon.Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <ul className="sm:hidden">
        {rows.map((i) => (
          <li key={i.id} className="border-b border-white/10 px-4 py-3 last:border-0">
            <p className="text-sm font-medium text-zinc-50">{i.title}</p>
            <p className={`mt-1 flex items-center justify-between text-xs font-normal ${MUTED}`}>
              <span className={severityColor(i.severity)}>{i.severity}</span>
              <span>{i.status}</span>
              <span>{i.opened}</span>
            </p>
          </li>
        ))}
      </ul>

      <table className="hidden w-full table-fixed border-collapse text-sm sm:table">
        <caption className="sr-only">Incident register, sortable, filterable by severity</caption>
        <colgroup>
          <col style={{ width: "40%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" aria-sort={ariaSort("title")} className="px-4 py-2.5 text-left font-normal">
              <button type="button" onClick={() => toggle("title")} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400 ${FOCUS_RING}`}>
                Incident {sortIcon("title")}
              </button>
            </th>
            <th scope="col" aria-sort={ariaSort("severity")} className="px-4 py-2.5 text-left font-normal">
              <button type="button" onClick={() => toggle("severity")} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400 ${FOCUS_RING}`}>
                Severity {sortIcon("severity")}
              </button>
            </th>
            <th scope="col" aria-sort={ariaSort("status")} className="px-4 py-2.5 text-left font-normal">
              <button type="button" onClick={() => toggle("status")} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400 ${FOCUS_RING}`}>
                Status {sortIcon("status")}
              </button>
            </th>
            <th scope="col" className="px-4 py-2.5 text-left font-normal">
              <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Owner</span>
            </th>
            <th scope="col" aria-sort={ariaSort("opened")} className="px-4 py-2.5 text-left font-normal">
              <button type="button" onClick={() => toggle("opened")} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400 ${FOCUS_RING}`}>
                Opened {sortIcon("opened")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((i) => (
            <tr key={i.id} className="border-b border-white/10 last:border-0">
              <td className="truncate px-4 py-2.5 text-zinc-200">{i.title}</td>
              <td className={`px-4 py-2.5 font-medium ${severityColor(i.severity)}`}>{i.severity}</td>
              <td className="px-4 py-2.5 text-zinc-300">{i.status}</td>
              <td className="px-4 py-2.5 text-zinc-300">{i.owner}</td>
              <td className="px-4 py-2.5 tabular-nums text-zinc-300">{i.opened}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ───────────────────────── command palette (bonus interaction) ───────────────────────── */

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const COMMANDS = ["Jump to decomposition tree", "Jump to board", "Jump to register", "Filter: Sev1 only", "Export CSV"];
  const filtered = COMMANDS.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-xl border ${BORDER} bg-zinc-900 p-3 shadow-xl`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-2 pb-2">
          <Icon.Search className="h-4 w-4 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            className={`w-full bg-transparent py-2 text-sm font-normal text-zinc-50 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close command menu" className={`rounded p-1 ${FOCUS_RING}`}>
            <Icon.X className="h-4 w-4 text-zinc-500" aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-2 space-y-0.5">
          {filtered.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={onClose}
                className={`w-full rounded-lg px-2.5 py-2 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}
              >
                {c}
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className={`px-2.5 py-2 text-sm ${MUTED}`}>No matching commands.</li>}
        </ul>
      </div>
    </div>
  );
}

/* ───────────────────────── page shell ───────────────────────── */

const NAV = [
  { icon: LayoutGrid, label: "Board", active: true },
  { icon: GitMerge, label: "Root cause", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Page() {
  const [selectedIncidentId, setSelectedIncidentId] = useState("inc1");
  const [selectedFactor, setSelectedFactor] = useState<FactorId>("infra");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const incident = incidentById(selectedIncidentId);
  const openCount = INCIDENTS.filter((i) => i.status === "Open").length;
  const investigatingCount = INCIDENTS.filter((i) => i.status === "Investigating").length;
  const sev1OpenCount = INCIDENTS.filter((i) => i.severity === "Sev1" && i.status !== "Closed").length;
  const factorPct = SHAPES[incident.shapeIdx][selectedFactor];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <aside className={`hidden w-56 flex-shrink-0 flex-col border-r ${BORDER} sm:flex`}>
        <div className={`flex items-center gap-2 border-b ${BORDER} px-5 py-4`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-700 text-xs font-semibold text-white">
            L
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">Ledgerwell</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>Incident Review</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <span
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${
                item.active ? "bg-orange-700/20 text-orange-400" : "text-zinc-400"
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </span>
          ))}
        </nav>
        <div className={`flex items-center gap-2.5 border-t ${BORDER} px-4 py-4`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-300">
            NS
          </span>
          <div>
            <p className="text-xs font-medium leading-none text-zinc-200">Nora Sato</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>SRE Lead</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`flex h-[44px] items-center justify-between border-b ${BORDER} px-4 sm:px-6`}>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className={`flex h-8 items-center gap-2 rounded-lg border ${BORDER} px-3 text-xs font-normal ${MUTED} ${FOCUS_RING}`}
          >
            <Icon.Search className="h-3.5 w-3.5" aria-hidden="true" />
            Search
            <span className="rounded border border-white/10 px-1 text-[10px]">&#8984;K</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`rounded-lg p-1.5 text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
              >
                <Icon.Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              {notifOpen && (
                <div className={`absolute right-0 top-9 w-56 rounded-lg border ${BORDER} bg-zinc-900 p-3 text-xs font-normal shadow-xl`}>
                  <p className="text-zinc-200">1 incident moved to Remediation today.</p>
                </div>
              )}
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-300">
              NS
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">Incident root-cause review</h1>
          <p className={`mt-1 text-sm font-normal ${MUTED}`}>
            {INCIDENTS.length} tracked incidents across {COLUMNS.length} remediation stages.
          </p>

          <div className="mt-5 flex flex-wrap gap-8 border-y border-white/10 py-4">
            <InlineStat label="Open" value={String(openCount)} />
            <InlineStat label="Investigating" value={String(investigatingCount)} />
            <InlineStat label="Sev1 unresolved" value={String(sev1OpenCount)} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className={`rounded-xl border ${BORDER} bg-zinc-900 p-5 lg:col-span-7`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${ACCENT_TEXT}`}>Dominant visualization</p>
              <DecompositionTree incident={incident} selectedFactor={selectedFactor} onSelectFactor={setSelectedFactor} />
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className={`rounded-xl border ${BORDER} bg-zinc-900 p-5`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${MUTED}`}>Incident detail</p>
                <p className="mt-1 text-lg font-semibold leading-snug text-zinc-50">{incident.title}</p>
                <div className="mt-3 flex items-center gap-4 text-sm font-normal text-zinc-300">
                  <span className={`inline-flex items-center gap-1.5 font-medium ${severityColor(incident.severity)}`}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: severityDot(incident.severity) }} aria-hidden="true" />
                    {incident.severity}
                  </span>
                  <span>{incident.status}</span>
                  <span>Opened {incident.opened}</span>
                </div>
                <p className={`mt-2 text-xs font-normal ${MUTED}`}>Owner: {incident.owner}</p>
              </div>

              <div className={`rounded-xl border ${BORDER} bg-zinc-900 p-5`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${MUTED}`}>Contributing factor</p>
                <p className="mt-1 text-lg font-semibold text-zinc-50">{FACTOR_LABEL[selectedFactor]}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-orange-400">{factorPct}%</p>
                <p className={`mt-2 text-sm font-normal ${MUTED}`}>{FACTOR_DESC[selectedFactor]}</p>
                <p className={`mt-3 text-xs font-normal ${MUTED}`}>
                  Independent of the incident pin at left &mdash; select any node in the tree to change this card only.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">Remediation board</h2>
            <KanbanBoard selectedId={selectedIncidentId} onSelect={setSelectedIncidentId} />
          </div>

          <div className="mt-6">
            <IncidentsTable />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
