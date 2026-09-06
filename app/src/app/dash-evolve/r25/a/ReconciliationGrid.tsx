"use client";

import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpCircle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  AlertTriangle,
  Minus,
  Pin,
  PinOff,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  TOTAL_LINES,
  WAREHOUSES,
  formatHoursAgo,
  formatInt,
  formatUSD,
  scanTrailOf,
  valueImpactOf,
  varianceOf,
  type ReconLine,
  type StatusFilter,
  type WarehouseFilter,
} from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, STATUS_BADGE, STATUS_LABEL, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, Progress, Segmented, useOutsideClose } from "./ui";

type SortKey = "scanned" | "variance" | "value" | "confidence" | "lastScan";

const STATUS_ICON = { matched: CheckCircle2, reviewing: Clock, missing: AlertTriangle, overcount: ArrowUpCircle } as const;

const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "matched", label: "Matched" },
  { id: "reviewing", label: "Reviewing" },
  { id: "missing", label: "Missing" },
  { id: "overcount", label: "Overcount" },
];

function SortHeader({ label, sortKeyId, sortKey, asc, onToggle, className, align = "right" }: { label: string; sortKeyId: SortKey; sortKey: SortKey; asc: boolean; onToggle: (key: SortKey) => void; className?: string; align?: "left" | "right" }) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : null;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={cx("py-2 align-middle font-normal", align === "right" ? "text-right" : "text-left", className)}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={cx(
          "inline-flex min-h-6 items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-[0.06em]",
          TRANSITION,
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
          active ? "text-zinc-50" : TEXT_AUX,
        )}
      >
        {label}
        {Icon ? <Icon size={11} aria-hidden="true" /> : <span aria-hidden="true" className="h-[11px] w-[11px]" />}
      </button>
    </th>
  );
}

