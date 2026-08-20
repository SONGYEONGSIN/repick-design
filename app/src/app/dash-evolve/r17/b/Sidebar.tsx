"use client";

import { CalendarRange, Check, ChevronsUpDown, Settings2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BRAND, CURRENT_USER, NAV_SECTIONS, WORKSPACES } from "./data";
import { ACCENT_SUBTLE, ACCENT_TEXT, BORDER, FOCUS, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel, useOutsideClose } from "./ui";

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
        className={cx("flex h-11 w-full items-center gap-2 rounded-xl border px-2.5 text-left", BORDER, "bg-white", HOVER_ACTIVE_BG, TRANSITION, FOCUS)}
      >
        <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold", ACCENT_SUBTLE)} aria-hidden="true">
          T4
        </span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-[13px] font-medium leading-tight", TEXT_PRIMARY)}>{ws.name}</span>
          <span className={cx("mt-0.5 block truncate text-[11px] font-normal leading-tight", TEXT_CAPTION)}>{ws.plan}</span>
        </span>
        <ChevronsUpDown size={15} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Select terminal workspace"
          className={cx("absolute left-3 right-3 top-full z-40 mt-1.5 overflow-hidden rounded-xl border p-1", BORDER, "bg-white shadow-lg shadow-zinc-950/10")}
        >
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
                className={cx("flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left", TRANSITION, FOCUS, selected ? ACCENT_SUBTLE : HOVER_ACTIVE_BG)}
              >
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate text-[13px] font-medium", TEXT_PRIMARY)}>{w.name}</span>
                  <span className={cx("block truncate text-[11px] font-normal", TEXT_CAPTION_MUTED)}>{w.plan}</span>
                </span>
                {selected ? <Check size={15} aria-hidden="true" className={cx("shrink-0", ACCENT_TEXT)} /> : null}
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
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-700 text-white" aria-hidden="true">
          <CalendarRange size={16} strokeWidth={2.25} />
        </span>
        <span className={cx("text-[15px] font-semibold leading-none tracking-tight", TEXT_PRIMARY)}>{BRAND.name}</span>
      </div>

      <WorkspaceSwitcher />

      <nav aria-label="Dashboard sections" className={cx("flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]", FOCUS)}>
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
                      <span aria-disabled="true" className={cx("flex min-h-11 cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium", TEXT_CAPTION_MUTED)}>
                        <item.Icon size={16} aria-hidden="true" className="shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        <span className={cx("shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium", TEXT_CAPTION_MUTED)}>Soon</span>
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
                        "flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-[13px]",
                        TRANSITION,
                        FOCUS,
                        item.active ? cx(ACCENT_SUBTLE, "font-semibold") : cx("font-medium", TEXT_CAPTION_MUTED, "hover:bg-zinc-100 hover:text-zinc-900"),
                      )}
                    >
                      <item.Icon size={16} aria-hidden="true" className="shrink-0" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
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
            src={`https://images.unsplash.com/photo-${CURRENT_USER.avatarId}?w=56&h=56&fit=crop&crop=faces`}
            alt={`${CURRENT_USER.name} profile photo`}
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full border border-zinc-200 bg-zinc-100 object-cover"
          />
          <span className="min-w-0 flex-1">
            <span className={cx("block truncate text-xs font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</span>
            <span className={cx("block truncate text-[11px] font-normal", TEXT_CAPTION)}>{CURRENT_USER.role}</span>
          </span>
          <Settings2 size={15} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className={cx("hidden w-64 shrink-0 border-r lg:block", BORDER, "bg-white")}>
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" onClick={onCloseMobile} className="absolute inset-0 bg-zinc-950/40" />
          <aside className={cx("absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r shadow-xl shadow-zinc-950/10", BORDER, "bg-white")}>
            <div className="flex shrink-0 justify-end p-2">
              <button
                type="button"
                onClick={onCloseMobile}
                className={cx("grid h-11 w-11 place-items-center rounded-full border", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS)}
              >
                <X size={18} aria-hidden="true" className={TEXT_CAPTION} />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <SidebarContent />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
