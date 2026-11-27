"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "./ui";

interface PopoverProps {
  trigger: (opts: { open: boolean; toggle: () => void }) => ReactNode;
  children: (opts: { close: () => void }) => ReactNode;
  align?: "left" | "right";
  side?: "down" | "up";
  className?: string;
}

export function Popover({ trigger, children, align = "left", side = "down", className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cx("relative", className)}>
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      {open && (
        <div
          className={cx(
            "absolute z-30 w-72 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg",
            align === "right" ? "right-0" : "left-0",
            side === "down" ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
          )}
        >
          {children({ close: () => setOpen(false) })}
        </div>
      )}
    </div>
  );
}
