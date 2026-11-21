"use client";

import { ArrowUpDown, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { COST_CENTERS, costCenterDeltaAt, costCenterSpendAt, formatCurrency, type PeriodMode } from "./data";
import { BORDER, FOCUS, NUM, RAIL_BG, SURFACE_INSET, TEAM_RAMP, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { DeltaTag } from "./ui";

type SortKey = "name" | "spend" | "delta";
type SortDir = "asc" | "desc";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "spend", label: "Spend" },
  { id: "delta", label: "Change" },
  { id: "name", label: "Name" },
];

/**
 * The content-specific rail — distinct from the global nav sidebar in Sidebar.tsx. Pinning a row
 * here sets ONLY `pinnedId`, read by PinnedCenterCard; it deliberately never touches
 * SpendBreakdown's `activeId`, so the sunburst keeps showing the full org view regardless of
 * what is pinned. Two independently-scoped selections.
 */
export default function CostCenterRail({ period, pinnedId, onPin }: { period: PeriodMode; pinnedId: string | null; onPin: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "spend", dir: "desc" });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = COST_CENTERS.filter((c) => q === "" || c.name.toLowerCase().includes(q));
    const withValues = filtered.map((c) => ({ center: c, spend: costCenterSpendAt(c, period), delta: costCenterDeltaAt(c, period) }));
    const dirMul = sort.dir === "asc" ? 1 : -1;
    withValues.sort((a, b) => {
      switch (sort.key) {
        case "name":
          return a.center.name.localeCompare(b.center.name) * dirMul;
        case "delta":
          return (a.delta.delta - b.delta.delta) * dirMul;
        default:
          return (a.spend - b.spend) * dirMul;
      }
    });
    return withValues;
  }, [query, sort, period]);

  function cycleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  return (
    <aside aria-label="Cost centers" className={cx("w-full shrink-0 rounded-2xl border lg:w-[280px]", BORDER, RAIL_BG)}>
      <div className="flex w-full min-w-0 flex-col p-3">
        <h2 className={cx("px-1 text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>Cost centers</h2>
        <p className={cx("mt-0.5 px-1 text-xs font-normal leading-relaxed", TEXT_AUX)}>{COST_CENTERS.length} teams · pin one to inspect it below</p>

        <div className={cx("mt-3 flex h-10 min-w-0 items-center gap-2 rounded-lg border px-2.5", BORDER, SURFACE_INSET)}>
          <Search size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Filter cost centers…"
            aria-label="Filter cost centers by name"
            className={cx("h-full min-w-0 flex-1 rounded-md bg-transparent text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
        </div>

        <div role="group" aria-label="Sort cost centers" className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {SORTS.map((s) => {
            const active = sort.key === s.id;
            const SortIcon = active ? (sort.dir === "asc" ? ChevronUp : ChevronDown) : ArrowUpDown;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                onClick={() => cycleSort(s.id)}
                className={cx(
                  "inline-flex min-h-9 items-center gap-1 rounded-lg border px-2.5 text-xs",
                  TRANSITION,
                  FOCUS,
                  BORDER,
                  active ? cx(SURFACE_INSET, "font-semibold text-cyan-300") : cx("font-medium", TEXT_MUTED, "hover:bg-white/5"),
                )}
              >
                {s.label}
                <SortIcon size={11} aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <ul className="mt-3 flex flex-col gap-1">
          {rows.map(({ center, spend, delta }) => {
            const pinned = pinnedId === center.id;
            const swatch = TEAM_RAMP[COST_CENTERS.indexOf(center) % TEAM_RAMP.length];
            return (
              <li key={center.id}>
                <button
                  type="button"
                  aria-pressed={pinned}
                  onClick={() => onPin(center.id)}
                  className={cx(
                    "flex min-h-[52px] w-full min-w-0 items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left",
                    TRANSITION,
                    FOCUS,
                    pinned ? "border-cyan-400/40 bg-cyan-400/10" : cx(BORDER, "hover:bg-white/5"),
                  )}
                >
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: swatch }} />
                  <span className="min-w-0 flex-1">
                    <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{center.name}</span>
                    <span className={cx("block truncate text-xs font-normal", NUM, TEXT_AUX)}>{formatCurrency(spend)}</span>
                  </span>
                  <DeltaTag delta={delta.delta} direction={delta.direction} className="shrink-0" />
                </button>
              </li>
            );
          })}
          {rows.length === 0 ? <li className={cx("px-2 py-6 text-center text-sm font-normal", TEXT_AUX)}>No cost centers match that filter.</li> : null}
        </ul>
      </div>
    </aside>
  );
}
