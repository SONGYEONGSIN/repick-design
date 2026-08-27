"use client";

import { AlertOctagon, AlertTriangle, Circle, Info, Search, X, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import { COLUMNS, TICKETS, type ColumnId, formatHours } from "./data";
import { BORDER, FOCUS, HOVER_ROW, PRIORITY_BADGE, PRIORITY_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, type Priority, cx } from "./tokens";
import { Badge, Progress } from "./ui";

const PRIORITY_ICON: Record<Priority, LucideIcon> = { P1: AlertOctagon, P2: AlertTriangle, P3: Info, P4: Circle };
const ALL_PRIORITIES: Priority[] = ["P1", "P2", "P3", "P4"];

export default function TriageBoard({
  query,
  onQueryChange,
  activePriorities,
  onTogglePriority,
  highlightedId,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  activePriorities: Priority[];
  onTogglePriority: (p: Priority) => void;
  highlightedId: string | null;
}) {
  const q = query.trim().toLowerCase();

  const byColumn = useMemo(() => {
    const map = new Map<ColumnId, typeof TICKETS>();
    for (const col of COLUMNS) {
      if (col.id === "resolved") continue;
      map.set(
        col.id,
        TICKETS.filter((t) => {
          if (t.column !== col.id) return false;
          if (activePriorities.length > 0 && !activePriorities.includes(t.priority)) return false;
          if (q === "") return true;
          return t.title.toLowerCase().includes(q) || t.key.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q);
        }),
      );
    }
    return map;
  }, [q, activePriorities]);

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <div className={cx("flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border px-2.5 sm:max-w-xs", BORDER, "bg-white")}>
          <Search size={14} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            type="text"
            placeholder="Filter board…"
            aria-label="Filter triage board by title, key, or customer"
            className={cx("h-9 min-w-0 flex-1 bg-transparent text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
          {query ? (
            <button type="button" onClick={() => onQueryChange("")} className={cx("shrink-0 rounded p-0.5", FOCUS)}>
              <X size={13} aria-hidden="true" className={TEXT_AUX} />
              <span className="sr-only">Clear filter</span>
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by priority">
          {ALL_PRIORITIES.map((p) => {
            const active = activePriorities.includes(p);
            const Icon = PRIORITY_ICON[p];
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() => onTogglePriority(p)}
                className={cx(
                  "inline-flex h-8 items-center gap-1 rounded-full border px-2.5 text-[11px] font-medium",
                  TRANSITION,
                  FOCUS,
                  active ? PRIORITY_BADGE[p] : cx(BORDER, "bg-white", TEXT_MUTED, "hover:bg-zinc-50"),
                )}
              >
                <Icon size={11} aria-hidden="true" />
                {p}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {COLUMNS.filter((c) => c.id !== "resolved").map((col) => {
          const items = byColumn.get(col.id) ?? [];
          return (
            <div key={col.id} className={cx("flex flex-col rounded-2xl border bg-white", BORDER)}>
              <div className={cx("flex items-center justify-between border-b px-3 py-2.5", BORDER)}>
                <h3 className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{col.label}</h3>
                <span className={cx("rounded-full px-1.5 py-0.5 text-[11px] font-medium", TEXT_MUTED, "bg-zinc-50")}>{items.length}</span>
              </div>
              <ul className="flex min-h-[120px] flex-col gap-2 overflow-y-auto p-2 [scrollbar-width:thin] lg:max-h-[520px]">
                {items.length === 0 ? <li className={cx("px-2 py-4 text-center text-xs font-normal", TEXT_AUX)}>No tickets match the filter.</li> : null}
                {items.map((t) => {
                  const Icon = PRIORITY_ICON[t.priority];
                  const burn = Math.min(100, (t.ageHours / t.slaHours) * 100);
                  const highlighted = t.id === highlightedId;
                  return (
                    <li
                      key={t.id}
                      tabIndex={0}
                      className={cx(
                        "rounded-xl border p-2.5 text-left",
                        TRANSITION,
                        FOCUS,
                        highlighted ? "border-cyan-300 bg-cyan-50" : cx(BORDER, HOVER_ROW),
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge Icon={Icon} className={PRIORITY_BADGE[t.priority]}>
                          {PRIORITY_LABEL[t.priority]}
                        </Badge>
                        <span className={cx("font-mono text-[11px] font-normal", TEXT_AUX)}>{t.key}</span>
                      </div>
                      <p className={cx("mt-1.5 text-[13px] font-medium leading-snug", TEXT_PRIMARY)}>{t.title}</p>
                      <p className={cx("mt-1 text-[11px] font-normal", TEXT_AUX)}>{t.customer}</p>
                      <div className="mt-2">
                        <Progress value={burn} label={`SLA budget consumed for ${t.key}`} />
                        <p className={cx("mt-1 text-[11px] font-normal tabular-nums", TEXT_AUX)}>{`${formatHours(t.ageHours)} old · ${formatHours(t.slaHours)} SLA`}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        <Image
                          src={`https://images.unsplash.com/photo-${t.assignee.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                          alt=""
                          width={18}
                          height={18}
                          className="h-[18px] w-[18px] shrink-0 rounded-full bg-zinc-100 object-cover"
                        />
                        <span className={cx("truncate text-[11px] font-normal", TEXT_MUTED)}>{t.assignee.name}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
