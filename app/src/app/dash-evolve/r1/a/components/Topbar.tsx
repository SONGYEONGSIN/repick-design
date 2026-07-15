"use client";

import Image from "next/image";
import { Bell, Menu, Plus, Search } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  onOpenPalette: () => void;
}

export default function Topbar({ onMenuClick, onOpenPalette }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
        className="flex size-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        className="flex h-11 flex-1 items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:max-w-sm"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-left">이벤트, 사용자, 소스 검색</span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:inline-flex"
        >
          <Plus className="size-4" aria-hidden="true" />
          이벤트 생성
        </button>

        <details className="relative">
          <summary
            aria-label="알림 3개"
            className="relative flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 [&::-webkit-details-marker]:hidden"
          >
            <Bell className="size-4.5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white"
            />
          </summary>
          <div className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-1.5 text-sm shadow-lg">
            <p className="px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              알림 3건
            </p>
            <p className="rounded-lg px-2.5 py-2 text-zinc-600">
              결제 웹훅 처리 워크플로에서 실패율이 급증했습니다.
            </p>
            <p className="rounded-lg px-2.5 py-2 text-zinc-600">이번 결제 주기 이벤트 사용량이 78%에 도달했습니다.</p>
            <p className="rounded-lg px-2.5 py-2 text-zinc-600">Snowflake 목적지 동기화가 완료됐습니다.</p>
          </div>
        </details>

        <details className="relative">
          <summary className="flex h-11 cursor-pointer list-none items-center rounded-lg p-1.5 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 [&::-webkit-details-marker]:hidden">
            <Image
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=64&h=64&fit=crop&crop=faces"
              alt="김도윤 계정 메뉴"
              width={32}
              height={32}
              className="size-8 rounded-full object-cover ring-1 ring-zinc-200"
            />
          </summary>
          <div className="absolute right-0 z-40 mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 text-sm shadow-lg">
            <p className="truncate px-2.5 py-1.5 text-xs text-zinc-500">dowoon@acme.io</p>
            <button
              type="button"
              className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-600 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              계정 설정
            </button>
            <button
              type="button"
              className="flex min-h-[36px] w-full items-center rounded-md px-2.5 text-left text-zinc-600 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              로그아웃
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
