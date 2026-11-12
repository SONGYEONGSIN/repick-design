"use client";

import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { FOCUS_RING_CLASS } from "./ui";

export interface PaletteCommand {
  id: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  run: () => void;
}

export function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean;
  onClose: () => void;
  commands: PaletteCommand[];
}) {
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) firstItemRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-24 sm:pt-32">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="fixed inset-0 bg-black/60" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="palette-heading"
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-2 shadow-2xl shadow-black/60"
      >
        <h2 id="palette-heading" className="px-3 pt-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
          Quick actions
        </h2>
        <ul className="flex flex-col gap-0.5">
          {commands.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <li key={cmd.id}>
                <button
                  ref={i === 0 ? firstItemRef : undefined}
                  type="button"
                  onClick={() => {
                    cmd.run();
                    onClose();
                  }}
                  className={`${FOCUS_RING_CLASS} flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-white/5`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-50">{cmd.label}</span>
                  <span className="shrink-0 text-xs font-normal text-zinc-400">{cmd.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
