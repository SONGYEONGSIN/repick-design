"use client";

import { useState } from "react";
import { CalendarDays, ClipboardList, Users, Building2, Settings, ChevronsUpDown, Check, LogOut, X } from "lucide-react";
import { FOCUS_RING, DISPLAY_FACE, InitialsAvatar } from "./ui";

const NAV_ITEMS = [
  { id: "calendar", label: "Booking calendar", icon: CalendarDays },
  { id: "bookings", label: "Bookings", icon: ClipboardList },
  { id: "clients", label: "Clients", icon: Users },
  { id: "rooms", label: "Rooms", icon: Building2 },
  { id: "settings", label: "Settings", icon: Settings },
];

/** Static current-page nav state — this route has one screen, so "Booking calendar" is always the
 *  active item. Not interactive state, just which pill renders as current. */
const ACTIVE_NAV = "calendar";

interface Workspace {
  id: string;
  name: string;
  subtitle: string;
}

const WORKSPACES: Workspace[] = [
  { id: "lumen-hall", name: "Lumen Hall & Studios", subtitle: "Event venue workspace" },
  { id: "lumen-north", name: "Lumen North Annex", subtitle: "Satellite event space" },
];

/** Real, wired workspace switcher — clicking the trigger opens a listbox of workspaces; picking
 *  one sets the active workspace and the trigger's own label updates to match. Not just a
 *  decorative chevron: the chevron rotates with `aria-expanded` and the panel is keyboard-reachable
 *  (a native `<button>` per option, tab order unaffected). */
function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(WORKSPACES[0].id);
  const active = WORKSPACES.find((w) => w.id === activeId) ?? WORKSPACES[0];

  return (
    <div className="relative mt-4 min-w-0 shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left transition-colors hover:bg-zinc-100 motion-reduce:transition-none ${FOCUS_RING}`}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-900">{active.name}</span>
          <span className="block truncate text-[11px] text-zinc-600">{active.subtitle}</span>
        </span>
        <ChevronsUpDown className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <ul role="listbox" aria-label="Switch workspace" className="absolute left-0 top-full z-20 mt-1.5 w-full min-w-0 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl">
          {WORKSPACES.map((ws) => {
            const isActive = ws.id === activeId;
            return (
              <li key={ws.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveId(ws.id);
                    setOpen(false);
                  }}
                  className={`flex w-full min-w-0 items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    isActive ? "bg-orange-50" : "hover:bg-zinc-100"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-medium ${isActive ? "text-orange-700" : "text-zinc-900"}`}>{ws.name}</span>
                    <span className="block truncate text-[11px] text-zinc-600">{ws.subtitle}</span>
                  </span>
                  {isActive ? <Check className="h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

const USER_MENU_ITEMS = [
  { id: "profile", label: "Profile", icon: Settings },
  { id: "sign-out", label: "Sign out", icon: LogOut },
];

/** Real, wired account menu for the sidebar footer — opens a small menu upward (it sits at the
 *  bottom of the rail) with two items; each item click closes the menu, same pattern as the
 *  topbar's avatar menu. */
function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-w-0 shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full min-w-0 items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left transition-colors hover:bg-zinc-100 motion-reduce:transition-none ${FOCUS_RING}`}
      >
        <InitialsAvatar name="Rosa Lin" size={28} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-zinc-900">Rosa Lin</span>
          <span className="block truncate text-[11px] text-zinc-600">Venue operations lead</span>
        </span>
      </button>
      {open ? (
        <div role="menu" aria-label="Account menu" className="absolute bottom-full left-0 z-20 mb-1.5 w-full min-w-0 rounded-lg border border-zinc-200 bg-white p-1 shadow-xl">
          {USER_MENU_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="menuitem"
              onClick={() => setOpen(false)}
              className={`flex h-9 w-full min-w-0 items-center gap-2 rounded-md px-2.5 text-left text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    // Explicit width + min-w-0 on the sidebar's own direct content wrapper: a row-direction flex
    // `<aside>` can let this child overflow the rail even when deeper content truncates correctly,
    // so it gets its own sizing rather than inheriting whatever the aside happens to be.
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className={`flex h-11 min-w-0 items-center gap-2 rounded-lg px-1 ${FOCUS_RING}`}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-orange-700 text-white">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="truncate text-sm font-semibold tracking-tight text-zinc-900" style={DISPLAY_FACE}>
          Stagebook
        </span>
      </div>

      <WorkspaceSwitcher />

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
                isActive ? "bg-orange-50 text-orange-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <UserMenu />
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
