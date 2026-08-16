"use client";

import { Search, Server, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NODES, TIER_LABEL, type NodeId } from "./data";
import { formatMs } from "./format";
import { BORDER, FOCUS_RING, FOCUS_WITHIN, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel, HealthBadge } from "./ui";

export default function CommandPalette({ onClose, onSelectNode }: { onClose: () => void; onSelectNode: (id: NodeId) => void }) {
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

  const matched = useMemo(
    () => (q === "" ? NODES : NODES.filter((n) => n.label.toLowerCase().includes(q) || n.owner.toLowerCase().includes(q) || TIER_LABEL[n.tier].toLowerCase().includes(q))),
    [q],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER, FOCUS_WITHIN)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Jump to a service, owner, or tier…"
            aria-label="Search services, owners, or tiers"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="mb-1 px-2.5 py-1">
            <EyebrowLabel>Services{q !== "" ? ` — ${matched.length} match${matched.length === 1 ? "" : "es"}` : ""}</EyebrowLabel>
          </div>
          {matched.length === 0 ? (
            <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching services.</p>
          ) : (
            matched.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => onSelectNode(n.id)}
                className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
              >
                <Server size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                <span className="min-w-0 flex-1 truncate">
                  {n.label} <span className={TEXT_CAPTION}>&middot; {TIER_LABEL[n.tier]}</span>
                </span>
                <span className={cx("shrink-0 text-xs tabular-nums", TEXT_CAPTION)}>{formatMs(n.p99Ms)}</span>
                <HealthBadge health={n.health} className="shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
