"use client";

import { useId, useMemo, useState } from "react";
import {
  LayoutGrid,
  AlertTriangle,
  Server,
  Settings,
  Search,
  Bell,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";

const BG = "#F8FAFC";
const CARD = "#FFFFFF";
const BORDER = "#E2E8F0";
const FG = "#1E293B";
const MUTED = "text-zinc-500"; // 4.83:1 on white
const MUTED_TINT = "text-zinc-600"; // 7.73:1 — for tinted/muted-surface text
const ACCENT = "#E11D48"; // rose-600 — 4.70:1 on white (AA body)
const ACCENT_STRONG = "#BE123C"; // rose-700 — 6.29:1
const GOOD = "#059669"; // emerald-600, text-safe on white (~4.5:1 — reused repo convention)
const WARN = "#B45309"; // amber-700, text-safe on white

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E11D48]";

/* ───────── deterministic data ───────── */

type Period = "24h" | "7d" | "30d";

type Service = {
  id: string;
  name: string;
  target: number;
  values: Record<Period, number>;
  spark: Record<Period, number[]>;
};

const SERVICES: Service[] = [
  {
    id: "api",
    name: "Public API",
    target: 99.9,
    values: { "24h": 99.98, "7d": 99.95, "30d": 99.91 },
    spark: {
      "24h": [99.9, 100, 100, 99.95, 100, 99.97, 99.98],
      "7d": [99.8, 99.9, 99.95, 100, 99.92, 99.97, 99.95],
      "30d": [99.6, 99.8, 99.85, 99.9, 99.88, 99.93, 99.91],
    },
  },
  {
    id: "web",
    name: "Web App",
    target: 99.9,
    values: { "24h": 99.99, "7d": 99.92, "30d": 99.88 },
    spark: {
      "24h": [100, 100, 99.97, 100, 100, 99.98, 99.99],
      "7d": [99.9, 99.85, 99.95, 99.9, 99.93, 99.9, 99.92],
      "30d": [99.7, 99.6, 99.85, 99.9, 99.82, 99.9, 99.88],
    },
  },
  {
    id: "db",
    name: "Primary DB",
    target: 99.95,
    values: { "24h": 99.9, "7d": 99.88, "30d": 99.82 },
    spark: {
      "24h": [99.95, 99.9, 99.85, 99.9, 99.92, 99.88, 99.9],
      "7d": [99.9, 99.8, 99.85, 99.9, 99.86, 99.89, 99.88],
      "30d": [99.8, 99.7, 99.75, 99.8, 99.78, 99.85, 99.82],
    },
  },
  {
    id: "queue",
    name: "Job Queue",
    target: 99.5,
    values: { "24h": 99.6, "7d": 99.55, "30d": 99.4 },
    spark: {
      "24h": [99.5, 99.6, 99.7, 99.6, 99.55, 99.62, 99.6],
      "7d": [99.4, 99.5, 99.6, 99.5, 99.52, 99.58, 99.55],
      "30d": [99.2, 99.3, 99.4, 99.45, 99.38, 99.42, 99.4],
    },
  },
  {
    id: "cdn",
    name: "CDN Edge",
    target: 99.99,
    values: { "24h": 100, "7d": 99.99, "30d": 99.97 },
    spark: {
      "24h": [100, 100, 100, 100, 100, 100, 100],
      "7d": [99.98, 100, 99.99, 100, 99.99, 100, 99.99],
      "30d": [99.95, 99.96, 99.98, 99.99, 99.97, 99.98, 99.97],
    },
  },
  {
    id: "auth",
    name: "Auth Service",
    target: 99.95,
    values: { "24h": 99.85, "7d": 99.8, "30d": 99.7 },
    spark: {
      "24h": [99.9, 99.85, 99.8, 99.85, 99.9, 99.82, 99.85],
      "7d": [99.75, 99.8, 99.85, 99.78, 99.82, 99.79, 99.8],
      "30d": [99.6, 99.65, 99.7, 99.75, 99.68, 99.72, 99.7],
    },
  },
];

type Incident = {
  id: string;
  service: string;
  date: string;
  duration: number;
  severity: "Minor" | "Major";
};

const INCIDENTS: Incident[] = [
  { id: "inc-1", service: "Auth Service", date: "Oct 19", duration: 14, severity: "Minor" },
  { id: "inc-2", service: "Primary DB", date: "Oct 15", duration: 42, severity: "Major" },
  { id: "inc-3", service: "Job Queue", date: "Oct 12", duration: 8, severity: "Minor" },
  { id: "inc-4", service: "Web App", date: "Oct 8", duration: 22, severity: "Minor" },
  { id: "inc-5", service: "Auth Service", date: "Oct 3", duration: 61, severity: "Major" },
  { id: "inc-6", service: "Primary DB", date: "Sep 28", duration: 11, severity: "Minor" },
];

