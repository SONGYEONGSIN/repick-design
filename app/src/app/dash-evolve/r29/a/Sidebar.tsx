"use client";

import { useEffect } from "react";
import {
  CandlestickChart,
  LayoutGrid,
  Gavel,
  Boxes,
  Building2,
  Users,
  Settings,
  ChevronsUpDown,
  X,
} from "lucide-react";
import { Avatar, FOCUS_RING, FOCUS_RING_FULL } from "./ui";

const NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Pricing desk", icon: Gavel, active: true },
  { label: "Lots", icon: Boxes, active: false },
  { label: "Warehouses", icon: Building2, active: false },
  { label: "Traders", icon: Users, active: false },
];

function SidebarContent({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300" aria-hidden="true">
          <CandlestickChart className="h-4.5 w-4.5" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
          Lotwise
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING_FULL}`}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-b border-white/10 px-3 py-3">
        <button
          type="button"
          className={`flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-left hover:bg-white/[0.08] ${FOCUS_RING}`}
        >
          <span className="min-w-0">
            <span className="block truncate text-xs font-normal text-zinc-400">Desk</span>
            <span className="block truncate text-sm font-medium text-zinc-50">Harborline Resale Ops</span>
          </span>
          <ChevronsUpDown aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-400" />
        </button>
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href="#"
              aria-current={item.active ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.();
              }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                item.active ? "bg-indigo-500/15 text-indigo-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
              }`}
            >
              <Icon aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
        >
          <Settings aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
          Settings
        </a>
        <div className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2">
          <Avatar initials="RN" size={32} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-zinc-50">Reya Novak</span>
            <span className="block truncate text-xs font-normal text-zinc-400">Pricing trader</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-950 lg:block">
      <div className="sticky top-0 h-screen">
        <SidebarContent />
      </div>
    </aside>
  );
}

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-950/70" />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-zinc-950 shadow-2xl shadow-black/50">
        <SidebarContent onNavigate={onClose} onClose={onClose} />
      </div>
    </div>
  );
}
