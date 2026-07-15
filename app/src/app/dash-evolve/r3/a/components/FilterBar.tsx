"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Users } from "lucide-react";
import { MEMBERS, STATUS_FILTERS, TaskStatus } from "../lib/data";
import { SegmentedControl } from "./ui";

export type ViewMode = "week" | "month";

export default function FilterBar({
  view,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  selectedMemberIds,
  onToggleMember,
  onSelectAllMembers,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  statusFilter: "all" | TaskStatus;
  onStatusFilterChange: (s: "all" | TaskStatus) => void;
  selectedMemberIds: Set<string>;
  onToggleMember: (id: string) => void;
  onSelectAllMembers: () => void;
}) {
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMemberMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMemberMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const allSelected = selectedMemberIds.size === MEMBERS.length;
  const memberButtonLabel = allSelected
    ? "All team members"
    : `${selectedMemberIds.size} member${selectedMemberIds.size === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 px-4 py-2.5 sm:px-5">
      <SegmentedControl
        ariaLabel="Timeline view"
        value={view}
        onChange={onViewChange}
        options={[
          { id: "week", label: "Weekly" },
          { id: "month", label: "Monthly" },
        ]}
      />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={memberMenuOpen}
          onClick={() => setMemberMenuOpen((v) => !v)}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
        >
          <Users className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
          {memberButtonLabel}
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
        </button>
        {memberMenuOpen ? (
          <div
            role="menu"
            aria-label="Filter by team member"
            className="absolute left-0 z-30 mt-1.5 w-60 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg"
          >
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={allSelected}
              onClick={onSelectAllMembers}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  allSelected ? "border-indigo-600 bg-indigo-600" : "border-zinc-300 bg-white"
                }`}
              >
                {allSelected ? <Check className="h-3 w-3 text-white" aria-hidden="true" /> : null}
              </span>
              All members
            </button>
            <div className="my-1 h-px bg-zinc-100" />
            {MEMBERS.map((m) => {
              const checked = selectedMemberIds.has(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={checked}
                  onClick={() => onToggleMember(m.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left outline-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      checked ? "border-indigo-600 bg-indigo-600" : "border-zinc-300 bg-white"
                    }`}
                  >
                    {checked ? <Check className="h-3 w-3 text-white" aria-hidden="true" /> : null}
                  </span>
                  <Image
                    src={m.avatar}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0 rounded-full object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate text-xs text-zinc-800">{m.name}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <SegmentedControl
        ariaLabel="Filter by status"
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={STATUS_FILTERS}
      />
    </div>
  );
}
