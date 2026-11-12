"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatUsd } from "./data";
import { ACCENT_BUTTON_FILL, ACCENT_TINT_TEXT, DISPLAY, FOCUS_RING, MUTED_TEXT, ON_ACCENT_BUTTON_TEXT, PROSE_WIDTH_18 } from "./tokens";

interface ClosingCTAProps {
  price: number;
  credit: number;
  conditionLabel: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ClosingCTA({ price, credit, conditionLabel }: ClosingCTAProps) {
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
    <section className="px-4 py-24 sm:px-6 lg:px-10" aria-labelledby="closing-heading">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6">
        <h2 id="closing-heading" className={`${DISPLAY} text-[clamp(2rem,4.2vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] tabular-nums text-[#F5F5F7]`}>
          Your {conditionLabel.toLowerCase()} item at {formatUsd(price)}
          <br />
          is worth {formatUsd(credit)} today.
        </h2>
        <p className={`${PROSE_WIDTH_18} text-lg font-normal leading-[1.6] ${MUTED_TEXT}`}>
          That figure comes straight from the calculator above — adjust it any time before you
          commit. No appraisal wait, no obligation to sell.
        </p>

        <a
          href="#hero-heading"
          className={`inline-flex items-center gap-2 rounded-full ${ACCENT_BUTTON_FILL} px-6 py-3 text-sm font-semibold ${ON_ACCENT_BUTTON_TEXT} transition-colors duration-200 ${FOCUS_RING}`}
        >
          Get my real offer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-start" noValidate>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <label htmlFor={inputId} className="sr-only">
              Email address — get a reminder when you&apos;re ready to trade in
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
              className={`w-full min-w-0 rounded-full border border-white/15 bg-transparent px-4 py-2.5 text-sm font-normal text-[#F5F5F7] placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
            {status === "error" && (
              <p id={errorId} className="text-xs font-normal text-sky-300">
                Enter a valid email so we can send the reminder.
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-[#F5F5F7] transition-colors duration-200 hover:border-white/30 ${FOCUS_RING}`}
          >
            {status === "success" ? (
              <>
                <CheckCircle2 className={`h-4 w-4 ${ACCENT_TINT_TEXT}`} aria-hidden="true" />
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
