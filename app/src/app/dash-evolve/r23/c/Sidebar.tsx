"use client";

import Image from "next/image";
import { useState, type ComponentType } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  PackageSearch,
  ClipboardCheck,
  BarChart3,
  Settings,
  Building2,
  User,
  SlidersHorizontal,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import { Popover, PopoverItem, FOCUS } from "./ui";
import { avatarUrl } from "./data";

interface NavItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
}

const NAV: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Schedule", icon: CalendarDays, active: true },
  { label: "Inspectors", icon: Users },
  { label: "Inventory Queue", icon: PackageSearch },
  { label: "Grading Backlog", icon: ClipboardCheck },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const WORKSPACES = ["Seoul Metro Hub", "Busan Coastal", "Incheon Air Cargo"];

export const SIDEBAR_WIDTH = 260;

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  return (
    <>
      {open ? (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-900/30 lg:hidden"
        />
      ) : null}

      <aside
        style={{ width: SIDEBAR_WIDTH }}
        className={`fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-5">
          <div className="flex items-baseline gap-1.5" style={{ fontFamily: "var(--font-display-mono)" }}>
            <span className="text-[17px] font-medium text-zinc-900">repick</span>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-teal-700">ops</span>
          </div>
          <button onClick={onClose} className={`rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 lg:hidden ${FOCUS}`} aria-label="Close navigation">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-zinc-100 px-3 py-3">
          <Popover
            width="w-56"
            trigger={({ toggle, open: isOpen }) => (
              <button
                type="button"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className={`flex h-11 w-full items-center gap-2.5 rounded-lg border border-zinc-200 px-3 text-left hover:bg-zinc-50 ${FOCUS}`}
              >
                <Building2 className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-zinc-800">{workspace}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
              </button>
            )}
          >
            {(close) => (
              <div>
                <p className="px-2.5 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
                  Switch workspace
                </p>
                {WORKSPACES.map((w) => (
                  <PopoverItem
                    key={w}
                    icon={<Building2 className="h-3.5 w-3.5" aria-hidden />}
                    onClick={() => {
                      setWorkspace(w);
                      close();
                    }}
                  >
                    {w}
                  </PopoverItem>
                ))}
              </div>
            )}
          </Popover>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3" aria-label="Primary">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={item.active ? "page" : undefined}
                className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-colors ${FOCUS} ${
                  item.active ? "bg-teal-50 text-teal-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-100 p-3">
          <Popover
            width="w-56"
            trigger={({ toggle, open: isOpen }) => (
              <button
                type="button"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className={`flex h-12 w-full items-center gap-2.5 rounded-lg px-2 text-left hover:bg-zinc-50 ${FOCUS}`}
              >
                <Image
                  src={avatarUrl("repick-jordan-ahn", 64)}
                  alt="Jordan Ahn avatar"
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-zinc-900">Jordan Ahn</span>
                  <span className="block truncate text-[11px] text-zinc-500">Logistics Ops Lead</span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
              </button>
            )}
          >
            {(close) => (
              <div>
                <PopoverItem icon={<User className="h-3.5 w-3.5" aria-hidden />} onClick={close}>
                  Profile
                </PopoverItem>
                <PopoverItem icon={<SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />} onClick={close}>
                  Preferences
                </PopoverItem>
                <PopoverItem icon={<LogOut className="h-3.5 w-3.5" aria-hidden />} onClick={close}>
                  Sign out
                </PopoverItem>
              </div>
            )}
          </Popover>
        </div>
      </aside>
    </>
  );
}
