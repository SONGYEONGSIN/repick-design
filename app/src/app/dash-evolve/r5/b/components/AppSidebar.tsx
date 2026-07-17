"use client";

import { useEffect, useRef, useState } from "react";
import {
  Anchor,
  BarChart3,
  Check,
  ChevronsUpDown,
  Inbox,
  Settings,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Avatar, EyebrowLabel } from "./ui";
import { AGENTS, CURRENT_AGENT_ID, WORKSPACE, WORKSPACES, agentById } from "../lib/data";

const NAV_ITEMS = [
  { id: "inbox", label: "Inbox", icon: Inbox, active: true },
  { id: "contacts", label: "Contacts", icon: Users, active: false },
  { id: "reports", label: "Reports", icon: BarChart3, active: false },
  { id: "automations", label: "Automations", icon: Zap, active: false },
];

/**
 * Workspace-level app shell sidebar (brand lockup + workspace switcher +
 * primary nav + current user). This is distinct from the queue rail that
 * lives *inside* the Inbox content area: this sidebar is white with an
 * indigo active pill and governs cross-product navigation, while the queue
 * rail (see QueueRail.tsx) is a tinted zinc-50 sub-nav scoped to Inbox only.
 */
export default function AppSidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const you = agentById(CURRENT_AGENT_ID)!;
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACE);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSwitcherOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-11 items-center gap-2 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
          <Anchor className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-zinc-900">Quay</span>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="relative px-3 pt-2" ref={switcherRef}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={switcherOpen}
          onClick={() => setSwitcherOpen((v) => !v)}
          className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-left outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white">
            {workspace.name.slice(0, 1)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-900">{workspace.name}</p>
            <p className="truncate text-[11px] text-zinc-500">{workspace.plan}</p>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
        </button>

        {switcherOpen ? (
          <div
            role="listbox"
            aria-label="Switch workspace"
            className="absolute left-3 right-3 z-30 mt-1.5 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
          >
            {WORKSPACES.map((w) => {
              const selected = w.id === workspace.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setWorkspace(w);
                    setSwitcherOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    selected ? "bg-indigo-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-zinc-900">{w.name}</span>
                    <span className="block truncate text-xs text-zinc-500">{w.plan}</span>
                  </span>
                  {selected ? <Check className="h-4 w-4 shrink-0 text-indigo-600" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <nav aria-label="Main" className="flex-1 space-y-0.5 px-3 py-4">
        <EyebrowLabel>Workspace</EyebrowLabel>
        <div className="mt-1.5 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href="#main-content"
                aria-current={item.active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                  item.active ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="mt-5">
          <EyebrowLabel>Manage</EyebrowLabel>
          <div className="mt-1.5 space-y-0.5">
            <a
              href="#main-content"
              className="flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-600 outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-50 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
              Settings
            </a>
          </div>
        </div>
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar avatarId={you.avatarId} name={you.name} size={28} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-900">{you.name}</p>
            <p className="truncate text-[11px] text-zinc-500">{you.role}</p>
          </div>
        </div>
        <p className="sr-only">Other agents on this team: {AGENTS.filter((a) => a.id !== CURRENT_AGENT_ID).map((a) => a.name).join(", ")}</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white lg:block">{content}</aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-900/40"
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-zinc-200 bg-white shadow-lg">{content}</aside>
        </div>
      ) : null}
    </>
  );
}
