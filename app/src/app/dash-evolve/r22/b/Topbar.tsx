"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, Search, Plus, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { KeyCap } from "./ui";

export function Topbar({ onOpenMenu, onOpenPalette }: { onOpenMenu: () => void; onOpenPalette: () => void }) {
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open menu"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 lg:hidden"
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 w-full max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 outline-none transition-colors hover:border-zinc-300 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
      >
        <Search size={15} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">Search services, edges…</span>
        <span className="sr-only sm:not-sr-only">
          <KeyCap>⌘</KeyCap> <KeyCap>K</KeyCap>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 text-sm font-semibold text-white outline-none transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 sm:flex"
        >
          <Plus size={16} aria-hidden="true" />
          Add service
        </button>

        <button
          type="button"
          aria-label="Notifications, 3 unread"
          className="relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
        >
          <Bell size={17} aria-hidden="true" />
          <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAccountOpen((v) => !v)}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
            className="flex h-11 items-center gap-1.5 rounded-lg pl-1 pr-2 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
          >
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&auto=format"
              alt=""
              width={30}
              height={30}
              className="h-[30px] w-[30px] rounded-full object-cover"
            />
            <ChevronDown size={14} className="text-zinc-500" aria-hidden="true" />
          </button>
          {accountOpen && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                onClick={() => setAccountOpen(false)}
                className="fixed inset-0 z-30 cursor-default"
              />
              <div
                role="menu"
                aria-label="Account"
                className="absolute right-0 top-[calc(100%+6px)] z-40 w-48 overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-md"
              >
                {[
                  { label: "Profile", icon: User },
                  { label: "Settings", icon: Settings },
                  { label: "Sign out", icon: LogOut },
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="flex h-9 w-full items-center gap-2.5 px-3 text-sm text-zinc-700 outline-none hover:bg-zinc-50 focus-visible:bg-zinc-50"
                  >
                    <Icon size={15} className="text-zinc-500" aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
