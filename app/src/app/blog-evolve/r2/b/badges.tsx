// app/src/app/blog-evolve/r2/b/badges.tsx
//
// Shared category and confidence badges. Confidence never leans on colour alone — each level pairs
// a distinct icon with its own text label, so the distinction survives greyscale or colour-blind
// viewing.
import type { LucideIcon } from "lucide-react";
import { FlaskConical, Shield, ShieldCheck } from "lucide-react";
import { CATEGORIES, CONFIDENCE_LABEL, type CategoryId, type Confidence } from "./data";

const CONFIDENCE_ICON: Record<Confidence, LucideIcon> = {
  high: ShieldCheck,
  medium: Shield,
  exploratory: FlaskConical,
};

export function CategoryBadge({ id, className = "" }: { id: CategoryId; className?: string }) {
  const cat = CATEGORIES.find((c) => c.id === id)!;
  const Icon = cat.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 ${className}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {cat.label}
    </span>
  );
}

export function ConfidenceBadge({ level, className = "" }: { level: Confidence; className?: string }) {
  const Icon = CONFIDENCE_ICON[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 ${className}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
      {CONFIDENCE_LABEL[level]}
    </span>
  );
}
