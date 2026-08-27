"use client";

import { Check, ChevronsUpDown, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BRAND, CURRENT_USER, NAV_SECTIONS, WORKSPACES } from "./data";
import { ACCENT_SUBTLE, ACCENT_TEXT, BORDER, FOCUS, HOVER_BG, PANEL_BG, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Eyebrow, useOutsideClose } from "./ui";

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
        className={cx("flex h-11 w-full items-center gap-2 rounded-xl border px-2.5 text-left", BORDER, SURFACE_INSET, HOVER_BG, TRANSITION, FOCUS)}
      >
        <span className={cx("grid h-7 w-7 shrink-0 place-items-center rounded-md text-[11px] font-semibold", ACCENT_SUBTLE)}>{ws.name.slice(0, 1)}</span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{ws.name}</span>
          <span className={cx("block truncate text-[11px] font-normal", TEXT_MUTED)}>{ws.plan}</span>
        </span>
        <ChevronsUpDown size={15} aria-hidden="true" className={TEXT_AUX} />
      </button>

      {open ? (
        <div role="listbox" aria-label="Select workspace" className={cx("absolute left-3 right-3 top-full z-40 mt-1.5 rounded-xl border p-1", BORDER, PANEL_BG, "shadow-xl shadow-black/40")}>
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
                className={cx("flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left", TRANSITION, FOCUS, selected ? ACCENT_SUBTLE : HOVER_BG)}
              >
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate text-sm font-medium", selected ? "text-blue-400" : TEXT_PRIMARY)}>{w.name}</span>
                  <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>{w.plan}</span>
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

function SidebarBody() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 px-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-blue-700 text-white">
          <BRAND.Icon size={16} aria-hidden="true" strokeWidth={2.25} />
        </span>
        <span className={cx("text-[15px] font-semibold leading-none tracking-tight", TEXT_PRIMARY)}>{BRAND.name}</span>
      </div>

      <WorkspaceSwitcher />

      <nav aria-label="Console sections" className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className="mb-5 last:mb-0">
            <div className="mb-1.5 px-2.5">
              <Eyebrow>{section.title}</Eyebrow>
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                if (item.disabled) {
                  return (
                    <li key={item.id}>
                      <span aria-disabled="true" className={cx("flex min-h-11 cursor-not-allowed items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium", TEXT_AUX)}>
                        <item.Icon size={17} aria-hidden="true" />
                        {item.label}
                        <span className={cx("ml-auto rounded-full border px-1.5 py-0.5 text-[10px] font-medium", BORDER, SURFACE_INSET, TEXT_MUTED)}>Soon</span>
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
                        "flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                        TRANSITION,
                        FOCUS,
                        item.active ? cx(ACCENT_SUBTLE, "font-semibold") : cx("font-medium", TEXT_AUX, "hover:bg-white/[0.06] hover:text-zinc-50"),
                      )}
                    >
                      <item.Icon size={17} aria-hidden="true" />
                      {item.label}
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
            className="h-7 w-7 shrink-0 rounded-full border border-white/10 bg-white/5 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className={cx("truncate text-xs font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
            <p className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{CURRENT_USER.role}</p>
          </div>
          <SlidersHorizontal size={15} aria-hidden="true" className={TEXT_AUX} />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className={cx("hidden w-64 shrink-0 border-r lg:block", BORDER, PANEL_BG)}>
        <SidebarBody />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={onCloseMobile} className="absolute inset-0 bg-black/60" />
          <aside className={cx("absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r shadow-2xl shadow-black/40", BORDER, PANEL_BG)}>
            <div className="flex justify-end p-2">
              <button type="button" onClick={onCloseMobile} className={cx("grid h-11 w-11 place-items-center rounded-full border text-sm font-medium", BORDER, HOVER_BG, TRANSITION, FOCUS)}>
                <X size={18} aria-hidden="true" className={TEXT_AUX} />
                <span className="sr-only">Close navigation</span>
              </button>
            </div>
            <div className="h-[calc(100%-52px)]">
              <SidebarBody />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
