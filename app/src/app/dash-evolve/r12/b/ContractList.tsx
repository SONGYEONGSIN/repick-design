"use client";

import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useMemo, useRef } from "react";
import {
  CONTRACTS,
  CONTRACT_TYPE_SHORT,
  EXPIRY_BY_MONTH,
  NEXT_EXPIRY_DAYS,
  STATUS_META,
  STATUS_ORDER,
  TOTAL_EXPIRING,
  formatExpiry,
  type Contract,
  type ContractStatus,
  type SortDir,
  type SortKey,
} from "./data";

import { BORDER, DIVIDE, FOCUS_RING, FOCUS_RING_INSET, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TONE, TRANSITION, cx } from "./tokens";
import { Badge, CardHeader, EyebrowLabel, ExpirySparkline, InitialsAvatar, RiskBadge } from "./ui";

function compareContracts(a: Contract, b: Contract, key: SortKey, dir: SortDir): number {
  let cmp = 0;
  if (key === "name") {
    cmp = a.counterparty.localeCompare(b.counterparty);
  } else if (key === "risk") {
    cmp = a.riskScore - b.riskScore;
  } else {
    const ax = a.daysToExpiry;
    const bx = b.daysToExpiry;
    if (ax === null && bx === null) cmp = 0;
    else if (ax === null) cmp = 1;
    else if (bx === null) cmp = -1;
    else cmp = ax - bx;
  }
  return dir === "asc" ? cmp : -cmp;
}

function SortButton({
  label,
  sortKeyValue,
  activeKey,
  sortDir,
  onSort,
}: {
  label: string;
  sortKeyValue: SortKey;
  activeKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortKeyValue;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKeyValue)}
      className={cx(
        "flex min-h-11 w-full items-center gap-1 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider",
        TRANSITION,
        FOCUS_RING_INSET,
        active ? "text-sky-700 dark:text-sky-400" : TEXT_CAPTION,
        "hover:text-zinc-900 dark:hover:text-zinc-100",
      )}
    >
      {label}
      {active ? sortDir === "asc" ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" /> : <ArrowUpDown size={12} aria-hidden="true" className="opacity-40" />}
    </button>
  );
}

