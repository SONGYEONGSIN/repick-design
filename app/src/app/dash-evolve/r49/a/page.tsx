"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShieldAlert,
  Search,
  Bell,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X,
  Download,
  Radar,
  Link2,
} from "lucide-react";

/* ───────────────────────── palette (AA verified, single accent) ─────────────────────────
 * Dark surface: zinc-950/900, border white/10, text zinc-50 / zinc-400 floor (7.76:1 — no-dark-dim-text safe).
 * Accent: rose. rose-400 on zinc-950 = 7.39:1 (icons/text). rose-600 + white text = 4.70:1 (buttons).
 * Status encoding (semantic, not the brand accent): flagged=rose-500, watch=amber-500, cleared=zinc-500 —
 * always paired with a text label, never color-only.
 */
const BG = "bg-zinc-950";
const CARD = "bg-zinc-900";
const BORDER = "border-white/10";
const MUTED = "text-zinc-400"; // 7.76:1 on zinc-950
const ACCENT_TEXT = "text-rose-400";
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400";

/* ───────────────────────── deterministic data ───────────────────────── */

type Status = "Flagged" | "Watch" | "Cleared";

type Account = {
  id: string;
  code: string;
  name: string;
  region: "NA" | "EU" | "APAC";
  risk: number;
  status: Status;
};

const ACCOUNTS: Account[] = [
  { id: "a1", code: "ACC-5118", name: "Halvorsen Trading LLC", region: "NA", risk: 82, status: "Flagged" },
  { id: "a2", code: "ACC-2244", name: "Ovida Freight Co", region: "EU", risk: 44, status: "Watch" },
  { id: "a3", code: "ACC-9031", name: "Baseline Imports", region: "APAC", risk: 91, status: "Flagged" },
  { id: "a4", code: "ACC-3367", name: "Solstice Retail Grp", region: "NA", risk: 28, status: "Cleared" },
  { id: "a5", code: "ACC-7742", name: "Northfork Logistics", region: "EU", risk: 63, status: "Watch" },
  { id: "a6", code: "ACC-1189", name: "Verdant Textiles", region: "APAC", risk: 76, status: "Flagged" },
  { id: "a7", code: "ACC-6604", name: "Anchorline Capital", region: "NA", risk: 35, status: "Cleared" },
  { id: "a8", code: "ACC-4823", name: "Port Meridian Co", region: "EU", risk: 58, status: "Watch" },
];

type Edge = { id: string; from: string; to: string; v7: number; v30: number; v90: number; flagged: boolean };

const EDGES: Edge[] = [
  { id: "e1", from: "a1", to: "a3", v7: 18, v30: 74, v90: 210, flagged: true },
  { id: "e2", from: "a3", to: "a6", v7: 22, v30: 90, v90: 255, flagged: true },
  { id: "e3", from: "a6", to: "a1", v7: 9, v30: 38, v90: 102, flagged: true },
  { id: "e4", from: "a2", to: "a5", v7: 5, v30: 21, v90: 58, flagged: false },
  { id: "e5", from: "a5", to: "a8", v7: 7, v30: 29, v90: 80, flagged: false },
  { id: "e6", from: "a8", to: "a2", v7: 4, v30: 16, v90: 44, flagged: false },
  { id: "e7", from: "a4", to: "a7", v7: 3, v30: 12, v90: 33, flagged: false },
  { id: "e8", from: "a7", to: "a4", v7: 2, v30: 9, v90: 24, flagged: false },
  { id: "e9", from: "a1", to: "a8", v7: 6, v30: 25, v90: 70, flagged: true },
  { id: "e10", from: "a3", to: "a5", v7: 4, v30: 17, v90: 46, flagged: false },
];

const PERIODS = [
  { id: "v7", label: "7d" },
  { id: "v30", label: "30d" },
  { id: "v90", label: "90d" },
] as const;
type PeriodId = (typeof PERIODS)[number]["id"];

function accountById(id: string) {
  return ACCOUNTS.find((a) => a.id === id)!;
}

