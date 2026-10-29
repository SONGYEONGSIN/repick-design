"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Generic popover dropdown used for the workspace switcher, notifications and
 * the avatar/user menu. Closes on outside click and Escape, and returns focus
 * to the trigger on close so keyboard users never lose their place.
 */
export function Dropdown({
  trigger,
  children,
  align = "left",
  label,
  panelClassName = "",
}: {
  trigger: (props: { onClick: () => void; expanded: boolean }) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  label: string;
  panelClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <TriggerCapture setRef={(el) => (triggerRef.current = el)}>
        {trigger({ onClick: () => setOpen((v) => !v), expanded: open })}
      </TriggerCapture>
      {open ? (
        <div
          role="group"
          aria-label={label}
          className={`absolute z-30 mt-2 min-w-56 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-lg shadow-black/40 ${
            align === "right" ? "right-0" : "left-0"
          } ${panelClassName}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

// Grabs a ref to the single button the trigger render-prop produces, so
// Escape can return focus to it without every caller wiring a ref manually.
function TriggerCapture({
  children,
  setRef,
}: {
  children: ReactNode;
  setRef: (el: HTMLButtonElement | null) => void;
}) {
  return <span ref={(el) => setRef(el?.querySelector("button") ?? null)}>{children}</span>;
}

export function DropdownItem({
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
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-normal text-zinc-300 hover:bg-white/5 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
    >
      {icon ? (
        <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center text-zinc-400">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
