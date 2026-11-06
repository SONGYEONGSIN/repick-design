"use client";

import { useState } from "react";
import { LayoutGrid, Activity, Server, ListChecks, Bell, Settings, ChevronDown, X } from "lucide-react";
import { InitialsAvatar } from "./ui";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "incidents", label: "Incidents", icon: Activity },
  { id: "services", label: "Services", icon: Server },
  { id: "runbooks", label: "Runbooks", icon: ListChecks },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const WORKSPACES = ["Production", "Staging"] as const;

function BrandLockup() {
  return (
    <div className="flex items-center gap-2 px-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-zinc-950">
        <Activity className="h-4 w-4" aria-hidden="true" />
      </span>
      <span
        className="text-lg font-semibold tracking-tight text-zinc-50"
        style={{ fontFamily: "var(--font-display-mono)" }}
      >
        Northbound
      </span>
    </div>
  );
}

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState<(typeof WORKSPACES)[number]>(WORKSPACES[0]);

  return (
    <div className="relative px-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-zinc-950 px-3 text-left outline-offset-2 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-cyan-400"
      >
        <span className="min-w-0 truncate text-sm font-medium text-zinc-50">{workspace}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open && (
        <>
          <div aria-hidden="true" className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul
            role="listbox"
            aria-label="Switch workspace"
            className="absolute left-2 right-2 z-20 mt-1 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg"
          >
            {WORKSPACES.map((option) => (
              <li key={option} role="option" aria-selected={option === workspace}>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspace(option);
                    setOpen(false);
                  }}
                  className={`block w-full truncate px-3 py-2 text-left text-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    option === workspace ? "bg-cyan-400/10 font-medium text-zinc-50" : "font-normal text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const [active, setActive] = useState<(typeof NAV_ITEMS)[number]["id"]>("incidents");
  return (
    <nav aria-label="Primary" className="flex flex-col gap-0.5 px-2">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              setActive(item.id);
              onNavigate?.();
            }}
            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm outline-offset-2 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 ${
              isActive
                ? "bg-cyan-400/10 font-semibold text-cyan-300"
                : "font-normal text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function UserCard() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <InitialsAvatar initials="AR" className="h-9 w-9 text-[12px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-50">Alex Rivera</p>
        <p className="truncate text-xs text-zinc-400">On-call lead</p>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 py-5">
      <BrandLockup />
      <WorkspaceSwitcher />
      <div className="flex-1 overflow-y-auto">
        <NavList onNavigate={onNavigate} />
      </div>
      <div className="border-t border-white/10 pt-4">
        <UserCard />
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      {/* Desktop: static column */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-950 md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile: off-canvas drawer */}
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 motion-reduce:transition-none md:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation"
        inert={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950 shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end px-2 pt-2">
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 outline-offset-2 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <SidebarContent onNavigate={onCloseMobile} />
      </div>
    </>
  );
}
