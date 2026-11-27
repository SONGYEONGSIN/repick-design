// Shared style tokens for this route. Focus treatment is a real outline (never combined with
// `outline-none`, so there is no `--tw-outline-style:none` fight to lose) layered with a solid
// background/border shift where the element already has a filled surface — both paint regardless
// of what's behind them, unlike `ring-2`+`ring-offset-*`, which Tailwind v4 can render fully
// transparent.
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

export const FOCUS_RING_INSET = "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-zinc-900";

export const CONTROL_H = "h-11";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
