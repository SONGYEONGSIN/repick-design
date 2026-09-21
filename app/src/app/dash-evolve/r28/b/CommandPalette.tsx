"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Command, TrendingUp, Users, Pin, PinOff, type LucideIcon } from "lucide-react";
import { CATEGORY_META, type CategoryId } from "./data";
import { cn, FOCUS_RING } from "./ui";

interface Action {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  onPin,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  onPin: (categoryId: CategoryId | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<Action[]>(() => {
    const navActions: Action[] = [
      {
        id: "nav-bridge",
        label: "Go to revenue bridge",
        hint: "Section",
        icon: TrendingUp,
        run: () => onNavigate("revenue-bridge"),
      },
      {
        id: "nav-accounts",
        label: "Go to account activity",
        hint: "Section",
        icon: Users,
        run: () => onNavigate("account-activity"),
      },
    ];
    const pinActions: Action[] = (Object.keys(CATEGORY_META) as CategoryId[]).map((id) => ({
      id: `pin-${id}`,
      label: `Pin bridge step — ${CATEGORY_META[id].label}`,
      hint: "Focuses accounts + spotlight",
      icon: Pin,
      run: () => onPin(id),
    }));
    return [
      ...navActions,
      ...pinActions,
      {
        id: "clear-pin",
        label: "Clear pinned bridge step",
        hint: "Reset",
        icon: PinOff,
        run: () => onPin(null),
      },
    ];
  }, [onNavigate, onPin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const t = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  function runAction(action: Action | undefined) {
    if (!action) return;
    action.run();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="fixed inset-0 bg-zinc-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-zinc-100 px-4">
          <Command className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                runAction(filtered[activeIndex]);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Type a command or search…"
            aria-label="Command palette search"
            aria-activedescendant={filtered[activeIndex]?.id}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-list"
            className="h-12 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-300 px-1.5 py-0.5 font-sans text-[11px] font-medium text-zinc-500 sm:inline">
            Esc
          </kbd>
        </div>
        <ul id="command-palette-list" role="listbox" className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-zinc-500">No matching commands.</li>
          )}
          {filtered.map((action, index) => {
            const ActionIcon = action.icon;
            const active = index === activeIndex;
            return (
              <li key={action.id} id={action.id} role="option" aria-selected={active}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => runAction(action)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                    FOCUS_RING,
                    active ? "bg-cyan-50 text-cyan-900" : "text-zinc-700",
                  )}
                >
                  <ActionIcon
                    className={cn("h-4 w-4 shrink-0", active ? "text-cyan-600" : "text-zinc-400")}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate">{action.label}</span>
                  <span className="shrink-0 text-xs text-zinc-500">{action.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