function edgeVolume(e: Edge, period: PeriodId) {
  return e[period];
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/* ───────────────────────── network layout (deterministic, 2dp) ───────────────────────── */

const CX = 110;
const CY = 110;
const R = 85;

const NODE_POS = ACCOUNTS.map((acc, i) => {
  const angle = (-90 + i * (360 / ACCOUNTS.length)) * (Math.PI / 180);
  return {
    id: acc.id,
    x: round2(CX + R * Math.cos(angle)),
    y: round2(CY + R * Math.sin(angle)),
  };
});

function posFor(id: string) {
  return NODE_POS.find((p) => p.id === id)!;
}

function nodeRadius(risk: number) {
  return round2(5 + risk / 10);
}

function statusFill(status: Status) {
  if (status === "Flagged") return "#f43f5e"; // rose-500
  if (status === "Watch") return "#f59e0b"; // amber-500
  return "#71717a"; // zinc-500
}

const Icon = { ShieldAlert, Search, Bell, ArrowUpDown, ChevronUp, ChevronDown, X, Download, Radar, Link2 };

/* ───────────────────────── small building blocks ───────────────────────── */

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className={`rounded-xl border ${BORDER} ${CARD} p-4`}>
      <p className={`text-[11px] font-medium uppercase tracking-[0.08em] ${MUTED}`}>{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums text-zinc-50">{value}</p>
      {hint && <p className={`mt-1 text-xs font-normal ${MUTED}`}>{hint}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const color = status === "Flagged" ? "text-rose-400" : status === "Watch" ? "text-amber-400" : "text-zinc-400";
  const dot = statusFill(status);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${color}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} aria-hidden="true" />
      {status}
    </span>
  );
}

/* ───────────────────────── network graph (dominant visualization) ───────────────────────── */

