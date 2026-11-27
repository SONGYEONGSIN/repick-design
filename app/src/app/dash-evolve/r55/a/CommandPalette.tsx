"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { Search, X, CornerDownLeft, Calendar, DoorOpen, Truck } from "lucide-react";
import { DOORS, getCarriers, type Period } from "./data";
import { FOCUS_RING } from "./ui";

interface Command {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  period,
  onSwitchPeriod,
  onPinDoor,
  onFocusCarrier,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  period: Period;
  onSwitchPeriod: (period: Period) => void;
  onPinDoor: (doorId: string) => void;
  onFocusCarrier: (carrier: string | null) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Reset query + selection on a closed -> open transition, and reset selection whenever the query
  // changes — both applied during render (React's documented pattern for resetting state on a
  // prop/derived change) rather than inside an effect body.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  const carriers = useMemo(() => getCarriers(period), [period]);

  const commands: Command[] = useMemo(
    () => [
      { id: "period-today", group: "Switch day", label: "Today", hint: "Timeline + stats", run: () => onSwitchPeriod("today") },
      { id: "period-tomorrow", group: "Switch day", label: "Tomorrow", hint: "Timeline + stats", run: () => onSwitchPeriod("tomorrow") },
      ...DOORS.map((door) => ({
        id: `door-${door.id}`,
        group: "Pin dock door",
        label: door.code,
        hint: door.zone === "inbound" ? "Inbound receiving" : "Outbound shipping",
        run: () => onPinDoor(door.id),
      })),
      ...carriers.map((carrier) => ({
        id: `carrier-${carrier}`,
        group: "Focus carrier",
        label: carrier,
        hint: "Highlight on timeline",
        run: () => onFocusCarrier(carrier),
      })),
      { id: "carrier-clear", group: "Focus carrier", label: "Clear carrier focus", run: () => onFocusCarrier(null) },
    ],
    [onSwitchPeriod, onPinDoor, onFocusCarrier, carriers],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [commands, query]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const activeId = filtered.length ? `${listboxId}-option-${activeIndex}` : undefined;

  function runActive() {
    const cmd = filtered[activeIndex];
    if (!cmd) return;
    cmd.run();
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runActive();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  }

  let groupCursor = "";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-zinc-950/60" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full min-w-0 max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl"
      >
        <div className="flex h-11 min-w-0 items-center gap-2 border-b border-white/10 px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls={listboxId}
            aria-activedescendant={activeId}
            placeholder="Switch day, pin a door, or focus a carrier…"
            className={`h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
          <button
            type="button"
            aria-label="Close command palette"
            onClick={onClose}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <ul id={listboxId} role="listbox" aria-label="Commands" className="max-h-80 min-w-0 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-zinc-400">No matches.</li>
          ) : (
            filtered.map((cmd, index) => {
              const showGroupHeader = cmd.group !== groupCursor;
              groupCursor = cmd.group;
              const isActive = index === activeIndex;
              const Icon = cmd.group === "Switch day" ? Calendar : cmd.group === "Pin dock door" ? DoorOpen : Truck;
              return (
                <li key={cmd.id} className="min-w-0">
                  {showGroupHeader ? (
                    <div className="px-2.5 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                      {cmd.group}
                    </div>
                  ) : null}
                  <div
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      cmd.run();
                      onClose();
                    }}
                    className={`flex h-9 min-w-0 cursor-pointer items-center gap-2 rounded-md px-2.5 text-sm ${
                      isActive ? "bg-emerald-400/10 text-emerald-300" : "text-zinc-300"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                    {cmd.hint ? <span className="shrink-0 truncate text-xs text-zinc-400">{cmd.hint}</span> : null}
                    {isActive ? <CornerDownLeft className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" /> : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
