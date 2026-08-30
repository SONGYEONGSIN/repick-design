"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FOCUS_RING } from "./focus";

/** Minimal button-triggered dropdown/popover. Closes on outside click and Escape. */
export function Popover({
  trigger,
  children,
  align = "start",
  panelClassName = "",
}: {
  trigger: (props: { onClick: () => void; ref: React.RefObject<HTMLButtonElement | null>; open: boolean; id: string }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || btnRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative">
      {trigger({ onClick: () => setOpen((v) => !v), ref: btnRef, open, id })}
      {open && (
        <div
          ref={panelRef}
          id={id}
          role="menu"
          className={`absolute z-30 mt-2 min-w-[13rem] overflow-hidden rounded-lg border border-white/10 bg-zinc-900 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] ${
            align === "end" ? "right-0" : "left-0"
          } ${panelClassName}`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function PopoverItem({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-zinc-50 ${FOCUS_RING}`}
    >
      {icon}
      {children}
    </button>
  );
}
