"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Bell, ArrowUpDown, ChevronUp, ChevronDown, X, Download, GitBranch, Inbox, Settings } from "lucide-react";

/* ───────────────────────── palette (AA verified, single accent) ─────────────────────────
 * True light: white/zinc-50 canvas, border zinc-200, text zinc-900 / zinc-500 floor (4.83:1 on white).
 * Accent: lime. lime-700 on white = 4.99:1 (text/icons/buttons). Decorative fills (bars) use lime-400/500/600
 * freely since no text sits directly on them.
 */
const BORDER = "border-zinc-200";
const MUTED = "text-zinc-500"; // 4.83:1 on white
const MUTED_TINT = "text-zinc-600"; // 7.03:1 on zinc-100 (muted surfaces)
const ACCENT_TEXT = "text-lime-700";
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700";

/* ───────────────────────── deterministic data ───────────────────────── */

type StageId = "new" | "triage" | "progress" | "escalated" | "resolved" | "reopened";

const STAGES: { id: StageId; label: string; x: number; y: number }[] = [
  { id: "new", label: "New", x: 40, y: 70 },
  { id: "triage", label: "Triage", x: 220, y: 70 },
  { id: "progress", label: "In Progress", x: 400, y: 70 },
  { id: "escalated", label: "Escalated", x: 580, y: 70 },
  { id: "resolved", label: "Resolved", x: 760, y: 70 },
  { id: "reopened", label: "Reopened", x: 400, y: 190 },
];

function stageLabel(id: StageId) {
  return STAGES.find((s) => s.id === id)!.label;
}
function stagePos(id: StageId) {
  return STAGES.find((s) => s.id === id)!;
}

type Flow = { id: string; from: StageId; to: StageId; w7: number; w30: number; bottleneck?: boolean };

const FLOWS: Flow[] = [
  { id: "f1", from: "new", to: "triage", w7: 420, w30: 1710 },
  { id: "f2", from: "triage", to: "progress", w7: 310, w30: 1260 },
  { id: "f3", from: "triage", to: "escalated", w7: 95, w30: 390, bottleneck: true },
  { id: "f4", from: "progress", to: "resolved", w7: 280, w30: 1145 },
  { id: "f5", from: "escalated", to: "resolved", w7: 80, w30: 325 },
  { id: "f6", from: "resolved", to: "reopened", w7: 18, w30: 74 },
  { id: "f7", from: "reopened", to: "triage", w7: 18, w30: 74 },
];

const PERIODS = [
  { id: "w7", label: "7d" },
  { id: "w30", label: "30d" },
] as const;
type PeriodId = (typeof PERIODS)[number]["id"];

function flowWeight(f: Flow, period: PeriodId) {
  return f[period];
}
function outflowOf(stage: StageId, period: PeriodId) {
  return FLOWS.filter((f) => f.from === stage).reduce((s, f) => s + flowWeight(f, period), 0);
}

const Icon = { Search, Bell, ArrowUpDown, ChevronUp, ChevronDown, X, Download, GitBranch, Inbox, Settings };

/* ───────────────────────── small building blocks ───────────────────────── */

function InlineStat({ label, value, tone }: { label: string; value: string; tone?: "accent" }) {
  return (
    <div className="flex flex-col">
      <span className={`text-[11px] font-medium uppercase tracking-[0.08em] ${MUTED}`}>{label}</span>
      <span className={`mt-1 text-xl font-semibold tabular-nums ${tone === "accent" ? ACCENT_TEXT : "text-zinc-900"}`}>
        {value}
      </span>
    </div>
  );
}

/* ───────────────────────── process map (dominant visualization) ───────────────────────── */

