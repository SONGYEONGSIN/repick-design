"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  ChevronsUpDown,
  FileText,
  Gauge,
  LogOut,
  Radar as RadarIcon,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { InitialsAvatar, useDismissable } from "./ui";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: Gauge, active: true },
  { id: "vendors", label: "Vendors", icon: Building2, active: false },
  { id: "scorecards", label: "Scorecards", icon: RadarIcon, active: false },
  { id: "contracts", label: "Contracts", icon: FileText, active: false },
  { id: "compliance", label: "Risk & Compliance", icon: ShieldCheck, active: false },
  { id: "settings", label: "Settings", icon: Settings, active: false },
];

const WORKSPACES = ["Procurement — North America", "Procurement — EMEA"];

function NavList() {
  return (
    <nav aria-label="Primary" className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href="#"
            aria-current={item.active ? "page" : undefined}
            className={`flex h-10 items-center gap-2.5 rounded-full px-3 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 ${
              item.active
                ? "bg-lime-50 font-semibold text-lime-800"
                : "font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2.25} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const { panelRef, triggerRef } = useDismissable(open, () => setOpen(false));

  return (
    <div className="relative px-3">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-left transition-colors motion-reduce:transition-none hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
      >
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-zinc-800">{workspace}</span>
        <ChevronsUpDown aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-500" />
      </button>
      {open && (
        <div
          ref={panelRef}
          role="group"
          aria-label="Switch workspace"
          className="absolute left-3 right-3 top-[calc(100%+4px)] z-20 rounded-lg border border-zinc-200 bg-white p-1 shadow-sm"
        >
          {WORKSPACES.map((ws) => (
            <button
              key={ws}
              type="button"
              onClick={() => {
                setWorkspace(ws);
                setOpen(false);
              }}
              className={`flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700 ${
                ws === workspace ? "bg-lime-50 text-lime-800" : "text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {ws}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const { panelRef, triggerRef } = useDismissable(open, () => setOpen(false));

  return (
    <div className="relative px-3 pb-3">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center gap-2.5 rounded-lg px-2.5 text-left transition-colors motion-reduce:transition-none hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
      >
        <InitialsAvatar initials="JL" className="h-8 w-8 shrink-0 text-xs" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-800">Jordan Lee</span>
          <span className="block truncate text-xs text-zinc-500">Procurement Lead</span>
        </span>
      </button>
      {open && (
        <div
          ref={panelRef}
          role="group"
          aria-label="Account menu"
          className="absolute bottom-[calc(100%+4px)] left-3 right-3 z-20 rounded-lg border border-zinc-200 bg-white p-1 shadow-sm"
        >
          {[
            { label: "Profile", icon: User },
            { label: "Account settings", icon: Settings },
            { label: "Sign out", icon: LogOut },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BrandLockup() {
  return (
    <div className="flex h-16 items-center gap-2 px-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-700 text-white">
        <RadarIcon aria-hidden="true" className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="font-[family-name:var(--font-display-grotesk)] text-base font-bold text-zinc-900">
        Vantage
      </span>
    </div>
  );
}

function SidebarBody() {
  return (
    <div className="flex h-full flex-col">
      <BrandLockup />
      <div className="pb-3">
        <WorkspaceSwitcher />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <NavList />
      </div>
      <div className="border-t border-zinc-200 pt-2">
        <UserMenu />
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  useEffect(() => {
    if (!mobileOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCloseMobile();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex">
        <div className="w-full">
          <SidebarBody />
        </div>
      </aside>

      {/* Mounted only while open, so off-canvas controls are never left reachable by keyboard. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div onClick={onCloseMobile} className="absolute inset-0 bg-zinc-900/30" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 left-0 w-72 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
            <SidebarBody />
          </div>
        </div>
      )}
    </>
  );
}