export default function ContractList({
  selectedId,
  onSelect,
  activeStatuses,
  onToggleStatus,
  searchQuery,
  onSearchQueryChange,
  sortKey,
  sortDir,
  onSort,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  activeStatuses: ContractStatus[];
  onToggleStatus: (status: ContractStatus) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const rowRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const q = searchQuery.trim().toLowerCase();
  const isSearching = q !== "";

  const groups = useMemo(() => {
    return STATUS_ORDER.filter((status) => activeStatuses.includes(status)).map((status) => {
      const rows = CONTRACTS.filter((c) => c.status === status && (!isSearching || c.counterparty.toLowerCase().includes(q) || c.contractType.toLowerCase().includes(q))).sort((a, b) =>
        compareContracts(a, b, sortKey, sortDir),
      );
      return { status, rows };
    });
  }, [activeStatuses, isSearching, q, sortKey, sortDir]);

  const visibleCount = useMemo(() => groups.reduce((sum, g) => sum + g.rows.length, 0), [groups]);
  const flatVisibleIds = useMemo(() => groups.flatMap((g) => g.rows.map((r) => r.id)), [groups]);

  function moveSelection(fromId: string, dir: "up" | "down") {
    const idx = flatVisibleIds.indexOf(fromId);
    if (idx === -1) return;
    const targetIdx = dir === "up" ? Math.max(0, idx - 1) : Math.min(flatVisibleIds.length - 1, idx + 1);
    const targetId = flatVisibleIds[targetIdx];
    if (!targetId) return;
    onSelect(targetId);
    rowRefs.current.get(targetId)?.focus();
  }

  function handleRowKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, id: string) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveSelection(id, "down");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveSelection(id, "up");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <section aria-labelledby="contract-list-heading" className="flex min-w-0 flex-col gap-3">
      <CardHeader
        titleId="contract-list-heading"
        title="Contract list"
        description={isSearching ? `${visibleCount} of ${CONTRACTS.length} contracts match "${searchQuery.trim()}"` : `${CONTRACTS.length} contracts across ${STATUS_ORDER.length} stages`}
      />

      <div className={cx("flex flex-col gap-1.5 rounded-xl border p-3", BORDER, "bg-zinc-50/70 dark:bg-white/[0.02]")}>
        <div className="flex items-center justify-between gap-3">
          <EyebrowLabel>Expiring per month</EyebrowLabel>
          <ExpirySparkline data={EXPIRY_BY_MONTH} width={148} height={32} />
        </div>
        <p className={cx("text-xs leading-snug", TEXT_CAPTION)}>
          <span className={cx("font-semibold tabular-nums", TEXT_PRIMARY)}>{TOTAL_EXPIRING}</span> contracts expiring in the next 12 months &middot; next expiry in{" "}
          <span className={cx("font-semibold tabular-nums", TEXT_PRIMARY)}>{NEXT_EXPIRY_DAYS} days</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_ORDER.map((status) => {
          const count = CONTRACTS.filter((c) => c.status === status).length;
          const pressed = activeStatuses.includes(status);
          const tone = TONE[STATUS_META[status].tone];
          return (
            <button
              key={status}
              type="button"
              aria-pressed={pressed}
              onClick={() => onToggleStatus(status)}
              className={cx(
                "inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-xs font-medium",
                TRANSITION,
                FOCUS_RING,
                pressed ? cx(tone.text, tone.bg, tone.border) : cx("border-zinc-200 text-zinc-400 dark:border-white/10 dark:text-zinc-500", "hover:text-zinc-600 dark:hover:text-zinc-300"),
              )}
            >
              <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", pressed ? tone.dot : "bg-zinc-300 dark:bg-zinc-600")} />
              {STATUS_META[status].label}
              <span className="tabular-nums">{count}</span>
            </button>
          );
        })}
      </div>

      <label className="relative flex h-11 w-full items-center">
        <span className="sr-only" id="contract-search-label">
          Filter contracts by counterparty or contract type
        </span>
        <Search size={15} aria-hidden="true" className={cx("pointer-events-none absolute left-3", TEXT_CAPTION)} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          aria-labelledby="contract-search-label"
          placeholder="Filter by counterparty or type…"
          className={cx("h-11 w-full rounded-lg border pl-9 pr-9 text-sm", BORDER, "bg-white dark:bg-zinc-900", TEXT_PRIMARY, "placeholder:text-zinc-400 dark:placeholder:text-zinc-500", FOCUS_RING)}
        />
        {isSearching ? (
          <button
            type="button"
            onClick={() => onSearchQueryChange("")}
            aria-label="Clear contract filter"
            className={cx("absolute right-1.5 grid h-8 w-8 place-items-center rounded-md", "hover:bg-zinc-100 dark:hover:bg-white/10", TRANSITION, FOCUS_RING)}
          >
            <X size={14} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        ) : null}
      </label>

      <div className={cx("overflow-x-auto overflow-y-auto rounded-xl border lg:max-h-[calc(100dvh-30rem)]", BORDER)}>
        <table className="w-full min-w-[560px] border-collapse text-left lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">
            Contract list grouped by review stage, sortable by counterparty, risk score, and days to expiry. {CONTRACTS.length} total contracts.
          </caption>
          <colgroup>
            <col className="lg:w-[36%]" />
            <col className="lg:w-[16%]" />
            <col className="lg:w-[24%]" />
            <col className="lg:w-[24%]" />
          </colgroup>
          <thead className={cx("sticky top-0 z-10 border-b", BORDER, "bg-zinc-50 dark:bg-zinc-900/95")}>
            <tr>
              <th scope="col" aria-sort={ariaSortFor("name")} className="p-0">
                <SortButton label="Counterparty" sortKeyValue="name" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
              </th>
              <th scope="col" className={cx("px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>
                Type
              </th>
              <th scope="col" aria-sort={ariaSortFor("risk")} className="p-0">
                <SortButton label="Risk" sortKeyValue="risk" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
              </th>
              <th scope="col" aria-sort={ariaSortFor("expiry")} className="p-0">
                <SortButton label="Expiry" sortKeyValue="expiry" activeKey={sortKey} sortDir={sortDir} onSort={onSort} />
              </th>
            </tr>
          </thead>

          {groups.length === 0 || visibleCount === 0 ? (
            <tbody>
              <tr>
                <td colSpan={4} className={cx("px-4 py-10 text-center text-sm", TEXT_CAPTION)}>
                  No contracts match the current filters.
                </td>
              </tr>
            </tbody>
          ) : (
            groups.map(
              (group) =>
                group.rows.length > 0 && (
                  <tbody key={group.status} className={cx("border-b last:border-b-0", BORDER)}>
                    <tr className={cx("border-b", BORDER, "bg-zinc-50/70 dark:bg-white/[0.02]")}>
                      <th colSpan={4} className={cx("px-3 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>
                        {STATUS_META[group.status].label}
                        <span className="ml-1.5 tabular-nums">({group.rows.length})</span>
                      </th>
                    </tr>
                    {group.rows.map((c) => {
                      const selected = selectedId === c.id;
                      const urgent = c.daysToExpiry !== null && c.daysToExpiry <= 30;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => onSelect(c.id)}
                          aria-selected={selected}
                          className={cx("cursor-pointer border-b last:border-b-0", DIVIDE, BORDER, TRANSITION, selected ? "bg-sky-50 dark:bg-sky-500/[0.08]" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]")}
                        >
                          <th scope="row" className="p-0 text-left font-normal">
                            <button
                              ref={(el) => {
                                if (el) rowRefs.current.set(c.id, el);
                                else rowRefs.current.delete(c.id);
                              }}
                              type="button"
                              aria-current={selected ? "true" : undefined}
                              onClick={() => onSelect(c.id)}
                              onKeyDown={(e) => handleRowKeyDown(e, c.id)}
                              className={cx("flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left", FOCUS_RING_INSET)}
                            >
                              <InitialsAvatar initials={c.counterpartyInitials} size={26} />
                              <span className="min-w-0 flex-1">
                                <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{c.counterparty}</span>
                              </span>
                            </button>
                          </th>
                          <td className="px-3 py-2 align-middle" title={c.contractType}>
                            <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{CONTRACT_TYPE_SHORT[c.contractType] ?? c.contractType}</span>
                          </td>
                          <td className="px-3 py-2 align-middle">
                            <RiskBadge score={c.riskScore} size={24} dense />
                          </td>
                          <td className="px-3 py-2 align-middle">
                            {c.daysToExpiry === null ? (
                              <span className={cx("text-xs", TEXT_CAPTION)}>Not effective</span>
                            ) : (
                              <span className={cx("inline-flex items-center gap-1 text-xs font-medium tabular-nums", urgent ? "text-rose-700 dark:text-rose-300" : TEXT_SECONDARY)}>
                                {urgent ? <AlertTriangle size={11} aria-hidden="true" /> : null}
                                {formatExpiry(c.daysToExpiry)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                ),
            )
          )}
        </table>
      </div>

      {activeStatuses.length < STATUS_ORDER.length ? (
        <p className={cx("text-xs", TEXT_CAPTION)}>
          <Badge tone={TONE.neutral}>Filtered</Badge> {activeStatuses.length} of {STATUS_ORDER.length} stages shown.
        </p>
      ) : null}
    </section>
  );
}
