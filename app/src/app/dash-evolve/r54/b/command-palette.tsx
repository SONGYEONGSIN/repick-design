"use client";

import { ArrowRight, Rocket, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEPLOYMENTS, STAGES, type Deployment } from "./data";
import { BORDER, FOCUS_RING, FOCUS_WITHIN, PANEL_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

export default function CommandPalette({ onClose, onSelectDeployment }: { onClose: () => void; onSelectDeployment: (d: Deployment, trigger: HTMLElement) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  const matched = useMemo(() => {
    if (q === "") return DEPLOYMENTS.slice(0, 7);
    return DEPLOYMENTS.filter(
      (d) => d.modelName.toLowerCase().includes(q) || d.owner.name.toLowerCase().includes(q) || d.team.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q)),
    ).slice(0, 8);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl shadow-black/50", BORDER, PANEL_BG)}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER, FOCUS_WITHIN)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a deployment, model, owner or tag…"
            aria-label="Search deployments"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", "hover:bg-white/5", TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="px-2.5 py-1">
            <EyebrowLabel>{q === "" ? "Recent deployments" : `Matches for "${query}"`}</EyebrowLabel>
          </div>
          {matched.length === 0 ? (
            <p className={cx("px-2.5 py-3 text-sm", TEXT_CAPTION)}>No deployments match that search.</p>
          ) : (
            matched.map((d) => {
              const stageLabel = STAGES.find((s) => s.id === d.stage)?.label ?? d.stage;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={(e) => onSelectDeployment(d, e.currentTarget)}
                  className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, "hover:bg-white/5", TRANSITION, FOCUS_RING)}
                >
                  <Rocket size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                  <span className="min-w-0 flex-1 truncate">
                    {d.modelName} <span className={cx("text-xs", TEXT_CAPTION)}>&middot; {d.owner.name}</span>
                  </span>
                  <span className={cx("shrink-0 text-xs font-medium", "text-cyan-300")}>{stageLabel}</span>
                  <ArrowRight size={13} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
