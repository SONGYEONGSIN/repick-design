"use client";

import { Gauge, ListTree, Map, MapPin, Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CORRIDOR_LABEL, HUBS, onTimeForPeriod, statusForOnTime } from "./data";
import type { PeriodId } from "./types";
import { BORDER, FOCUS_VISIBLE, FOCUS_WITHIN, HOVER_ACTIVE_BG, NUM, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";
import { EyebrowLabel } from "./ui";

type SectionLink = { id: string; label: string; description: string; targetId: string; Icon: LucideIcon };

const SECTION_LINKS: SectionLink[] = [
  { id: "map", label: "Network map", description: "Schematic hub-and-lane view", targetId: "network-map", Icon: Map },
  { id: "trend", label: "On-time trend", description: "Network trend with hub overlay", targetId: "trend-panel", Icon: Gauge },
  { id: "routes", label: "Routes & hubs", description: "Sortable, filterable hub table", targetId: "routes-table", Icon: ListTree },
];

export default function CommandPalette({
  period,
  onClose,
  onSelectHub,
}: {
  period: PeriodId;
  onClose: () => void;
  onSelectHub: (hubId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const q = query.trim().toLowerCase();

  const hubResults = useMemo(
    () =>
      q === ""
        ? []
        : HUBS.filter((h) => h.name.toLowerCase().includes(q) || h.code.toLowerCase().includes(q) || CORRIDOR_LABEL[h.corridor].toLowerCase().includes(q)),
    [q],
  );
  const sectionResults = useMemo(() => (q === "" ? SECTION_LINKS : SECTION_LINKS.filter((s) => s.label.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))), [q]);

  type Row = { kind: "section"; item: SectionLink } | { kind: "hub"; item: (typeof HUBS)[number] };
  const rows: Row[] = [...sectionResults.map((item) => ({ kind: "section" as const, item })), ...hubResults.map((item) => ({ kind: "hub" as const, item }))];

  function activate(row: Row) {
    if (row.kind === "hub") {
      onSelectHub(row.item.id);
      onClose();
      requestAnimationFrame(() => document.getElementById("network-map")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      return;
    }
    onClose();
    requestAnimationFrame(() => document.getElementById(row.item.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && rows[activeIndex]) {
      activate(rows[activeIndex]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-24" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className={cx("w-full max-w-lg overflow-hidden rounded-2xl border shadow-lg", BORDER, "bg-zinc-900")}
      >
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER, FOCUS_WITHIN)}>
          <Search size={16} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            type="text"
            placeholder="Jump to a hub, corridor, or section…"
            aria-label="Search this console"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none", TEXT_PRIMARY, "placeholder:text-zinc-400")}
          />
          <button type="button" onClick={onClose} aria-label="Close command palette" className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 [scrollbar-width:thin]">
          {sectionResults.length > 0 ? (
            <>
              <div className="px-2.5 py-1">
                <EyebrowLabel>Sections</EyebrowLabel>
              </div>
              {sectionResults.map((link) => {
                const i = rows.findIndex((r) => r.kind === "section" && r.item.id === link.id);
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => activate({ kind: "section", item: link })}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, TRANSITION, FOCUS_VISIBLE, i === activeIndex ? "bg-white/[0.06]" : HOVER_ACTIVE_BG)}
                  >
                    <link.Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{link.label}</span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{link.description}</span>
                    </span>
                  </button>
                );
              })}
            </>
          ) : null}

          {hubResults.length > 0 ? (
            <>
              <div className="px-2.5 pt-2.5">
                <EyebrowLabel>Hubs</EyebrowLabel>
              </div>
              {hubResults.map((hub) => {
                const i = rows.findIndex((r) => r.kind === "hub" && r.item.id === hub.id);
                const onTime = onTimeForPeriod(hub, period);
                const status = statusForOnTime(onTime);
                const tone = TONE[STATUS_TONE[status]];
                return (
                  <button
                    key={hub.id}
                    type="button"
                    onClick={() => activate({ kind: "hub", item: hub })}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, TRANSITION, FOCUS_VISIBLE, i === activeIndex ? "bg-white/[0.06]" : HOVER_ACTIVE_BG)}
                  >
                    <MapPin size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">
                        {hub.name} <span className={TEXT_CAPTION}>· {hub.code}</span>
                      </span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{CORRIDOR_LABEL[hub.corridor]}</span>
                    </span>
                    <span className={cx("shrink-0 text-xs font-medium", NUM, tone.text)}>{onTime.toFixed(1)}%</span>
                  </button>
                );
              })}
            </>
          ) : null}

          {rows.length === 0 ? <p className={cx("px-2.5 py-2 text-sm", TEXT_CAPTION)}>No matches for “{query}”.</p> : null}
        </div>
      </div>
    </div>
  );
}
