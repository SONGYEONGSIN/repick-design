"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Check, KanbanSquare, List, Users } from "lucide-react";
import { owners, periodMeta, type Period } from "./data";
import { SORT_PRESETS, type BoardControls } from "./types";

const PERIODS: Period[] = ["quarter", "prev_quarter", "year"];

export function Toolbar({ controls }: { controls: BoardControls }) {
  const { view, setView, period, setPeriod, ownerFilter, setOwnerFilter, sort, setSort } = controls;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* View toggle (segmented control) */}
      <Segmented
        ariaLabel="Switch view"
        options={[
          { value: "board", label: "Board", icon: KanbanSquare },
          { value: "list", label: "List", icon: List },
        ]}
        value={view}
        onChange={(v) => setView(v as "board" | "list")}
      />

      {/* Period toggle (segmented control) */}
      <Segmented
        ariaLabel="Switch period"
        options={PERIODS.map((p) => ({ value: p, label: periodMeta[p].short }))}
        value={period}
        onChange={(v) => setPeriod(v as Period)}
      />

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <OwnerFilter value={ownerFilter} onChange={setOwnerFilter} />
        <SortMenu
          value={sort}
          onChange={(preset) => setSort({ key: preset.key, dir: preset.dir })}
        />
      </div>
    </div>
  );
}

/* ── Segmented control ───────────────────────────────── */

function Segmented({
  ariaLabel,
  options,
  value,
  onChange,
}: {
  ariaLabel: string;
  options: { value: string; label: string; icon?: typeof List }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex h-11 items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-1"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex h-full items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
              active
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Owner filter (dropdown) ──────────────────────────── */

function OwnerFilter({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, () => setOpen(false));

  const activeOwner = owners.find((o) => o.id === value);
  const label = activeOwner ? activeOwner.name : "All Reps";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <Users className="h-4 w-4 text-zinc-400" aria-hidden="true" />
        <span className="whitespace-nowrap">Rep: {label}</span>
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label="Filter by rep"
          className="absolute right-0 z-30 mt-1 w-56 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          <OwnerOption label="All Reps" selected={value === "all"} onClick={() => { onChange("all"); setOpen(false); }} />
          <div className="my-1 h-px bg-zinc-100" />
          {owners.map((o) => (
            <OwnerOption
              key={o.id}
              label={`${o.name} · ${o.role}`}
              selected={value === o.id}
              onClick={() => { onChange(o.id); setOpen(false); }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function OwnerOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={`flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2.5 text-left text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
        selected ? "bg-blue-50 font-medium text-blue-700" : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      <span className="truncate">{label}</span>
      {selected ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
    </button>
  );
}

/* ── Sort (dropdown) ──────────────────────────────────── */

function SortMenu({
  value,
  onChange,
}: {
  value: { key: string; dir: string };
  onChange: (preset: (typeof SORT_PRESETS)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClose(ref, () => setOpen(false));

  const active =
    SORT_PRESETS.find((p) => p.key === value.key && p.dir === value.dir) ?? SORT_PRESETS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ArrowUpDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
        <span className="whitespace-nowrap">Sort: {active.label}</span>
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Sort by"
          className="absolute right-0 z-30 mt-1 w-44 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          {SORT_PRESETS.map((p) => {
            const selected = p.key === value.key && p.dir === value.dir;
            return (
              <button
                key={p.label}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => { onChange(p); setOpen(false); }}
                className={`flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2.5 text-left text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                  selected ? "bg-blue-50 font-medium text-blue-700" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <span>{p.label}</span>
                {selected ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/* ── util ───────────────────────────────────────────── */

function useOutsideClose(ref: React.RefObject<HTMLDivElement | null>, onClose: () => void) {
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onClose]);
}
