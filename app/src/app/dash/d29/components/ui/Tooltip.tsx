"use client";

import { useState, type ReactNode } from "react";

/**
 * Hover/focus tooltip. The caller must set tabIndex=0 + aria-describedby={id}
 * on the trigger element for keyboard accessibility to work.
 */
export function HoverTooltip({
  id,
  content,
  children,
  className = "",
}: {
  id: string;
  content: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      {children}
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white shadow-lg"
        >
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
        </span>
      ) : null}
    </span>
  );
}
