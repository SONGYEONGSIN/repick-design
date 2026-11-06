"use client";

import { useMemo, useState } from "react";
import { Bell, LayoutGrid, ListTree, Search, Settings, Users } from "lucide-react";
import { TREE, findLeaf, grandTotal, topLeaf, type Leaf } from "./data";
import Tree from "./tree";
import InspectorPanel from "./inspector-panel";
import { cx } from "./ui";

const NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Root cause", icon: ListTree, active: true },
  { label: "Customers", icon: Users, active: false },
];

function allBranchIds(): string[] {
  return TREE.flatMap((cat) => [cat.id, ...cat.subcategories.map((s) => s.id)]);
}

const DEFAULT_LEAF = topLeaf();
const TOTAL = grandTotal();
const RESOLUTION_RATE = 71;
const AVG_RESOLUTION = "1.8d";

export default function DashboardApp() {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(allBranchIds()));
  const [pinnedLeafId, setPinnedLeafId] = useState(DEFAULT_LEAF.id);
  const [hoveredLeafId, setHoveredLeafId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function pin(leaf: Leaf) {
    setPinnedLeafId(leaf.id);
  }

  const current = useMemo(() => findLeaf(pinnedLeafId), [pinnedLeafId]);
  const hovered = hoveredLeafId && hoveredLeafId !== pinnedLeafId ? findLeaf(hoveredLeafId) : null;

  const q = query.trim().toLowerCase();
  const matchCount = q.length
    ? TREE.flatMap((c) => c.subcategories.flatMap((s) => s.leaves)).filter((l) => l.name.toLowerCase().includes(q)).length
    : 0;

  if (!current) return null;

  return (
    <div className="flex min-h-dvh w-full bg-zinc-50 font-sans text-zinc-900">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 lg:flex">
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cyan-600 text-[13px] font-semibold text-white" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            T
          </span>
          <span className="text-[14px] font-semibold" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            Traceline
          </span>
        </div>
        <nav aria-label="Primary" className="mt-6 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <div key={item.label} className={cx("flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium", item.active ? "bg-cyan-50 text-cyan-700" : "text-zinc-500")}>
              <item.icon aria-hidden className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 rounded-lg border border-zinc-200 px-2.5 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-600">JV</span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-zinc-900">Jules Voss</p>
            <p className="truncate text-[11px] text-zinc-500">Support operations</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 items-center gap-3 border-b border-zinc-200 bg-white px-4 lg:px-6">
          <label className="relative hidden max-w-xs flex-1 sm:block">
            <span className="sr-only">Search root causes</span>
            <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search root causes"
              className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-8 pr-3 text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
            />
          </label>
          {query && (
            <span className="text-[11px] text-zinc-500" aria-live="polite">
              {matchCount} match{matchCount === 1 ? "" : "es"}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button type="button" aria-label="Notifications" className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500">
              <Bell aria-hidden className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Settings" className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500">
              <Settings aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-semibold tracking-tight text-zinc-900">Root-cause explorer</h1>
              <p className="mt-0.5 text-[13px] text-zinc-500">Trailing 30 days · {TOTAL} tickets classified.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600">
                Total tickets <span className="ml-1 font-semibold tabular-nums text-zinc-900">{TOTAL}</span>
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600">
                Resolution rate <span className="ml-1 font-semibold tabular-nums text-zinc-900">{RESOLUTION_RATE}%</span>
              </span>
              <span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-zinc-600">
                Avg. resolution <span className="ml-1 font-semibold tabular-nums text-zinc-900">{AVG_RESOLUTION}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <section aria-label="Ticket decomposition tree" className="min-w-0 flex-[1.6] rounded-xl border border-zinc-200 bg-white p-4 lg:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[13px] font-semibold text-zinc-900">Tickets decomposed by cause</h2>
                <p className="text-[12px] text-zinc-500" aria-live="polite">
                  {hovered
                    ? `${hovered.leaf.name}: ${hovered.leaf.count} tickets · last seen ${hovered.leaf.lastSeen} · ${hovered.leaf.trend === "up" ? "trending up" : hovered.leaf.trend === "down" ? "trending down" : "flat"}`
                    : "Hover or focus a root cause for its trend and last occurrence"}
                </p>
              </div>
              <div className="mt-3">
                <Tree
                  expanded={expanded}
                  onToggle={toggle}
                  pinnedLeafId={pinnedLeafId}
                  hoveredLeafId={hoveredLeafId}
                  query={query}
                  onPin={pin}
                  onHoverChange={setHoveredLeafId}
                />
              </div>
            </section>

            <InspectorPanel cat={current.cat} sub={current.sub} leaf={current.leaf} />
          </div>
        </main>
      </div>
    </div>
  );
}
