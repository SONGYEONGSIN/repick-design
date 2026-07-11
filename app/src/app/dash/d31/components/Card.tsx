import type { ReactNode } from "react";

interface CardProps {
  id?: string;
  headingId?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** 대시보드 전역에서 재사용하는 카드 컨테이너 — radius/border/shadow/padding 통일. */
export default function Card({ id, headingId, title, description, action, children, className = "" }: CardProps) {
  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={`rounded-xl border border-white/10 bg-zinc-900/60 p-4 shadow-sm sm:p-5 ${className}`}
    >
      {title && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={headingId} className="text-sm font-semibold text-zinc-100">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
