"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Building2, Check, ChevronsUpDown, FileBarChart2, Kanban, LayoutGrid, Receipt, Settings, Users, X } from "lucide-react";
import { BRAND_NAME, BRAND_TAGLINE, CURRENT_USER, WORKSPACES } from "./data";
import { FOCUS_RING, cn } from "./ui";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Revenue Mix", icon: Kanban, active: true },
  { label: "Accounts", icon: Users, active: false },
  { label: "Invoices", icon: Receipt, active: false },
  { label: "Reports", icon: FileBarChart2, active: false },
];

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
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={cn("flex h-11 w-full items-center gap-2 rounded-lg border border-white/10 px-3 text-left font-medium text-sm text-zinc-50 hover:bg-white/5", FOCUS_RING)}
      >
        <Building2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">{WORKSPACES[index]}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <div role="listbox" aria-label="Workspaces" className="absolute left-0 top-12 z-30 w-full rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl">
          {WORKSPACES.map((ws, i) => (
            <button
              key={ws}
              type="button"
              role="option"
              aria-selected={i === index}
              onClick={() => {
                setIndex(i);
                setOpen(false);
              }}
              className={cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-normal text-sm text-zinc-300 hover:bg-white/5", FOCUS_RING)}
            >
              <span className="min-w-0 flex-1 truncate">{ws}</span>
              {i === index ? <Check className="h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" /> : null}
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
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400">
          <Kanban className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-lg leading-tight text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
            {BRAND_NAME}
          </p>
          <p className="truncate font-normal text-xs text-zinc-400">{BRAND_TAGLINE}</p>
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
                className={cn(
                  "flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors",
                  FOCUS_RING,
                  item.active ? "bg-teal-500/15 text-teal-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
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
      <Image
        src={`https://images.unsplash.com/photo-${CURRENT_USER.avatarId}?w=60&h=60&fit=crop&crop=faces`}
        alt=""
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 rounded-full bg-zinc-800 object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
        <p className="truncate font-normal text-xs text-zinc-400">{CURRENT_USER.role}</p>
      </div>
      <button
        type="button"
        aria-label="Account settings"
        className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50", FOCUS_RING)}
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
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-900 lg:flex">
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
      <button type="button" aria-label="Close navigation" onClick={onClose} className={cn("absolute inset-0 bg-zinc-950/70", FOCUS_RING)} />
      <div className="relative flex h-full w-80 max-w-[85vw] flex-col bg-zinc-900">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <p className="font-semibold text-sm text-zinc-50">Menu</p>
          <button type="button" aria-label="Close navigation" onClick={onClose} className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5", FOCUS_RING)}>
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
