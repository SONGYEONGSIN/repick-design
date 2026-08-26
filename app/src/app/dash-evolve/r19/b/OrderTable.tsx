"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { LINES, LINE_BY_ID, STATUS_ICON, WORK_ORDERS, dueOffset, formatInt, formatShort } from "./data";
import type { LineId, WorkOrder } from "./data";
import { BORDER, FOCUS, NUM, STATUS_BADGE, STATUS_LABEL, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import type { OrderStatus } from "./tokens";
import { Card, CardHead, ProgressBar, useOutsideClose } from "./ui";

type SortKey = "id" | "line" | "start" | "due" | "progress" | "qty";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS: OrderStatus[] = ["on-track", "at-risk", "delayed", "complete", "hold"];

const COLUMNS: { key: SortKey; label: string; width: string; align: "left" | "right" }[] = [
  { key: "id", label: "Work order", width: "26%", align: "left" },
  { key: "line", label: "Line", width: "20%", align: "left" },
  { key: "start", label: "Start", width: "11%", align: "right" },
  { key: "due", label: "Due", width: "11%", align: "right" },
  { key: "progress", label: "Progress", width: "20%", align: "right" },
  { key: "qty", label: "Qty", width: "12%", align: "right" },
];

function LineFilter({ value, onChange }: { value: LineId | "all"; onChange: (v: LineId | "all") => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium", BORDER, SURFACE_INSET, TEXT_SECONDARY, "hover:bg-white", TRANSITION, FOCUS)}
      >
        <span className="sr-only">Filter by production line: </span>
        {value === "all" ? "All lines" : LINE_BY_ID[value].name}
        <ChevronDown size={14} aria-hidden="true" className={TEXT_AUX} />
      </button>
      {open ? (
        <div role="listbox" aria-label="Production line" className={cx("absolute right-0 top-full z-30 mt-1.5 w-52 rounded-xl border p-1", BORDER, "bg-white shadow-xl shadow-zinc-900/10")}>
          {(["all", ...LINES.map((l) => l.id)] as (LineId | "all")[]).map((opt) => {
            const selected = opt === value;
            const label = opt === "all" ? "All lines" : LINE_BY_ID[opt].name;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cx("flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium", TRANSITION, FOCUS, selected ? "bg-cyan-50 text-cyan-700" : cx(TEXT_PRIMARY, "hover:bg-zinc-100"))}
              >
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {selected ? <Check size={14} aria-hidden="true" className="text-cyan-600" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function OrderTable() {
  const [sortKey, setSortKey] = useState<SortKey>("due");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [lineFilter, setLineFilter] = useState<LineId | "all">("all");
  const [query, setQuery] = useState("");

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const q = query.trim().toLowerCase();

  const rows = useMemo(() => {
    const filtered = WORK_ORDERS.filter(
      (o) =>
        (statusFilter === "all" || o.status === statusFilter) &&
        (lineFilter === "all" || o.lineId === lineFilter) &&
        (q === "" || o.id.toLowerCase().includes(q) || o.sku.toLowerCase().includes(q)),
    );
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "line") cmp = LINE_BY_ID[a.lineId].name.localeCompare(LINE_BY_ID[b.lineId].name);
      else if (sortKey === "start") cmp = a.startOffset - b.startOffset;
      else if (sortKey === "due") cmp = dueOffset(a) - dueOffset(b);
      else if (sortKey === "progress") cmp = a.progress - b.progress;
      else cmp = a.qty - b.qty;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [statusFilter, lineFilter, q, sortKey, sortDir]);

  const totalQty = rows.reduce((a, o) => a + o.qty, 0);
  const avgProgress = rows.length ? Math.round(rows.reduce((a, o) => a + o.progress, 0) / rows.length) : 0;
  const filtering = statusFilter !== "all" || lineFilter !== "all" || q !== "";

  return (
    <Card id="orders-card" className="flex min-w-0 flex-col">
      <CardHead
        title="Work order ledger"
        hint={`Every order across all six lines, independent of the schedule's line focus above. ${rows.length} of ${WORK_ORDERS.length} orders shown.`}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className={cx("relative flex h-9 min-w-0 flex-1 items-center gap-1.5 rounded-xl border px-2.5 sm:max-w-xs", BORDER, SURFACE_INSET)}>
          <Search size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <span className="sr-only">Search work orders by id or SKU</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search id or SKU…"
            className={cx("h-full min-w-0 flex-1 rounded-md bg-transparent text-xs font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
        </label>
        <div role="radiogroup" aria-label="Filter ledger by status" className={cx("inline-flex flex-wrap items-center gap-1 rounded-xl border p-0.5", BORDER, SURFACE_INSET)}>
          {(["all", ...STATUS_OPTIONS] as (OrderStatus | "all")[]).map((s) => {
            const active = s === statusFilter;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setStatusFilter(s)}
                className={cx(
                  "h-8 rounded-lg px-2.5 text-[11px]",
                  TRANSITION,
                  FOCUS,
                  active ? "bg-zinc-900 font-semibold text-white" : cx("font-medium", TEXT_MUTED, "hover:bg-white hover:text-zinc-900"),
                )}
              >
                {s === "all" ? "All" : STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>
        <LineFilter value={lineFilter} onChange={setLineFilter} />
      </div>

      {/* Desktop: the real ledger. */}
      <div className={cx("mt-3 hidden overflow-hidden rounded-xl border md:block", BORDER)}>
        <table className="w-full table-fixed text-left text-sm">
          <caption className={cx("px-3 pt-3 text-left text-[11px] font-normal", TEXT_AUX)}>
            {"Work order, production line, start, due, progress and quantity for every order matching the filters above. Column headers sort."}
          </caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER, SURFACE_INSET)}>
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={col.key} scope="col" aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className={cx("px-3 py-2.5", col.align === "right" && "text-right")}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cx(
                        "inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.08em]",
                        col.align === "right" && "flex-row-reverse",
                        active ? TEXT_PRIMARY : TEXT_MUTED,
                        "hover:text-zinc-900",
                        TRANSITION,
                        FOCUS,
                      )}
                    >
                      {col.label}
                      <Icon size={11} aria-hidden="true" className={active ? "text-cyan-600" : undefined} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((o) => (
              <OrderRow key={o.id} order={o} />
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={cx("px-3 py-8 text-center text-sm font-normal", TEXT_AUX)}>
                  No work orders match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
          {rows.length > 0 ? (
            <tfoot>
              <tr className={cx("border-t", BORDER, SURFACE_INSET)}>
                <th scope="row" colSpan={4} className={cx("px-3 py-2.5 text-left text-xs font-semibold", TEXT_PRIMARY)}>
                  {filtering ? "Subtotal of shown rows" : "Fleet total"}
                </th>
                <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-xs font-semibold", NUM, TEXT_PRIMARY)}>{`Avg ${avgProgress}%`}</td>
                <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-xs font-semibold", NUM, TEXT_PRIMARY)}>{formatInt(totalQty)}</td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      {/* Below md the six-column ledger stops being legible, so it becomes a stacked card list. */}
      <ul className="mt-3 flex flex-col gap-1.5 md:hidden">
        {rows.map((o) => (
          <li key={o.id} className={cx("rounded-xl border p-3", BORDER, "bg-white")}>
            <div className="flex items-start justify-between gap-2">
              <span className="min-w-0">
                <span className={cx("block truncate text-sm font-semibold", TEXT_PRIMARY)}>{o.id}</span>
                <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>{`${o.sku} · ${LINE_BY_ID[o.lineId].name}`}</span>
              </span>
              <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", STATUS_BADGE[o.status])}>{STATUS_LABEL[o.status]}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar value={o.progress} className="flex-1" />
              <span className={cx("shrink-0 text-xs font-medium tabular-nums", TEXT_PRIMARY)}>{`${o.progress}%`}</span>
            </div>
            <p className={cx("mt-1.5 flex items-baseline justify-between gap-2 whitespace-nowrap text-[11px] font-normal", TEXT_AUX)}>
              <span className="tabular-nums">{`${formatShort(o.startOffset)} – ${formatShort(dueOffset(o))}`}</span>
              <span className="tabular-nums">{`Qty ${formatInt(o.qty)}`}</span>
            </p>
          </li>
        ))}
        {rows.length === 0 ? <li className={cx("rounded-xl border p-6 text-center text-sm font-normal", BORDER, TEXT_AUX)}>No work orders match the current filters.</li> : null}
      </ul>
    </Card>
  );
}

function OrderRow({ order: o }: { order: WorkOrder }) {
  const StatusIcon = STATUS_ICON[o.status];
  return (
    <tr className={cx(TRANSITION, "hover:bg-zinc-50")}>
      <td className="px-3 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md", STATUS_BADGE[o.status])}>
            <StatusIcon size={12} aria-hidden="true" strokeWidth={2.25} />
          </span>
          <span className="min-w-0">
            <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{o.id}</span>
            <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>{o.sku}</span>
          </span>
        </span>
      </td>
      <td className="px-3 py-2.5">
        <span className={cx("block truncate text-xs font-medium", TEXT_SECONDARY)}>{LINE_BY_ID[o.lineId].name}</span>
      </td>
      <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-xs font-normal", NUM, TEXT_SECONDARY)}>{formatShort(o.startOffset)}</td>
      <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-xs font-normal", NUM, TEXT_SECONDARY)}>{formatShort(dueOffset(o))}</td>
      <td className="whitespace-nowrap px-3 py-2.5">
        <span className="flex items-center justify-end gap-2">
          <ProgressBar value={o.progress} className="hidden w-14 2xl:block" />
          <span className={cx("text-xs font-medium tabular-nums", TEXT_PRIMARY)}>{`${o.progress}%`}</span>
        </span>
      </td>
      <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-xs font-medium", NUM, TEXT_PRIMARY)}>{formatInt(o.qty)}</td>
    </tr>
  );
}
