"use client";

import { useId, useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronDown, Check } from "lucide-react";
import type { SortMode } from "../lib/data";
import { FOCUS_RING, Switch } from "./ui";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "improvement", label: "Biggest improvement first" },
  { value: "decline", label: "Biggest decline first" },
  { value: "name", label: "Facility name (A–Z)" },
];

/** Real sort + filter controls for the slope chart — independent of the metric toggle above it. */
export function FilterBar({
  sortMode,
  onSortChange,
  declineOnly,
  onDeclineOnlyChange,
}: {
  sortMode: SortMode;
  onSortChange: (m: SortMode) => void;
  declineOnly: boolean;
  onDeclineOnlyChange: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const buttonId = useId();
  const listId = useId();
  const current = SORT_OPTIONS.find((o) => o.value === sortMode)!;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-5 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            id={buttonId}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            className={`flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 hover:border-zinc-300 ${FOCUS_RING}`}
          >
            <span className="text-zinc-500">Sort:</span>
            {current.label}
            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
          </button>
          {open ? (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close sort menu"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <ul
                id={listId}
                role="listbox"
                aria-labelledby={buttonId}
                className="absolute left-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
              >
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={opt.value === sortMode}
                      onClick={() => {
                        onSortChange(opt.value);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs ${FOCUS_RING} ${
                        opt.value === sortMode ? "bg-lime-50 text-lime-800" : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {opt.label}
                      {opt.value === sortMode ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <Switch id="decline-only" checked={declineOnly} onChange={onDeclineOnlyChange} label="Declining only" />
      </div>

      <ul aria-label="Legend" className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-zinc-400 bg-white" aria-hidden="true" />
          Prior quarter
        </li>
        <li className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-600" aria-hidden="true" />
          Current quarter
        </li>
        <li className="flex items-center gap-1.5 text-lime-700">
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          Improved
        </li>
        <li className="flex items-center gap-1.5 text-rose-600">
          <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
          Declined
        </li>
      </ul>
    </div>
  );
}
