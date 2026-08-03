"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { cx, FOCUS } from "./data";

interface DisclosureProps {
  id: string;
  icon: LucideIcon;
  title: string;
  /** Condensed fact shown next to the chevron whether the panel is open or collapsed. */
  peek: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

/**
 * Independently-controlled accordion module. Each instance owns no state of its own — the parent
 * lifts `open` so the persistent summary bar can jump straight to a specific module (e.g. "Right-size
 * your plan") without the modules being coupled to one another the way a single-open accordion group
 * would be. That decoupling is the point: persuasion and sizing open on their own schedules.
 */
export default function Disclosure({ id, icon: Icon, title, peek, open, onToggle, children }: DisclosureProps) {
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;

  return (
    <section id={id} className="scroll-mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60">
      <h2 className="m-0">
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cx(
            "flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-zinc-900 sm:px-6 sm:py-5",
            FOCUS,
          )}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-blue-500/10">
              <Icon className="h-4.5 w-4.5 text-blue-400" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-base font-semibold tracking-tight text-zinc-50">{title}</span>
          </span>
          <span className="flex flex-none items-center gap-3 sm:gap-4">
            <span className="hidden text-right text-xs font-normal text-zinc-400 sm:block">{peek}</span>
            <ChevronDown
              className={cx("h-4.5 w-4.5 flex-none text-zinc-400 transition-transform duration-200 motion-reduce:transition-none", open && "rotate-180")}
              aria-hidden="true"
            />
          </span>
        </button>
      </h2>
      <div className="px-5 pb-2 text-xs font-normal text-zinc-400 sm:hidden">{peek}</div>
      <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!open} className="border-t border-zinc-800 px-5 pb-6 pt-5 sm:px-6">
        {children}
      </div>
    </section>
  );
}
