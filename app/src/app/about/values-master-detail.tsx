"use client";

import { useState } from "react";
import { FOCUS_RING, VALUES } from "./data";

/**
 * Third wired interaction: master-detail, not tabs. The left column is a plain vertical list of
 * real <button> elements (no role="tab"/"tablist") — selecting one swaps the single detail panel
 * on the right. Deliberately not an accordion (only one thing is ever expanded, and the list
 * itself never grows/shrinks) and not a carousel (no auto-advance, no next/prev arrows — direct
 * selection only). Arrow-key roving is added as an enhancement on top of native list Tab order,
 * not a replacement for it, so Tab/Shift+Tab still reaches every item.
 */
export default function ValuesMasterDetail() {
  const [activeId, setActiveId] = useState(VALUES[0].id);
  const activeIndex = VALUES.findIndex((v) => v.id === activeId);
  const active = VALUES[activeIndex];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" ? 1 : -1;
    const next = (activeIndex + dir + VALUES.length) % VALUES.length;
    setActiveId(VALUES[next].id);
    document.getElementById(`value-item-${VALUES[next].id}`)?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-10">
      <ul onKeyDown={onKeyDown} className="divide-y divide-zinc-800 border-y border-zinc-800 lg:border lg:rounded-xl">
        {VALUES.map((v) => {
          const isActive = v.id === activeId;
          return (
            <li key={v.id}>
              <button
                id={`value-item-${v.id}`}
                type="button"
                aria-current={isActive}
                aria-controls="value-detail-panel"
                onClick={() => setActiveId(v.id)}
                className={`flex w-full items-center gap-4 px-4 py-4 text-left ${FOCUS_RING} ${
                  isActive ? "bg-blue-400/10" : "hover:bg-zinc-900/60"
                }`}
              >
                <span
                  className={`text-sm font-semibold tabular-nums ${isActive ? "text-blue-400" : "text-zinc-400"}`}
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  {v.ordinal}
                </span>
                <span
                  className={`border-l pl-4 text-sm font-normal leading-snug ${
                    isActive ? "border-blue-400 text-zinc-50" : "border-transparent text-zinc-400"
                  }`}
                >
                  {v.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        id="value-detail-panel"
        role="region"
        aria-labelledby={`value-item-${active.id}`}
        className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"
      >
        <span
          className="text-sm font-semibold tabular-nums text-blue-400"
          style={{ fontFamily: "var(--font-display-wide)" }}
        >
          {active.ordinal}
        </span>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-zinc-50 sm:text-2xl">{active.title}</h3>
        <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">{active.body}</p>
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3">
          <span className="block text-sm font-semibold text-zinc-50">In practice</span>
          <p className="mt-1.5 max-w-2xl text-sm font-normal leading-relaxed text-zinc-400">{active.practice}</p>
        </div>
      </div>
    </div>
  );
}
