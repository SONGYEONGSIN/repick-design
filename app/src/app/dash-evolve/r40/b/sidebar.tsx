"use client";

import {
  Building2,
  ChevronsUpDown,
  ClipboardList,
  FileText,
  ListChecks,
  LogOut,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { CURRENT_USER, WORKSPACES } from "./data";

interface NavItem {
  label: string;
  icon: LucideIcon;
  active: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Scorecards", icon: ClipboardList, active: true },
  { label: "Shortlists", icon: ListChecks, active: false },
  { label: "Suppliers Directory", icon: Building2, active: false },
  { label: "Contracts", icon: FileText, active: false },
];

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
        <Target className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg font-semibold leading-tight text-zinc-900 [font-family:var(--font-display-wide)]">
          Calibre
        </p>
        <p className="truncate text-xs font-normal text-zinc-500">Supplier Intelligence</p>
      </div>
    </div>
  );
}

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  return (
    <div className="relative px-2">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-left motion-safe:transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700">
          {WORKSPACES[index]}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label="Switch workspace"
          className="absolute left-2 right-2 top-full z-20 mt-1 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {WORKSPACES.map((ws, i) => (
            <li key={ws} role="option" aria-selected={i === index}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-normal motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                  i === index ? "bg-rose-50 text-rose-700 font-medium" : "text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {ws}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1 px-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.label}>
            <button
              type="button"
              aria-current={item.active ? "page" : undefined}
              onClick={onNavigate}
              className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                item.active ? "bg-rose-50 text-rose-700" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function UserFooter() {
  return (
    <div className="flex items-center gap-2.5 border-t border-zinc-200 px-4 py-3">
      <Image
        src={CURRENT_USER.avatarUrl}
        alt={CURRENT_USER.name}
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900">{CURRENT_USER.name}</p>
        <p className="truncate text-xs font-normal text-zinc-500">{CURRENT_USER.role}</p>
      </div>
      <button
        type="button"
        aria-label="Settings"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 motion-safe:transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Sign out"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 motion-safe:transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-4 bg-white py-4">
      <BrandLockup />
      <WorkspaceSwitcher />
      <nav aria-label="Primary">
        <NavList onNavigate={onNavigate} />
      </nav>
      <div className="mt-auto">
        <UserFooter />
      </div>
    </div>
  );
}