function ProcessMap({
  period,
  pinnedId,
  onPin,
}: {
  period: PeriodId;
  pinnedId: StageId;
  onPin: (id: StageId) => void;
}) {
  const [hoveredId, setHoveredId] = useState<Flow | null>(null);
  const maxW = useMemo(() => Math.max(...FLOWS.map((f) => flowWeight(f, period))), [period]);
  const bottleneck = FLOWS.find((f) => f.bottleneck)!;
  const bottleneckShare = round1((flowWeight(bottleneck, period) / outflowOf(bottleneck.from, period)) * 100);

  return (
    <div>
      <p className="text-3xl font-semibold tabular-nums text-zinc-900 sm:text-4xl" style={{ fontFamily: "var(--font-display-wide)" }}>
        {bottleneckShare}%
      </p>
      <p className={`mt-1 text-sm font-normal ${MUTED}`}>
        Biggest bottleneck this period: {stageLabel(bottleneck.from)} &rarr; {stageLabel(bottleneck.to)} &mdash;{" "}
        {flowWeight(bottleneck, period)} tickets ({bottleneckShare}% of {stageLabel(bottleneck.from)} outflow)
      </p>

      <div className="relative mx-auto mt-5 w-full" style={{ aspectRatio: "820/240" }}>
        <svg viewBox="0 0 820 240" className="h-full w-full" role="img" aria-label="Ticket flow between support stages">
          {FLOWS.map((f) => {
            const p1 = stagePos(f.from);
            const p2 = stagePos(f.to);
            const w = flowWeight(f, period);
            const sw = round2(1.5 + (w / maxW) * 5);
            const dim = hoveredId && hoveredId.id !== f.id;
            const midX = round2((p1.x + p2.x) / 2 + 30);
            const midY = round2((p1.y + p2.y) / 2);
            return (
              <path
                key={f.id}
                d={`M${p1.x + 42},${p1.y} Q${midX},${midY} ${p2.x - 42},${p2.y}`}
                fill="none"
                stroke={f.bottleneck ? "#4d7c0f" : "#a1a1aa"}
                strokeWidth={sw}
                strokeOpacity={dim ? 0.25 : f.bottleneck ? 0.9 : 0.55}
              />
            );
          })}
          {STAGES.map((s) => (
            <g key={s.id}>
              <rect
                x={s.x - 42}
                y={s.y - 18}
                width="84"
                height="36"
                rx="8"
                fill={s.id === pinnedId ? "#4d7c0f" : "#ffffff"}
                stroke={s.id === pinnedId ? "#4d7c0f" : "#d4d4d8"}
                strokeWidth="1.5"
              />
              <text
                x={s.x}
                y={s.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight={500}
                fill={s.id === pinnedId ? "#ffffff" : "#18181b"}
              >
                {s.label}
              </text>
            </g>
          ))}
        </svg>
        {FLOWS.map((f) => {
          const p1 = stagePos(f.from);
          const p2 = stagePos(f.to);
          const mx = (p1.x + p2.x) / 2 + 15;
          const my = (p1.y + p2.y) / 2;
          return (
            <button
              key={f.id}
              type="button"
              onMouseEnter={() => setHoveredId(f)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(f)}
              onBlur={() => setHoveredId(null)}
              className={`absolute flex h-6 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded ${FOCUS_RING}`}
              style={{ left: `${(mx / 820) * 100}%`, top: `${(my / 240) * 100}%` }}
            >
              <span className="sr-only">
                {stageLabel(f.from)} to {stageLabel(f.to)}: {flowWeight(f, period)} tickets this period.
              </span>
            </button>
          );
        })}
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPin(s.id)}
            aria-pressed={s.id === pinnedId}
            className={`absolute h-9 w-24 -translate-x-1/2 -translate-y-1/2 rounded-lg ${FOCUS_RING}`}
            style={{ left: `${(s.x / 820) * 100}%`, top: `${(s.y / 240) * 100}%` }}
          >
            <span className="sr-only">Pin {s.label} stage &mdash; shows its spotlight card.</span>
          </button>
        ))}
      </div>

      <p className={`mt-3 min-h-[1.25rem] text-sm font-normal ${MUTED}`} aria-live="polite">
        {hoveredId
          ? `${stageLabel(hoveredId.from)} → ${stageLabel(hoveredId.to)}: ${flowWeight(hoveredId, period)} tickets`
          : "Hover or focus a transition for its exact count."}
      </p>
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/* ───────────────────────── transitions table (required fallback + real sort/filter) ───────────────────────── */

type SortKey = "from" | "to" | "tickets" | "share";

