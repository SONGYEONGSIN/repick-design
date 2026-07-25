"use client";

import { useRef, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Gem,
  LayoutGrid,
  LineChart,
  Settings,
  Star,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import { cn } from "./utils";

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutGrid;
  active?: boolean;
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Main",
    items: [
      { id: "overview", label: "Overview", icon: LayoutGrid, active: true },
      { id: "holdings", label: "Holdings", icon: Wallet },
      { id: "watchlist", label: "Watchlist", icon: Star },
    ],
  },
  {
    label: "Analysis",
    items: [
      { id: "markets", label: "Markets", icon: LineChart },
      { id: "alerts", label: "Price alerts", icon: Bell },
    ],
  },
];

const WORKSPACES = [
  { id: "primary", name: "Main Portfolio", plan: "Pro" },
  { id: "trading", name: "Trading Account", plan: "Pro" },
];

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("primary");
  const ref = useRef<HTMLDivElement>(null);
  const active = WORKSPACES.find((w) => w.id === activeId) ?? WORKSPACES[0];

  return (
    <div className="relative px-3 pb-3" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 text-left transition-colors",
          "hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/20 text-[11px] font-semibold text-indigo-300">
          {active.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-100">{active.name}</span>
        </span>
        <span className="shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          {active.plan}
        </span>
        <ChevronDown aria-hidden="true" className="size-3.5 shrink-0 text-zinc-500" />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Select workspace"
          className="absolute inset-x-3 top-full z-20 mt-1 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg"
        >
          {WORKSPACES.map((ws) => (
            <li key={ws.id}>
              <button
                type="button"
                role="option"
                aria-selected={ws.id === activeId}
                onClick={() => {
                  setActiveId(ws.id);
                  setOpen(false);
                }}
                className="flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-zinc-300 outline-none hover:bg-white/5 focus-visible:bg-white/5"
              >
                <span className="flex-1 truncate">{ws.name}</span>
                {ws.id === activeId ? <Check aria-hidden="true" className="size-3.5 text-indigo-400" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 px-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500">
          <Gem aria-hidden="true" className="size-4 text-white" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-50">Meridian</span>
      </div>

      <div className="pt-3">
        <WorkspaceSwitcher />
      </div>

      <nav aria-label="Main menu" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">{section.label}</p>
            <ul className="mt-1.5 space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!item.active}
                      aria-current={item.active ? "page" : undefined}
                      title={item.active ? undefined : "Coming soon in this demo"}
                      className={cn(
                        "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium outline-none transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                        item.active
                          ? "bg-indigo-500/15 text-indigo-300"
                          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200 disabled:pointer-events-none disabled:opacity-50",
                      )}
                    >
                      <Icon aria-hidden="true" className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
          <Image
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&crop=faces"
            alt="Jordan Lee profile photo"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-zinc-100">Jordan Lee</span>
            <span className="block truncate text-[11.5px] text-zinc-500">Portfolio Manager</span>
          </span>
          <button
            type="button"
            aria-label="Open settings"
            title="Settings"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 outline-none transition-colors",
              "hover:bg-white/5 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
            )}
          >
            <Settings aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-zinc-950 lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-black/60"
          />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-white/5 bg-zinc-950 shadow-xl">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className={cn(
                "absolute right-2 top-2 flex size-11 items-center justify-center rounded-lg text-zinc-500 outline-none transition-colors",
                "hover:bg-white/5 hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400",
              )}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      ) : null}
    </>
  );
}
