"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
import { type MatchPair } from "./data";
import { COLOR } from "./theme";
import { Eyebrow, Folio, Reveal, FOCUS_RING } from "./ui";

export default function ClosingCTA({
  matches,
  categoryLabel,
}: {
  matches: MatchPair[];
  categoryLabel: string;
}) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const inputId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email.trim().length === 0) return;
    setSubscribed(true);
  }

  return (
    <section className="px-6 py-16 md:px-12 md:py-24" style={{ background: COLOR.bg }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between">
          <Eyebrow>Get matched</Eyebrow>
          <Folio index={5} total={5} label="Fig. 05" />
        </div>

        <Reveal>
          <div
            className="mt-6 grid grid-cols-1 gap-8 rounded-lg border p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10"
            style={{ borderColor: COLOR.accentBorder, background: COLOR.bgElevated }}
          >
            <div>
              <h2
                className="max-w-[18ch] font-extrabold"
                style={{
                  fontFamily: "var(--font-display-mono)",
                  color: COLOR.fg,
                  letterSpacing: "-0.02em",
                  fontSize: "clamp(1.6rem, 1.2rem + 1.8vw, 2.75rem)",
                  lineHeight: 1.05,
                }}
              >
                {matches.length} live matches waiting in {categoryLabel}.
              </h2>
              <p className="mt-4 text-[15px] font-normal" style={{ color: COLOR.muted, lineHeight: 1.6, maxWidth: "500px" }}>
                That count moves with the filter you set above — it's the same
                board, not a separate preview. Save the filter and we&rsquo;ll
                tell you the moment a new pair threads.
              </p>
              <a
                href="#preview"
                className={`mt-6 inline-flex items-center gap-2 rounded-md px-5 py-3 text-[14px] font-semibold transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
                style={{ background: COLOR.accent, color: COLOR.inkOnAccent }}
              >
                See the {categoryLabel.toLowerCase()} board
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="rounded-md border p-5" style={{ borderColor: COLOR.border, background: COLOR.bgCard }}>
              <p className="text-[13px] font-semibold" style={{ color: COLOR.fg }}>
                Get notified for new {categoryLabel.toLowerCase()} matches
              </p>
              {subscribed ? (
                <p className="mt-4 flex items-start gap-2 text-[13px] font-normal" style={{ color: COLOR.accentBright, lineHeight: 1.5 }}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  You&rsquo;re set — we&rsquo;ll email new {categoryLabel.toLowerCase()}{" "}
                  matches as sellers list them.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mt-4">
                  <label htmlFor={inputId} className="text-[12px] font-normal" style={{ color: COLOR.mutedDim }}>
                    Email address
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                        style={{ color: COLOR.mutedDim }}
                        aria-hidden="true"
                      />
                      <input
                        id={inputId}
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full rounded-md border bg-transparent py-2.5 pl-9 pr-3 text-[13px] font-normal ${FOCUS_RING}`}
                        style={{ borderColor: COLOR.border, color: COLOR.fg }}
                      />
                    </div>
                    <button
                      type="submit"
                      className={`shrink-0 rounded-md px-4 py-2.5 text-[13px] font-semibold ${FOCUS_RING}`}
                      style={{ background: COLOR.accent, color: COLOR.inkOnAccent }}
                    >
                      Notify me
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
