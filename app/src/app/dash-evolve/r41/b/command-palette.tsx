"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  AlertTriangle,
  FileBarChart2,
  LayoutGrid,
  PieChart,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { FOCUS_RING } from "./ui";

interface CommandItem {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
}

const COMMANDS: CommandItem[] = [
  { id: "overview", label: "Go to Overview", hint: "Workspace summary", icon: LayoutGrid },
  { id: "cost-explorer", label: "Go to Cost Explorer", hint: "Allocation by category", icon: PieChart },
  { id: "budgets", label: "Go to Budgets", hint: "Allocated vs spent", icon: Wallet },
  { id: "anomalies", label: "Go to Anomalies", hint: "Unexpected spend spikes", icon: AlertTriangle },
  { id: "reports", label: "Go to Reports", hint: "Exportable cost reports", icon: FileBarChart2 },
  { id: "new-budget", label: "Create budget", hint: "Set a new category budget", icon: Plus },
];

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q),
    );
  }, [query]);

  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  if (activeIndex >= results.length) {
    const clamped = results.length > 0 ? results.length - 1 : 0;
    if (clamped !== activeIndex) setActiveIndex(clamped);
  }

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  if (!open) return null;

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button
        type="button"
        aria-label="Close command palette"
        onClick={onClose}
        className={`absolute inset-0 bg-zinc-950/70 ${FOCUS_RING}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg rounded-xl border border-white/10 bg-zinc-900 shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4">
          <span className="font-normal text-sm text-zinc-400" aria-hidden="true">
            &#8984;K
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search categories, budgets, reports..."
            aria-label="Search commands"
            className={`h-14 flex-1 bg-transparent font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
        </div>
        <ul role="listbox" aria-label="Command results" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center font-normal text-sm text-zinc-400">
              No matching commands.
            </li>
          ) : (
            results.map((item, index) => {
              const Icon = item.icon;
              const active = index === activeIndex;
              return (
                <li key={item.id} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={onClose}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                      active ? "bg-rose-500/10 text-zinc-50" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{item.label}</span>
                    <span className="shrink-0 truncate font-normal text-xs text-zinc-400">{item.hint}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
