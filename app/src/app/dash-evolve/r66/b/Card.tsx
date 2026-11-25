import type { ReactNode } from "react";
import { cx } from "./ui";

interface CardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({ children, className, padded = true }: CardProps) {
  return (
    <div
      className={cx(
        "rounded-xl border border-zinc-200 bg-white shadow-sm",
        padded && "p-4 sm:p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  as?: "h2" | "h3";
  right?: ReactNode;
  id?: string;
}

export function CardHeader({ title, description, as = "h2", right, id }: CardHeaderProps) {
  const Heading = as;
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Heading id={id} className="text-sm font-bold text-zinc-900">
          {title}
        </Heading>
        {description ? <p className="mt-0.5 text-xs text-zinc-500">{description}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{children}</span>;
}
