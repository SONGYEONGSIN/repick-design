"use client";

import { useState } from "react";
import { Bell, Download, Menu, Search } from "lucide-react";
import { cn } from "../lib/cn";

interface TopbarProps {
  onOpenMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
}

export function Topbar({ onOpenMobileSidebar, onOpenCommandPalette }: TopbarProps) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-white/10 dark:bg-zinc-950/95">
      <button
        type="button"
        onClick={onOpenMobileSidebar}
        aria-label="메뉴 열기"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-300 dark:hover:bg-white/10 lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="flex h-11 min-w-0 flex-1 max-w-sm items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-[13px] text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate">코호트·지표·이벤트 검색</span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-300 bg-white px-1.5 py-0.5 font-sans text-[10.5px] font-medium text-zinc-500 sm:inline-flex dark:border-white/20 dark:bg-white/10 dark:text-zinc-400">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 sm:flex"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          리포트 내보내기
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((v) => !v);
              setAvatarOpen(false);
            }}
            aria-expanded={notifOpen}
            aria-label="알림"
            className="relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            <Bell className="h-4.5 w-4.5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-zinc-900"
            >
              <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                알림
              </p>
              <div className="rounded-md px-2.5 py-2 text-[12.5px] text-zinc-600 dark:text-zinc-300">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">6/1 코호트 W6 리텐션 급락</p>
                <p className="mt-0.5 text-zinc-500 dark:text-zinc-400">전주 대비 4.1%p 하락 — 확인 필요</p>
              </div>
              <div className="rounded-md px-2.5 py-2 text-[12.5px] text-zinc-600 dark:text-zinc-300">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">주간 리포트 생성 완료</p>
                <p className="mt-0.5 text-zinc-500 dark:text-zinc-400">7월 3주차 리텐션 요약 PDF 준비됨</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAvatarOpen((v) => !v);
              setNotifOpen(false);
            }}
            aria-expanded={avatarOpen}
            aria-label="계정 메뉴"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              avatarOpen && "ring-2 ring-indigo-500",
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=faces"
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          </button>
          {avatarOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-white/10 dark:bg-zinc-900"
            >
              <p className="truncate px-2.5 pb-0.5 pt-2 text-[13px] font-medium text-zinc-900 dark:text-zinc-50">
                Dana Whitfield
              </p>
              <p className="truncate px-2.5 pb-1.5 text-[12px] text-zinc-500 dark:text-zinc-400">
                dana.whitfield@foothold.io
              </p>
              <div className="my-1 h-px bg-zinc-100 dark:bg-white/10" />
              <a
                href="#"
                role="menuitem"
                className="block rounded-md px-2.5 py-1.5 text-[12.5px] text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/5"
              >
                계정 설정
              </a>
              <a
                href="#"
                role="menuitem"
                className="block rounded-md px-2.5 py-1.5 text-[12.5px] text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-white/5"
              >
                로그아웃
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
