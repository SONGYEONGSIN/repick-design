"use client";

import { useId, useMemo, useState } from "react";
import {
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Check,
} from "lucide-react";

const BG = "#F8FAFC";
const CARD = "#FFFFFF";
const BORDER = "#E2E8F0";
const FG = "#1E293B";
const MUTED = "text-zinc-500"; // 4.83:1 on white
const MUTED_TINT = "text-zinc-600"; // 7.73:1 — tinted-surface text
const ACCENT = "#7C3AED"; // violet-600 — 5.70:1 on white
const COMPARE_COLORS = ["#0D9488", "#B45309"]; // teal-600, amber-700 — both AA-safe on white

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]";

/* ───────── deterministic data ───────── */

const AXES = ["Quality", "Price", "Delivery", "Support", "Compliance"] as const;
type Axis = (typeof AXES)[number];

type Vendor = {
  id: string;
  name: string;
  category: string;
  scores: Record<Axis, number>;
};

const VENDORS: Vendor[] = [
  { id: "v1", name: "Northfield Mfg.", category: "Apparel", scores: { Quality: 88, Price: 62, Delivery: 74, Support: 70, Compliance: 95 } },
  { id: "v2", name: "Solace Leather", category: "Accessories", scores: { Quality: 92, Price: 55, Delivery: 68, Support: 80, Compliance: 90 } },
  { id: "v3", name: "Harrow & Finch", category: "Footwear", scores: { Quality: 78, Price: 80, Delivery: 85, Support: 65, Compliance: 72 } },
  { id: "v4", name: "Cedarline Goods", category: "Apparel", scores: { Quality: 70, Price: 88, Delivery: 60, Support: 58, Compliance: 68 } },
  { id: "v5", name: "Mica Optics", category: "Eyewear", scores: { Quality: 85, Price: 70, Delivery: 90, Support: 75, Compliance: 83 } },
  { id: "v6", name: "Rowan Timepiece", category: "Watches", scores: { Quality: 95, Price: 40, Delivery: 55, Support: 60, Compliance: 98 } },
];

