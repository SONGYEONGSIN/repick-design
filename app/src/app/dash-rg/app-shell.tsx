"use client";

import {
  Bell,
  Check,
  ChevronsUpDown,
  HelpCircle,
  LogOut,
  Mountain,
  Plus,
  Search,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";
import {
  ACTIVITY,
  BRAND,
  CURRENT_USER,
  NAV_SECTIONS,
  PEOPLE,
  WORKSPACES,
  type Workspace,
} from "./data";
import { Avatar, cx, usePopover } from "./primitives";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION } from "./tokens";

/* ---------------------------------------------------------------------- */
/* 브랜드 로고                                                              */
/* ---------------------------------------------------------------------- */

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className={cx("flex items-center gap-2 rounded-lg", FOCUS_RING)}>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white">
        <Mountain size={18} aria-hidden="true" />
      </span>
      {!compact && <span className={cx("text-base font-semibold tracking-tight", TEXT_PRIMARY)}>{BRAND.wordmark}</span>}
    </a>
  );
}

/* ---------------------------------------------------------------------- */
/* 워크스페이스 스위처                                                       */
/* ---------------------------------------------------------------------- */

export function WorkspaceSwitcher({
  workspace,
  onChange,
}: {
  workspace: Workspace;
  onChange: (w: Workspace) => void;
}) {
  const { open, setOpen, containerRef, triggerRef } = usePopover();
  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex w-full min-h-11 items-center gap-2 rounded-xl border px-2.5 py-2 text-left",
          BORDER,
          "bg-white dark:bg-zinc-900",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-indigo-50 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {workspace.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{workspace.name}</span>
          <span className={cx("block truncate text-xs", TEXT_SECONDARY)}>{workspace.plan}</span>
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" className={TEXT_SECONDARY} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="워크스페이스 선택"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cx(
              "absolute left-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-xl border p-1",
              BORDER,
              "bg-white shadow-lg dark:bg-zinc-900",
            )}
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
                  onChange(w);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? "bg-indigo-50 dark:bg-indigo-500/10" : HOVER_ACTIVE_BG,
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate font-medium", TEXT_PRIMARY)}>{w.name}</span>
                  <span className={cx("block truncate text-xs", TEXT_SECONDARY)}>{w.plan}</span>
                </span>
                {selected && <Check size={16} aria-hidden="true" className="shrink-0 text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
          <div className={cx("mt-1 border-t pt-1", BORDER)}>
            <button
              type="button"
              className={cx(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium",
                "text-indigo-600 dark:text-indigo-400",
                HOVER_ACTIVE_BG,
                TRANSITION,
                FOCUS_RING,
              )}
            >
              <Plus size={16} aria-hidden="true" />
              새 워크스페이스 만들기
            </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 유저 메뉴                                                                */
/* ---------------------------------------------------------------------- */

const USER_MENU_ITEMS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "settings", label: "계정 설정", Icon: Settings },
  { id: "help", label: "도움말 센터", Icon: HelpCircle },
  { id: "logout", label: "로그아웃", Icon: LogOut },
];

export function UserMenu() {
  const { open, setOpen, containerRef, triggerRef } = usePopover();
  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex min-h-11 items-center gap-2.5 rounded-xl border px-2 py-1.5",
          BORDER,
          "bg-white dark:bg-zinc-900",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <Avatar avatarId={CURRENT_USER.avatarId} name={CURRENT_USER.name} size={30} />
        <span className="hidden text-left leading-tight sm:block">
          <span className={cx("block text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</span>
          <span className={cx("block text-xs", TEXT_SECONDARY)}>{CURRENT_USER.role}</span>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="사용자 메뉴"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cx(
              "absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border p-1",
              BORDER,
              "bg-white shadow-lg dark:bg-zinc-900",
            )}
          >
          <div className={cx("border-b px-3 py-2.5", BORDER)}>
            <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
            <p className={cx("truncate text-xs", TEXT_SECONDARY)}>doyoon@nimbuslabs.io</p>
          </div>
          <div className="p-1">
            {USER_MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cx(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm",
                  TEXT_PRIMARY,
                  HOVER_ACTIVE_BG,
                  TRANSITION,
                  FOCUS_RING,
                )}
              >
                <item.Icon size={16} aria-hidden="true" className={TEXT_SECONDARY} />
                {item.label}
              </button>
            ))}
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 알림 패널                                                                */
/* ---------------------------------------------------------------------- */

