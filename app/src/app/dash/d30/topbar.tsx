"use client";

import Image from "next/image";
import { Bell, ChevronDown, LogOut, PanelLeft, Plus, Search, Settings2, User } from "lucide-react";
import { useDisclosure } from "./use-disclosure";

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "정하늘님이 디스커버리 콜을 예약했습니다",
    time: "12분 전",
  },
  {
    id: "n2",
    title: "제품 데모 일정이 변경되었습니다 · 배수아",
    time: "1시간 전",
  },
  {
    id: "n3",
    title: "김도윤님이 오늘 일정을 모두 완료했습니다",
    time: "3시간 전",
  },
];

interface TopbarProps {
  onOpenMobileNav: () => void;
  onOpenCommand: () => void;
}

export function Topbar({ onOpenMobileNav, onOpenCommand }: TopbarProps) {
  const notif = useDisclosure<HTMLDivElement>();
  const account = useDisclosure<HTMLDivElement>();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="메뉴 열기"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
      >
        <PanelLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenCommand}
        className="flex h-11 w-full max-w-xs items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-left text-[13px] text-zinc-400 transition-colors hover:border-zinc-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:max-w-sm"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">전체 검색…</span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="hidden h-11 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:flex"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          새 이벤트 타입
        </button>
        <button
          type="button"
          aria-label="새 이벤트 타입 만들기"
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:hidden"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>

        <div ref={notif.ref} className="relative">
          <button
            type="button"
            onClick={() => notif.setOpen(!notif.open)}
            aria-haspopup="true"
            aria-expanded={notif.open}
            aria-label={`알림 ${NOTIFICATIONS.length}개`}
            className="relative flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"
            />
          </button>
          {notif.open ? (
            <div
              role="dialog"
              aria-label="알림"
              className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-3.5 py-2.5">
                <p className="text-[13px] font-semibold text-zinc-900">알림</p>
                <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-indigo-700">
                  {NOTIFICATIONS.length}
                </span>
              </div>
              <ul>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="border-b border-zinc-50 px-3.5 py-2.5 last:border-0">
                    <p className="text-[13px] leading-snug text-zinc-700">{n.title}</p>
                    <p className="mt-0.5 text-[11.5px] text-zinc-400">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div ref={account.ref} className="relative">
          <button
            type="button"
            onClick={() => account.setOpen(!account.open)}
            aria-haspopup="true"
            aria-expanded={account.open}
            className="flex h-11 items-center gap-1.5 rounded-lg pl-0.5 pr-1.5 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Image
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=faces"
              alt="김태오 프로필 사진"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          </button>
          {account.open ? (
            <div
              role="menu"
              aria-label="계정 메뉴"
              className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
            >
              <div className="border-b border-zinc-100 px-3.5 py-2.5">
                <p className="text-[13px] font-medium text-zinc-900">김태오</p>
                <p className="text-[11.5px] text-zinc-500">taeo.kim@slotted.app</p>
              </div>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:bg-zinc-50"
              >
                <User className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                프로필
              </button>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:bg-zinc-50"
              >
                <Settings2 className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                설정
              </button>
              <div className="my-1 border-t border-zinc-100" />
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-rose-600 hover:bg-rose-50 focus-visible:outline-none focus-visible:bg-rose-50"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                로그아웃
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
