import type { ReactNode } from "react";

export function Badge({
  children,
  className = "",
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
