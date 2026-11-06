"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { describePath, formatDaysPhrase, formatUsd, type PathSummary } from "./trade-math";
import {
  ACCENT_FILL,
  ACCENT_FILL_HOVER,
  ACCENT_TEXT,
  ACCENT_TINT_TEXT,
  EYEBROW,
  FOCUS_RING,
  INK_CLASS,
  MUTED_TEXT,
  ON_ACCENT_TEXT,
  PROSE_WIDTH_18,
} from "./tokens";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The closing headline cites the CURRENT PathSummary object by name — branch, leaf, payout,
 * days — so it changes the moment a visitor commits a different path above. It never falls
 * back to a fixed number, including before the second step is chosen: the copy reads the
 * live-in-progress range exactly as the hero's headline number does.
 */
export function ClosingCTA({ summary }: { summary: PathSummary }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const inputId = useId();
  const errorId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  const headlineNumber =
    summary.stage === "leaf"
      ? `${formatUsd(summary.leaf.payout)}, ${formatDaysPhrase(summary.leaf.days)}`
      : `${formatUsd(summary.range.low)}–${formatUsd(summary.range.high)}`;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="closing-heading">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6">
        <p className={`${EYEBROW} ${ACCENT_TEXT}`}>{summary.stage === "leaf" ? "Path committed" : "Path in progress"}</p>
        <h2
          id="closing-heading"
          className={`text-[clamp(1.8rem,8vw,2.4rem)] lg:text-[clamp(2.4rem,4vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] tabular-nums ${INK_CLASS}`}
        >
          Right now your path reads
          <br />
          {headlineNumber}.
        </h2>
        <p className={`${PROSE_WIDTH_18} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That number comes straight from the tree above — {describePath(summary)} List your
          own gear and it runs the same simulator, live, before you commit to anything.
        </p>

        <a
          href="#hero-heading"
          className={`inline-flex items-center gap-2 rounded-full ${ACCENT_FILL} px-6 py-3 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 ${ACCENT_FILL_HOVER} ${FOCUS_RING}`}
        >
          Run my own trade path
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-start" noValidate>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <label htmlFor={inputId} className="sr-only">
              Email address — get a reminder when you&apos;re ready to list
            </label>
            <input
              id={inputId}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="you@example.com"
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? errorId : undefined}
              className={`w-full min-w-0 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm font-normal ${INK_CLASS} placeholder:text-zinc-400 ${FOCUS_RING}`}
            />
            {status === "error" && (
              <p id={errorId} className={`text-xs font-normal ${ACCENT_TINT_TEXT}`}>
                Enter a valid email so we can send the reminder.
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold ${INK_CLASS} transition-colors duration-200 hover:border-white/30 hover:bg-white/[0.05] ${FOCUS_RING}`}
          >
            {status === "success" ? (
              <>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Saved
              </>
            ) : (
              "Remind me later"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
