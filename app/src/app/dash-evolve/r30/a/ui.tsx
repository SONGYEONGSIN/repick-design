import { useEffect, type ReactNode, type RefObject } from "react";

/** Closes an open popover/menu on outside pointer-down or Escape. Kept
 * as one shared hook so every popover in the shell (workspace switcher,
 * notifications, avatar menu, command palette) behaves identically. */
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!active) return;
    function handlePointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismiss();
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onDismiss();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [active, ref, onDismiss]);
}

/** Joins class-name fragments, skipping falsy ones. Local, no dependency. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Shared focus treatment — the SAFE PATTERN only: a real, painted
 * `outline` applied directly on `:focus-visible`, never `ring`/
 * `ring-offset` (which can paint fully transparent in this Tailwind v4
 * setup) and never paired with an `outline-none` on the same or an
 * ancestor element (an earlier `outline-none` cancels a later
 * `focus-visible:outline` via the shared `--tw-outline-style`
 * variable — a dead idiom that looks correct in the class list but
 * renders no visible change on Tab). Every interactive element in this
 * page applies `FOCUS_RING` directly and nothing here or on any
 * ancestor ever sets `outline-none`.
 */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600";

/** Non-focus, permanent "this is pinned" treatment. Also outline-based
 * (never `ring`/`ring-offset`) so it actually paints, matching the
 * safe pattern used for focus above. */
export const PIN_OUTLINE = "outline outline-2 outline-offset-2 outline-cyan-500";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04)]",
        padded && "p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "up" | "down" | "accent";
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "bg-zinc-100 text-zinc-600",
    up: "bg-emerald-50 text-emerald-700",
    down: "bg-rose-50 text-rose-700",
    accent: "bg-cyan-50 text-cyan-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-lg bg-zinc-100 p-1"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "h-9 rounded-md px-3 text-sm font-medium transition-colors",
              FOCUS_RING,
              active
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function IconButton({
  children,
  label,
  onClick,
  active = false,
  className,
  type = "button",
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-colors",
        FOCUS_RING,
        active
          ? "border-cyan-200 bg-cyan-50 text-cyan-700"
          : "border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
