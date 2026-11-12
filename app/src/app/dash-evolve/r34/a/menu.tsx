"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { FOCUS_RING } from "./ui";

/**
 * Controlled dropdown/popover primitive.
 *
 * Deliberately NOT a render-prop component (no `{children({ close })}`). Open
 * state is owned by the caller and closing always happens from a real event
 * handler — a click-outside listener, Escape, or a plain `onClick` on an item
 * inside `panel` — never invoked inline during this component's own render
 * pass. That sidesteps the whole class of "ref-reaching callback called
 * during render" bug this route was rebuilt to avoid.
 */
export function Menu({
  open,
  onClose,
  trigger,
  panel,
  align = "left",
  placement = "bottom",
  panelClassName = "",
}: {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  panel: ReactNode;
  align?: "left" | "right";
  placement?: "bottom" | "top";
  panelClassName?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className="relative inline-block" ref={rootRef}>
      {trigger}
      {open ? (
        <div
          className={`absolute z-30 min-w-[14rem] rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl shadow-black/40 ${
            align === "right" ? "right-0" : "left-0"
          } ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"} ${panelClassName}`}
        >
          {panel}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  children,
  onClick,
  icon,
  tone = "default",
}: {
  children: ReactNode;
  onClick: () => void;
  icon?: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${FOCUS_RING} flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium motion-safe:transition-colors ${
        tone === "danger" ? "text-red-300 hover:bg-red-500/10" : "text-zinc-200 hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="truncate">{children}</span>
    </button>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="px-2.5 pt-1.5 pb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400">{children}</div>;
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-white/10" role="separator" />;
}
