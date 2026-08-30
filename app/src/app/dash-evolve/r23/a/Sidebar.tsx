"use client";

import Image from "next/image";
import { Inbox, ShieldCheck, Users, BarChart3, Settings, X, LogOut, Building2 } from "lucide-react";
import { CURRENT_AGENT } from "./data";
import { Popover, PopoverItem, ChevronToggle, FOCUS_DARK, cx } from "./ui";

const NAV = [
  { label: "Disputes", icon: Inbox, active: true },
  { label: "Grading audits", icon: ShieldCheck, active: false },
  { label: "Sellers", icon: Users, active: false },
  { label: "Reports", icon: BarChart3, active: false },
];

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-950/40 lg:hidden"
        />
      )}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 transition-transform duration-200 motion-reduce:transition-none lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 px-5 pt-5">
          <div className="min-w-0">
            <p className="text-[20px] font-semibold leading-none text-white" style={{ fontFamily: "var(--font-display-grotesk)" }}>
              repick
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Trust Console</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className={cx("rounded-lg p-1.5 text-zinc-400 hover:text-white lg:hidden", FOCUS_DARK)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 px-3">
          <Popover
            align="left"
            trigger={({ toggle, open, buttonProps }) => (
              <button
                type="button"
                onClick={toggle}
                {...buttonProps}
                className={cx(
                  "flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-left",
                  FOCUS_DARK,
                )}
              >
                <Building2 className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-zinc-100">Trust &amp; Safety</span>
                <ChevronToggle open={open} />
              </button>
            )}
          >
            <PopoverItem selected>Trust &amp; Safety</PopoverItem>
            <PopoverItem>Authenticity Lab</PopoverItem>
            <PopoverItem>Payments Risk</PopoverItem>
          </Popover>
        </div>

        <nav className="mt-4 flex-1 space-y-0.5 px-3" aria-label="Primary">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href="#"
                aria-current={item.active ? "page" : undefined}
                className={cx(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors motion-reduce:transition-none",
                  item.active ? "bg-amber-500/15 text-amber-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
                  FOCUS_DARK,
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </a>
            );
          })}
          <a
            href="#"
            className={cx(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 motion-reduce:transition-none",
              FOCUS_DARK,
            )}
          >
            <Settings className="h-4 w-4 shrink-0" />
            Settings
          </a>
        </nav>

        <div className="border-t border-white/10 p-3">
          <Popover
            align="left"
            trigger={({ toggle, buttonProps }) => (
              <button type="button" onClick={toggle} {...buttonProps} className={cx("flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/5", FOCUS_DARK)}>
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <Image src={`https://images.unsplash.com/photo-${CURRENT_AGENT.avatarId}?w=64&h=64&fit=crop&crop=faces`} alt="" fill sizes="32px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-[12.5px] font-medium text-zinc-100">{CURRENT_AGENT.name}</span>
                  <span className="block truncate text-[11px] text-zinc-400">Senior Trust Analyst</span>
                </span>
              </button>
            )}
          >
            <PopoverItem>Profile settings</PopoverItem>
            <div className="my-1 h-px bg-zinc-200" />
            <PopoverItem>
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </span>
            </PopoverItem>
          </Popover>
        </div>
      </aside>
    </>
  );
}
