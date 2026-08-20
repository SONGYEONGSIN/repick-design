"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown, Equal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Bridge, DriverId, DriverType } from "./data";
import { DRIVER_TYPES, formatPct, formatSignedUSD, formatUSD } from "./data";
import { ACCENT_TEXT, BORDER, CHART, FOCUS, HOVER_ROW, NUM, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Card, CardHead, DirectionMark, Segmented, useOutsideClose } from "./ui";

type SortKey = "driver" | "amount" | "running" | "share";
type SortDir = "asc" | "desc";
type DirFilter = "all" | "increase" | "decrease";

const DIR_OPTIONS: { id: DirFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "increase", label: "Increases" },
  { id: "decrease", label: "Decreases" },
];

/**
 * Column widths are tuned so the Driver cell keeps its two lines intact at 1280px, the narrowest
 * width the desktop ledger is ever asked to render — a name clipped to "Observability r…" means
 * the split is wrong, not that the name is too long.
 */
const COLUMNS: { key: SortKey | null; label: string; width: string; align: "left" | "right" }[] = [
  { key: "driver", label: "Driver", width: "34%", align: "left" },
  { key: null, label: "Direction", width: "15%", align: "left" },
  { key: "amount", label: "Amount", width: "16%", align: "right" },
  { key: "running", label: "Running total", width: "17%", align: "right" },
  { key: "share", label: "Share", width: "18%", align: "right" },
];

