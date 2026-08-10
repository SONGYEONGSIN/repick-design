"use client";

import type { ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { FOCUS_RING, GUTTER, linesToText, type Line, type ParamId, type TokKind } from "./data";

/**
 * One pane of the transcript.
 *
 * Two craft decisions are load-bearing here:
 *
 * 1. **The gutter is sticky.** A code pane at 390px has to scroll sideways, and a marker that scrolls
 *    out of view answers nothing. `position: sticky; left: 0` pins each line's tag against the pane
 *    edge while its code slides underneath, so the parameter-to-field mapping survives on a phone.
 *    Both gutter states carry an *opaque* background for the same reason — a translucent tint would
 *    let the scrolled code show through the tag.
 * 2. **Accent marks computed values, not syntax.** Numbers and keywords are cyan; keys and
 *    punctuation are zinc-400, strings zinc-100. A reader scanning for "what did my change do" is
 *    looking for numbers, so the one hue on the page points at them rather than at a rainbow.
 */

const TOK_CLASS: Record<TokKind | "plain", string> = {
  plain: "text-zinc-300",
  key: "text-zinc-400",
  str: "text-zinc-100",
  num: "text-cyan-300 tabular-nums",
  punct: "text-zinc-400",
  kw: "text-cyan-300",
  cmt: "text-zinc-400",
};

export type PaneProps = {
  label: string;
  /** `out` is a message you send, `in` is one you receive. Cell 03 inverts them, and it matters. */
  direction: "out" | "in";
  lines: Line[];
  trace: ParamId | null;
  copyId: string;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  meta?: ReactNode;
  tone?: "ok" | "error";
};

export default function CodePane({
  label,
  direction,
  lines,
  trace,
  copyId,
  copiedId,
  onCopy,
  meta,
  tone = "ok",
}: PaneProps) {
  const copied = copiedId === copyId;
  const DirectionIcon = direction === "out" ? ArrowUpRight : ArrowDownLeft;

  return (
    <div
      className={`flex min-w-0 flex-col rounded-xl border bg-zinc-950 ${
        tone === "error" ? "border-rose-400/50" : "border-zinc-800"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-zinc-800 px-3 py-2">
        <span className="inline-flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          <DirectionIcon aria-hidden="true" className="h-3.5 w-3.5 flex-none text-cyan-400" />
          <span className="min-w-0 truncate">{label}</span>
        </span>
        <span className="flex items-center gap-3">
          {meta}
          <button
            type="button"
            onClick={() => onCopy(copyId, linesToText(lines))}
            className={`inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-2 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:border-cyan-400 hover:text-cyan-300 motion-reduce:transition-none ${FOCUS_RING}`}
          >
            {copied ? (
              <Check aria-hidden="true" className="h-3.5 w-3.5 flex-none text-cyan-300" />
            ) : (
              <Copy aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </span>
      </div>

      <pre className="overflow-x-auto py-3 font-mono text-[12px] leading-6 sm:text-[13px]">
        <code>
          {lines.map((line, index) => {
            const traced = trace !== null && (line.d === trace || line.d === "sum");
            const chained = line.d === "chain";
            return (
              <span
                key={index}
                className={`flex w-max min-w-full items-start ${traced ? "bg-cyan-950" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className={`sticky left-0 z-10 w-12 flex-none select-none border-l-2 pl-2 pr-2 text-[10px] tracking-[0.08em] ${
                    traced
                      ? "border-cyan-400 bg-cyan-950 text-cyan-300"
                      : `border-transparent bg-zinc-950 ${chained ? "text-cyan-300" : "text-zinc-400"}`
                  }`}
                >
                  {line.d ? GUTTER[line.d] : " "}
                </span>
                <span className="whitespace-pre pr-4">
                  {line.toks.length === 0
                    ? " "
                    : line.toks.map((tok, tokIndex) => (
                        <span key={tokIndex} className={TOK_CLASS[tok.k ?? "plain"]}>
                          {tok.t}
                        </span>
                      ))}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
