"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarCheck2,
  CalendarClock,
  Check,
  ChevronDown,
  House,
  Layers,
  Link2,
  Settings,
  UserCheck,
  X,
} from "lucide-react";
import { useDisclosure } from "./use-disclosure";
import { cn } from "./cn";

interface NavItem {
  id: string;
  label: string;
  icon: typeof House;
  active?: boolean;
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Main",
    items: [
      { id: "overview", label: "Overview", icon: House },
      { id: "bookings", label: "Bookings", icon: CalendarCheck2, active: true },
    ],
  },
  {
    label: "Manage",
    items: [
      { id: "event-types", label: "Event Types", icon: Layers },
      { id: "availability", label: "Team Availability", icon: UserCheck },
      { id: "integrations", label: "Calendar Integrations", icon: Link2 },
    ],
  },
];

const WORKSPACES = [
  { id: "growth", name: "Growth Team", plan: "Pro" },
  { id: "success", name: "Customer Success", plan: "Pro" },
];

function WorkspaceSwitcher() {
  const { open, setOpen, ref } = useDisclosure<HTMLDivElement>();
  const [activeId, setActiveId] = useState("growth");
  const active = WORKSPACES.find((w) => w.id === activeId) ?? WORKSPACES[0];

  return (
    <div ref={ref} className="relative px-3 pb-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-11 w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-left transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-[11px] font-semibold text-indigo-700">
          {active.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-900">
            {active.name}
          </span>
        </span>
        <span className="shrink-0 rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
          {active.plan}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Select workspace"
          className="absolute inset-x-3 top-full z-20 mt-1 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
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
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:bg-zinc-50"
              >
                <span className="flex-1 truncate">{ws.name}</span>
                {ws.id === activeId ? (
                  <Check className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                ) : null}
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
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-zinc-100 px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <CalendarClock className="h-4 w-4 text-white" aria-hidden="true" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-900">
          Slotted
        </span>
      </div>

      <div className="pt-3">
        <WorkspaceSwitcher />
      </div>

      <nav aria-label="Main menu" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
              {section.label}
            </p>
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
                        "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
                        item.active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-zinc-100 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
          <Image
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=faces"
            alt="Taeo Kim profile photo"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-zinc-900">
              Taeo Kim
            </span>
            <span className="block truncate text-[11.5px] text-zinc-500">
              Workspace Admin
            </span>
          </span>
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-900/30"
          />
          <div className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            <SidebarContent />
          </div>
        </div>
      ) : null}
    </>
  );
}
