"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Plus, Search, User, Settings, LogOut } from "lucide-react";
import { OwnerAvatar } from "./ui";

const NOTIFICATIONS = [
  { id: "n1", text: "Rollout for Pricing Page Redesign reached 50% in prod.", time: "2h ago" },
  { id: "n2", text: "AI Copilot Panel rollout increased to 12% in prod.", time: "1d ago" },
  { id: "n3", text: "Search Relevance Rerank was paused in prod.", time: "3d ago" },
];

function Popover({
  label,
  icon,
  badge,
  panelRole,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  badge?: boolean;
  panelRole?: "menu" | "region";
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup={panelRole === "region" ? "dialog" : "menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative flex size-11 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        {icon}
        {badge && <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-sky-400" aria-hidden="true" />}
      </button>
      {open && (
        <div
          role={panelRole ?? "menu"}
          aria-label={label}
          className="absolute right-0 top-[calc(100%+6px)] z-30 w-72 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-lg shadow-black/40"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export default function Topbar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-950/95 px-4 backdrop-blur">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Open menu"
        className="flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Search flags and experiments, keyboard shortcut command K"
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-400 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:max-w-xs"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="hidden truncate sm:inline">Search flags…</span>
        <span className="ml-auto hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[11px] text-zinc-400 sm:inline">
          ⌘K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          className="flex h-11 items-center gap-1.5 rounded-lg bg-sky-400 px-3.5 text-sm font-medium text-zinc-950 hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">New flag</span>
        </button>

        <Popover label="Notifications" icon={<Bell className="size-[18px]" aria-hidden="true" />} badge panelRole="region">
          {() => (
            <div>
              <div className="px-2.5 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">Notifications</div>
              <ul>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="rounded-lg px-2.5 py-2 text-sm hover:bg-white/[0.06]">
                    <p className="text-zinc-200">{n.text}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popover>

        <Popover label="Account menu" icon={<OwnerAvatar name="Sam Okafor" seed="sluice-current-user" size={26} />} panelRole="menu">
          {(close) => (
            <div>
              <div className="px-2.5 py-2 text-sm">
                <div className="font-medium text-zinc-100">Sam Okafor</div>
                <div className="text-xs text-zinc-400">sam.okafor@sluice.dev</div>
              </div>
              <div className="my-1 border-t border-white/10" />
              <button
                type="button"
                role="menuitem"
                onClick={close}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-zinc-300 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <User className="size-4" aria-hidden="true" /> Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={close}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-zinc-300 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <Settings className="size-4" aria-hidden="true" /> Settings
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={close}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm text-zinc-300 hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <LogOut className="size-4" aria-hidden="true" /> Sign out
              </button>
            </div>
          )}
        </Popover>
      </div>
    </header>
  );
}
