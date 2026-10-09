"use client";

import { useState } from "react";
import { Anchor, LayoutGrid, Building2, Activity, OctagonAlert, FileBarChart2, Settings, ChevronDown, X } from "lucide-react";
import { InitialsAvatar } from "./ui";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "latency", label: "Latency", icon: Activity },
  { id: "incidents", label: "Incidents", icon: OctagonAlert },
  { id: "reports", label: "Reports", icon: FileBarChart2 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

const WORKSPACES = ["Production API", "Staging sandbox"] as const;

function BrandLockup() {
  return (
    <div className="flex items-center gap-2 px-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <Anchor className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
        Portcall
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
        className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-left outline-offset-2 transition-colors duration-150 ease-out hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none"
      >
        <span className="min-w-0 truncate text-sm font-medium text-zinc-900">{workspace}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
      </button>
      {open && (
        <>
          <div aria-hidden="true" className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul role="listbox" aria-label="Switch workspace" className="absolute left-2 right-2 z-20 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
            {WORKSPACES.map((option) => (
              <li key={option} role="option" aria-selected={option === workspace}>
                <button
                  type="button"
                  onClick={() => {
                    setWorkspace(option);
                    setOpen(false);
                  }}
                  className={`block w-full truncate px-3 py-2 text-left text-sm outline-offset-2 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                    option === workspace ? "bg-indigo-50 font-medium text-indigo-700" : "font-normal text-zinc-600 hover:bg-zinc-50"
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
  const [active, setActive] = useState<(typeof NAV_ITEMS)[number]["id"]>("overview");
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
            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm outline-offset-2 transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none ${
              isActive ? "bg-indigo-50 font-medium text-indigo-700" : "font-normal text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
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
      <InitialsAvatar initials="MR" className="h-9 w-9 text-[12px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900">Mina Reyes</p>
        <p className="truncate text-xs font-normal text-zinc-500">Platform engineering</p>
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
      <div className="border-t border-zinc-200 pt-4">
        <UserCard />
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      {/* Desktop: static column, part of the shell's own flex row (never the horizontal scroller). */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile: off-canvas drawer. */}
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={`fixed inset-0 z-40 bg-zinc-900/50 transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation"
        inert={!mobileOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white shadow-2xl transition-transform duration-200 ease-out motion-reduce:transition-none lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end px-2 pt-2">
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <SidebarContent onNavigate={onCloseMobile} />
      </div>
    </>
  );
}
