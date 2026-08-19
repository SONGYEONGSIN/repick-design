"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cx, FOCUS } from "./data";

type Status = "idle" | "invalid" | "loading" | "done";

// Fixed delay so the loading state is visible without depending on the wall
// clock — a plain setTimeout duration, not Date.now()-derived content.
const SUBMIT_DELAY_MS = 700;

/**
 * Closing-section email capture — the brief's "form/newsletter" interaction.
 * Validates on blur and on submit (ux-guidelines Forms: inline validation +
 * submit feedback), shows a real loading state, and ends in a persistent
 * success message rather than a silent no-op.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const inputId = useId();
  const errorId = useId();

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validate = () => {
    if (!isValidEmail(email)) {
      setStatus("invalid");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    window.setTimeout(() => setStatus("done"), SUBMIT_DELAY_MS);
  };

  if (status === "done") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2.5 rounded-xl border border-emerald-700 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800"
      >
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
        Certificate preview on its way — check your inbox.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <div className="flex-1">
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold text-zinc-600">
          Work email <span className="text-emerald-700">*</span>
        </label>
        <input
          id={inputId}
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "invalid") setStatus("idle");
          }}
          onBlur={validate}
          aria-invalid={status === "invalid"}
          aria-describedby={status === "invalid" ? errorId : undefined}
          placeholder="you@example.com"
          className={cx(
            "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm font-normal text-zinc-950 placeholder:text-zinc-500",
            status === "invalid" ? "border-red-600" : "border-zinc-300",
            FOCUS,
          )}
        />
        {status === "invalid" && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs font-normal text-red-700">
            Enter a valid email address to get a sample certificate.
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className={cx(
          "mt-[1.625rem] inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70 sm:mt-[1.625rem]",
          FOCUS,
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Sending
          </>
        ) : (
          <>
            Send me a sample
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
          </>
        )}
      </button>
    </form>
  );
}