export function NotificationsPopover() {
  const { open, setOpen, containerRef, triggerRef } = usePopover();
  const items = ACTIVITY.slice(0, 3);
  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "relative grid h-11 w-11 place-items-center rounded-full border",
          BORDER,
          "bg-white dark:bg-zinc-900",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <Bell size={18} aria-hidden="true" className={TEXT_SECONDARY} />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
        <span className="sr-only">알림 (읽지 않음 2개)</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cx(
              "absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border",
              BORDER,
              "bg-white shadow-lg dark:bg-zinc-900",
            )}
          >
          <div className={cx("border-b px-4 py-3", BORDER)}>
            <h2 className={cx("text-sm font-semibold", TEXT_PRIMARY)}>알림</h2>
          </div>
          <ul className={cx("divide-y", BORDER)}>
            {items.map((item) => {
              const person = PEOPLE[item.personId];
              return (
                <li key={item.id} className="flex items-start gap-3 px-4 py-3">
                  <Avatar avatarId={person.avatarId} name={person.name} size={28} />
                  <div className="min-w-0">
                    <p className={cx("text-sm leading-snug", TEXT_PRIMARY)}>
                      <span className="font-medium">{person.name}</span>님이 {item.text}
                    </p>
                    <p className={cx("mt-0.5 text-xs", TEXT_SECONDARY)}>{item.timeLabel}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className={cx("border-t p-2", BORDER)}>
            <a
              href="#activity"
              onClick={() => setOpen(false)}
              className={cx(
                "block rounded-lg px-2.5 py-2 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400",
                HOVER_ACTIVE_BG,
                TRANSITION,
                FOCUS_RING,
              )}
            >
              모든 활동 보기
            </a>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 내비게이션 리스트 (사이드바 + 모바일 드로어 공용)                             */
/* ---------------------------------------------------------------------- */

export function NavList({
  activeId,
  onNavigate,
  layoutScope = "sidebar",
}: {
  activeId: string;
  onNavigate?: () => void;
  /** 사이드바/모바일 드로어가 동시에 마운트되므로 activePill layoutId 충돌을 막기 위한 스코프. */
  layoutScope?: "sidebar" | "drawer";
}) {
  return (
    <nav aria-label="대시보드 섹션">
      {NAV_SECTIONS.map((section) => (
        <div key={section.id} className="mb-5 last:mb-0">
          <p className={cx("mb-1.5 px-2.5 text-[11px] font-semibold uppercase tracking-wider", TEXT_SECONDARY)}>
            {section.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = item.id === activeId;
              if (item.disabled) {
                return (
                  <li key={item.id}>
                    <span
                      aria-disabled="true"
                      className={cx(
                        "flex min-h-11 cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-400 dark:text-zinc-600",
                      )}
                    >
                      <item.Icon size={17} aria-hidden="true" />
                      {item.label}
                      <span className="ml-auto rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                        곧 지원
                      </span>
                    </span>
                  </li>
                );
              }
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "relative flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium",
                      TRANSITION,
                      FOCUS_RING,
                      active
                        ? "text-indigo-700 dark:text-indigo-300"
                        : cx(TEXT_SECONDARY, "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100"),
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`nav-active-pill-${layoutScope}`}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-500/10"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <item.Icon size={17} aria-hidden="true" className="relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    {item.badge ? (
                      <span className="relative z-10 ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/* ---------------------------------------------------------------------- */
/* 전역 검색 입력                                                            */
/* ---------------------------------------------------------------------- */

export function GlobalSearch({
  onOpen,
  triggerRef,
}: {
  /** ⌘K 커맨드 팔레트를 여는 콜백. */
  onOpen: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={16}
        aria-hidden="true"
        className={cx("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2", TEXT_SECONDARY)}
      />
      <button
        ref={triggerRef}
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className={cx(
          "flex h-10 w-full items-center rounded-lg border pl-9 pr-14 text-left text-sm",
          BORDER,
          "bg-zinc-50 dark:bg-zinc-900",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          TEXT_SECONDARY,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        거래, 계좌, 청구서 검색
      </button>
      <kbd
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
          BORDER,
          TEXT_SECONDARY,
          "bg-white dark:bg-zinc-950",
        )}
      >
        ⌘K
      </kbd>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* 모바일 드로어                                                            */
/* ---------------------------------------------------------------------- */

export function MobileDrawer({
  dialogRef,
  activeId,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  activeId: string;
  onClose: () => void;
}) {
  function handleBackdropClick(e: ReactMouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="대시보드 메뉴"
      onClick={handleBackdropClick}
      className={cx(
        "fixed inset-y-0 left-0 m-0 h-full max-h-none w-80 max-w-[85vw] border-none p-0 backdrop:bg-black/40 md:hidden",
        "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
      )}
    >
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
        <div className="flex items-center justify-between">
          <BrandMark />
          <button
            type="button"
            onClick={onClose}
            className={cx("grid h-11 w-11 place-items-center rounded-full border", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
          >
            <X size={20} aria-hidden="true" />
            <span className="sr-only">메뉴 닫기</span>
          </button>
        </div>
        <NavList activeId={activeId} onNavigate={onClose} layoutScope="drawer" />
      </div>
    </dialog>
  );
}
