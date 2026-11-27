"use client";

import Image from "next/image";
import { BOARD_COLUMNS, CATEGORIES, FINDINGS, type Finding } from "../lib/data";
import { FOCUS_RING, SeverityBadge } from "./ui";

const categoryName = (id: Finding["category"]) => CATEGORIES.find((c) => c.id === id)?.name ?? id;

export function KanbanBoard({
  selectedFindingId,
  onSelectFinding,
}: {
  selectedFindingId: string;
  onSelectFinding: (id: string) => void;
}) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {BOARD_COLUMNS.map((col) => {
        const items = FINDINGS.filter((f) => f.column === col.id);
        return (
          <div key={col.id} className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-zinc-900">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <h3 className="truncate text-xs font-semibold uppercase tracking-wide text-zinc-50">{col.name}</h3>
                <p className="mt-0.5 truncate text-[11px] text-zinc-400">{col.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-medium tabular-nums text-zinc-400">
                {items.length}
              </span>
            </div>

            <ul className="flex flex-1 flex-col gap-2 p-3">
              {items.map((f) => {
                const isSelected = f.id === selectedFindingId;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => onSelectFinding(f.id)}
                      aria-pressed={isSelected}
                      aria-label={`${f.id}, ${f.title}, ${f.severity} severity. Select to pin to the finding detail panel.`}
                      className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                        isSelected
                          ? "border-emerald-400/50 bg-emerald-400/10"
                          : "border-white/10 bg-zinc-950/60 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-medium tabular-nums text-zinc-400">{f.id}</span>
                        <SeverityBadge severity={f.severity} />
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-zinc-50">{f.title}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] text-zinc-400">{categoryName(f.category)}</span>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <Image
                            src={`https://images.unsplash.com/photo-${f.owner.photoId}?q=80&w=48&h=48&fit=crop&crop=faces`}
                            alt={f.owner.name}
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px] rounded-full object-cover"
                          />
                          <span className="text-[11px] tabular-nums text-zinc-400">{f.due}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
