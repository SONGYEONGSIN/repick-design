import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return (
    <Tag className={`min-w-0 rounded-xl border border-white/10 bg-zinc-900/60 ${className}`}>
      {children}
    </Tag>
  );
}
