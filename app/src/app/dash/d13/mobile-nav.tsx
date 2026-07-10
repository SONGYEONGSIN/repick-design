"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  current?: boolean;
}

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const dialogId = useId();

  useEffect(() => {
    if (!open) return;
    firstItemRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
      >
        <Menu aria-hidden="true" className="h-5 w-5" />
        <span className="sr-only">메뉴 열기</span>
      </button>

      {open ? (
        <div id={dialogId} role="dialog" aria-modal="true" aria-label="메뉴" className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="메뉴 닫기"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 bg-[var(--ink)]/40"
          />
          <div className="relative flex h-full w-72 max-w-[80vw] flex-col gap-6 border-l border-[var(--line)] bg-[var(--cream)] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-[var(--ink-soft)]">메뉴</span>
              <button
                type="button"
                onClick={close}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--ink)] hover:bg-[var(--bone)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
              >
                <X aria-hidden="true" className="h-5 w-5" />
                <span className="sr-only">메뉴 닫기</span>
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {items.map((item, index) => (
                <li key={item.label}>
                  {item.current ? (
                    <a
                      ref={index === 0 ? firstItemRef : undefined}
                      href={item.href ?? "#main-content"}
                      aria-current="page"
                      className="block rounded-md px-3 py-3 font-[family-name:var(--font-display)] text-lg italic text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="flex items-center justify-between px-3 py-3 text-sm text-[var(--ink-soft)]">
                      {item.label}
                      <span className="text-xs text-[var(--ink-soft)]">준비중</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
