"use client";

import Image from "next/image";
import {
  Activity,
  ChevronsUpDown,
  CreditCard,
  Home,
  Puzzle,
  Settings,
  Users,
  Waypoints,
  Workflow,
  X,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  Icon: typeof Home;
  active?: boolean;
  badge?: number;
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Operations",
    items: [
      { id: "overview", label: "Overview", Icon: Home, active: true },
      { id: "workflows", label: "Workflows", Icon: Workflow },
      { id: "executions", label: "Execution log", Icon: Activity },
      { id: "integrations", label: "Integrations", Icon: Puzzle },
    ],
  },
  {
    label: "Organization",
    items: [
      { id: "team", label: "Team members", Icon: Users },
      { id: "billing", label: "Credits & billing", Icon: CreditCard },
      { id: "settings", label: "Settings", Icon: Settings },
    ],
  },
];

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center gap-2 px-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
          <Waypoints className="size-4.5" aria-hidden="true" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-50">Conduit</span>
      </div>

      <details className="mx-3 mb-2 rounded-lg border border-white/10 bg-white/[0.03] open:bg-white/[0.05]">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-400 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 truncate">Acme Workspace</span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
        </summary>
        <div className="border-t border-white/10 p-1.5 text-sm">
          <button
            type="button"
            className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-300 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Acme Workspace
          </button>
          <button
            type="button"
            className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-400 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Acme Staging
          </button>
        </div>
      </details>

      <nav aria-label="Main menu" className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <h2 className="px-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
              {section.label}
            </h2>
            <ul className="mt-1.5 space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={item.active ? "page" : undefined}
                    className={`flex min-h-[40px] items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                      item.active
                        ? "bg-indigo-500/10 text-indigo-300"
                        : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200"
                    }`}
                  >
                    <item.Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <details className="shrink-0 border-t border-white/10 p-2">
        <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-2.5 rounded-lg px-2 py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-400 [&::-webkit-details-marker]:hidden">
          <Image
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&crop=faces"
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full object-cover ring-1 ring-white/10"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-zinc-200">Dowoon Kim</span>
            <span className="block truncate text-xs text-zinc-500">dowoon@acme.io</span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-zinc-500" aria-hidden="true" />
        </summary>
        <div className="mt-1 space-y-0.5 border-t border-white/10 pt-1.5 text-sm">
          <button
            type="button"
            className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-300 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Account settings
          </button>
          <button
            type="button"
            className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-300 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Sign out
          </button>
        </div>
      </details>
    </div>
  );
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-zinc-950 lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
          />
          <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950 shadow-xl">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="absolute top-4 right-3 flex size-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <X className="size-4.5" aria-hidden="true" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
