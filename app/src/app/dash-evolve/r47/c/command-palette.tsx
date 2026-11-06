"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Download, ListChecks, RefreshCw, Search, X } from "lucide-react";
import { ACCOUNTS } from "./data";
import { FOCUS_RING } from "./ui";

interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  onRun: () => void;
}

export function CommandPalette({
  open,
  onToggle,
  onClose,
  onSelectAccount,
  onExportCsv,
  onJumpToTasks,
  onCycleMetric,
}: {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelectAccount: (id: string) => void;
  onExportCsv: () => void;
  onJumpToTasks: () => void;
  onCycleMetric: () => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Global ⌘K / Ctrl+K toggle — attached once, independent of open state.
  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onToggle();
      }
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToggle, onClose]);

  // Reset query/highlight when the palette opens -- a render-time state adjustment (the
  // documented React pattern for "derive state from a prop change") rather than inside an
  // effect, which would otherwise trigger a synchronous cascading re-render
  // (react-hooks/set-state-in-effect).
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery("");
      setHighlight(0);
    }
  }

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const accountItems: PaletteItem[] = useMemo(
    () =>
      ACCOUNTS.filter((a) => a.name.toLowerCase().includes(query.toLowerCase())).map((a) => ({
        id: `account-${a.id}`,
        label: a.name,
        hint: a.segment,
        onRun: () => onSelectAccount(a.id),
      })),
    [query, onSelectAccount],
  );

  const actionItems: PaletteItem[] = useMemo(
    () => [
      { id: "action-export", label: "Export current ranking as CSV", hint: "Action", onRun: onExportCsv },
      { id: "action-tasks", label: "Jump to renewal tasks", hint: "Action", onRun: onJumpToTasks },
      { id: "action-metric", label: "Cycle ranking metric", hint: "Action", onRun: onCycleMetric },
    ],
    [onExportCsv, onJumpToTasks, onCycleMetric],
  );

  const items = useMemo(() => {
    const filteredActions = query
      ? actionItems.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
      : actionItems;
    return [...accountItems, ...filteredActions];
  }, [accountItems, actionItems, query]);

  function run(item: PaletteItem) {
    item.onRun();
    onClose();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((h) => (items.length ? (h + 1) % items.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((h) => (items.length ? (h - 1 + items.length) % items.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = items[highlight];
      if (item) run(item);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-900/30 px-4 pt-24">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm animate-[rise_0.2s_ease-out] motion-reduce:animate-none"
      >
        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setHighlight(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search accounts or run a command…"
            aria-label="Search accounts or run a command"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={items[highlight] ? `palette-option-${items[highlight].id}` : undefined}
            className={`h-11 min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING} rounded-md`}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition-colors duration-150 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <ul id="palette-listbox" role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto py-1">
          {items.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-zinc-500">No matches found.</li>
          )}
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                id={`palette-option-${item.id}`}
                type="button"
                role="option"
                aria-selected={index === highlight}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => run(item)}
                className={`flex w-full min-w-0 items-center justify-between gap-3 px-4 py-2 text-left text-sm transition-colors duration-150 ${FOCUS_RING} ${
                  index === highlight ? "bg-blue-50 text-blue-700" : "text-zinc-700"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {item.id.startsWith("action-") ? (
                    item.id === "action-export" ? (
                      <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : item.id === "action-tasks" ? (
                      <ListChecks className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <RefreshCw className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )
                  ) : null}
                  <span className="min-w-0 truncate">{item.label}</span>
                </span>
                <span className="shrink-0 text-xs text-zinc-600">{item.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
