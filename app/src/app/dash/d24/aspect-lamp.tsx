import type { Aspect, DelayLevel } from "./data";
import { ASPECT_LABEL } from "./data";

export const LEVEL_TO_ASPECT: Record<DelayLevel, Aspect> = {
  onTime: "clear",
  minor: "caution",
  major: "stop",
};

export const DOT_CLASS: Record<Aspect, string> = {
  clear: "bg-[var(--clear)] shadow-[0_0_7px_1px_var(--clear)]",
  caution: "bg-[var(--caution)] shadow-[0_0_7px_1px_var(--caution)]",
  stop: "bg-[var(--stop)] shadow-[0_0_7px_1px_var(--stop)]",
  restrict: "bg-[var(--restrict)] shadow-[0_0_7px_1px_var(--restrict)]",
};

export const TEXT_CLASS: Record<Aspect, string> = {
  clear: "text-[var(--clear)]",
  caution: "text-[var(--caution)]",
  stop: "text-[var(--stop)]",
  restrict: "text-[var(--restrict)]",
};

export const RING_CLASS: Record<Aspect, string> = {
  clear: "ring-1 ring-inset ring-[var(--clear)]/40",
  caution: "ring-1 ring-inset ring-[var(--caution)]/40",
  stop: "ring-1 ring-inset ring-[var(--stop)]/40",
  restrict: "ring-1 ring-inset ring-[var(--restrict)]/40",
};

export function AspectDot({ aspect }: { aspect: Aspect }) {
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 rounded-full ${DOT_CLASS[aspect]}`} />;
}

export function AspectBadge({ aspect, dense = false }: { aspect: Aspect; dense?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-[var(--border)] bg-[var(--bg-inset)]/60 font-mono uppercase tracking-wide ${dense ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-[11px]"}`}
    >
      <AspectDot aspect={aspect} />
      <span className={TEXT_CLASS[aspect]}>{ASPECT_LABEL[aspect]}</span>
    </span>
  );
}

export function DelayChip({ level, text }: { level: DelayLevel; text: string }) {
  const aspect = LEVEL_TO_ASPECT[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-[var(--border)] px-1.5 py-0.5 font-mono text-[11px] tabular-nums ${TEXT_CLASS[aspect]}`}
    >
      <AspectDot aspect={aspect} />
      {text}
    </span>
  );
}
