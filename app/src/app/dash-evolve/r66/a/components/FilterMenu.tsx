"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ListFilter } from "lucide-react";
import { FOCUS_RING } from "./focus";

export default function FilterMenu<T extends string>({
  options,
  selected,
  onToggle,
  label,
}: {
  options: Array<{ value: T; label: string }>;
  selected: Set<T>;
  onToggle: (v: T) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const activeCount = selected.size;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-zinc-300 hover:bg-white/10 ${FOCUS_RING}`}
      >
        <ListFilter aria-hidden="true" className="size-3.5" />
        {label}
        {activeCount > 0 && activeCount < options.length && (
          <span className="rounded-full bg-indigo-400/20 px-1.5 text-[11px] tabular-nums text-indigo-200">{activeCount}</span>
        )}
      </button>
      {open && (
        <div role="menu" aria-label={`${label} options`} className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-md border border-white/10 bg-zinc-900 shadow-xl">
          {options.map((opt) => {
            const checked = selected.has(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitemcheckbox"
                aria-checked={checked}
                onClick={() => onToggle(opt.value)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200 hover:bg-white/10 ${FOCUS_RING}`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                    checked ? "border-indigo-400 bg-indigo-400 text-zinc-950" : "border-white/20"
                  }`}
                >
                  {checked && <Check className="size-3" strokeWidth={3} />}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
