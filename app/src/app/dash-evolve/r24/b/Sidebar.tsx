"use client";

import { useEffect, useRef, useState } from "react";
import {
  Flag,
  LayoutDashboard,
  GitBranch,
  Rocket,
  Layers,
  Users,
  KeyRound,
  Settings,
  ChevronsUpDown,
  Check,
  Waves,
  X,
} from "lucide-react";
import { OwnerAvatar } from "./ui";

const WORKSPACES = ["Core Platform", "Growth Team"];

type NavItem = { label: string; icon: typeof Flag; current?: boolean };
const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Flags", icon: Flag, current: true },
      { label: "Experiments", icon: GitBranch },
      { label: "Rollouts", icon: Rocket },
    ],
  },
  {
    heading: "Configure",
    items: [
      { label: "Environments", icon: Layers },
      { label: "Segments", icon: Users },
    ],
  },
  {
    heading: "Admin",
    items: [
      { label: "API keys", icon: KeyRound },
      { label: "Settings", icon: Settings },
    ],
  },
];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 text-left text-sm text-zinc-200 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sky-400/15 text-[11px] font-semibold text-sky-300">
          {workspace.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1 truncate">{workspace}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Switch workspace"
          className="absolute left-0 top-[calc(100%+4px)] z-30 w-full rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-lg shadow-black/40"
        >
          {WORKSPACES.map((w) => (
            <button
              key={w}
              type="button"
              role="option"
              aria-selected={w === workspace}
              onClick={() => {
                setWorkspace(w);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-zinc-200 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {w}
              {w === workspace && <Check className="size-3.5 text-sky-400" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="flex items-center gap-2 px-1">
        <Waves className="size-5 text-sky-400" aria-hidden="true" />
        <span
          className="text-[17px] font-semibold tracking-tight text-zinc-50"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Sluice
        </span>
      </div>

      <WorkspaceSwitcher />

      <nav className="flex-1 space-y-5 overflow-y-auto" aria-label="Primary">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading}>
            <div className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-400">{section.heading}</div>
            <div className="space-y-0.5">
              {section.items.map((item) =>
                item.current ? (
                  <div
                    key={item.label}
                    aria-current="page"
                    className="flex items-center gap-2.5 rounded-lg bg-sky-400/10 px-2.5 py-1.5 text-sm font-medium text-sky-300 ring-1 ring-inset ring-sky-400/20"
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </div>
                ) : (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-zinc-400">
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2">
        <OwnerAvatar name="Sam Okafor" seed="sluice-current-user" size={28} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-zinc-100">Sam Okafor</div>
          <div className="truncate text-xs text-zinc-400">Release engineer</div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-950 md:block" aria-label="Sidebar">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/60"
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-zinc-950 shadow-xl" aria-label="Sidebar">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-zinc-400 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
