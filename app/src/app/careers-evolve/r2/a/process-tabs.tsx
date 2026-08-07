"use client";

import { useState } from "react";
import { FOCUS_RING, PROCESS_TABS } from "./data";

/**
 * Third wired interaction: a real ARIA tablist (role="tablist"/"tab"/"tabpanel", roving tabindex,
 * arrow-key navigation) switching between the four hiring-process stages. One panel is always
 * rendered with real body copy, defaulting to stage one.
 */
export default function ProcessTabs() {
  const [activeId, setActiveId] = useState(PROCESS_TABS[0].id);
  const activeIndex = PROCESS_TABS.findIndex((t) => t.id === activeId);
  const active = PROCESS_TABS[activeIndex];

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (activeIndex + dir + PROCESS_TABS.length) % PROCESS_TABS.length;
    setActiveId(PROCESS_TABS[next].id);
    document.getElementById(`process-tab-${PROCESS_TABS[next].id}`)?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Hiring process stages" onKeyDown={onKeyDown} className="flex flex-wrap gap-2">
        {PROCESS_TABS.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              id={`process-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls="process-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={`rounded-full border px-4 py-2 text-sm ${FOCUS_RING} ${
                isActive
                  ? "border-orange-700 bg-orange-700/10 font-semibold text-orange-800"
                  : "border-zinc-300 font-normal text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id="process-panel"
        role="tabpanel"
        aria-labelledby={`process-tab-${active.id}`}
        tabIndex={0}
        className={`mt-6 max-w-2xl rounded-2xl border border-zinc-200 bg-zinc-50 p-6 ${FOCUS_RING}`}
      >
        <h3 className="text-xl font-semibold text-zinc-900">{active.title}</h3>
        <p className="mt-3 text-base font-normal leading-relaxed text-zinc-700">{active.body}</p>
      </div>
    </div>
  );
}
