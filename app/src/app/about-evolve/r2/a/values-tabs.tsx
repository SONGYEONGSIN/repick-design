"use client";

import { useState } from "react";
import { FOCUS_RING, VALUE_TABS } from "./data";

/**
 * Second wired interaction: a real ARIA tablist (role="tablist"/"tab"/"tabpanel", roving
 * tabindex, arrow-key navigation) switching between four value statements. Exactly one panel is
 * ever rendered, and it always shows real body copy — never an empty state — because the tablist
 * itself defaults to the first tab selected.
 */
export default function ValuesTabs() {
  const [activeId, setActiveId] = useState(VALUE_TABS[0].id);
  const activeIndex = VALUE_TABS.findIndex((t) => t.id === activeId);
  const active = VALUE_TABS[activeIndex];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + dir + VALUE_TABS.length) % VALUE_TABS.length;
    setActiveId(VALUE_TABS[next].id);
    document.getElementById(`value-tab-${VALUE_TABS[next].id}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Company values" onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
        {VALUE_TABS.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              id={`value-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls="value-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={`rounded-full border px-4 py-2 text-sm ${FOCUS_RING} ${
                isActive
                  ? "border-rose-400 bg-rose-400/10 font-semibold text-rose-300"
                  : "border-zinc-800 font-normal text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id="value-panel"
        role="tabpanel"
        aria-labelledby={`value-tab-${active.id}`}
        tabIndex={0}
        className={`mt-6 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 ${FOCUS_RING}`}
      >
        <h3 className="text-xl font-semibold text-zinc-50">{active.title}</h3>
        <p className="mt-3 text-base font-normal leading-relaxed text-zinc-400">{active.body}</p>
      </div>
    </div>
  );
}
