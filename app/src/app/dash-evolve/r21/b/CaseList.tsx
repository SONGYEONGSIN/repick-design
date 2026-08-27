"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { CASES, formatInt, type RiskCase } from "./data";
import { BORDER, FOCUS, SEVERITY_DOT, STATUS_BADGE, STATUS_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, type CaseStatus, cx } from "./tokens";
import { Badge } from "./ui";

const TABS: { id: CaseStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "review", label: "Review" },
  { id: "escalated", label: "Escalated" },
  { id: "closed", label: "Closed" },
];

export default function CaseList({
  query,
  onQueryChange,
  statusFilter,
  onStatusChange,
  selectedId,
  onSelect,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  statusFilter: CaseStatus | "all";
  onStatusChange: (s: CaseStatus | "all") => void;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return CASES.filter((c: RiskCase) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (q === "") return true;
      return c.vendor.toLowerCase().includes(q) || c.key.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    });
  }, [statusFilter, q]);

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <div className={cx("flex h-9 items-center gap-2 rounded-lg border px-2.5", BORDER, "bg-white")}>
          <Search size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            placeholder="Filter cases…"
            aria-label="Filter case register by vendor, key, or category"
            className={cx("h-9 min-w-0 flex-1 bg-transparent text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
          {query ? (
            <button type="button" onClick={() => onQueryChange("")} className={cx("shrink-0 rounded p-0.5", FOCUS)}>
              <X size={13} aria-hidden="true" className={TEXT_AUX} />
              <span className="sr-only">Clear filter</span>
            </button>
          ) : null}
        </div>

        <div role="group" aria-label="Filter by status" className="mt-2 flex flex-wrap gap-1">
          {TABS.map((t) => {
            const active = t.id === statusFilter;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => onStatusChange(t.id)}
                className={cx(
                  "h-7 rounded-full border px-2.5 text-[11px] font-medium",
                  TRANSITION,
                  FOCUS,
                  active ? "border-rose-200 bg-rose-50 text-rose-700" : cx(BORDER, "bg-white", TEXT_MUTED, "hover:bg-zinc-50"),
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul className={cx("flex-1 overflow-y-auto border-t [scrollbar-width:thin]", BORDER)}>
        {filtered.length === 0 ? <li className={cx("px-4 py-8 text-center text-sm font-normal", TEXT_AUX)}>No cases match the filter.</li> : null}
        {filtered.map((c) => {
          const selected = c.id === selectedId;
          return (
            <li key={c.id} className={cx("border-b last:border-b-0", BORDER)}>
              <button
                type="button"
                onClick={() => onSelect(c.id)}
                aria-current={selected ? "true" : undefined}
                className={cx(
                  "flex w-full items-start gap-2.5 border-l-2 px-3.5 py-3 text-left",
                  TRANSITION,
                  FOCUS,
                  selected ? "border-l-rose-700 bg-rose-50/60" : cx("border-l-transparent hover:bg-zinc-50"),
                )}
              >
                <span aria-hidden="true" className={cx("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", SEVERITY_DOT[c.severity])} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{c.vendor}</span>
                    <span className={cx("shrink-0 font-mono text-[11px] font-normal", TEXT_AUX)}>{c.key}</span>
                  </span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <Badge className={STATUS_BADGE[c.status]}>{STATUS_LABEL[c.status]}</Badge>
                    <span className={cx("text-[11px] font-normal", TEXT_MUTED)}>{c.category}</span>
                  </span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <Image
                      src={`https://images.unsplash.com/photo-${c.owner.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                      alt=""
                      width={16}
                      height={16}
                      className="h-4 w-4 shrink-0 rounded-full bg-zinc-100 object-cover"
                    />
                    <span className={cx("text-[11px] font-normal", TEXT_AUX)}>{`${c.owner.name} · ${formatInt(c.ageDays)}d open · score ${c.score}`}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
