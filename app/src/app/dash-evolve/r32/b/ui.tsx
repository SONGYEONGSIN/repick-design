import { useEffect, useRef, type ReactNode } from "react";
import type { Priority, TicketStatus } from "./data";

/** Closes a menu/popover on outside click or Escape. Returns the ref its wrapper needs. */
export function useDismissable<T extends HTMLElement>(active: boolean, onDismiss: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    function onDocDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onDismiss]);
  return ref;
}

export function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

const PRIORITY_STYLE: Record<Priority, string> = {
  Low: "border-zinc-200 bg-zinc-50 text-zinc-600",
  Medium: "border-sky-200 bg-sky-50 text-sky-700",
  High: "border-amber-200 bg-amber-50 text-amber-700",
  Urgent: "border-rose-200 bg-rose-50 text-rose-700",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        PRIORITY_STYLE[priority]
      )}
    >
      {priority}
    </span>
  );
}

const STATUS_STYLE: Record<TicketStatus, string> = {
  New: "border-zinc-200 bg-zinc-50 text-zinc-600",
  "In Progress": "border-blue-200 bg-blue-50 text-blue-700",
  "Waiting on Customer": "border-amber-200 bg-amber-50 text-amber-700",
  Escalated: "border-rose-200 bg-rose-50 text-rose-700",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        STATUS_STYLE[status]
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function Avatar({ initials, name }: { initials: string; name: string }) {
  return (
    <span
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-semibold text-zinc-700"
      title={name}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "rounded-md px-3 py-1.5 text-[13px] font-medium leading-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1450b0]",
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("rounded-xl border border-zinc-200 bg-white shadow-sm", className)}>{children}</div>;
}
