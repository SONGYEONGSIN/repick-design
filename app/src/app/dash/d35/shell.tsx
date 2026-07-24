"use client";

import {
  Bell,
  Check,
  ChevronsUpDown,
  CornerDownLeft,
  HelpCircle,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ACCOUNTS,
  BORDER,
  BRAND,
  CATEGORY,
  CURRENT_USER,
  FOCUS_RING,
  HOLDINGS,
  HOVER_ACTIVE_BG,
  NAV_SECTIONS,
  NUM,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TRANSITION,
  cx,
  fmtKRWc,
  unsplashAvatar,
} from "./data";
import { EyebrowLabel } from "./ui";

function useOutsideClose(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  return ref;
}

/* ---- 계좌 스위처 --------------------------------------------------- */
function AccountSwitcher() {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const ref = useOutsideClose(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative px-3 pt-3">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex min-h-11 w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left",
          BORDER,
          "bg-white dark:bg-zinc-900",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-violet-50 text-[11px] font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
          {account.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{account.name}</span>
          <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{account.meta}</span>
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" className={TEXT_CAPTION} />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label="포트폴리오 계좌 선택"
          className={cx("absolute left-3 right-3 top-full z-40 mt-1.5 overflow-hidden rounded-xl border p-1", BORDER, "bg-white shadow-lg dark:bg-zinc-900")}
        >
          {ACCOUNTS.map((a) => {
            const selected = a.id === account.id;
            return (
              <button
                key={a.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setAccount(a);
                  setOpen(false);
                }}
                className={cx(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? "bg-violet-50 dark:bg-violet-500/10" : HOVER_ACTIVE_BG,
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate font-medium", TEXT_PRIMARY)}>{a.name}</span>
                  <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{a.meta}</span>
                </span>
                {selected ? <Check size={16} aria-hidden="true" className="shrink-0 text-violet-600 dark:text-violet-400" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 px-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-violet-600 text-white">
          <BRAND.Icon size={16} aria-hidden="true" strokeWidth={2.25} />
        </span>
        <span className="min-w-0">
          <span className={cx("block text-[15px] font-semibold leading-none tracking-tight", TEXT_PRIMARY)}>{BRAND.name}</span>
          <span className={cx("mt-0.5 block text-[10px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>{BRAND.tagline}</span>
        </span>
      </div>

      <AccountSwitcher />

      <nav aria-label="대시보드 섹션" className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="mb-5 last:mb-0">
            <div className="mb-1.5 px-2.5">
              <EyebrowLabel>{section.title}</EyebrowLabel>
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                if (item.disabled) {
                  return (
                    <li key={item.id}>
                      <span
                        aria-disabled="true"
                        className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-400 dark:text-zinc-500"
                      >
                        <item.Icon size={17} aria-hidden="true" />
                        {item.label}
                        <span className="ml-auto rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                          곧 지원
                        </span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.id}>
                    <a
                      href="#main-content"
                      aria-current={item.active ? "page" : undefined}
                      className={cx(
                        "flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium",
                        TRANSITION,
                        FOCUS_RING,
                        item.active
                          ? "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                          : cx(TEXT_CAPTION, "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100"),
                      )}
                    >
                      <item.Icon size={17} aria-hidden="true" />
                      {item.label}
                      {item.badge ? (
                        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-violet-600 px-1 text-[11px] font-semibold text-white">
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

      <div className={cx("border-t p-3", BORDER)}>
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Image
            src={unsplashAvatar(CURRENT_USER.avatarId, 56)}
            alt={`${CURRENT_USER.name} 프로필 사진`}
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full border border-black/5 object-cover dark:border-white/10"
          />
          <div className="min-w-0 flex-1">
            <p className={cx("truncate text-xs font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
            <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>{CURRENT_USER.role}</p>
          </div>
          <Settings size={15} aria-hidden="true" className={TEXT_CAPTION} />
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className={cx("hidden w-64 shrink-0 border-r lg:block", BORDER, "bg-white dark:bg-zinc-950")}>
        <SidebarContent />
      </aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="메뉴 닫기" onClick={onCloseMobile} className="absolute inset-0 bg-zinc-900/40" />
          <aside className={cx("absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r shadow-lg", BORDER, "bg-white dark:bg-zinc-950")}>
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="메뉴 닫기"
                className={cx("grid h-11 w-11 place-items-center rounded-full border", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="h-[calc(100%-52px)]">
              <SidebarContent />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

/* ---- 상단바 -------------------------------------------------------- */
const NOTIFICATIONS = [
  { id: "n1", text: "BTC 비중이 목표 대비 +2.5%p로 리밸런싱 밴드를 벗어났습니다.", time: "3분 전" },
  { id: "n2", text: "월간 배당 ₩1,840,000이 원화 MMF로 입금되었습니다.", time: "1시간 전" },
  { id: "n3", text: "2분기 세금 리포트 초안이 준비되었습니다.", time: "어제" },
];

export function Topbar({ onOpenPalette, onOpenMobileNav }: { onOpenPalette: () => void; onOpenMobileNav: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useOutsideClose(notifOpen, () => setNotifOpen(false));
  const userRef = useOutsideClose(userOpen, () => setUserOpen(false));

  return (
    <header className={cx("flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4", BORDER, "bg-white/90 backdrop-blur dark:bg-zinc-950/90")}>
      <button
        type="button"
        onClick={onOpenMobileNav}
        aria-label="메뉴 열기"
        className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-lg lg:hidden", TEXT_CAPTION, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
      >
        <Menu size={18} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onOpenPalette}
        aria-haspopup="dialog"
        className={cx(
          "ml-1 flex h-11 flex-1 items-center gap-2 rounded-lg border pl-3 pr-2.5 text-left text-sm sm:max-w-sm",
          BORDER,
          "bg-zinc-50 dark:bg-zinc-900",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          TEXT_CAPTION,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <Search size={16} aria-hidden="true" className="shrink-0" />
        <span className="hidden truncate sm:inline">종목·자산군 검색</span>
        <span
          aria-hidden="true"
          className={cx("ml-auto hidden shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-medium sm:inline-flex", BORDER, "bg-white dark:bg-zinc-950", TEXT_CAPTION)}
        >
          ⌘K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenPalette}
          className={cx(
            "hidden h-11 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium sm:inline-flex",
            "bg-violet-600 text-white hover:bg-violet-500 active:bg-violet-700",
            TRANSITION,
            FOCUS_RING,
          )}
        >
          <Plus size={15} aria-hidden="true" />
          매수 주문
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={notifOpen}
            aria-label="알림 (읽지 않음 3개)"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className={cx("relative grid h-11 w-11 place-items-center rounded-full border", BORDER, "bg-white dark:bg-zinc-900", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
          >
            <Bell size={17} aria-hidden="true" className={TEXT_CAPTION} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" aria-hidden="true" />
          </button>
          {notifOpen ? (
            <div role="menu" aria-label="알림" className={cx("absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border", BORDER, "bg-white shadow-lg dark:bg-zinc-900")}>
              <div className={cx("border-b px-4 py-3", BORDER)}>
                <h2 className={cx("text-sm font-semibold", TEXT_PRIMARY)}>알림</h2>
              </div>
              <ul className={cx("divide-y", BORDER)}>
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-4 py-2.5">
                    <p className={cx("text-sm leading-snug", TEXT_PRIMARY)}>{n.text}</p>
                    <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div ref={userRef} className="relative">
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={userOpen}
            aria-label={`${CURRENT_USER.name} 계정 메뉴`}
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className={cx("flex h-11 items-center gap-2 rounded-full border pl-1 pr-2", BORDER, "bg-white dark:bg-zinc-900", HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
          >
            <Image
              src={unsplashAvatar(CURRENT_USER.avatarId, 60)}
              alt={`${CURRENT_USER.name} 프로필 사진`}
              width={30}
              height={30}
              className="h-[30px] w-[30px] shrink-0 rounded-full object-cover"
            />
            <span className={cx("hidden text-sm font-medium sm:inline", TEXT_PRIMARY)}>{CURRENT_USER.name}</span>
          </button>
          {userOpen ? (
            <div role="menu" aria-label="계정" className={cx("absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border p-1", BORDER, "bg-white shadow-lg dark:bg-zinc-900")}>
              <div className={cx("border-b px-3 py-2.5", BORDER)}>
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
                <p className={cx("truncate text-xs", TEXT_CAPTION)}>{CURRENT_USER.role}</p>
              </div>
              <div className="p-1">
                {[
                  { label: "계정 설정", Icon: Settings },
                  { label: "도움말 센터", Icon: HelpCircle },
                  { label: "로그아웃", Icon: LogOut },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    role="menuitem"
                    onClick={() => setUserOpen(false)}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm", TEXT_PRIMARY, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}
                  >
                    <item.Icon size={16} aria-hidden="true" className={TEXT_CAPTION} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

/* ---- ⌘K 커맨드 팔레트 ---------------------------------------------- */
export function CommandPalette({ onClose, onSelectHolding }: { onClose: () => void; onSelectHolding: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HOLDINGS.filter(
      (h) => !q || h.symbol.toLowerCase().includes(q) || h.name.toLowerCase().includes(q) || CATEGORY[h.category].label.includes(q),
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    setCursor(0);
  }, [query]);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function choose(id: string | undefined) {
    if (!id) return;
    onSelectHolding(id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="명령 팔레트">
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" />
      <div className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl", BORDER, "bg-white dark:bg-zinc-900")}>
        <div className={cx("flex items-center gap-2.5 border-b px-4", BORDER)}>
          <Search size={17} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                choose(results[cursor]?.id);
              }
            }}
            placeholder="종목명, 심볼, 자산군 검색"
            aria-label="검색어"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500", TEXT_PRIMARY)}
          />
          <kbd className={cx("rounded-md border px-1.5 py-0.5 text-[11px] font-medium", BORDER, TEXT_CAPTION)}>Esc</kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2" role="listbox" aria-label="검색 결과">
          {results.length === 0 ? (
            <li className={cx("px-3 py-6 text-center text-sm", TEXT_CAPTION)}>일치하는 종목이 없습니다.</li>
          ) : (
            results.map((h, i) => {
              const meta = CATEGORY[h.category];
              return (
                <li key={h.id} role="option" aria-selected={i === cursor}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => choose(h.id)}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left",
                      TRANSITION,
                      i === cursor ? "bg-violet-50 dark:bg-violet-500/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-800",
                    )}
                  >
                    <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", "bg-zinc-100 dark:bg-zinc-800")}>
                      <meta.Icon size={15} aria-hidden="true" className={meta.arc} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cx("block truncate text-sm font-medium", NUM, TEXT_PRIMARY)}>
                        {h.symbol} <span className="font-normal text-zinc-500 dark:text-zinc-400">{h.name}</span>
                      </span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{meta.label} · 원가 {fmtKRWc(h.cost)}</span>
                    </span>
                    {i === cursor ? <CornerDownLeft size={15} aria-hidden="true" className={TEXT_CAPTION} /> : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