function overall(v: Vendor) {
  const vals = AXES.map((a) => v.scores[a]);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

/* ───────── radar geometry (deterministic, 2dp) ───────── */

const R = 80;
const CX = 110;
const CY = 100;

function axisPoint(i: number, value: number) {
  const angle = (-90 + i * (360 / AXES.length)) * (Math.PI / 180);
  const r = (value / 100) * R;
  const x = Number((CX + r * Math.cos(angle)).toFixed(2));
  const y = Number((CY + r * Math.sin(angle)).toFixed(2));
  return { x, y };
}

function labelPoint(i: number) {
  const angle = (-90 + i * (360 / AXES.length)) * (Math.PI / 180);
  const r = R + 22;
  const x = Number((CX + r * Math.cos(angle)).toFixed(2));
  const y = Number((CY + r * Math.sin(angle)).toFixed(2));
  return { x, y };
}

function polygonPath(vendor: Vendor) {
  return AXES.map((a, i) => {
    const { x, y } = axisPoint(i, vendor.scores[a]);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ") + " Z";
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

function RadarChart({ primary, compare }: { primary: Vendor; compare: Vendor[] }) {
  const ringLevels = [20, 40, 60, 80, 100];
  return (
    <div>
      <svg viewBox="0 0 220 210" className="mx-auto h-64 w-full max-w-sm" role="img" aria-label={`Radar chart for ${primary.name}`}>
        {ringLevels.map((lvl) => {
          const pts = AXES.map((_, i) => axisPoint(i, lvl));
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
          return <path key={lvl} d={d} fill="none" stroke="#E2E8F0" strokeWidth="1" />;
        })}
        {AXES.map((_, i) => {
          const p = axisPoint(i, 100);
          return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#E2E8F0" strokeWidth="1" />;
        })}
        {compare.map((v, idx) => (
          <path
            key={v.id}
            d={polygonPath(v)}
            fill="none"
            stroke={COMPARE_COLORS[idx % COMPARE_COLORS.length]}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        ))}
        <path d={polygonPath(primary)} fill={ACCENT} fillOpacity="0.15" stroke={ACCENT} strokeWidth="2" />
        {AXES.map((a, i) => {
          const p = axisPoint(i, primary.scores[a]);
          return <circle key={a} cx={p.x} cy={p.y} r="2.5" fill={ACCENT} />;
        })}
        {AXES.map((a, i) => {
          const lp = labelPoint(i);
          return (
            <text
              key={a}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={FG}
            >
              {a}
            </text>
          );
        })}
      </svg>
      <ul className="mt-3 grid grid-cols-5 gap-2 text-center">
        {AXES.map((a) => (
          <li key={a}>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${MUTED}`}>{a}</p>
            <p className="text-sm font-extrabold tabular-nums" style={{ color: ACCENT, fontFamily: "var(--font-display-mono)" }}>
              {primary.scores[a]}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type SortKey = "name" | "category" | "overall";

function VendorRail({
  selectedId,
  onSelect,
  compareIds,
  onToggleCompare,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("overall");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const copy = [...VENDORS];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "category") cmp = a.category.localeCompare(b.category);
      else cmp = overall(a) - overall(b);
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, asc]);

  function toggle(key: SortKey) {
    if (key === sortKey) setAsc((a) => !a);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ArrowUpDown className={`h-3 w-3 ${MUTED}`} />;
    return asc ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  }

  function thSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return asc ? "ascending" : "descending";
  }

  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: BORDER, backgroundColor: CARD }}>
      <table className="w-full table-fixed border-collapse text-sm">
        <caption className="sr-only">Vendor scorecards, sortable, select a row to inspect</caption>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "46%" }} />
          <col style={{ width: "24%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr className="border-b" style={{ borderColor: BORDER }}>
            <th scope="col" className="px-3 py-2.5 text-left">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.06em] ${MUTED}`}>Cmp.</span>
            </th>
            <th scope="col" aria-sort={thSort("name")} className="px-3 py-2.5 text-left font-normal">
              <button type="button" onClick={() => toggle("name")} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${MUTED} ${FOCUS_RING}`}>
                Vendor {sortIcon("name")}
              </button>
            </th>
            <th scope="col" aria-sort={thSort("category")} className="px-3 py-2.5 text-left font-normal">
              <button type="button" onClick={() => toggle("category")} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${MUTED} ${FOCUS_RING}`}>
                Category {sortIcon("category")}
              </button>
            </th>
            <th scope="col" aria-sort={thSort("overall")} className="px-3 py-2.5 text-left font-normal">
              <button type="button" onClick={() => toggle("overall")} className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${MUTED} ${FOCUS_RING}`}>
                Score {sortIcon("overall")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => {
            const isSelected = v.id === selectedId;
            const compareIdx = compareIds.indexOf(v.id);
            return (
              <tr key={v.id} className="border-b last:border-0" style={{ borderColor: BORDER, backgroundColor: isSelected ? "#F5F3FF" : undefined }}>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleCompare(v.id)}
                    disabled={v.id === selectedId}
                    aria-pressed={compareIdx >= 0}
                    className={`flex h-6 w-6 items-center justify-center rounded border text-[9px] font-semibold disabled:opacity-30 ${FOCUS_RING}`}
                    style={{
                      borderColor: compareIdx >= 0 ? COMPARE_COLORS[compareIdx % COMPARE_COLORS.length] : BORDER,
                      color: compareIdx >= 0 ? COMPARE_COLORS[compareIdx % COMPARE_COLORS.length] : "transparent",
                    }}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">
                      {compareIdx >= 0 ? `Remove ${v.name} from radar comparison` : `Add ${v.name} to radar comparison`}
                    </span>
                  </button>
                </td>
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onSelect(v.id)}
                    aria-pressed={isSelected}
                    className={`-mx-1 -my-1 rounded px-1 py-1 text-left text-sm font-semibold ${FOCUS_RING}`}
                    style={{ color: FG, minHeight: 24 }}
                  >
                    {v.name}
                  </button>
                </td>
                <td className={`truncate px-3 py-2.5 text-xs font-normal ${MUTED_TINT}`}>{v.category}</td>
                <td className="px-3 py-2.5 text-sm font-extrabold tabular-nums" style={{ color: FG }}>
                  {overall(v)}
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
  { icon: Users, label: "Vendors", active: true },
  { icon: ClipboardList, label: "Scorecards", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Page() {
  const [selectedId, setSelectedId] = useState("v1");
  const [compareIds, setCompareIds] = useState<string[]>(["v3"]);
  const selected = VENDORS.find((v) => v.id === selectedId) ?? VENDORS[0];
  const compareVendors = compareIds.map((id) => VENDORS.find((v) => v.id === id)).filter((v): v is Vendor => !!v);
  const legendId = useId();

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: BG, color: FG }}>
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r bg-white sm:flex" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-2 border-b px-5 py-4" style={{ borderColor: BORDER }}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold text-white" style={{ backgroundColor: ACCENT }}>
            V
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">Vantage</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>Sourcing Ops</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold"
              style={item.active ? { backgroundColor: "#F5F3FF", color: ACCENT } : { color: "#3F3F46" }}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
          ))}
        </nav>
        <div className="flex items-center gap-2.5 border-t px-4 py-4" style={{ borderColor: BORDER }}>
          <Avatar initials="PL" />
          <div>
            <p className="text-xs font-semibold leading-none">Priya Lal</p>
            <p className={`mt-1 text-xs font-normal leading-none ${MUTED}`}>Sourcing Manager</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[44px] items-center justify-between border-b bg-white px-4 sm:px-6" style={{ borderColor: BORDER }}>
          <span className={`inline-flex items-center gap-2 rounded-lg border px-3 text-xs font-normal ${MUTED}`} style={{ borderColor: BORDER, height: 32 }}>
            <Search className="h-3.5 w-3.5" />
            Search
            <span className={`ml-2 rounded border px-1 text-[10px] ${MUTED}`} style={{ borderColor: BORDER }}>
              ⌘K
            </span>
          </span>
          <div className="flex items-center gap-3">
            <button type="button" className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${FOCUS_RING}`} style={{ backgroundColor: ACCENT }}>
              New scorecard
            </button>
            <Bell className={`h-4 w-4 ${MUTED}`} aria-hidden="true" />
            <Avatar initials="PL" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <h1 className="text-2xl font-extrabold tracking-[-0.02em]">Vendor scorecards</h1>
          <p className={`mt-1 text-sm font-normal ${MUTED}`}>
            {VENDORS.length} vendors tracked across {AXES.length} scoring axes.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <VendorRail
              selectedId={selectedId}
              onSelect={setSelectedId}
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
            />

            <div className="rounded-xl border p-5" style={{ borderColor: BORDER, backgroundColor: CARD }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.08em] ${MUTED}`}>Detail</p>
                  <p className="mt-1 text-lg font-extrabold">{selected.name}</p>
                  <p className={`text-xs font-normal ${MUTED_TINT}`}>{selected.category} · overall {overall(selected)}</p>
                </div>
                <div id={legendId} className="flex flex-col items-end gap-1 text-xs font-normal">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden="true" />
                    {selected.name}
                  </span>
                  {compareVendors.map((v, idx) => (
                    <span key={v.id} className="inline-flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full border"
                        style={{ borderColor: COMPARE_COLORS[idx % COMPARE_COLORS.length] }}
                        aria-hidden="true"
                      />
                      {v.name} (compare)
                    </span>
                  ))}
                  {compareVendors.length === 0 && (
                    <span className={MUTED}>Check a row&apos;s &ldquo;Cmp.&rdquo; box to overlay it here.</span>
                  )}
                </div>
              </div>
              <div className="mt-4" aria-describedby={legendId}>
                <RadarChart primary={selected} compare={compareVendors} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
