"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Plus, Search, Settings, User } from "lucide-react";
import { cn } from "./utils";

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative min-w-0">
      {open ? (
        <div role="search" className="flex h-11 w-56 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 sm:w-72">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="자산, 거래 검색…"
            aria-label="자산, 거래 검색"
            onBlur={() => setOpen(false)}
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500 sm:inline">
            Esc
          </kbd>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-11 w-40 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-left text-sm text-zinc-500 outline-none transition-colors sm:w-64",
            "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          )}
        >
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <span className="min-w-0 flex-1 truncate">검색…</span>
          <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-zinc-500 sm:inline">
            ⌘K
          </kbd>
        </button>
      )}
    </div>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="계정 메뉴 열기"
        className={cn(
          "flex h-11 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 pl-1.5 pr-2 outline-none transition-colors",
          "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-indigo-500/20 text-[11px] font-semibold text-indigo-300">
          김도
        </span>
        <ChevronDown aria-hidden="true" className="size-3.5 text-zinc-500" />
      </button>

      {open ? (
        <ul
          role="menu"
          aria-label="계정 메뉴"
          className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-lg"
        >
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-zinc-300 outline-none hover:bg-white/5 focus-visible:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <User aria-hidden="true" className="size-3.5" /> 프로필
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-zinc-300 outline-none hover:bg-white/5 focus-visible:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <Settings aria-hidden="true" className="size-3.5" /> 설정
            </button>
          </li>
          <li role="none" className="my-1 border-t border-white/5" />
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className="flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-red-400 outline-none hover:bg-white/5 focus-visible:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <LogOut aria-hidden="true" className="size-3.5" /> 로그아웃
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}

export function Topbar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/5 bg-zinc-950/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="메뉴 열기"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 outline-none transition-colors lg:hidden",
          "hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <GlobalSearch />

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className={cn(
            "hidden h-11 items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 text-sm font-semibold text-white outline-none transition-colors sm:flex",
            "hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:bg-indigo-600",
          )}
        >
          <Plus aria-hidden="true" className="size-4" />
          자산 추가
        </button>

        <button
          type="button"
          aria-label="알림 3건, 확인 안 함"
          className={cn(
            "relative flex size-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 outline-none transition-colors",
            "hover:bg-white/5 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          )}
        >
          <Bell aria-hidden="true" className="size-4.5" />
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 flex size-2 rounded-full bg-red-500 ring-2 ring-zinc-950"
          />
        </button>

        <UserMenu />
      </div>
    </header>
  );
}
