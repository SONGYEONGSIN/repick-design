"use client";

import { useState } from "react";
import { SlidersHorizontal, Flag, Users, History, RotateCcw, ChevronsUpDown, Check, X } from "lucide-react";
import { FOCUS_RING, DISPLAY_FACE, InitialsAvatar } from "./ui";

const WORKSPACES = [
  { id: "prod", name: "Northwind Retail", subtitle: "Production workspace" },
  { id: "staging", name: "Northwind Retail", subtitle: "Staging workspace" },
];

/** This route is a single screen — "Flags" is the only page that exists in this demo, so it is the
 *  permanent `aria-current="page"` item. The other nav entries describe real sibling pages of a
 *  full product (Segments, Audit log, Rollback events) that are out of scope for this route;
 *  clicking them is a no-op here, same as every other sidebar in this catalog. */
const NAV_SECTIONS: {
  heading: string;
  items: { id: string; label: string; icon: typeof Flag; active?: boolean }[];
}[] = [
  {
    heading: "Workspace",
    items: [
      { id: "flags", label: "Flags", icon: Flag, active: true },
      { id: "segments", label: "Segments", icon: Users },
      { id: "audit", label: "Audit log", icon: History },
    ],
  },
  {
    heading: "Insights",
    items: [{ id: "rollbacks", label: "Rollback events", icon: RotateCcw }],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState(WORKSPACES[0].id);
  const workspace = WORKSPACES.find((w) => w.id === workspaceId) ?? WORKSPACES[0];

  return (
    // Explicit width + min-w-0 on the sidebar's own content wrapper: a row-direction flex
    // <aside> can let this child overflow the rail even when deeper content truncates correctly.
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className={`flex h-11 min-w-0 items-center gap-2 rounded-lg px-1 ${FOCUS_RING}`}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-lime-700 text-white">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="truncate text-sm font-semibold tracking-tight text-zinc-900" style={DISPLAY_FACE}>
          Vernier
        </span>
      </div>

      <div className="relative mt-4 min-w-0 shrink-0">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={switcherOpen}
          onClick={() => setSwitcherOpen((v) => !v)}
          className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left transition-colors hover:bg-zinc-100 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-zinc-900">{workspace.name}</span>
            <span className="block truncate text-[11px] text-zinc-600">{workspace.subtitle}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
        </button>
        {switcherOpen ? (
          <div role="menu" aria-label="Switch workspace" className="absolute left-0 top-full z-20 mt-1 w-full min-w-0 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl">
            {WORKSPACES.map((w) => {
              const isCurrent = w.id === workspaceId;
              return (
                <button
                  key={w.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isCurrent}
                  onClick={() => {
                    setWorkspaceId(w.id);
                    setSwitcherOpen(false);
                  }}
                  className={`flex h-10 w-full min-w-0 items-center gap-2 rounded-md px-2 text-left hover:bg-zinc-100 ${FOCUS_RING}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-zinc-900">{w.name}</span>
                    <span className="block truncate text-[11px] text-zinc-500">{w.subtitle}</span>
                  </span>
                  {isCurrent ? <Check className="h-4 w-4 shrink-0 text-lime-700" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <nav className="mt-6 flex flex-1 min-w-0 flex-col gap-5 overflow-y-auto" aria-label="Primary">
        {NAV_SECTIONS.map((section) => (
          <div key={section.heading} className="min-w-0">
            <span className="block px-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">{section.heading}</span>
            <div className="mt-2 flex min-w-0 flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={item.active ? "page" : undefined}
                    onClick={onNavigate}
                    className={`flex h-10 w-full min-w-0 items-center gap-2.5 rounded-full px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                      item.active ? "bg-lime-50 text-lime-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex h-11 w-full min-w-0 shrink-0 items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3">
        <InitialsAvatar initials="RT" size={28} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-900">Rhea Torres</span>
          <span className="block truncate text-[11px] text-zinc-600">Platform engineer</span>
        </span>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-zinc-200 bg-white p-4 lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" aria-label="Close navigation menu" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] min-w-0 flex-col border-r border-zinc-200 bg-white p-4 shadow-xl">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
