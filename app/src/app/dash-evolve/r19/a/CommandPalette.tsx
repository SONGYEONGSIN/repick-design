"use client";

import { ArrowRight, Building2, CalendarRange, ListFilter, Search, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PALETTE_COMMANDS, type PaletteCommand } from "./data";
import { BORDER, FOCUS, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow } from "./ui";

const KIND_ICON: Record<PaletteCommand["kind"], LucideIcon> = {
  view: CalendarRange,
  resource: Building2,
  filter: ListFilter,
  jump: ArrowRight,
};

const KIND_LABEL: Record<PaletteCommand["kind"], string> = {
  view: "View",
  resource: "Resources",
  filter: "Status filter",
  jump: "Jump to",
};

const KIND_ORDER: PaletteCommand["kind"][] = ["jump", "view", "resource", "filter"];

export default function CommandPalette({ onClose, onRun }: { onClose: () => void; onRun: (command: PaletteCommand) => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
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
  const matches = useMemo(() => PALETTE_COMMANDS.filter((c) => q === "" || c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)), [q]);

  const groups = useMemo(
    () => KIND_ORDER.map((kind) => ({ kind, items: matches.filter((c) => c.kind === kind) })).filter((g) => g.items.length > 0),
    [matches],
  );

  // Flattened in the SAME order the groups render in (jump, view, resource, filter) — not the
  // order `matches` holds them in — so the `activeIndex` a keyboard user moves through and the
  // index a click reports always point at the same command.
  const flatMatches = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // Command id → its position in `flatMatches`, computed once per list instead of by mutating a
  // counter while rendering (that mutation is a render-purity violation the lint gate flags).
  const indexById = useMemo(() => {
    const map = new Map<string, number>();
    flatMatches.forEach((c, i) => map.set(c.id, i));
    return map;
  }, [flatMatches]);

  function runByIndex(index: number) {
    const item = flatMatches[index];
    if (item) {
      onRun(item);
      onClose();
    }
  }

  function onInputKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(flatMatches.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runByIndex(activeIndex);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/40 px-4 pt-20 sm:pt-24" role="presentation" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()} className={cx("w-full max-w-xl rounded-2xl border bg-white shadow-2xl shadow-zinc-900/20", BORDER)}>
        <div className={cx("flex items-center gap-2.5 border-b px-3 py-2", BORDER)}>
          <Search size={16} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={flatMatches[activeIndex] ? `cmd-${flatMatches[activeIndex].id}` : undefined}
            placeholder="Search views, resources or a status filter…"
            aria-label="Search views, resources or a status filter"
            className={cx("h-9 min-w-0 flex-1 rounded-md bg-transparent px-1 text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-500", FOCUS)}
          />
          <button type="button" onClick={onClose} className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-medium", "hover:bg-zinc-100", TRANSITION, FOCUS)}>
            <X size={15} aria-hidden="true" className={TEXT_CAPTION} />
            <span className="sr-only">Close command palette</span>
          </button>
        </div>

        <div id="palette-listbox" role="listbox" aria-label="Commands" className="max-h-[60vh] overflow-y-auto p-2 [scrollbar-width:thin]">
          {flatMatches.length === 0 ? <p className={cx("px-2.5 py-6 text-center text-sm", TEXT_CAPTION)}>No matching commands.</p> : null}

          {groups.map((group) => (
            <div key={group.kind} className="mb-1 last:mb-0">
              <div className="px-2.5 py-1">
                <Eyebrow>{KIND_LABEL[group.kind]}</Eyebrow>
              </div>
              {group.items.map((item) => {
                const index = indexById.get(item.id) ?? 0;
                const active = index === activeIndex;
                const Icon = KIND_ICON[item.kind];
                return (
                  <button
                    key={item.id}
                    id={`cmd-${item.id}`}
                    role="option"
                    aria-selected={active}
                    type="button"
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runByIndex(index)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-normal", TEXT_PRIMARY, TRANSITION, FOCUS, active ? "bg-sky-50" : "hover:bg-zinc-50")}
                  >
                    <Icon size={15} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                      <span className={cx("ml-2 text-[11px]", TEXT_CAPTION_MUTED)}>{item.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
