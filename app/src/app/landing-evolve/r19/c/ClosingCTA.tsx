"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { STAGES } from "./data";
import { ACCENT, BODY, BORDER, ERROR, INK, MUTED, SURFACE_SOFT } from "./tokens";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ClosingCTA({ activeIndex, trustScore }: { activeIndex: number; trustScore: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "success">("idle");
  const stage = STAGES[activeIndex];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(EMAIL_PATTERN.test(email) ? "success" : "invalid");
  }

  return (
    <section id="closing-cta" className="px-6 py-24 sm:px-10 lg:px-16" style={{ backgroundColor: "#FFFFFF" }}>
      <div
        className="mx-auto flex max-w-[1280px] flex-col items-start gap-10 rounded-2xl border p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between"
        style={{ borderColor: BORDER, backgroundColor: SURFACE_SOFT }}
      >
        <div className="max-w-[480px]">
          <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.28em", color: MUTED }}>
            Fig. 05 — This listing, right now
          </p>
          <h2
            className="mt-4"
            style={{ fontFamily: "var(--font-display-mono)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.5rem, 1.2vw + 1.3rem, 2.25rem)", color: INK }}
          >
            <span className="tabular-nums" style={{ color: ACCENT }}>
              {trustScore}
            </span>{" "}
            is where the record stands after {stage.label.toLowerCase()}.
          </h2>
          <p className="mt-4 text-[16px] font-normal leading-[1.6]" style={{ color: BODY }}>
            That number came from the stage you left selected above, not a fixed claim. Every listing on
            Repick carries the same four-stage record — get notified when public timelines ship to your
            account.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="w-full max-w-[380px] shrink-0">
          <label htmlFor="cta-email" className="text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: MUTED }}>
            Email
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" style={{ color: MUTED }} aria-hidden="true" />
              <input
                id="cta-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="you@example.com"
                aria-invalid={status === "invalid"}
                aria-describedby="cta-email-status"
                className="w-full rounded-lg border py-2.5 pr-3 pl-9 text-[14px] font-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ borderColor: "#D4D4D8", backgroundColor: "#FFFFFF", color: INK, outlineColor: ACCENT }}
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-lg px-5 py-2.5 text-[14px] font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: ACCENT, outlineColor: ACCENT }}
            >
              Notify me
            </button>
          </div>
          <p id="cta-email-status" className="mt-2 min-h-[18px] text-[12px] font-normal" aria-live="polite">
            {status === "invalid" && <span style={{ color: ERROR }}>Enter a valid email address.</span>}
            {status === "success" && (
              <span className="inline-flex items-center gap-1.5" style={{ color: ACCENT }}>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                You&rsquo;re on the list.
              </span>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
