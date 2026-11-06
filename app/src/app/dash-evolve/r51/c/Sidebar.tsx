"use client";

import { Check, ChevronsUpDown, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { BRAND, CURRENT_USER, NAV_SECTIONS, WORKSPACES } from "./data";
import { ACCENT_SUBTLE, ACCENT_TEXT, BORDER, FOCUS, HOVER_BG, PANEL_BG, SURFACE_INSET, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx, displayMonoStyle } from "./tokens";
import { Avatar, Eyebrow, useOutsideClose } from "./ui";

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
        {/*
          `min-w-0 flex-1` lets the label truncate instead of forcing this flex row wider than its
          parent — but that alone is not enough. The house bug: if THIS wrapper (the `<aside>`'s one
          child) had no explicit width of its own, a `min-width:auto` reset inside it would not
          propagate across the container boundary, and a 50+ char workspace name would blow out the
          fixed-width rail anyway. `SidebarBody` below carries an explicit `w-full` for exactly that
          reason — this `truncate` is necessary but not sufficient on its own.
        */}
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{ws.name}</span>
          <span className={cx("block truncate text-[11px] font-normal", TEXT_AUX)}>{ws.plan}</span>
        </span>
        <ChevronsUpDown size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
      </button>

      {open ? (
        <div role="listbox" aria-label="Select workspace" className={cx("absolute left-3 right-3 top-full z-40 mt-1.5 rounded-xl border p-1 shadow-xl", BORDER, PANEL_BG)}>
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
                  <span className={cx("block truncate text-sm font-medium", selected ? "text-green-800" : TEXT_PRIMARY)}>{w.name}</span>
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
    // Explicit `w-full`: the fix for the sidebar-rail-overflow bug (see WorkspaceSwitcher comment
    // above). Without it this wrapper can float wider than the rail even once every label inside
    // truncates correctly on its own.
    <div className="flex h-full w-full min-w-0 flex-col">
      <div className="flex h-11 shrink-0 items-center gap-2 px-4">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[9px] bg-green-700 text-white">
          <BRAND.Icon size={16} aria-hidden="true" strokeWidth={2.25} />
        </span>
        <span className={cx("text-[15px] font-semibold leading-none tracking-tight", TEXT_PRIMARY)} style={displayMonoStyle}>
          {BRAND.name}
        </span>
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
                        <span className={cx("ml-auto rounded-full border px-1.5 py-0.5 text-[10px] font-medium", BORDER, SURFACE_INSET, TEXT_AUX)}>Soon</span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={item.active ? "page" : undefined}
                      className={cx(
                        "flex min-h-11 items-center gap-3 rounded-lg px-2.5 py-2 text-sm",
                        TRANSITION,
                        FOCUS,
                        item.active ? cx(ACCENT_SUBTLE, "font-semibold") : cx("font-medium", TEXT_AUX, "hover:bg-zinc-100 hover:text-zinc-900"),
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
          <Avatar name={CURRENT_USER.name} size={28} />
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
      <aside className={cx("hidden w-64 shrink-0 border-r lg:sticky lg:top-0 lg:block lg:h-dvh", BORDER, PANEL_BG)}>
        <SidebarBody />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={onCloseMobile} className="absolute inset-0 bg-black/40" />
          <aside className={cx("absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r shadow-2xl", BORDER, PANEL_BG)}>
            <div className="flex justify-end p-2">
              <button type="button" onClick={onCloseMobile} className={cx("grid h-11 w-11 place-items-center rounded-full border text-sm font-medium", BORDER, HOVER_BG, TRANSITION, FOCUS)}>
                <X size={18} aria-hidden="true" className={TEXT_AUX} />
                <span className="sr-only">Close navigation</span>
              </button>
            </div>
            <div className="h-[calc(100%-52px)]">
              {/* Same component, same real anchors as the desktop mount above — a nav that only
                  works on one of the two mounts is the house bug class this avoids. */}
              <SidebarBody />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
