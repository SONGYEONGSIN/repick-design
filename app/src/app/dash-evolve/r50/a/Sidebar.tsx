"use client";

import { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Nav, type NavId } from "./Nav";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

// 25+ chars on purpose — the house bug this brief calls out only shows up with a long label.
const WORKSPACES = ["Northwind Platform Engineering", "Northwind Payments Infra"];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-zinc-50 ${FOCUS_RING}`}
      >
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[10px] font-semibold text-zinc-600">
          {workspace.slice(0, 2).toUpperCase()}
        </span>
        {/* min-w-0 + flex-1 + truncate on the label, AND w-full on this wrapper's parent row below —
            both ends of the sidebar-blowout fix, see SidebarContent. */}
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700">{workspace}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Switch workspace"
          className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
        >
          {WORKSPACES.map((w) => (
            <li key={w}>
              <button
                type="button"
                role="option"
                aria-selected={w === workspace}
                onClick={() => {
                  setWorkspace(w);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
              >
                <span className="min-w-0 flex-1 truncate">{w}</span>
                {w === workspace && <Check className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Shared between the desktop `<aside>` and the mobile drawer. Given an explicit `w-full` here
 *  deliberately: this is the single flex-item child of a row-direction flex container at both
 *  mount points, and without `w-full` a long workspace label can blow out the fixed-width rail
 *  even though the label span itself already has `truncate`+`min-w-0`+`flex-1` — the house bug. */
export function SidebarContent({ active, onNavigate }: { active: NavId; onNavigate: (id: NavId) => void }) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <div className="flex flex-shrink-0 items-center gap-2 border-b border-zinc-200 px-5 py-4">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white">
          R
        </span>
        <p
          className="truncate text-base font-semibold leading-none text-zinc-900"
          style={{ fontFamily: "var(--font-display-wide)" }}
        >
          Riskline
        </p>
      </div>
      <div className="flex-shrink-0 border-b border-zinc-200 px-3 py-3">
        <WorkspaceSwitcher />
      </div>
      <Nav active={active} onNavigate={onNavigate} />
      <div className="flex flex-shrink-0 items-center gap-2.5 border-t border-zinc-200 px-4 py-4">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-600">
          YS
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium leading-none text-zinc-900">You</p>
          <p className="mt-1 truncate text-xs font-normal leading-none text-zinc-600">Release manager</p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ active, onNavigate }: { active: NavId; onNavigate: (id: NavId) => void }) {
  return (
    <aside className="hidden w-64 flex-shrink-0 flex-row border-r border-zinc-200 bg-white sm:flex">
      <SidebarContent active={active} onNavigate={onNavigate} />
    </aside>
  );
}
