"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { Folio, QuoteGlyph } from "./ui";
import { COLOR, DISPLAY_FONT, FOCUS_RING, TRACK, W } from "./tokens";
import { SUBJECT, type Verdict } from "./data";
import Reveal from "./Reveal";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ClosingCta({ verdict }: { verdict: Verdict }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  return (
    <section id="closing" className="mx-auto max-w-[1600px] px-5 sm:px-8 py-16 sm:py-24">
      <Reveal>
        <div
          className="rounded-xl p-6 sm:p-10"
          style={{ background: COLOR.surface, border: `1px solid ${COLOR.ink}26` }}
        >
          <div className="flex items-start justify-between gap-4">
            <span
              className={`${W.label} text-[11px] uppercase`}
              style={{ color: COLOR.accentDark, letterSpacing: TRACK.eyebrow }}
            >
              Closing statement
            </span>
            <Folio n={6} of={6} />
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 min-w-0">
              <QuoteGlyph />
              <h2
                className={`${W.heavy} text-[clamp(2rem,1.4rem+2.6vw,3.5rem)] leading-[1.02] -mt-2`}
                style={{ color: COLOR.ink, letterSpacing: "-0.02em", fontFamily: DISPLAY_FONT }}
              >
                Read Case File {SUBJECT.caseFile.split("-").pop()} yourself.
              </h2>
              <p className={`${W.body} mt-5 text-[15px] leading-[1.6] max-w-[460px]`} style={{ color: COLOR.ink }}>
                It clears at <span className={W.heavy}>{verdict.confidence}% confidence</span>,{" "}
                <span className="tabular-nums">{verdict.checksPassed} of {verdict.checksTotal}</span> checks
                passed, recommended at{" "}
                <span className="tabular-nums">${verdict.recommendedPrice.toLocaleString("en-US")}</span> —{" "}
                <span className="tabular-nums">{verdict.discountPercent}%</span> below replacement value.
                Change the assumptions above and this number moves with it, all the way down here.
              </p>
            </div>

            <div className="lg:col-span-5 min-w-0">
              <form onSubmit={onSubmit} noValidate className="w-full">
                <label htmlFor="dossier-email" className={`${W.label} block text-[12px] mb-2`} style={{ color: COLOR.mutedOnSurf }}>
                  Get the next case file when it opens
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                      style={{ color: COLOR.mutedOnSurf }}
                      aria-hidden="true"
                    />
                    <input
                      id="dossier-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status !== "idle") setStatus("idle");
                      }}
                      placeholder="you@email.com"
                      aria-invalid={status === "error"}
                      aria-describedby={status === "error" ? "dossier-email-error" : undefined}
                      className={`${FOCUS_RING} w-full rounded-md py-3 pl-9 pr-3 text-[14px]`}
                      style={{
                        background: COLOR.bg,
                        color: COLOR.ink,
                        border: `1px solid ${status === "error" ? COLOR.accentDark : COLOR.ink + "3D"}`,
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${W.label} ${FOCUS_RING} inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-[14px] shrink-0`}
                    style={{ background: COLOR.accent, color: COLOR.white }}
                  >
                    Notify me
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-2 min-h-[20px]">
                  {status === "error" && (
                    <p id="dossier-email-error" className={`${W.body} text-[12px]`} style={{ color: COLOR.accentDark }}>
                      That doesn&apos;t look like a valid email address.
                    </p>
                  )}
                  {status === "success" && (
                    <p className={`${W.label} inline-flex items-center gap-1.5 text-[12px]`} style={{ color: COLOR.accentDark }}>
                      <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                      You&apos;re on the list — we&apos;ll send Case File 2291 and every dossier
                      after it.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
