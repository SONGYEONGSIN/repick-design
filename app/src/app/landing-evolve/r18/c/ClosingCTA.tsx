"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { ACCENT, ACCENT_BRIGHT } from "./Hero";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ClosingCTA({ composite }: { composite: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "success">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(EMAIL_PATTERN.test(email) ? "success" : "invalid");
  }

  return (
    <section id="closing-cta" className="bg-[#0B0B0F] px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-10 rounded-2xl border border-[#1C1C22] bg-[#111116] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[492px]">
          <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.28em" }}>
            Fig. 05 — Your weighted score
          </p>
          <h2
            className="mt-4 text-white"
            style={{ fontFamily: "var(--font-display-grotesk)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 1.6vw + 1.5rem, 2.5rem)" }}
          >
            <span className="tabular-nums" style={{ color: ACCENT_BRIGHT }}>
              {composite.toFixed(1)}
            </span>
            {" "}is the score your weights produced.
          </h2>
          <p className="mt-4 text-[15px] font-normal leading-[1.6] text-[#A1A1AA]">
            That number came from the sliders you left set above. Every listing on Repick carries the
            same four-factor math — get notified when re-weighting ships to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="w-full max-w-[380px] shrink-0">
          <label htmlFor="cta-email" className="text-[12px] font-semibold uppercase text-[#71717A]" style={{ letterSpacing: "0.12em" }}>
            Email
          </label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" aria-hidden="true" />
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
                className="w-full rounded-lg border border-[#27272E] bg-[#0B0B0F] py-2.5 pl-9 pr-3 text-[14px] font-normal text-white placeholder:text-[#52525B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ outlineColor: ACCENT_BRIGHT }}
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-lg px-5 py-2.5 text-[14px] font-semibold text-[#0B0B0F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: ACCENT, outlineColor: ACCENT_BRIGHT }}
            >
              Notify me
            </button>
          </div>
          <p id="cta-email-status" className="mt-2 min-h-[18px] text-[12px] font-normal" aria-live="polite">
            {status === "invalid" && <span className="text-[#F87171]">Enter a valid email address.</span>}
            {status === "success" && (
              <span className="inline-flex items-center gap-1.5" style={{ color: ACCENT_BRIGHT }}>
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
