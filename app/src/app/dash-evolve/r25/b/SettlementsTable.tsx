"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown, Pin } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { HERO_DATA, METHOD_LABEL, SELLER_BY_ID, STATUS_LABEL, currency, formatDate, type RunStatus, type SettlementRun } from "./data";
import { ACCENT_TEXT, BORDER, FOCUS, HOVER_ROW, NUM, PANEL_BG, SURFACE_INSET, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, StatusBadge, useOutsideClose } from "./ui";

type SortKey = "amount" | "date";
type StatusFilter = "all" | RunStatus;

const STATUS_ORDER: RunStatus[] = ["paid", "processing", "held", "failed"];

function SortHeader({ label, sortKeyId, sortKey, asc, onToggle, className }: { label: string; sortKeyId: SortKey; sortKey: SortKey; asc: boolean; onToggle: (k: SortKey) => void; className?: string }) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={cx("py-2 text-right align-middle", className)}>
      <button type="button" onClick={() => onToggle(sortKeyId)} className={cx("inline-flex items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-[0.06em]", TRANSITION, FOCUS, active ? TEXT_PRIMARY : TEXT_MUTED)}>
        {label}
        <Icon size={11} aria-hidden="true" />
      </button>
    </th>
  );
}

function StatusFilterMenu({ value, onChange, counts, total }: { value: StatusFilter; onChange: (v: StatusFilter) => void; counts: Record<RunStatus, number>; total: number }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const currentLabel = value === "all" ? `All statuses (${total})` : `${STATUS_LABEL[value]} (${counts[value]})`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium", BORDER, SURFACE_INSET, TEXT_MUTED, TRANSITION, FOCUS, "hover:bg-white")}
      >
        {currentLabel}
        <ChevronDown size={13} aria-hidden="true" />
      </button>
      {open ? (
        <div role="listbox" aria-label="Filter by status" className={cx("absolute right-0 top-full z-20 mt-1.5 w-52 rounded-xl border p-1", BORDER, PANEL_BG, "shadow-xl shadow-zinc-900/10")}>
          {(["all", ...STATUS_ORDER] as StatusFilter[]).map((opt) => {
            const selected = opt === value;
            const label = opt === "all" ? `All statuses (${total})` : `${STATUS_LABEL[opt]} (${counts[opt]})`;
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
                className={cx("flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm", TRANSITION, FOCUS, selected ? cx(ACCENT_TEXT, "font-semibold") : cx("font-medium", TEXT_PRIMARY), "hover:bg-zinc-100")}
              >
                {label}
                {selected ? <Check size={14} aria-hidden="true" className={ACCENT_TEXT} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function SettlementsTable({ runs, pinnedRunId, onPinToggle }: { runs: SettlementRun[]; pinnedRunId: string | null; onPinToggle: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [asc, setAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const outerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ sellerId: string; runId: string; top: number; left: number } | null>(null);

  const counts = useMemo(() => {
    const base: Record<RunStatus, number> = { paid: 0, processing: 0, held: 0, failed: 0 };
    for (const r of runs) base[r.status] += 1;
    return base;
  }, [runs]);

  const filtered = useMemo(() => (statusFilter === "all" ? runs : runs.filter((r) => r.status === statusFilter)), [runs, statusFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = sortKey === "amount" ? a.amount : a.dateIso;
      const bv = sortKey === "amount" ? b.amount : b.dateIso;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  }

  function showTooltip(e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>, sellerId: string, runId: string) {
    const contRect = outerRef.current?.getBoundingClientRect();
    const trigRect = e.currentTarget.getBoundingClientRect();
    if (!contRect) return;
    setHover({ sellerId, runId, top: trigRect.bottom - contRect.top + 6, left: Math.min(Math.max(trigRect.left - contRect.left, 0), Math.max(contRect.width - 264, 0)) });
  }
  function hideTooltip(runId: string) {
    setHover((cur) => (cur && cur.runId === runId ? null : cur));
  }

  const hoverSeller = hover ? SELLER_BY_ID[hover.sellerId] : null;

  return (
    <div ref={outerRef} className="relative">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={cx("text-xs font-normal", TEXT_MUTED)}>{`Showing ${sorted.length} of ${runs.length} recent runs · ${HERO_DATA.quarter.settlements.toLocaleString("en-US")} processed this quarter`}</p>
        <StatusFilterMenu value={statusFilter} onChange={setStatusFilter} counts={counts} total={runs.length} />
      </div>

      <div className="mt-3 w-full overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className={cx("mb-2 text-left text-xs font-normal", TEXT_MUTED)}>
            Recent settlement runs. Click a row&apos;s pin to inspect it in the panel on the right; this list is a fixed operational sample and is independent of the period toggle above.
          </caption>
          {/*
            Column budget (min content width, computed before percentages — not guessed after):
              Run 100 · Seller 110 · Amount 76 · Method 90 · Status 96 · Date 84 = 556px sum.
            Percentages below are that sum's shares, so at the tightest tested desktop width
            (1280px, ~600px available in this card) the columns sit ~44px above their floor and
            never hit min-w; only mobile (Method hidden, remaining floors ~466px vs ~326px
            available) is expected to trigger the horizontal-scroll safety net.
          */}
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[20%]" />
            <col className="w-[14%]" />
            <col className="hidden w-[16%] md:table-column" />
            <col className="w-[17%]" />
            <col className="w-[15%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("min-w-[100px] py-2 pr-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_MUTED)}>
                Run
              </th>
              <th scope="col" className={cx("min-w-[110px] py-2 pr-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_MUTED)}>
                Seller
              </th>
              <SortHeader label="Amount" sortKeyId="amount" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="min-w-[76px] pr-2" />
              <th scope="col" className={cx("hidden min-w-[90px] py-2 pr-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] md:table-cell", TEXT_MUTED)}>
                Method
              </th>
              <th scope="col" className={cx("min-w-[96px] py-2 pr-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_MUTED)}>
                Status
              </th>
              <SortHeader label="Date" sortKeyId="date" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="min-w-[84px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((run) => {
              const seller = SELLER_BY_ID[run.sellerId];
              const isPinned = pinnedRunId === run.id;
              return (
                <tr key={run.id} className={cx(HOVER_ROW, TRANSITION, isPinned && "bg-orange-50/60")}>
                  <td className="py-2.5 pr-2 align-middle">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        aria-pressed={isPinned}
                        onClick={() => onPinToggle(run.id)}
                        className={cx("relative grid h-7 w-7 shrink-0 place-items-center rounded-md", TRANSITION, FOCUS, isPinned ? "bg-orange-100 text-orange-700" : cx(TEXT_MUTED, "hover:bg-zinc-100"))}
                      >
                        <Pin size={13} aria-hidden="true" className={isPinned ? "fill-orange-700" : undefined} />
                        <span className="sr-only">{isPinned ? `Unpin run ${run.id}` : `Pin run ${run.id} to detail panel`}</span>
                      </button>
                      <span className={cx("truncate font-mono text-[12.5px] font-medium", TEXT_PRIMARY)}>{run.id}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-2 align-middle">
                    <button
                      type="button"
                      aria-describedby={hover?.runId === run.id ? "settlement-seller-tip" : undefined}
                      onMouseEnter={(e) => showTooltip(e, run.sellerId, run.id)}
                      onFocus={(e) => showTooltip(e, run.sellerId, run.id)}
                      onMouseLeave={() => hideTooltip(run.id)}
                      onBlur={() => hideTooltip(run.id)}
                      className={cx("flex w-full items-center gap-2 rounded-md py-0.5 text-left", TRANSITION, FOCUS)}
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-${seller.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                        alt=""
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px] shrink-0 rounded-full bg-zinc-200 object-cover"
                      />
                      <span className={cx("min-w-0 truncate text-[13px] font-medium", TEXT_PRIMARY)}>{seller.name}</span>
                    </button>
                  </td>
                  <td className={cx("whitespace-nowrap py-2.5 pr-2 text-right align-middle text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>{currency(run.amount)}</td>
                  <td className={cx("hidden truncate py-2.5 pr-2 align-middle text-[13px] font-normal md:table-cell", TEXT_MUTED)}>{METHOD_LABEL[run.method]}</td>
                  <td className="py-2.5 pr-2 align-middle">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className={cx("whitespace-nowrap py-2.5 text-right align-middle text-[13px] font-normal", NUM, TEXT_MUTED)}>{formatDate(run.dateIso)}</td>
                </tr>
              );
            })}
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className={cx("py-8 text-center text-sm font-normal", TEXT_MUTED)}>
                  No settlement runs match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {hover && hoverSeller ? (
        <div
          id="settlement-seller-tip"
          role="tooltip"
          style={{ top: hover.top, left: hover.left }}
          className={cx("absolute z-20 w-64 rounded-xl border p-3 shadow-lg shadow-zinc-900/10", BORDER, PANEL_BG)}
        >
          <p className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{hoverSeller.name}</p>
          <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_MUTED)}>
            {hoverSeller.region} · seller since {hoverSeller.sellerSince}
            <br />
            {hoverSeller.lifetimeSettlements.toLocaleString("en-US")} lifetime settlements
          </p>
          <Badge className="mt-2">Ephemeral preview — closes on blur</Badge>
        </div>
      ) : null}
    </div>
  );
}
