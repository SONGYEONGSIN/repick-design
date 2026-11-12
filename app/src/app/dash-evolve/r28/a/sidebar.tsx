"use client";

import { useEffect } from "react";
import { CalendarDays, LayoutGrid, ClipboardList, Building2, Users, Settings, X } from "lucide-react";
import { Avatar, FOCUS_RING, FOCUS_RING_FULL } from "./ui";

const NAV = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Calendar", icon: CalendarDays, active: true },
  { label: "Appointments", icon: ClipboardList, active: false },
  { label: "Locations", icon: Building2, active: false },
  { label: "Staff", icon: Users, active: false },
];

function SidebarContent({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-zinc-200 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white" aria-hidden="true">
          <CalendarDays className="h-4.5 w-4.5" />
        </span>
        <span
          className="text-lg font-bold text-zinc-900"
          style={{ fontFamily: "var(--font-display-wide)" }}
        >
          Openhour
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={`ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING_FULL}`}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-b border-zinc-200 px-3 py-3">
        <button
          type="button"
          className={`flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left hover:bg-zinc-100 ${FOCUS_RING}`}
        >
          <span className="min-w-0">
            <span className="block truncate text-xs font-medium text-zinc-500">Workspace</span>
            <span className="block truncate text-sm font-bold text-zinc-900">BrightPath Dental Group</span>
          </span>
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
              onClick={(e) => { e.preventDefault(); onNavigate?.(); }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${FOCUS_RING} ${
                item.active
                  ? "bg-orange-50 text-orange-800"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <Settings aria-hidden="true" className="h-4.5 w-4.5 shrink-0" />
          Settings
        </a>
        <div className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2">
          <Avatar initials="AM" size={32} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-zinc-900">Ava Morrow</span>
            <span className="block truncate text-xs text-zinc-500">Operations Manager</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 md:block">
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
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/40"
      />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-zinc-50 shadow-xl">
        <SidebarContent onNavigate={onClose} onClose={onClose} />
      </div>
    </div>
  );
}
