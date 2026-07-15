"use client";

import Image from "next/image";
import {
  ChartGantt,
  ChevronsUpDown,
  KanbanSquare,
  LayoutDashboard,
  ListTodo,
  Settings,
  Users,
  X,
} from "lucide-react";
import { WORKSPACE, MEMBERS } from "../lib/data";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "timeline", label: "Timeline", icon: ChartGantt, active: true },
  { id: "board", label: "Board", icon: KanbanSquare },
  { id: "tasks", label: "My tasks", icon: ListTodo },
  { id: "team", label: "Team", icon: Users },
];

export default function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const you = MEMBERS[0];

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-11 items-center gap-2 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
          <ChartGantt className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-zinc-900">
          Trackline
        </span>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="px-3 pt-2">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-left outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white">
            FR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-900">
              {WORKSPACE.org}
            </p>
            <p className="truncate text-[11px] text-zinc-500">
              {WORKSPACE.plan}
            </p>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main" className="flex-1 space-y-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href="#main-content"
              aria-current={item.active ? "page" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                item.active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <a
          href="#main-content"
          className="flex items-center gap-2.5 rounded-lg px-2 py-2 outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
        >
          <Image
            src={you.avatar}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-900">
              {you.name}
            </p>
            <p className="truncate text-[11px] text-zinc-500">{you.role}</p>
          </div>
          <Settings className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
        </a>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white lg:block">
        {content}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={onCloseMobile}
            className="absolute inset-0 bg-zinc-900/40"
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-zinc-200 bg-white shadow-lg">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
