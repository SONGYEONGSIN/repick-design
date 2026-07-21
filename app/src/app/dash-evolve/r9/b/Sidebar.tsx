"use client";

import { Check, ChevronsUpDown, Settings, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BRAND, BrandIcon, CURRENT_USER, NAV_SECTIONS, WORKSPACES, unsplashAvatar } from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
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

function WorkspaceSwitcher() {
  const [open, setOpen] = useState(false);
  const [ws, setWs] = useState(WORKSPACES[0]);
  const ref = useOutsideClose(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative px-3 pt-3">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cx(
          "flex h-11 w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left",
          BORDER,
          "bg-white dark:bg-zinc-900",
          HOVER_ACTIVE_BG,
          TRANSITION,
          FOCUS_RING,
        )}
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-indigo-50 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          {ws.name.slice(0, 1)}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{ws.name}</span>
          <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{ws.plan}</span>
        </span>
        <ChevronsUpDown size={16} aria-hidden="true" className={TEXT_CAPTION} />
      </button>

      {open ? (
        <div role="listbox" aria-label="워크스페이스 선택" className={cx("absolute left-3 right-3 top-full z-40 mt-1.5 overflow-hidden rounded-xl border p-1", BORDER, "bg-white shadow-lg dark:bg-zinc-900")}>
          {WORKSPACES.map((w) => {
            const selected = w.id === ws.id;
            return (
              <button
                key={w.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setWs(w);
                  setOpen(false);
                }}
                className={cx(
                  "flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left",
                  TRANSITION,
                  FOCUS_RING,
                  selected ? "bg-indigo-50 dark:bg-indigo-500/10" : HOVER_ACTIVE_BG,
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{w.name}</span>
                  <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{w.plan}</span>
                </span>
                {selected && <Check size={16} aria-hidden="true" className="shrink-0 text-indigo-600 dark:text-indigo-400" />}
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
      <div className="flex h-11 shrink-0 items-center gap-2 px-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px] bg-indigo-600 text-white">
          <BrandIcon size={16} aria-hidden="true" strokeWidth={2.25} />
        </span>
        <span className={cx("text-[15px] font-semibold leading-none tracking-tight", TEXT_PRIMARY)}>{BRAND.name}</span>
      </div>

      <WorkspaceSwitcher />

      <nav aria-label="대시보드 섹션" className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
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
                      <span aria-disabled="true" className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <item.Icon size={17} aria-hidden="true" />
                        {item.label}
                        <span className="ml-auto rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">곧 지원</span>
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
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
                          : cx(TEXT_CAPTION, "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-zinc-100"),
                      )}
                    >
                      <item.Icon size={17} aria-hidden="true" />
                      {item.label}
                      {item.badge ? (
                        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-semibold text-white">{item.badge}</span>
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

export default function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
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
              <button type="button" onClick={onCloseMobile} aria-label="메뉴 닫기" className={cx("grid h-11 w-11 place-items-center rounded-full border", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
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