function fmt(n: number) {
  return n.toFixed(2);
}

function statusColor(value: number, target: number) {
  if (value >= target) return GOOD;
  if (value >= target - 0.1) return WARN;
  return ACCENT_STRONG;
}

/* ───────── small building blocks ───────── */

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{ backgroundColor: ACCENT }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function Sparkline({ points, id, onFocusPoint }: { points: number[]; id: string; onFocusPoint: (v: number | null) => void }) {
  const w = 120;
  const h = 28;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = Number(((i / (points.length - 1)) * w).toFixed(2));
    const y = Number((h - ((p - min) / range) * h).toFixed(2));
    return { x, y, v: p };
  });
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-7 w-full" aria-hidden="true">
        <path d={path} fill="none" stroke={ACCENT} strokeWidth="1.5" />
      </svg>
      <div className="mt-1 flex justify-between">
        {coords.map((c, i) => (
          <button
            key={i}
            type="button"
            onFocus={() => onFocusPoint(c.v)}
            onBlur={() => onFocusPoint(null)}
            onMouseEnter={() => onFocusPoint(c.v)}
            onMouseLeave={() => onFocusPoint(null)}
            aria-label={`Day ${i + 1}: ${fmt(c.v)}% uptime`}
            className={`flex h-6 w-6 items-center justify-center rounded-full ${FOCUS_RING}`}
          >
            <span className="h-2 w-2 rounded-full border border-zinc-400 bg-white" aria-hidden="true" />
          </button>
        ))}
      </div>
      <p id={id} className={`mt-1 text-[10px] font-normal tabular-nums ${MUTED}`}>
        Hover or tab a point for that day&apos;s value
      </p>
    </div>
  );
}

function ServiceCard({
  service,
  period,
  selected,
  onSelect,
}: {
  service: Service;
  period: Period;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hoverVal, setHoverVal] = useState<number | null>(null);
  const value = service.values[period];
  const color = statusColor(value, service.target);
  const sparkId = useId();
  return (
    <div
      className="rounded-xl border bg-white p-4"
      style={{ borderColor: selected ? ACCENT : BORDER, borderWidth: selected ? 2 : 1 }}
    >
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={`-mx-1 -my-1 rounded-md px-1 py-1 text-left text-sm font-semibold ${FOCUS_RING}`}
          style={{ color: FG, minHeight: 24 }}
        >
          {service.name}
        </button>
        <span className={`text-xs font-normal tabular-nums ${MUTED}`}>target {service.target}%</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold tabular-nums" style={{ color }}>
        {hoverVal !== null ? fmt(hoverVal) : fmt(value)}%
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }}
        />
      </div>
      <div className="mt-3" aria-describedby={sparkId}>
        <Sparkline points={service.spark[period]} id={sparkId} onFocusPoint={setHoverVal} />
      </div>
    </div>
  );
}

type SortKey = "date" | "service" | "duration";

