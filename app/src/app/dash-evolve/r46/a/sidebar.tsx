"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronsUpDown,
  FileBarChart,
  LogOut,
  Plug,
  Settings,
  Trophy,
  Workflow,
  X,
} from "lucide-react";
import { Avatar, FOCUS_RING } from "./ui";

const NAV_ITEMS = [
  { label: "Leaderboard", icon: Trophy, active: true },
  { label: "Workflows", icon: Workflow, active: false },
  { label: "Connections", icon: Plug, active: false },
  { label: "Usage Reports", icon: FileBarChart, active: false },
  { label: "Alerts", icon: AlertCircle, active: false },
];

const WORKSPACES = ["Lumen Robotics — Production", "Lumen Robotics — Sandbox"];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative mt-4">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-11 w-full items-center gap-2 rounded-lg border border-white/10 px-3 text-left font-medium text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
      >
        <Building2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{WORKSPACES[index]}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute left-0 top-12 z-30 w-full rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          {WORKSPACES.map((ws, i) => (
            <button
              key={ws}
              type="button"
              onClick={() => {
                setIndex(i);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
            >
              <span className="min-w-0 flex-1 truncate">{ws}</span>
              {i === index ? <Check className="h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BrandAndNav() {
  return (
    <div>
      <div className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-400 text-zinc-950">
          <Workflow className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg leading-tight text-zinc-50 [font-family:var(--font-display-mono)]">Threadline</p>
          <p className="truncate font-normal text-xs text-zinc-400">Integration Analytics</p>
        </div>
      </div>

      <WorkspaceSwitcher />

      <nav className="mt-4" aria-label="Primary">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                  item.active ? "bg-sky-400/10 text-sky-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function UserFooter() {
  return (
    <div className="mt-auto flex items-center gap-2.5 border-t border-white/10 px-2 pt-4">
      <Avatar initials="PN" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm text-zinc-50">Priya Natarajan</p>
        <p className="truncate font-normal text-xs text-zinc-400">Platform Analyst</p>
      </div>
      <button
        type="button"
        aria-label="Account settings"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function SidebarContent() {
  return (
    <div className="flex h-full flex-col px-3 py-4">
      <BrandAndNav />
      <div className="min-h-0 flex-1" />
      <UserFooter />
    </div>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-950 lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-950/70" />
      <div className="relative flex h-full w-80 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950 motion-safe:animate-[rise_200ms_ease-out]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <p className="font-semibold text-sm text-zinc-50">Menu</p>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className={`flex h-11 w-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
}

export function SignOutRow() {
  return (
    <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      Sign out
    </button>
  );
}
