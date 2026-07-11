import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  "aria-labelledby"?: string;
}

export function Card({ children, className = "", as = "div", ...rest }: CardProps) {
  const Comp = as;
  return (
    <Comp
      className={`rounded-xl border border-zinc-200 bg-white shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({
  title,
  titleId,
  description,
  action,
}: {
  title: string;
  titleId?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4">
      <div className="min-w-0">
        <h2 id={titleId} className="text-sm font-semibold text-zinc-900">
          {title}
        </h2>
        {description ? <p className="mt-0.5 text-xs text-zinc-500">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
    </div>
  );
}
