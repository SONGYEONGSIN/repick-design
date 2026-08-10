"use client";

import { Check, Copy, X } from "lucide-react";

export type CopyState = "idle" | "copied" | "failed";

type Props = {
  label: string;
  state: CopyState;
  onCopy: () => void;
  tone?: "quiet" | "solid";
};

const BASE =
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium tracking-wide transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const TONES = {
  quiet:
    "border border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white",
  solid: "bg-amber-500 text-zinc-900 hover:bg-amber-400",
};

const STATES = {
  copied: "border-amber-600 bg-amber-500 text-zinc-900 hover:bg-amber-500 hover:text-zinc-900",
  failed: "border-orange-800 bg-orange-800 text-white hover:bg-orange-800 hover:text-white",
};

export default function CopyButton({ label, state, onCopy, tone = "quiet" }: Props) {
  const stateClass = state === "idle" ? TONES[tone] : STATES[state];
  const Icon = state === "copied" ? Check : state === "failed" ? X : Copy;
  const word = state === "copied" ? "Copied" : state === "failed" ? "Blocked" : "Copy";

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`${word} ${label}`}
      className={`${BASE} ${stateClass}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{word}</span>
    </button>
  );
}
