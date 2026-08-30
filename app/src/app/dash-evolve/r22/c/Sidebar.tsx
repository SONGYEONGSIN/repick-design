"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  Aperture,
  Bookmark,
  ChevronsUpDown,
  Compass,
  Database,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCog,
  X,
} from "lucide-react";
import { FOCUS_RING, useDismissablePopover } from "./ui";

const WORKSPACES = ["Northwind Analytics", "Northwind Growth", "Northwind Ops"];

const NAV_ITEMS = [
  { label: "Explore", icon: Compass, href: "#main-content", current: true },
  { label: "Dashboards", icon: LayoutDashboard, href: "#main-content", current: false },
  { label: "Saved Questions", icon: Bookmark, href: "#saved-questions", current: false },
  { label: "Data Sources", icon: Database, href: "#main-content", current: false },
  { label: "Settings", icon: Settings, href: "#main-content", current: false },
];

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const workspace = useDismissablePopover(workspaceRef);
  const accountRef = useRef<HTMLDivElement>(null);
  const account = useDismissablePopover(accountRef);
  const activeWorkspaceIndex = 0;

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(57,135,229,0.16)] text-[#5b9bec]">
          <Aperture size={17} aria-hidden="true" />
        </span>
        <span className="[font-family:var(--font-display-mono)] text-[15px] font-semibold tracking-tight text-zinc-50">
          Aperture
        </span>
      </div>

      <div ref={workspaceRef} className="relative border-b border-white/10 p-3">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={workspace.open}
          onClick={() => workspace.setOpen((o) => !o)}
          className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 hover:border-white/20 ${FOCUS_RING}`}
        >
          <span className="truncate text-[13px] font-medium text-zinc-100">{WORKSPACES[activeWorkspaceIndex]}</span>
          <ChevronsUpDown size={14} className="shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
        {workspace.open && (
          <div role="listbox" aria-label="Workspaces" className="absolute left-3 right-3 top-[calc(100%+4px)] z-30 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/40">
            {WORKSPACES.map((w, i) => (
              <button
                key={w}
                type="button"
                role="option"
                aria-selected={i === activeWorkspaceIndex}
                onClick={() => workspace.setOpen(false)}
                className={`flex w-full items-center px-3 py-2 text-left text-[13px] ${
                  i === activeWorkspaceIndex ? "bg-white/10 text-zinc-50" : "text-zinc-300 hover:bg-white/5"
                } ${FOCUS_RING}`}
              >
                {w}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              onClick={onNavigate}
              className={`flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium ${FOCUS_RING} ${
                item.current ? "bg-[rgba(57,135,229,0.14)] text-[#8ab6f2]" : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div ref={accountRef} className="relative border-t border-white/10 p-3">
        {account.open && (
          <ul role="menu" aria-label="Account" className="absolute bottom-[calc(100%+4px)] left-3 right-3 z-30 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/40">
            <li role="none">
              <button role="menuitem" type="button" onClick={() => account.setOpen(false)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
                <UserCog size={14} aria-hidden="true" />
                Workspace settings
              </button>
            </li>
            <li role="none">
              <button role="menuitem" type="button" onClick={() => account.setOpen(false)} className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}>
                <LogOut size={14} aria-hidden="true" />
                Sign out
              </button>
            </li>
          </ul>
        )}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={account.open}
          onClick={() => account.setOpen((o) => !o)}
          className={`flex h-11 w-full items-center gap-2.5 rounded-lg px-1.5 hover:bg-white/[0.05] ${FOCUS_RING}`}
        >
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-zinc-800">
            <Image
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
              alt=""
              fill
              sizes="28px"
              className="object-cover"
            />
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[13px] font-medium text-zinc-100">Priya Raman</span>
            <span className="block truncate text-[11px] font-normal text-zinc-400">Analytics Lead</span>
          </span>
          <ChevronsUpDown size={14} className="shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 lg:block" aria-label="Sidebar">
      <div className="sticky top-0 h-screen">
        <SidebarBody />
      </div>
    </aside>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Navigation" className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/10 shadow-2xl shadow-black/60">
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close navigation"
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/10 hover:text-zinc-50 ${FOCUS_RING}`}
        >
          <X size={16} aria-hidden="true" />
        </button>
        <SidebarBody onNavigate={onClose} />
      </div>
    </div>
  );
}