function IncidentTable({ selectedService }: { selectedService: string | null }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const copy = [...INCIDENTS];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "duration") cmp = a.duration - b.duration;
      else if (sortKey === "service") cmp = a.service.localeCompare(b.service);
      else cmp = INCIDENTS.indexOf(a) - INCIDENTS.indexOf(b);
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((a) => !a);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  function headerButton(key: SortKey, label: string) {
    const active = key === sortKey;
    return (
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className={`flex items-center gap-1 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500 ${FOCUS_RING}`}
      >
        {label}
        {active ? (
          asc ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className={`h-3 w-3 ${MUTED}`} />
        )}
      </button>
    );
  }

  function thSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return asc ? "ascending" : "descending";
  }

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: BORDER, backgroundColor: CARD }}>
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">Recent incidents, sortable by date, service, or duration</caption>
        <colgroup>
          <col style={{ width: "18%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr className="border-b" style={{ borderColor: BORDER }}>
            <th scope="col" aria-sort={thSort("date")} className="px-4 py-3 text-left font-normal">
              {headerButton("date", "Date")}
            </th>
            <th scope="col" aria-sort={thSort("service")} className="px-4 py-3 text-left font-normal">
              {headerButton("service", "Service")}
            </th>
            <th scope="col" aria-sort={thSort("duration")} className="px-4 py-3 text-left font-normal">
              {headerButton("duration", "Duration")}
            </th>
            <th scope="col" className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
              Severity
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isHighlighted = selectedService !== null && r.service === selectedService;
            return (
              <tr
                key={r.id}
                className="border-b last:border-0"
                style={{
                  borderColor: BORDER,
                  backgroundColor: isHighlighted ? "#FFF1F2" : undefined,
                }}
              >
                <td className="whitespace-nowrap px-4 py-3 font-normal tabular-nums text-zinc-700">{r.date}</td>
                <td className="truncate px-4 py-3 font-normal text-zinc-700">{r.service}</td>
                <td className="whitespace-nowrap px-4 py-3 font-normal tabular-nums text-zinc-700">{r.duration}m</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={
                      r.severity === "Major"
                        ? { backgroundColor: "#FEE2E2", color: ACCENT_STRONG }
                        : { backgroundColor: "#FEF3C7", color: WARN }
                    }
                  >
                    {r.severity}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const NAV = [
  { icon: LayoutGrid, label: "Overview", active: true },
  { icon: AlertTriangle, label: "Incidents", active: false },
  { icon: Server, label: "Services", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Page() {
  const [period, setPeriod] = useState<Period>("7d");
  const [selectedId, setSelectedId] = useState<string>(SERVICES[0].id);
  const selected = SERVICES.find((s) => s.id === selectedId) ?? SERVICES[0];

  const atTarget = SERVICES.filter((s) => s.values[period] >= s.target).length;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: BG, color: FG }}>
      {/* sidebar */}
      <aside
        className="hidden w-60 flex-shrink-0 flex-col border-r bg-white sm:flex"
        style={{ borderColor: BORDER }}
      >
        <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: BORDER }}>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            P
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">Pulseboard</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>Acme Platform</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold"
              style={
                item.active
                  ? { backgroundColor: "#FFF1F2", color: ACCENT_STRONG }
                  : { color: "#3F3F46" }
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 border-t px-4 py-4" style={{ borderColor: BORDER }}>
          <Avatar initials="JN" />
          <div>
            <p className="text-xs font-semibold leading-none">Jordan Ng</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>SRE Lead</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar */}
        <header
          className="flex h-[44px] items-center justify-between border-b bg-white px-4 sm:px-6"
          style={{ borderColor: BORDER }}
        >
          <span className={`inline-flex items-center gap-2 rounded-lg border px-3 text-xs font-normal ${MUTED}`} style={{ borderColor: BORDER, height: 32 }}>
            <Search className="h-3.5 w-3.5" />
            Search
            <span className={`ml-2 rounded border px-1 text-[10px] ${MUTED}`} style={{ borderColor: BORDER }}>
              ⌘K
            </span>
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT }}
            >
              New incident
            </button>
            <Bell className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            <Avatar initials="JN" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-[-0.02em]">Service health</h1>
              <p className={`mt-1 text-sm font-normal ${MUTED}`}>
                {atTarget} of {SERVICES.length} services at or above target
              </p>
            </div>
            <div className="flex gap-1 rounded-lg border p-1" style={{ borderColor: BORDER }} role="group" aria-label="Period">
              {(["24h", "7d", "30d"] as Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={p === period}
                  onClick={() => setPeriod(p)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    p === period ? "text-white" : "text-zinc-600"
                  }`}
                  style={p === period ? { backgroundColor: ACCENT } : undefined}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                period={period}
                selected={s.id === selectedId}
                onSelect={() => setSelectedId(s.id)}
              />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-500">Recent incidents</h2>
              <div className="mt-3">
                <IncidentTable selectedService={selected.name} />
              </div>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: BORDER, backgroundColor: CARD }}>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">Inspector</p>
              <p className="mt-2 text-sm font-semibold">{selected.name}</p>
              <p className={`mt-1 text-xs font-normal ${MUTED_TINT}`}>Target {selected.target}% uptime</p>
              <p
                className="mt-4 text-3xl font-extrabold tabular-nums"
                style={{ color: statusColor(selected.values[period], selected.target) }}
              >
                {fmt(selected.values[period])}%
              </p>
              <p className={`mt-1 text-xs font-normal ${MUTED}`}>over the last {period}</p>
              <p className={`mt-4 text-xs font-normal leading-relaxed ${MUTED_TINT}`}>
                {INCIDENTS.filter((i) => i.service === selected.name).length} incident(s) on record for
                this service. Select a different card above to inspect it instead — the incidents
                table on the left highlights matching rows for whichever service is selected here.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
