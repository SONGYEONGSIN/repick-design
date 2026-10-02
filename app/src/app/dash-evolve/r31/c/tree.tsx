"use client";

import { ChevronRight, Pin } from "lucide-react";
import { TREE, categoryCount, grandTotal, subcategoryCount, type Leaf } from "./data";
import { cx } from "./ui";

interface Props {
  expanded: Set<string>;
  onToggle: (id: string) => void;
  pinnedLeafId: string;
  hoveredLeafId: string | null;
  query: string;
  onPin: (leaf: Leaf) => void;
  onHoverChange: (id: string | null) => void;
}

function matches(name: string, query: string) {
  return query.length > 0 && name.toLowerCase().includes(query.toLowerCase());
}

export default function Tree({ expanded, onToggle, pinnedLeafId, hoveredLeafId, query, onPin, onHoverChange }: Props) {
  const total = grandTotal() || 1;

  return (
    <div className="flex flex-col">
      {TREE.map((cat) => {
        const catOpen = expanded.has(cat.id);
        const catCount = categoryCount(cat);
        const catPct = Math.round((catCount / total) * 100);
        const catHit = matches(cat.name, query);
        return (
          <div key={cat.id} className="border-b border-zinc-100 last:border-0">
            <button
              type="button"
              onClick={() => onToggle(cat.id)}
              aria-expanded={catOpen}
              className={cx(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
                catHit ? "bg-cyan-50" : "hover:bg-zinc-50"
              )}
            >
              <ChevronRight aria-hidden className={cx("h-4 w-4 shrink-0 text-zinc-400 transition-transform", catOpen && "rotate-90")} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-zinc-900">{cat.name}</span>
              <span className="shrink-0 text-[11px] tabular-nums text-zinc-600">{catPct}%</span>
              <span className="w-10 shrink-0 text-right text-[13px] font-semibold tabular-nums text-zinc-900">{catCount}</span>
            </button>

            {catOpen && (
              <div className="pl-5">
                {cat.subcategories.map((sub) => {
                  const subOpen = expanded.has(sub.id);
                  const subCount = subcategoryCount(sub);
                  const subPct = Math.round((subCount / total) * 100);
                  const subHit = matches(sub.name, query);
                  return (
                    <div key={sub.id} className="border-l border-zinc-100 pl-3">
                      <button
                        type="button"
                        onClick={() => onToggle(sub.id)}
                        aria-expanded={subOpen}
                        className={cx(
                          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
                          subHit ? "bg-cyan-50" : "hover:bg-zinc-50"
                        )}
                      >
                        <ChevronRight aria-hidden className={cx("h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform", subOpen && "rotate-90")} />
                        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-zinc-700">{sub.name}</span>
                        <span className="shrink-0 text-[11px] tabular-nums text-zinc-600">{subPct}%</span>
                        <span className="w-10 shrink-0 text-right text-[12.5px] font-medium tabular-nums text-zinc-700">{subCount}</span>
                      </button>

                      {subOpen && (
                        <ul className="border-l border-zinc-100 pl-3">
                          {sub.leaves.map((leaf) => {
                            const leafPct = Math.round((leaf.count / total) * 100);
                            const isPinned = leaf.id === pinnedLeafId;
                            const leafHit = matches(leaf.name, query);
                            return (
                              <li key={leaf.id}>
                                <div
                                  tabIndex={0}
                                  role="button"
                                  aria-pressed={isPinned}
                                  onClick={() => onPin(leaf)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      onPin(leaf);
                                    }
                                  }}
                                  onMouseEnter={() => onHoverChange(leaf.id)}
                                  onMouseLeave={() => onHoverChange(null)}
                                  onFocus={() => onHoverChange(leaf.id)}
                                  onBlur={() => onHoverChange(null)}
                                  className={cx(
                                    "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
                                    isPinned ? "bg-cyan-100" : leafHit ? "bg-cyan-50" : hoveredLeafId === leaf.id ? "bg-zinc-50" : ""
                                  )}
                                >
                                  <Pin aria-hidden className={cx("h-3.5 w-3.5 shrink-0", isPinned ? "fill-cyan-600 text-cyan-600" : "text-zinc-300")} />
                                  <span className={cx("min-w-0 flex-1 truncate text-[12px]", isPinned ? "font-semibold text-cyan-900" : "text-zinc-600")}>{leaf.name}</span>
                                  <span className="shrink-0 text-[11px] tabular-nums text-zinc-600">{leafPct}%</span>
                                  <span className={cx("w-10 shrink-0 text-right text-[12px] font-semibold tabular-nums", isPinned ? "text-cyan-900" : "text-zinc-900")}>{leaf.count}</span>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
