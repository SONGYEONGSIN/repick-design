"use client";

import {
  ChevronsUpDown,
  FlaskConical,
  Flag,
  LineChart,
  Settings,
  SplitSquareHorizontal,
  Users2,
  X,
} from "lucide-react";
import { Avatar, EyebrowLabel } from "./ui";
import { CURRENT_USER, WORKSPACE } from "../lib/data";

const NAV_ITEMS = [
  { id: "experiments", label: "Experiments", icon: FlaskConical, active: true },
  { id: "flags", label: "Feature flags", icon: Flag, active: false },
  { id: "metrics", label: "Metrics", icon: LineChart, active: false },
  { id: "audiences", label: "Audiences", icon: Users2, active: false },
];

export default function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-11 items-center gap-2 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
          <SplitSquareHorizontal className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Bisect
        </span>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-400 dark:hover:bg-white/5 lg:hidden"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="px-3 pt-2">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-2 text-left outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
            NL
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
              {WORKSPACE.org}
            </p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{WORKSPACE.plan}</p>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
        </button>
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
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                  item.active
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-zinc-200 p-3 dark:border-white/10">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} size={28} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
              {CURRENT_USER.name}
            </p>
            <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{CURRENT_USER.role}</p>
          </div>
          <Settings className="h-3.5 w-3.5 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-950 lg:block">
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
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-zinc-200 bg-white shadow-lg dark:border-white/10 dark:bg-zinc-950">
            {content}
          </aside>
        </div>
      ) : null}
    </>
  );
}