function TypeFilter({ value, onChange }: { value: DriverType | "all"; onChange: (v: DriverType | "all") => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const options: (DriverType | "all")[] = ["all", ...DRIVER_TYPES];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium", BORDER, SURFACE_INSET, TEXT_SECONDARY, "hover:bg-white/[0.07]", TRANSITION, FOCUS)}
      >
        <span className="sr-only">Filter by driver type: </span>
        {value === "all" ? "All types" : value}
        <ChevronDown size={14} aria-hidden="true" className={TEXT_AUX} />
      </button>
      {open ? (
        <div role="listbox" aria-label="Driver type" className={cx("absolute right-0 top-full z-30 mt-1.5 w-44 rounded-xl border p-1", BORDER, "bg-zinc-900 shadow-xl shadow-black/60")}>
          {options.map((opt) => {
            const selected = opt === value;
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
                className={cx("flex min-h-9 w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm font-medium", TRANSITION, FOCUS, selected ? "bg-lime-400/10 text-lime-300" : cx(TEXT_PRIMARY, "hover:bg-white/5"))}
              >
                <span className="min-w-0 flex-1 truncate">{opt === "all" ? "All types" : opt}</span>
                {selected ? <Check size={14} aria-hidden="true" className={ACCENT_TEXT} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The share bar is scaled against the LARGEST share in view, not against a full 100% track: at
 * 100% the 3.2% driver would draw a 1px stub that reads as a rendering fault. The exact figure
 * sits immediately to its left, so the bar only has to carry rank at a glance.
 */
function ShareBar({ share, maxShare, selected }: { share: number; maxShare: number; selected: boolean }) {
  const w = Math.max(6, Math.round((share / maxShare) * 1000) / 10);
  return (
    <span aria-hidden="true" className={cx("ml-2 hidden h-1.5 w-10 shrink-0 overflow-hidden rounded-full 2xl:inline-block", SURFACE_INSET)}>
      <span className="block h-full rounded-full" style={{ width: `${w}%`, backgroundColor: selected ? CHART.decrease : CHART.increase }} />
    </span>
  );
}

export default function LedgerTable({
  bridge,
  selectedId,
  onSelect,
}: {
  bridge: Bridge;
  selectedId: DriverId | null;
  onSelect: (id: DriverId) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("share");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [dirFilter, setDirFilter] = useState<DirFilter>("all");
  const [typeFilter, setTypeFilter] = useState<DriverType | "all">("all");

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "driver" ? "asc" : "desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = bridge.rows.filter(
      (r) => (dirFilter === "all" || r.direction === dirFilter) && (typeFilter === "all" || r.type === typeFilter),
    );
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "driver") cmp = a.label.localeCompare(b.label);
      else if (sortKey === "amount") cmp = a.amount - b.amount;
      else if (sortKey === "running") cmp = a.runningTotal - b.runningTotal;
      else cmp = a.share - b.share;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [bridge, dirFilter, typeFilter, sortKey, sortDir]);

  const shown = rows.reduce((a, r) => a + r.amount, 0);
  const maxShare = Math.max(1, ...rows.map((r) => r.share));
  const shownShare = rows.reduce((a, r) => a + r.share, 0);
  const filtering = dirFilter !== "all" || typeFilter !== "all";

  return (
    <Card id="ledger-card" className="flex min-w-0 flex-col">
      <CardHead
        title="Running-total ledger"
        hint={`One row per bar in the bridge. Running totals always follow the bridge's own order, so they stay true when the view is sorted or filtered. ${rows.length} of ${bridge.rows.length} drivers shown.`}
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Segmented options={DIR_OPTIONS} value={dirFilter} onChange={setDirFilter} ariaLabel="Filter ledger by direction" />
        <TypeFilter value={typeFilter} onChange={setTypeFilter} />
      </div>

      {/* Desktop: the real ledger. */}
      <div className={cx("mt-3 hidden rounded-xl border lg:block", BORDER)}>
        <table className="w-full table-fixed text-left text-sm">
          <caption className={cx("px-3 pt-3 text-left text-[11px] font-normal", TEXT_AUX)}>
            {`${bridge.basis.full} — driver, direction, signed amount, running balance, share of gross variance. Headers sort; the selected row matches the highlighted bar.`}
          </caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.label} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLUMNS.map((col) => {
                if (!col.key) {
                  return (
                    <th key={col.label} scope="col" className={cx("px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
                      {col.label}
                    </th>
                  );
                }
                const active = sortKey === col.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={col.label}
                    scope="col"
                    aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                    className={cx("px-3 py-2.5", col.align === "right" && "text-right")}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as SortKey)}
                      className={cx(
                        "inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.08em]",
                        col.align === "right" && "flex-row-reverse",
                        active ? TEXT_PRIMARY : TEXT_AUX,
                        "hover:text-zinc-50",
                        TRANSITION,
                        FOCUS,
                      )}
                    >
                      {col.label}
                      <Icon size={11} aria-hidden="true" className={active ? ACCENT_TEXT : undefined} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            {rows.map((row) => {
              const selected = row.id === selectedId;
              return (
                <tr
                  key={row.id}
                  aria-selected={selected}
                  className={cx(TRANSITION, selected ? "bg-lime-400/[0.09]" : HOVER_ROW)}
                >
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => onSelect(row.id)}
                      className={cx("flex w-full min-w-0 items-center gap-2 rounded-md text-left", TRANSITION, FOCUS)}
                    >
                      <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-md border", BORDER, selected ? "bg-lime-400/15" : SURFACE_INSET)}>
                        <row.Icon size={13} aria-hidden="true" className={selected ? "text-lime-300" : TEXT_AUX} />
                      </span>
                      <span className="min-w-0">
                        <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{row.label}</span>
                        <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>{`${row.type} · ${row.owner}`}</span>
                      </span>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <span className={cx("inline-flex items-center gap-1 text-xs font-medium", TEXT_SECONDARY)}>
                      <DirectionMark amount={row.amount} size={12} />
                      {row.amount < 0 ? "Decrease" : "Increase"}
                    </span>
                  </td>
                  <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatSignedUSD(row.amount)}</td>
                  <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-sm font-normal", NUM, TEXT_SECONDARY)}>{formatUSD(row.runningTotal)}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">
                    <span className="inline-flex items-center justify-end">
                      <span className={cx("text-sm font-medium", NUM, TEXT_PRIMARY)}>{formatPct(row.share)}</span>
                      <ShareBar share={row.share} maxShare={maxShare} selected={selected} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={cx("border-t", BORDER, SURFACE_INSET)}>
              <th scope="row" className={cx("px-3 py-2.5 text-left text-xs font-semibold", TEXT_PRIMARY)}>
                {filtering ? "Subtotal of shown rows" : "Net movement"}
              </th>
              <td className="whitespace-nowrap px-3 py-2.5">
                <span className={cx("inline-flex items-center gap-1 text-xs font-medium", TEXT_SECONDARY)}>
                  <DirectionMark amount={shown} size={12} />
                  {shown < 0 ? "Decrease" : "Increase"}
                </span>
              </td>
              <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatSignedUSD(shown)}</td>
              <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatUSD(bridge.closing)}</td>
              <td className={cx("whitespace-nowrap px-3 py-2.5 text-right text-sm font-medium", NUM, TEXT_SECONDARY)}>{formatPct(shownShare)}</td>
            </tr>
          </tfoot>
        </table>

        <p className={cx("flex items-center gap-1.5 border-t px-3 py-2.5 text-[11px] font-medium", BORDER, bridge.balanced ? ACCENT_TEXT : "text-zinc-50")}>
          {bridge.balanced ? <Check size={13} aria-hidden="true" strokeWidth={2.5} /> : <Equal size={13} aria-hidden="true" />}
          {bridge.balanced
            ? `Balanced — ${formatUSD(bridge.opening)} opening ${formatSignedUSD(bridge.net)} = ${formatUSD(bridge.closing)} closing.`
            : `Out of balance by ${formatSignedUSD(bridge.derivedClosing - bridge.closing)}.`}
        </p>
      </div>

      {/* Below lg the five-column ledger stops being legible however the widths are split, so it is
          replaced by a stacked card list rather than shrunk into a side-scroller. */}
      <ul className="mt-3 flex flex-col gap-1.5 lg:hidden">
        {rows.map((row) => {
          const selected = row.id === selectedId;
          return (
            <li key={row.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(row.id)}
                className={cx("w-full rounded-xl border p-3 text-left", TRANSITION, FOCUS, selected ? "border-lime-400/50 bg-lime-400/[0.09]" : cx(BORDER, "bg-white/[0.02] hover:bg-white/[0.05]"))}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{row.label}</span>
                    <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>{`${row.type} · ${row.owner}`}</span>
                  </span>
                  <span className={cx("flex shrink-0 items-center gap-1 text-sm font-semibold tabular-nums", TEXT_PRIMARY)}>
                    <DirectionMark amount={row.amount} size={12} />
                    {formatSignedUSD(row.amount)}
                  </span>
                </span>
                <span className={cx("mt-2 flex items-baseline justify-between gap-2 whitespace-nowrap text-[11px] font-normal", TEXT_AUX)}>
                  <span className="min-w-0 truncate">{`${row.amount < 0 ? "Decrease" : "Increase"} · ${formatPct(row.share)}`}</span>
                  <span className="shrink-0 tabular-nums">{`Running ${formatUSD(row.runningTotal)}`}</span>
                </span>
              </button>
            </li>
          );
        })}
        <li className={cx("rounded-xl border p-3", BORDER, SURFACE_INSET)}>
          <span className="flex items-baseline justify-between gap-3">
            <span className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{filtering ? "Subtotal of shown rows" : "Net movement"}</span>
            <span className={cx("text-sm font-semibold tabular-nums", TEXT_PRIMARY)}>{formatSignedUSD(shown)}</span>
          </span>
          <span className={cx("mt-1 flex items-baseline justify-between gap-3 text-[11px] font-normal", TEXT_AUX)}>
            <span>{bridge.balanced ? "Bridge balanced" : "Bridge out of balance"}</span>
            <span className="tabular-nums">{`Closing ${formatUSD(bridge.closing)}`}</span>
          </span>
        </li>
      </ul>
    </Card>
  );
}
