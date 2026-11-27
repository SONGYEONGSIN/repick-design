"use client";

import { Container, LayoutDashboard, DoorOpen, Truck, Warehouse, Settings, ChevronsUpDown, X } from "lucide-react";
import { FOCUS_RING, DISPLAY_FACE } from "./ui";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "schedule", label: "Dock schedule", icon: DoorOpen },
  { id: "carriers", label: "Carriers", icon: Truck },
  { id: "yard", label: "Yard activity", icon: Warehouse },
  { id: "settings", label: "Settings", icon: Settings },
];

/** Static current-page nav state — this route has one screen, so "Dock schedule" is always the
 *  active item. Not interactive state, just which pill renders as current. */
const ACTIVE_NAV = "schedule";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    // Explicit width + min-w-0 on the sidebar's own direct content wrapper: a row-direction flex
    // `<aside>` can let this child overflow the rail even when deeper content truncates correctly,
    // so it gets its own sizing rather than inheriting whatever the aside happens to be.
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className={`flex h-11 min-w-0 items-center gap-2 rounded-lg px-1 ${FOCUS_RING}`}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-400 text-zinc-950">
          <Container className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="truncate text-sm font-semibold tracking-tight text-zinc-50" style={DISPLAY_FACE}>
          Portlane
        </span>
      </div>

      <button
        type="button"
        className={`mt-4 flex h-11 w-full min-w-0 shrink-0 items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left transition-colors hover:bg-white/[0.06] motion-reduce:transition-none ${FOCUS_RING}`}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-50">Harborview Terminal 4</span>
          <span className="block truncate text-[11px] text-zinc-400">Freight terminal workspace</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>

      <nav className="mt-6 flex flex-1 min-w-0 flex-col gap-1" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === ACTIVE_NAV;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
              className={`flex h-10 w-full min-w-0 items-center gap-2.5 rounded-full px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                isActive ? "bg-emerald-400/10 text-emerald-300" : "text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className={`flex h-11 w-full min-w-0 shrink-0 items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-left transition-colors hover:bg-white/[0.06] motion-reduce:transition-none ${FOCUS_RING}`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-medium text-zinc-300">
          MC
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-50">Mara Chen</span>
          <span className="block truncate text-[11px] text-zinc-400">Terminal operations lead</span>
        </span>
      </button>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-white/10 bg-zinc-950 p-4 lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button type="button" aria-label="Close navigation menu" onClick={onClose} className="absolute inset-0 bg-zinc-950/60" />
      <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] min-w-0 flex-col border-r border-white/10 bg-zinc-950 p-4 shadow-xl">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onClose}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] ${FOCUS_RING}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  );
}