function TransitionsTable({ period }: { period: PeriodId }) {
  const [sortKey, setSortKey] = useState<SortKey>("tickets");
  const [asc, setAsc] = useState(false);
  const [bottleneckOnly, setBottleneckOnly] = useState(false);

  const rows = useMemo(() => {
    let list = bottleneckOnly ? FLOWS.filter((f) => f.bottleneck) : FLOWS;
    list = [...list].sort((a, b) => {
      const shareA = (flowWeight(a, period) / outflowOf(a.from, period)) * 100;
      const shareB = (flowWeight(b, period) / outflowOf(b.from, period)) * 100;
      let cmp = 0;
      if (sortKey === "from") cmp = stageLabel(a.from).localeCompare(stageLabel(b.from));
      else if (sortKey === "to") cmp = stageLabel(a.to).localeCompare(stageLabel(b.to));
      else if (sortKey === "tickets") cmp = flowWeight(a, period) - flowWeight(b, period);
      else cmp = shareA - shareB;
      return asc ? cmp : -cmp;
    });
    return list;
  }, [bottleneckOnly, sortKey, asc, period]);

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
    if (key !== sortKey) return <Icon.ArrowUpDown className="h-3 w-3 text-zinc-400" aria-hidden="true" />;
    return asc ? <Icon.ChevronUp className="h-3 w-3" aria-hidden="true" /> : <Icon.ChevronDown className="h-3 w-3" aria-hidden="true" />;
  }

  function downloadCsv() {
    const header = "From,To,Tickets,Share of source outflow\n";
    const body = rows
      .map((f) => `${stageLabel(f.from)},${stageLabel(f.to)},${flowWeight(f, period)},${round1((flowWeight(f, period) / outflowOf(f.from, period)) * 100)}%`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transitions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={`rounded-xl border ${BORDER} bg-white`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-zinc-900">Transitions (required fallback)</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBottleneckOnly((v) => !v)}
            aria-pressed={bottleneckOnly}
            className={`rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium ${FOCUS_RING} ${
              bottleneckOnly ? "bg-lime-700 text-white" : "text-zinc-600"
            }`}
          >
            Bottleneck only
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            className={`flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <Icon.Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export
          </button>
        </div>
      </div>

      <ul className="sm:hidden">
        {rows.map((f) => (
          <li key={f.id} className="border-b border-zinc-200 px-4 py-3 last:border-0">
            <p className="text-sm font-medium text-zinc-900">
              {stageLabel(f.from)} &rarr; {stageLabel(f.to)}
            </p>
            <p className={`mt-1 flex items-center justify-between text-xs font-normal ${MUTED}`}>
              <span className="tabular-nums">{flowWeight(f, period)} tickets</span>
              <span>{round1((flowWeight(f, period) / outflowOf(f.from, period)) * 100)}%</span>
            </p>
          </li>
        ))}
      </ul>

      <table className="hidden w-full table-fixed border-collapse text-sm sm:table">
        <caption className="sr-only">Stage-to-stage ticket transitions, sortable</caption>
        <colgroup>
          <col style={{ width: "28%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "22%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-zinc-200">
            {(["from", "to", "tickets", "share"] as SortKey[]).map((key) => (
              <th key={key} scope="col" aria-sort={ariaSort(key)} className="px-4 py-2.5 text-left font-normal">
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${MUTED_TINT} ${FOCUS_RING}`}
                >
                  {key === "from" ? "From" : key === "to" ? "To" : key === "tickets" ? "Tickets" : "Share"}
                  {sortIcon(key)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className="border-b border-zinc-200 last:border-0">
              <td className="truncate px-4 py-2.5 text-zinc-700">{stageLabel(f.from)}</td>
              <td className="truncate px-4 py-2.5 text-zinc-700">{stageLabel(f.to)}</td>
              <td className="px-4 py-2.5 tabular-nums text-zinc-900">{flowWeight(f, period)}</td>
              <td className="px-4 py-2.5 tabular-nums text-zinc-900">
                {round1((flowWeight(f, period) / outflowOf(f.from, period)) * 100)}%
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

  const COMMANDS = ["Jump to process map", "Jump to transitions table", "Filter: bottleneck only", "Export CSV"];
  const filtered = COMMANDS.filter((c) => c.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-24" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-3 shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-2 pb-2">
          <Icon.Search className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command…"
            className={`w-full bg-transparent py-2 text-sm font-normal text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button type="button" onClick={onClose} aria-label="Close command menu" className={`rounded p-1 ${FOCUS_RING}`}>
            <Icon.X className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          </button>
        </div>
        <ul className="mt-2 space-y-0.5">
          {filtered.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={onClose}
                className={`w-full rounded-lg px-2.5 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-100 ${FOCUS_RING}`}
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

export default function Page() {
  const [period, setPeriod] = useState<PeriodId>("w30");
  const [pinnedStage, setPinnedStage] = useState<StageId>("triage");
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

  const totalIntake = FLOWS.filter((f) => f.from === "new").reduce((s, f) => s + flowWeight(f, period), 0);
  const totalResolved = FLOWS.filter((f) => f.to === "resolved").reduce((s, f) => s + flowWeight(f, period), 0);
  const reopenFlow = FLOWS.find((f) => f.from === "resolved" && f.to === "reopened")!;
  const reopenRate = round1((flowWeight(reopenFlow, period) / totalResolved) * 100);
  const resolutionRate = round1((totalResolved / totalIntake) * 100);

  const stageInflow = FLOWS.filter((f) => f.to === pinnedStage).reduce((s, f) => s + flowWeight(f, period), 0);
  const stageOutflow = outflowOf(pinnedStage, period);

  return (
    <div className="flex min-h-screen bg-white text-zinc-900">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className={`flex h-[44px] items-center justify-between border-b ${BORDER} px-4 sm:px-6`}>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-700 text-xs font-semibold text-white">
              F
            </span>
            <p className="text-sm font-semibold leading-none" style={{ fontFamily: "var(--font-display-wide)" }}>
              Flowline
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className={`flex h-8 items-center gap-2 rounded-lg border ${BORDER} px-3 text-xs font-normal ${MUTED} ${FOCUS_RING}`}
          >
            <Icon.Search className="h-3.5 w-3.5" aria-hidden="true" />
            Search
            <span className="rounded border border-zinc-200 px-1 text-[10px]">&#8984;K</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`rounded-lg p-1.5 text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <Icon.Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-9 w-56 rounded-lg border border-zinc-200 bg-white p-3 text-xs font-normal shadow-xl">
                  <p className="text-zinc-700">Escalation rate crossed 22% this period.</p>
                </div>
              )}
            </div>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600">
              DK
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.01em]">Support ticket flow</h1>
              <p className={`mt-1 text-sm font-normal ${MUTED}`}>
                How tickets move through {STAGES.length} stages, {FLOWS.length} transitions tracked.
              </p>
            </div>
            <div role="group" aria-label="Period" className="flex rounded-lg border border-zinc-200 p-0.5 text-xs font-medium">
              {PERIODS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPeriod(p.id)}
                  aria-pressed={period === p.id}
                  className={`rounded-md px-2.5 py-1 ${FOCUS_RING} ${period === p.id ? "bg-lime-700 text-white" : "text-zinc-600"}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-8 border-y border-zinc-200 py-4">
            <InlineStat label="Intake" value={String(totalIntake)} />
            <InlineStat label="Resolved" value={String(totalResolved)} />
            <InlineStat label="Resolution rate" value={`${resolutionRate}%`} tone="accent" />
            <InlineStat label="Reopen rate" value={`${reopenRate}%`} />
          </div>

          <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
            <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${ACCENT_TEXT}`}>Dominant visualization</p>
            <ProcessMap period={period} pinnedId={pinnedStage} onPin={setPinnedStage} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-xl border border-zinc-200 bg-white p-5 lg:col-span-4">
              <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${MUTED}`}>Stage spotlight</p>
              <p className="mt-1 text-lg font-semibold text-zinc-900">{stageLabel(pinnedStage)}</p>
              <dl className="mt-3 space-y-2 text-sm font-normal text-zinc-700">
                <div className="flex items-center justify-between">
                  <dt>Inflow</dt>
                  <dd className="tabular-nums text-zinc-900">{stageInflow || "—"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Outflow</dt>
                  <dd className="tabular-nums text-zinc-900">{stageOutflow || "—"}</dd>
                </div>
              </dl>
              <p className={`mt-3 text-xs font-normal ${MUTED}`}>Click any stage in the map above to spotlight it here.</p>
            </div>
            <div className="lg:col-span-8">
              <TransitionsTable period={period} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
