"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ACCENT, ACCENT_DEEP, BORDER, INK, MUTED, PRODUCT_NAME, STAGES } from "./data";
import { Eyebrow, FOCUS_RING, Reveal } from "./ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Closes the loop the hero opened: the headline below is generated from `STAGES[stage]`, the same
 * lifted state the hero scrubber and the value-split control both write to. Whatever stage a
 * visitor left the pipeline on is what the page says goodbye with — the "live" state survives all
 * the way to the last section instead of dying after the hero.
 */
export function ClosingCta({ stage }: { stage: number }) {
  const current = STAGES[stage];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("success");
  }

  return (
    <section id="closing-cta" className="border-b" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow>
              {PRODUCT_NAME.split("—")[0].trim()} · currently {current.label.toLowerCase()}
            </Eyebrow>
            <h2
              className="mt-4 font-extrabold"
              style={{
                fontFamily: "var(--font-display-wide)",
                letterSpacing: "-0.02em",
                lineHeight: 1.0,
                fontSize: "clamp(2rem, 2vw + 1.4rem, 3.4rem)",
                color: INK,
              }}
            >
              {current.metrics.price
                ? `Priced at $${current.metrics.price} and matched to ${current.metrics.matchedBuyers} buyers.`
                : `${current.metrics.matchedBuyers} buyers are already watching this record.`}
            </h2>
            <p className="mt-5 max-w-[480px] text-[14px] leading-[1.6]" style={{ color: MUTED }}>
              Every item on Repick carries the same kind of record you just scrubbed through. Sell into
              a pipeline that shows its work, or browse listings you can audit before you buy.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#product-preview"
                className={`inline-flex items-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition-colors ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT, color: INK }}
              >
                Browse graded items
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <span className="text-[12px]" style={{ color: MUTED }}>
                No account needed to look.
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="rounded-md border p-6" style={{ borderColor: BORDER }}>
              <h3 className="text-[15px] font-semibold" style={{ color: INK }}>
                Get notified when your category is graded
              </h3>
              <p className="mt-2 text-[13px] leading-[1.6]" style={{ color: MUTED }}>
                One email when a new item finishes verification. No listings spam.
              </p>

              {status === "success" ? (
                <div className="mt-5 flex items-start gap-2 rounded-sm border p-3" style={{ borderColor: ACCENT_DEEP }} role="status">
                  <CheckCircle2 size={16} aria-hidden="true" style={{ color: ACCENT_DEEP }} className="mt-0.5 shrink-0" />
                  <p className="text-[13px]" style={{ color: INK }}>
                    You&apos;re on the list — we&apos;ll email <span className="font-semibold">{email}</span> at the
                    next Verified stage.
                  </p>
                </div>
              ) : (
                <form className="mt-5" onSubmit={handleSubmit} noValidate>
                  <label htmlFor="notify-email" className="sr-only">
                    Email address
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="notify-email"
                      type="email"
                      inputMode="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (status === "invalid") setStatus("idle");
                      }}
                      aria-invalid={status === "invalid"}
                      aria-describedby={status === "invalid" ? "notify-email-error" : undefined}
                      className={`w-full rounded-sm border px-3 py-2.5 text-[13px] ${FOCUS_RING}`}
                      style={{ borderColor: status === "invalid" ? "#B3261E" : BORDER, color: INK, backgroundColor: "transparent" }}
                    />
                    <button
                      type="submit"
                      className={`shrink-0 rounded-sm border px-4 py-2.5 text-[13px] font-semibold transition-colors ${FOCUS_RING}`}
                      style={{ borderColor: ACCENT_DEEP, color: ACCENT_DEEP }}
                    >
                      Notify me
                    </button>
                  </div>
                  {status === "invalid" && (
                    <p id="notify-email-error" className="mt-2 text-[12px]" style={{ color: "#B3261E" }}>
                      Enter a valid email address to get notified.
                    </p>
                  )}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
