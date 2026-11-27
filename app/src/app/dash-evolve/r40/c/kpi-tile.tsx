import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";

export default function KpiTile({
  icon: Icon,
  label,
  value,
  delta,
  direction,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta: string;
  direction: "up" | "down" | "flat";
}) {
  const DeltaIcon = direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : Minus;
  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-zinc-900 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
        <p className="truncate font-medium text-xs text-zinc-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 font-semibold text-lg text-zinc-50 tabular-nums">{value}</p>
      <p className="mt-1 flex items-center gap-1 font-normal text-xs text-zinc-400">
        <DeltaIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
        {delta}
      </p>
    </div>
  );
}
