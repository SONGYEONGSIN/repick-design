"use client";

import { Gauge, ListChecks, Search, TableProperties, TrendingUp, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BORDER, FOCUS, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

type QuickLink = { id: string; label: string; description: string; targetId: string; Icon: LucideIcon };

const QUICK_LINKS: QuickLink[] = [
  { id: "kpi", label: "KPI overview", description: "Performance-vs-target bullet grid", targetId: "kpi-panel", Icon: Gauge },
  { id: "feed", label: "Activity feed", description: "Live moderation action stream", targetId: "activity-feed", Icon: ListChecks },
  { id: "trend", label: "Queue depth trend", description: "12-hour backlog sparkline", targetId: "queue-trend", Icon: TrendingUp },
  { id: "capacity", label: "Reviewer capacity", description: "Active reviewers by queue", targetId: "reviewer-capacity", Icon: TableProperties },
];

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => (q === "" ? QUICK_LINKS : QUICK_LINKS.filter((l) => l.label.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))), [q]);

  function go(link: QuickLink) {
    onClose();
    // Deferred so the dialog unmounts before the browser computes scroll position.
    requestAnimationFrame(() => {
      document.getElementById(link.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && matches[activeIndex]) {
      go(matches[activeIndex]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            type="text"
            placeholder="Jump to a section…"
            aria-label="Search this console"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-500")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 [scrollbar-width:thin]">
          <div className="px-2.5 py-1">
            <EyebrowLabel>Sections</EyebrowLabel>
          </div>
          {matches.length === 0 ? (
            <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matching sections.</p>
          ) : (
            matches.map((link, i) => (
              <button
                key={link.id}
                type="button"
                onClick={() => go(link)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, TRANSITION, FOCUS, i === activeIndex ? "bg-white/[0.06]" : HOVER_ACTIVE_BG)}
              >
                <link.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{link.label}</span>
                  <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{link.description}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
