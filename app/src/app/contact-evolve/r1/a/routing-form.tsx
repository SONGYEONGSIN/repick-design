"use client";

import { useId, useState } from "react";
import { Check, CircleAlert, Send } from "lucide-react";
import {
  EMAIL_PATTERN,
  FOCUS_RING,
  referenceCode,
  type Desk,
  type Field,
} from "./data";

/**
 * The form is a *consequence* of the routing choice, not the page's premise: which fields exist,
 * which are required, and what the hints ask for all come from the desk the visitor picked upstream.
 * The parent remounts this with `key={desk.id}`, so switching desks clears half-typed answers that
 * would no longer mean anything — a stale "Severity: P1" carried into a press enquiry is worse than
 * an empty field.
 */
export default function RoutingForm({
  desk,
  replySummary,
}: {
  desk: Desk;
  replySummary: string;
}) {
  const formId = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  const fieldId = (field: Field) => `${formId}-${field.name}`;
  const errorId = (field: Field) => `${formId}-${field.name}-error`;
  const hintId = (field: Field) => `${formId}-${field.name}-hint`;

  function validate(): Record<string, string> {
    const found: Record<string, string> = {};
    for (const field of desk.fields) {
      const value = (values[field.name] ?? "").trim();
      if (field.required && value === "") {
        found[field.name] =
          field.kind === "select" ? "Pick one so the message lands in the right queue." : "This one is required.";
        continue;
      }
      if (field.kind === "email" && value !== "" && !EMAIL_PATTERN.test(value)) {
        found[field.name] = "That address is missing an @ or a domain — we would have nowhere to reply.";
      }
    }
    return found;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    const firstBad = desk.fields.find((field) => found[field.name]);
    if (firstBad) {
      document.getElementById(fieldId(firstBad))?.focus();
      return;
    }
    const seed = desk.fields.map((field) => `${field.name}=${(values[field.name] ?? "").trim()}`).join(";");
    setSent(referenceCode(desk.id, seed));
  }

  function update(name: string, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  }

  if (sent) {
    return (
      <div
        role="status"
        className="animate-[rise_0.35s_ease-out_both] rounded-2xl border border-emerald-700 bg-emerald-50 p-6 motion-reduce:animate-none sm:p-8"
      >
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <Check aria-hidden="true" className="h-4 w-4 flex-none" />
          Routed to {desk.name}
        </p>
        <p className="mt-4 text-2xl font-bold tracking-tight text-zinc-900">{replySummary}</p>
        <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-700">
          {desk.owner} owns it from here, {desk.slaLabel}. Quote the reference below if you need to chase it, or if you
          remember something you left out.
        </p>
        <dl className="mt-5 grid gap-4 border-t border-emerald-700/30 pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-700">Your reference</dt>
            <dd className="mt-1 text-lg font-bold tabular-nums text-zinc-900">{sent}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-700">Copy sent to</dt>
            <dd className="mt-1 break-words text-lg font-semibold text-zinc-900">
              {(values.email ?? "").trim() || desk.email}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setSent(null);
            setValues({});
            setErrors({});
          }}
          className={`mt-6 rounded-full border border-zinc-400 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors duration-150 hover:border-zinc-900 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          Write another message
        </button>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-zinc-300 bg-white p-6 sm:p-8">
      <h3 className="text-lg font-bold tracking-tight text-zinc-900">Write to {desk.name}</h3>
      <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-600">
        {desk.fields.filter((field) => field.required).length} required answers on this desk — they change with the
        desk, because the queues need different things.
      </p>

      {errorCount > 0 && (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2 rounded-lg border border-red-700 bg-red-50 p-3 text-sm font-semibold text-red-800"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
          <span>
            {errorCount} answer{errorCount === 1 ? "" : "s"} still needed. Nothing was sent — the details are marked
            below.
          </span>
        </p>
      )}

      <div className="mt-6 space-y-5">
        {desk.fields.map((field) => {
          const invalid = Boolean(errors[field.name]);
          const described = [field.hint ? hintId(field) : null, invalid ? errorId(field) : null]
            .filter(Boolean)
            .join(" ");
          const shell = `w-full rounded-lg border bg-white px-3 py-2.5 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING} ${
            invalid ? "border-red-700" : "border-zinc-400"
          }`;

          return (
            <div key={field.name}>
              <label htmlFor={fieldId(field)} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-sm font-semibold text-zinc-900">{field.label}</span>
                <span className="text-xs font-normal text-zinc-600">{field.required ? "Required" : "Optional"}</span>
              </label>

              {field.hint && (
                <p id={hintId(field)} className="mt-1 text-xs font-normal leading-relaxed text-zinc-600">
                  {field.hint}
                </p>
              )}

              <div className="mt-2">
                {field.kind === "textarea" ? (
                  <textarea
                    id={fieldId(field)}
                    name={field.name}
                    rows={4}
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    aria-invalid={invalid}
                    aria-describedby={described || undefined}
                    onChange={(event) => update(field.name, event.target.value)}
                    className={`${shell} resize-y leading-relaxed`}
                  />
                ) : field.kind === "select" ? (
                  <select
                    id={fieldId(field)}
                    name={field.name}
                    value={values[field.name] ?? ""}
                    aria-invalid={invalid}
                    aria-describedby={described || undefined}
                    onChange={(event) => update(field.name, event.target.value)}
                    className={shell}
                  >
                    <option value="">Choose one</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={fieldId(field)}
                    name={field.name}
                    type={field.kind === "email" ? "email" : "text"}
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    aria-invalid={invalid}
                    aria-describedby={described || undefined}
                    onChange={(event) => update(field.name, event.target.value)}
                    className={shell}
                  />
                )}
              </div>

              {invalid && (
                <p
                  id={errorId(field)}
                  role="alert"
                  className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-red-800"
                >
                  <CircleAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 flex-none" />
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-800 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          Send to {desk.name}
          <Send aria-hidden="true" className="h-4 w-4" />
        </button>
        <p className="text-xs font-normal leading-relaxed text-zinc-600">
          Prefer your own mail client?{" "}
          <a
            href={`mailto:${desk.email}`}
            className={`rounded font-semibold text-emerald-800 underline underline-offset-2 ${FOCUS_RING}`}
          >
            {desk.email}
          </a>{" "}
          reaches the same queue.
        </p>
      </div>
    </form>
  );
}