function WarehouseDropdown({ value, onChange }: { value: WarehouseFilter; onChange: (v: WarehouseFilter) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const options: WarehouseFilter[] = ["all", ...WAREHOUSES];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium", BORDER, SURFACE_INSET, TEXT_SECONDARY, TRANSITION, FOCUS, "hover:bg-white/[0.06]")}
      >
        {value === "all" ? "All warehouses" : value}
        <ChevronDown size={13} aria-hidden="true" className={TEXT_AUX} />
      </button>
      {open ? (
        <div role="listbox" aria-label="Filter by warehouse" className={cx("absolute right-0 top-full z-30 mt-1.5 w-44 rounded-xl border p-1", BORDER, "bg-zinc-800 shadow-xl shadow-black/40")}>
          {options.map((w) => {
            const selected = w === value;
            return (
              <button
                key={w}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(w);
                  setOpen(false);
                }}
                className={cx("flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-medium", TRANSITION, FOCUS, selected ? "bg-blue-500/10 text-blue-300" : cx(TEXT_SECONDARY, "hover:bg-white/[0.06]"))}
              >
                {w === "all" ? "All warehouses" : w}
                {selected ? <Check size={13} aria-hidden="true" className="text-blue-400" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/** Ephemeral, read-only scan-trail popover. It is triggered by hover *or* focus on the SKU cell's
 *  trigger button and owns no state outside this component's own hoverId/render — closing it
 *  (mouseleave or blur) leaves zero residual effect on the rest of the page. This is deliberately
 *  a *different* interaction from the Pin button two cells over: pinning persists and recomputes
 *  the tray above the grid; this only ever describes what's already on screen. */
function ScanTrailPopover({ line }: { line: ReconLine }) {
  const trail = scanTrailOf(line);
  return (
    <div
      role="tooltip"
      className={cx(
        "absolute left-0 top-full z-30 mt-1.5 w-64 max-w-[80vw] rounded-xl border p-3 text-left shadow-xl shadow-black/50",
        BORDER,
        "bg-zinc-800",
      )}
    >
      <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Scan trail</p>
      <ul className="mt-1.5 flex flex-col gap-1">
        {trail.map((ev, i) => (
          <li key={i} className="flex items-center justify-between gap-3 text-xs">
            <span className={TEXT_SECONDARY}>{formatHoursAgo(ev.hoursAgo)}</span>
            <span className={cx(NUM, "font-medium", TEXT_PRIMARY)}>{`+${formatInt(ev.units)} units`}</span>
          </li>
        ))}
      </ul>
      <p className={cx("mt-2 border-t pt-2 text-[11px] leading-relaxed", BORDER, TEXT_AUX)}>{line.warehouse} · does not change the pinned line above</p>
    </div>
  );
}

export default function ReconciliationGrid({
  rows,
  statusFilter,
  onStatusFilterChange,
  warehouseFilter,
  onWarehouseFilterChange,
  search,
  onSearchChange,
  pinnedId,
  onTogglePin,
}: {
  rows: ReconLine[];
  statusFilter: StatusFilter;
  onStatusFilterChange: (v: StatusFilter) => void;
  warehouseFilter: WarehouseFilter;
  onWarehouseFilterChange: (v: WarehouseFilter) => void;
  search: string;
  onSearchChange: (v: string) => void;
  pinnedId: string | null;
  onTogglePin: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [asc, setAsc] = useState(true);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (sortKey === "scanned") {
        av = a.scanned;
        bv = b.scanned;
      } else if (sortKey === "variance") {
        av = varianceOf(a);
        bv = varianceOf(b);
      } else if (sortKey === "value") {
        av = valueImpactOf(a);
        bv = valueImpactOf(b);
      } else if (sortKey === "confidence") {
        av = a.confidence;
        bv = b.confidence;
      } else {
        av = a.lastScanHoursAgo;
        bv = b.lastScanHoursAgo;
      }
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented ariaLabel="Filter by status" options={STATUS_OPTIONS} value={statusFilter} onChange={onStatusFilterChange} />

        <label className={cx("flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border px-2.5 sm:max-w-xs", BORDER, SURFACE_INSET, "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-400")}>
          <Search size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <span className="sr-only">Search reconciliation lines</span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SKU, title, category…"
            className={cx("h-full min-w-0 flex-1 bg-transparent text-xs font-normal outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
        </label>

        <WarehouseDropdown value={warehouseFilter} onChange={onWarehouseFilterChange} />

        <span className={cx("ml-auto text-[11px] font-normal", TEXT_AUX)}>{`${formatInt(rows.length)} of ${formatInt(TOTAL_LINES)} lines`}</span>
      </div>

      <div className="w-full min-w-0 overflow-x-auto rounded-xl border border-white/10 [scrollbar-width:thin]">
        <table className="relative w-full min-w-[900px] table-fixed border-collapse text-sm">
          <caption className="sr-only">Inventory reconciliation lines, sortable by scanned quantity, variance, value impact, match confidence, and last scan time</caption>
          <colgroup>
            <col className="w-[4%]" />
            <col className="w-[25%]" />
            <col className="w-[9%]" />
            <col className="w-[8%]" />
            <col className="w-[10%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[11%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className="relative min-w-9 py-2 font-normal">
                <span className="sr-only">Pin</span>
              </th>
              <th scope="col" className={cx("min-w-[200px] py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                SKU
              </th>
              <SortHeader label="Exp / Scan" sortKeyId="scanned" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="min-w-[80px]" />
              <SortHeader label="Variance" sortKeyId="variance" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="min-w-[70px]" />
              <SortHeader label="Value impact" sortKeyId="value" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="min-w-[90px]" />
              <SortHeader label="Confidence" sortKeyId="confidence" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="left" className="min-w-[110px]" />
              <th scope="col" className={cx("min-w-[110px] py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Status
              </th>
              <th scope="col" className={cx("min-w-[100px] py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Reviewer
              </th>
              <SortHeader label="Last scan" sortKeyId="lastScan" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="right" className="min-w-[70px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={9} className={cx("py-10 text-center text-sm font-normal", TEXT_AUX)}>
                  No lines match the current filters.
                </td>
              </tr>
            ) : null}
            {sorted.map((line) => {
              const variance = varianceOf(line);
              const value = valueImpactOf(line);
              const VarIcon = variance > 0 ? ArrowUpRight : variance < 0 ? ArrowDownRight : Minus;
              const StatusIcon = STATUS_ICON[line.status];
              const pinned = pinnedId === line.id;
              const confidenceTone = line.status === "missing" ? "danger" : line.status === "matched" ? "ok" : "accent";
              return (
                <tr key={line.id} className={cx(HOVER_ROW, TRANSITION, pinned && "bg-blue-500/[0.06]")}>
                  <td className="min-w-9 py-2 pl-2 align-middle">
                    <button
                      type="button"
                      aria-pressed={pinned}
                      aria-label={pinned ? `Unpin ${line.title}` : `Pin ${line.title} for cross-reference`}
                      onClick={() => onTogglePin(line.id)}
                      className={cx("grid h-7 w-7 place-items-center rounded-md", TRANSITION, FOCUS, pinned ? "bg-blue-500/20 text-blue-300" : cx(TEXT_AUX, "hover:bg-white/[0.08] hover:text-zinc-50"))}
                    >
                      {pinned ? <Pin size={14} aria-hidden="true" strokeWidth={2.25} /> : <PinOff size={14} aria-hidden="true" />}
                    </button>
                  </td>
                  <td className="relative min-w-[200px] py-2.5 pr-2 align-middle">
                    <button
                      type="button"
                      onMouseEnter={() => setHoverId(line.id)}
                      onMouseLeave={() => setHoverId(null)}
                      onFocus={() => setHoverId(line.id)}
                      onBlur={() => setHoverId(null)}
                      aria-expanded={hoverId === line.id}
                      aria-describedby={hoverId === line.id ? `trail-${line.id}` : undefined}
                      className={cx("block w-full min-w-0 rounded-md px-1 py-0.5 text-left", TRANSITION, FOCUS)}
                    >
                      <p className={cx("line-clamp-2 text-[13px] font-medium leading-snug", TEXT_PRIMARY)}>{line.title}</p>
                      <p className={cx("mt-0.5 truncate font-mono text-[11px] font-normal", TEXT_AUX)}>{`${line.sku} · ${line.category} · ${line.warehouse}`}</p>
                    </button>
                    {hoverId === line.id ? (
                      <div id={`trail-${line.id}`}>
                        <ScanTrailPopover line={line} />
                      </div>
                    ) : null}
                  </td>
                  <td className={cx("min-w-[80px] whitespace-nowrap py-2.5 pr-2 text-right align-middle text-[13px] font-normal", NUM, TEXT_SECONDARY)}>{`${formatInt(line.expected)} / ${formatInt(line.scanned)}`}</td>
                  <td className={cx("min-w-[70px] whitespace-nowrap py-2.5 pr-2 text-right align-middle text-[13px] font-medium", NUM)}>
                    <span className={cx("inline-flex items-center gap-1", statusToneText(line.status))}>
                      <VarIcon size={12} aria-hidden="true" />
                      {variance > 0 ? `+${formatInt(variance)}` : formatInt(variance)}
                    </span>
                  </td>
                  <td className={cx("min-w-[90px] whitespace-nowrap py-2.5 pr-2 text-right align-middle text-[13px] font-medium", NUM, TEXT_PRIMARY)}>{formatUSD(value)}</td>
                  <td className="min-w-[110px] py-2.5 pr-2 align-middle">
                    <div className="flex items-center gap-2">
                      <Progress value={line.confidence} label={`${line.title} match confidence`} tone={confidenceTone} />
                      <span className={cx("w-8 shrink-0 text-right text-[11px] font-medium", NUM, TEXT_MUTED)}>{`${line.confidence}%`}</span>
                    </div>
                  </td>
                  <td className="min-w-[110px] py-2.5 pr-2 align-middle">
                    <Badge Icon={StatusIcon} className={STATUS_BADGE[line.status]}>
                      {STATUS_LABEL[line.status]}
                    </Badge>
                  </td>
                  <td className="min-w-[100px] py-2.5 pr-2 align-middle">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Image
                        src={`https://images.unsplash.com/photo-${line.reviewer.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 shrink-0 rounded-full bg-zinc-800 object-cover"
                      />
                      <span className={cx("truncate text-[13px] font-normal", TEXT_SECONDARY)}>{line.reviewer.name}</span>
                    </div>
                  </td>
                  <td className={cx("min-w-[70px] whitespace-nowrap py-2.5 pr-3 text-right align-middle text-[13px] font-normal", NUM, TEXT_MUTED)}>{formatHoursAgo(line.lastScanHoursAgo)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function statusToneText(status: ReconLine["status"]): string {
  if (status === "missing") return "text-red-400";
  if (status === "overcount") return "text-orange-400";
  if (status === "matched") return "text-zinc-400";
  return "text-zinc-300";
}
