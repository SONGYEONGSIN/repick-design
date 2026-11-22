"use client";

import { useState, type FormEvent } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { formatUSD, type DerivedCombo } from "../lib/delivery";

interface ClosingCTAProps {
  combo: DerivedCombo;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Cites the exact same `combo` object the hero's device produced — never a re-typed copy of
 * the total or the window. The email form is the page's fourth distinct interaction.
 */
export default function ClosingCTA({ combo }: ClosingCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(EMAIL_PATTERN.test(email) ? "success" : "invalid");
  }

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950/60 py-14 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <h2 className="text-[clamp(1.75rem,2.6vw+1.1rem,3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
              Your pick totals <span className="tabular-nums">{formatUSD(combo.totalCost)}</span>, arriving{" "}
              {combo.deliveryWindow}.
            </h2>
            <p className="mt-3 max-w-[30rem] text-base leading-[1.6] text-zinc-400">
              That&rsquo;s {combo.speedMeta.label.toLowerCase()} speed with{" "}
              {combo.insuranceMeta.label.toLowerCase()} insurance — recomputed the moment you
              changed the grid above, never re-typed between here and there.
            </p>
            <a
              href="#preview"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              Claim this listing
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <label htmlFor="cta-email" className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                <Mail aria-hidden="true" className="h-4 w-4 text-violet-300" />
                Get notified when prices like this drop further
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  id="cta-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setStatus("idle");
                  }}
                  placeholder="you@email.com"
                  aria-invalid={status === "invalid"}
                  aria-describedby="cta-email-status"
                  className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
                >
                  Notify me
                </button>
              </div>
              <p id="cta-email-status" aria-live="polite" className="mt-2 text-xs text-zinc-400">
                {status === "success" && "You're on the list — watch for a confirmation email."}
                {status === "invalid" && "Enter a valid email address to continue."}
                {status === "idle" && "No spam — delivery price alerts only."}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
