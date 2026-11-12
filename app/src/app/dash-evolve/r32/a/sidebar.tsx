"use client";

import { useEffect } from "react";
import { ChevronsUpDown, FileWarning, LayoutDashboard, Radar, Settings, ShieldCheck, Users, X } from "lucide-react";
import { FOCUS_RING, cx } from "./ui";

const NAV = [
  { label: "Overview", icon: LayoutDashboard, active: false },
  { label: "Signal Wall", icon: Radar, active: true },
  { label: "Cases", icon: FileWarning, active: false },
  { label: "Sellers", icon: Users, active: false },
  { label: "Policies", icon: ShieldCheck, active: false },
];

function SidebarContent({ onNavigate, onCloseMobile }: { onNavigate?: () => void; onCloseMobile?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b border-zinc-200 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-600 text-white" aria-hidden="true">
          <Radar className="h-4 w-4" />
        </span>
        <span className="text-[15px] font-semibold text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          Tripwire
        </span>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className={cx("ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700", FOCUS_RING)}
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-b border-zinc-200 px-3 py-3">
        <button
          type="button"
          className={cx(
            "flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-left hover:bg-zinc-100",
            FOCUS_RING
          )}
        >
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-medium text-zinc-600">Workspace</span>
            <span className="block truncate text-[13px] font-semibold text-zinc-900">repick Trust &amp; Safety</span>
          </span>
          <ChevronsUpDown aria-hidden className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
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
              className={cx(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                FOCUS_RING,
                item.active ? "bg-rose-50 text-rose-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon aria-hidden className="h-4 w-4 shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className={cx("flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900", FOCUS_RING)}
        >
          <Settings aria-hidden className="h-4 w-4 shrink-0" />
          Settings
        </a>
        <button
          type="button"
          className={cx("mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-zinc-50", FOCUS_RING)}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[11px] font-semibold text-zinc-700">DM</span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium text-zinc-900">Dana Mercer</span>
            <span className="block truncate text-[11px] text-zinc-500">Trust &amp; safety lead</span>
          </span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:block">
      <div className="sticky top-0 h-dvh">
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
      <button type="button" tabIndex={-1} aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl">
        <SidebarContent onNavigate={onClose} onCloseMobile={onClose} />
      </div>
    </div>
  );
}
