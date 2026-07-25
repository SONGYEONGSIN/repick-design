"use client";

import Image from "next/image";
import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-white/10 bg-zinc-950/85 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        className="flex min-h-[44px] flex-1 items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-500 transition-colors hover:border-white/20 hover:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 sm:max-w-xs"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">Search workflows, executions, integrations</span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="hidden min-h-[44px] items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 sm:inline-flex"
        >
          <Plus className="size-4" aria-hidden="true" />
          New workflow
        </button>

        <details className="relative">
          <summary
            aria-label="3 notifications"
            className="relative flex min-h-[44px] min-w-[44px] cursor-pointer list-none items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 [&::-webkit-details-marker]:hidden"
          >
            <Bell className="size-4.5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.5 flex size-2 items-center justify-center rounded-full bg-rose-400 ring-2 ring-zinc-950"
            />
          </summary>
          <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-white/10 bg-zinc-900 p-1.5 text-sm shadow-xl">
            <p className="px-2.5 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">3 notifications</p>
            <p className="rounded-lg px-2.5 py-2 text-zinc-300">
              Failure rate spiked in the Stripe payment webhook workflow.
            </p>
            <p className="rounded-lg px-2.5 py-2 text-zinc-300">Credit usage for this billing cycle has exceeded 90%.</p>
            <p className="rounded-lg px-2.5 py-2 text-zinc-300">Nightly database backup completed successfully.</p>
          </div>
        </details>

        <details className="relative">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-lg py-1 pr-1.5 pl-1 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 [&::-webkit-details-marker]:hidden">
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&crop=faces"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full object-cover ring-1 ring-white/10"
            />
            <ChevronDown className="hidden size-3.5 text-zinc-500 sm:block" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 z-40 mt-2 w-48 rounded-xl border border-white/10 bg-zinc-900 p-1.5 text-sm shadow-xl">
            <p className="truncate px-2.5 py-1.5 text-xs text-zinc-500">dowoon@acme.io</p>
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
    </header>
  );
}
