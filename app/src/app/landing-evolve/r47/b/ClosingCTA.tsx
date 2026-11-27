"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatRange, type Verdict } from "./checkpoint-math";
import { ACCENT_FILL, DISPLAY, EYEBROW, FOCUS_RING, MUTED_TEXT, ON_ACCENT_TEXT, PROSE_WIDTH_18, ACCENT_TEXT } from "./tokens";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The closing headline cites the CURRENT verdict object by name — avgScore, gradeLetter,
 * priceLow/priceHigh — so it changes the moment a visitor confirms or flags a card above. It
 * never falls back to a fixed number, including before every checkpoint is resolved: the copy
 * reads the live-in-progress figures exactly as the tally does.
 */
export function ClosingCTA({ verdict }: { verdict: Verdict }) {
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

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="closing-heading">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6">
        <p className={`${EYEBROW} ${ACCENT_TEXT}`}>
          {verdict.allResolved ? "Run complete" : "Run in progress"}
        </p>
        <h2
          id="closing-heading"
          className={`${DISPLAY} text-[clamp(2rem,4.2vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] tabular-nums text-zinc-900`}
        >
          Right now this unit reads
          <br />
          Grade {verdict.gradeLetter} — {formatRange(verdict.priceLow, verdict.priceHigh)}.
        </h2>
        <p className={`${PROSE_WIDTH_18} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That score, grade and range come straight from the checkpoint deck above —{" "}
          {verdict.resolvedCount} of {verdict.total} checks resolved, {verdict.avgScore}/100 trust
          score. List your own gear and it runs the same four checks, live, in front of you.
        </p>

        <a
          href="#hero-heading"
          className={`inline-flex items-center gap-2 rounded-full ${ACCENT_FILL} px-6 py-3 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 hover:bg-amber-400 ${FOCUS_RING}`}
        >
          Start my own checkpoint run
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
              className={`w-full min-w-0 rounded-full border border-zinc-300 bg-white px-4 py-2.5 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
            {status === "error" && (
              <p id={errorId} className="text-xs font-normal text-amber-700">
                Enter a valid email so we can send the reminder.
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors duration-200 hover:border-zinc-400 hover:bg-zinc-50 ${FOCUS_RING}`}
          >
            {status === "success" ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-zinc-900" aria-hidden="true" />
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