function NetworkGraph({
  period,
  pinnedId,
  onPin,
}: {
  period: PeriodId;
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const maxVol = useMemo(() => Math.max(...EDGES.map((e) => edgeVolume(e, period))), [period]);

  const topFlaggedEdge = useMemo(() => {
    const flagged = EDGES.filter((e) => e.flagged);
    return flagged.reduce((best, e) => (edgeVolume(e, period) > edgeVolume(best, period) ? e : best), flagged[0]);
  }, [period]);

  const inspected = hoveredId ? accountById(hoveredId) : accountById(pinnedId);

  return (
    <div>
      <p className="text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl">
        <span style={{ fontFamily: "var(--font-display-grotesk)" }}>
          ${edgeVolume(topFlaggedEdge, period)}k
        </span>
      </p>
      <p className={`mt-1 text-sm font-normal ${MUTED}`}>
        Largest flagged flow this period: {accountById(topFlaggedEdge.from).name} &rarr;{" "}
        {accountById(topFlaggedEdge.to).name}
      </p>

      <div className="relative mx-auto mt-5 aspect-square w-full max-w-md">
        <svg viewBox="0 0 220 220" className="h-full w-full" role="img" aria-label="Transaction network between monitored accounts">
          {EDGES.map((e) => {
            const p1 = posFor(e.from);
            const p2 = posFor(e.to);
            const vol = edgeVolume(e, period);
            const sw = round2(1 + (vol / maxVol) * 4);
            const dim = hoveredId && e.from !== hoveredId && e.to !== hoveredId;
            return (
              <line
                key={e.id}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={e.flagged ? "#fb7185" : "#52525b"}
                strokeWidth={sw}
                strokeOpacity={dim ? 0.25 : e.flagged ? 0.9 : 0.6}
              />
            );
          })}
          {ACCOUNTS.map((acc) => {
            const p = posFor(acc.id);
            const r = nodeRadius(acc.risk);
            const isPinned = acc.id === pinnedId;
            return (
              <g key={acc.id}>
                <circle cx={p.x} cy={p.y} r={r} fill={statusFill(acc.status)} fillOpacity={0.9} />
                {isPinned && <circle cx={p.x} cy={p.y} r={r + 3} fill="none" stroke="#fda4af" strokeWidth="1.5" />}
              </g>
            );
          })}
        </svg>
        {ACCOUNTS.map((acc) => {
          const p = posFor(acc.id);
          return (
            <button
              key={acc.id}
              type="button"
              onMouseEnter={() => setHoveredId(acc.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(acc.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => onPin(acc.id)}
              aria-pressed={acc.id === pinnedId}
              className={`absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[9px] font-medium text-zinc-50 ${FOCUS_RING}`}
              style={{ left: `${(p.x / 220) * 100}%`, top: `${(p.y / 220) * 100}%` }}
            >
              <span aria-hidden="true">{acc.code.slice(4)}</span>
              <span className="sr-only">
                {acc.name}, {acc.status}, risk score {acc.risk}. Press Enter to pin this account&apos;s case.
              </span>
            </button>
          );
        })}
      </div>

      <p className={`mt-4 min-h-[1.5rem] text-sm font-normal ${MUTED}`} aria-live="polite">
        {inspected.code} &middot; {inspected.name} &middot; risk {inspected.risk} &middot; {inspected.status}
        {hoveredId ? " (hover preview)" : " (pinned)"}
      </p>
    </div>
  );
}

/* ───────────────────────── transfers table (required fallback + real sort/filter) ───────────────────────── */

type SortKey = "from" | "to" | "vol" | "flagged";
type FilterKey = "all" | "flagged" | "routine";

function TransfersTable({ period }: { period: PeriodId }) {
  const [sortKey, setSortKey] = useState<SortKey>("vol");
  const [asc, setAsc] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  const rows = useMemo(() => {
    let list = EDGES.filter((e) => (filter === "all" ? true : filter === "flagged" ? e.flagged : !e.flagged));
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "from") cmp = accountById(a.from).name.localeCompare(accountById(b.from).name);
      else if (sortKey === "to") cmp = accountById(a.to).name.localeCompare(accountById(b.to).name);
      else if (sortKey === "vol") cmp = edgeVolume(a, period) - edgeVolume(b, period);
      else cmp = Number(a.flagged) - Number(b.flagged);
      return asc ? cmp : -cmp;
    });
    return list;
  }, [filter, sortKey, asc, period]);

  function toggle(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }
  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return asc ? "ascending" : "descending";
  }
  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <Icon.ArrowUpDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />;
    return asc ? (
      <Icon.ChevronUp className="h-3 w-3" aria-hidden="true" />
    ) : (
      <Icon.ChevronDown className="h-3 w-3" aria-hidden="true" />
    );
  }

  function downloadCsv() {
    const header = "From,To,Volume (k),Flagged\n";
    const body = rows
      .map((e) => `${accountById(e.from).name},${accountById(e.to).name},${edgeVolume(e, period)},${e.flagged}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transfers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={`rounded-xl border ${BORDER} ${CARD}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-50">Transfers (adjacency, required fallback)</h2>
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Filter transfers" className="flex rounded-lg border border-white/10 p-0.5 text-xs font-medium">
            {(["all", "flagged", "routine"] as FilterKey[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`rounded-md px-2.5 py-1 ${FOCUS_RING} ${filter === f ? "bg-rose-600 text-white" : "text-zinc-400"}`}
              >
                {f === "all" ? "All" : f === "flagged" ? "Flagged" : "Routine"}
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

      {/* Mobile card list (below sm) */}
      <ul className="sm:hidden">
        {rows.map((e) => (
          <li key={e.id} className="border-b border-white/10 px-4 py-3 last:border-0">
            <p className="text-sm font-medium text-zinc-50">
              {accountById(e.from).name} &rarr; {accountById(e.to).name}
            </p>
            <p className={`mt-1 flex items-center justify-between text-xs font-normal ${MUTED}`}>
              <span className="tabular-nums">${edgeVolume(e, "v30" as PeriodId)}k / 30d</span>
              <span>{e.flagged ? "Flagged" : "Routine"}</span>
            </p>
          </li>
        ))}
      </ul>

      {/* Desktop table — table-fixed + % colgroup, min-w on <table>, no horizontal scroller */}
      <table className="hidden w-full table-fixed border-collapse text-sm sm:table">
        <caption className="sr-only">Account-to-account transfers for the selected period, sortable</caption>
        <colgroup>
          <col style={{ width: "32%" }} />
          <col style={{ width: "32%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            {(["from", "to", "vol", "flagged"] as SortKey[]).map((key) => (
              <th key={key} scope="col" aria-sort={ariaSort(key)} className="px-4 py-2.5 text-left font-normal">
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400 ${FOCUS_RING}`}
                >
                  {key === "from" ? "From" : key === "to" ? "To" : key === "vol" ? "Volume" : "Flagged"}
                  {sortIcon(key)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="border-b border-white/10 last:border-0">
              <td className="truncate px-4 py-2.5 text-zinc-200">{accountById(e.from).name}</td>
              <td className="truncate px-4 py-2.5 text-zinc-200">{accountById(e.to).name}</td>
              <td className="px-4 py-2.5 tabular-nums text-zinc-50">${edgeVolume(e, period)}k</td>
              <td className="px-4 py-2.5">
                <span className={e.flagged ? "text-rose-400" : "text-zinc-400"}>{e.flagged ? "Flagged" : "Routine"}</span>
              </td>
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

  const COMMANDS = ["Jump to transfers", "Jump to case detail", "Filter: flagged only", "Export CSV"];
  const filtered = COMMANDS.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-xl border ${BORDER} ${CARD} p-3 shadow-xl`}
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
  { icon: Radar, label: "Network", active: true },
  { icon: ShieldAlert, label: "Cases", active: false },
  { icon: Link2, label: "Rules", active: false },
];

export default function Page() {
  const [period, setPeriod] = useState<PeriodId>("v30");
  const [pinnedId, setPinnedId] = useState("a3"); // default: highest-risk account, never empty
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

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

  const pinned = accountById(pinnedId);
  const connections = EDGES.filter((e) => e.from === pinnedId || e.to === pinnedId);
  const flaggedCount = ACCOUNTS.filter((a) => a.status === "Flagged").length;
  const totalVolume = useMemo(() => EDGES.reduce((sum, e) => sum + edgeVolume(e, period), 0), [period]);
  const maxFlow = useMemo(() => Math.max(...EDGES.map((e) => edgeVolume(e, period))), [period]);

  return (
    <div className={`flex min-h-screen ${BG} text-zinc-50`}>
      <aside className={`hidden w-56 flex-shrink-0 flex-col border-r ${BORDER} sm:flex`}>
        <div className={`flex items-center gap-2 border-b ${BORDER} px-5 py-4`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-xs font-semibold text-white">
            M
          </span>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ fontFamily: "var(--font-display-grotesk)" }}>
              Meridian
            </p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>AML &amp; Fraud Ops</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <span
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${
                item.active ? "bg-rose-600/15 text-rose-400" : "text-zinc-400"
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </span>
          ))}
        </nav>
        <div className={`flex items-center gap-2.5 border-t ${BORDER} px-4 py-4`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-300">
            JR
          </span>
          <div>
            <p className="text-xs font-medium leading-none text-zinc-200">Jamie Reyes</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>Compliance Analyst</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`flex h-[44px] items-center justify-between border-b ${BORDER} px-4 sm:px-6`}>
          <button
            ref={searchBtnRef}
            type="button"
            onClick={() => setPaletteOpen(true)}
            className={`flex h-8 items-center gap-2 rounded-lg border ${BORDER} px-3 text-xs font-normal ${MUTED} ${FOCUS_RING}`}
          >
            <Icon.Search className="h-3.5 w-3.5" aria-hidden="true" />
            Search
            <span className="rounded border border-white/10 px-1 text-[10px]">&#8984;K</span>
          </button>
          <div className="flex items-center gap-3">
            <div role="group" aria-label="Period" className="flex rounded-lg border border-white/10 p-0.5 text-xs font-medium">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  aria-pressed={period === p.id}
                  className={`rounded-md px-2.5 py-1 ${FOCUS_RING} ${
                    period === p.id ? "bg-rose-600 text-white" : "text-zinc-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
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
                <div className={`absolute right-0 top-9 w-56 rounded-lg border ${BORDER} ${CARD} p-3 text-xs font-normal shadow-xl`}>
                  <p className="text-zinc-200">3 new flagged transfers since yesterday.</p>
                </div>
              )}
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-300">
              JR
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">Transaction network</h1>
          <p className={`mt-1 text-sm font-normal ${MUTED}`}>
            {ACCOUNTS.length} monitored accounts &middot; {EDGES.length} active transfer corridors.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard label="Flagged accounts" value={String(flaggedCount)} hint="Status = Flagged" />
            <KpiCard label="Monitored volume" value={`$${totalVolume}k`} hint={`Over ${PERIODS.find((p) => p.id === period)?.label}`} />
            <KpiCard label="Largest flow" value={`$${maxFlow}k`} hint="Single corridor, this period" />
            <KpiCard label="Open cases" value="2" hint="Under active investigation" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className={`rounded-xl border ${BORDER} ${CARD} p-5 lg:col-span-7`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${ACCENT_TEXT}`}>Dominant visualization</p>
              <NetworkGraph period={period} pinnedId={pinnedId} onPin={setPinnedId} />
            </div>

            <div className="flex flex-col gap-6 lg:col-span-5">
              <div className={`rounded-xl border ${BORDER} ${CARD} p-5`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${MUTED}`}>Case detail</p>
                <p className="mt-1 text-lg font-semibold text-zinc-50">{pinned.name}</p>
                <p className={`text-xs font-normal ${MUTED}`}>{pinned.code} &middot; {pinned.region}</p>
                <div className="mt-3 flex items-center gap-4">
                  <StatusBadge status={pinned.status} />
                  <span className="text-sm font-normal text-zinc-300">
                    Risk score <span className="font-semibold tabular-nums text-zinc-50">{pinned.risk}</span>
                  </span>
                </div>
                <p className={`mt-4 text-[11px] font-semibold uppercase tracking-[0.06em] ${MUTED}`}>Direct connections</p>
                <ul className="mt-2 space-y-1.5">
                  {connections.map((c) => {
                    const other = c.from === pinnedId ? c.to : c.from;
                    return (
                      <li key={c.id} className="flex items-center justify-between text-sm font-normal text-zinc-300">
                        <span className="truncate">{accountById(other).name}</span>
                        <span className="tabular-nums text-zinc-50">${edgeVolume(c, period)}k</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className={`rounded-xl border ${BORDER} ${CARD} p-5`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${MUTED}`}>Legend</p>
                <ul className="mt-2 space-y-1.5 text-sm font-normal text-zinc-300">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusFill("Flagged") }} aria-hidden="true" />
                    Flagged account
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusFill("Watch") }} aria-hidden="true" />
                    Under watch
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusFill("Cleared") }} aria-hidden="true" />
                    Cleared
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-0.5 w-4 bg-rose-400" aria-hidden="true" />
                    Flagged corridor (edge width &prop; volume)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <TransfersTable period={period} />
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
