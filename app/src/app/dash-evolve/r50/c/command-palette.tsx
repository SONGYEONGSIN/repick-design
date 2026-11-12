"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Beaker, Flag as FlagIcon, Search } from "lucide-react";
import type { Experiment, FeatureFlag } from "./types";

type ResultItem = { kind: "flag"; flag: FeatureFlag } | { kind: "experiment"; experiment: Experiment };

export function CommandPalette({
  open,
  onClose,
  flags,
  experiments,
  onSelectFlag,
  onSelectExperiment,
}: {
  open: boolean;
  onClose: () => void;
  flags: FeatureFlag[];
  experiments: Experiment[];
  onSelectFlag: (flag: FeatureFlag) => void;
  onSelectExperiment: (experiment: Experiment) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset derived from the `open` prop changing — React's "adjust state during render" pattern, so
  // no extra effect/render round-trip is needed just to clear the query when the palette reopens.
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setHighlight(0);
    }
  }
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setHighlight(0);
  }

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const results: ResultItem[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    const flagItems: ResultItem[] = flags
      .filter((f) => !q || f.name.toLowerCase().includes(q) || f.key.toLowerCase().includes(q))
      .map((flag) => ({ kind: "flag", flag }));
    const expItems: ResultItem[] = experiments
      .filter((e) => !q || e.name.toLowerCase().includes(q) || e.flagKey.toLowerCase().includes(q))
      .map((experiment) => ({ kind: "experiment", experiment }));
    return [...expItems, ...flagItems].slice(0, 8);
  }, [flags, experiments, query]);

  if (!open) return null;

  function runItem(item: ResultItem) {
    if (item.kind === "flag") onSelectFlag(item.flag);
    else onSelectExperiment(item.experiment);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[highlight];
      if (item) runItem(item);
    } else if (e.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('input, button:not([tabindex="-1"])');
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24" onKeyDown={handleKeyDown}>
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search flags and experiments"
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex h-12 items-center gap-2 border-b border-zinc-200 px-3.5 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-emerald-600">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flags or experiments…"
            aria-label="Search flags or experiments"
            aria-activedescendant={results[highlight] ? `cmd-${results[highlight].kind}-${resultKey(results[highlight])}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
        <ul id="command-results" role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto py-1.5">
          {results.length === 0 && <li className="px-3.5 py-6 text-center text-[13px] font-normal text-zinc-500">No matches.</li>}
          {results.map((item, i) => {
            const active = i === highlight;
            const key = `cmd-${item.kind}-${resultKey(item)}`;
            const Icon = item.kind === "flag" ? FlagIcon : Beaker;
            const label = item.kind === "flag" ? item.flag.name : item.experiment.name;
            const hint = item.kind === "flag" ? "Flag" : "Experiment";
            const sub = item.kind === "flag" ? item.flag.key : item.experiment.flagKey;
            return (
              <li key={key} id={key} role="option" aria-selected={active}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => runItem(item)}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left transition-colors duration-150 ease-out ${
                    active ? "bg-emerald-50 text-emerald-900" : "text-zinc-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-normal">
                    {label} <span className="text-zinc-600">· {sub}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-normal text-zinc-600">{hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function resultKey(item: ResultItem): string {
  return item.kind === "flag" ? item.flag.id : item.experiment.id;
}
