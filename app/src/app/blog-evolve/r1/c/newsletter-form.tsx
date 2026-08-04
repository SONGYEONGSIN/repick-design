"use client";

import { useId, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Mail, Send } from "lucide-react";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter capture with client-side validation feedback. Submitting an invalid address keeps the
 * form in place and shows an inline error tied to the input via aria-describedby + role="alert";
 * a valid address swaps the form for a confirmation state that names the address it captured.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (trimmed.length === 0) {
      setError("Enter your email address to subscribe.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("That doesn't look like a valid email address — check for a typo.");
      return;
    }
    setError(null);
    setSubmittedEmail(trimmed);
  }

  if (submittedEmail) {
    return (
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
        <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-800">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          You&apos;re subscribed
        </p>
        <p className="mt-2 text-sm leading-relaxed font-normal text-stone-700">
          We&apos;ll send new posts to <span className="font-medium text-stone-900">{submittedEmail}</span> as soon
          as they publish — usually once a week.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedEmail(null);
            setEmail("");
          }}
          className="mt-3 rounded-sm text-sm font-medium text-orange-800 underline decoration-orange-300 underline-offset-2 transition-colors hover:text-orange-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-50"
        >
          Use a different address
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <h2 style={DISPLAY_FONT} className="flex items-center gap-1.5 text-base font-semibold text-stone-900">
        <Mail className="h-4 w-4 text-orange-700" aria-hidden="true" />
        Get the newsletter
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed font-normal text-stone-700">
        One email a week: the newest post, plus a short note from the team. No spam, unsubscribe any
        time.
      </p>

      <form className="mt-4" onSubmit={handleSubmit} noValidate>
        <label htmlFor={inputId} className="text-xs font-medium text-stone-600">
          Work email
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id={inputId}
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError(null);
            }}
            placeholder="you@studio.com"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
            className="min-w-0 flex-1 rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-normal text-stone-900 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-orange-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Subscribe
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-xs font-medium text-red-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
