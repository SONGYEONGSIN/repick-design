"use client";

import { useCallback, useState } from "react";
import { Check, Code, FileText, Hash, Mail, ShieldCheck, X } from "lucide-react";
import CopyButton, { type CopyState } from "./CopyButton";
import {
  BOILERPLATES,
  BOILERPLATE_APPROVED,
  BRAND_COLORS,
  CONTACTS,
  FACTS,
  FORMATS,
  RECORD_NEXT,
  RECORD_REVIEWED,
  STYLE_RULES,
  formatBoilerplate,
  formatFact,
  formatRecord,
  wordCount,
  type CiteFormat,
} from "./data";

const FORMAT_ICONS = { plain: FileText, markdown: Hash, bibtex: Code };

const SEGMENT_BASE =
  "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
const SEGMENT_ON = "border-zinc-900 bg-zinc-900 text-white";
const SEGMENT_OFF = "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900";

type Status = { id: string; label: string; ok: boolean; payload: string };

export default function KitBody() {
  const [format, setFormat] = useState<CiteFormat>("plain");
  const [variant, setVariant] = useState("standard");
  const [status, setStatus] = useState<Status | null>(null);

  const copy = useCallback(async (id: string, label: string, payload: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(payload);
        setStatus({ id, label, ok: true, payload });
        return;
      }
    } catch {
      setStatus({ id, label, ok: false, payload });
      return;
    }
    setStatus({ id, label, ok: false, payload });
  }, []);

  const stateOf = (id: string): CopyState =>
    status && status.id === id ? (status.ok ? "copied" : "failed") : "idle";

  const activeFormat = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
  const boilerplate = BOILERPLATES.find((b) => b.id === variant) ?? BOILERPLATES[1];
  const preview = formatFact(FACTS[0], format);

  const statusMessage = status
    ? status.ok
      ? `Copied ${status.label} as ${activeFormat.name}.`
      : `Copy blocked by this browser. ${status.label} is waiting in the manual copy panel at the bottom of the screen.`
    : "Nothing copied yet. Every fact stays readable whether you copy it or not.";

  return (
    <div className="font-normal">
      <section
        aria-labelledby="carry-heading"
        className="mt-10 rounded-xl border border-zinc-300 bg-white p-5 sm:p-7"
      >
        <h2
          id="carry-heading"
          className="text-xl font-semibold tracking-tight text-zinc-900"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Carry it as
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-zinc-600">
          Nothing on this page is hidden behind a button. This control only changes the shape a fact
          arrives in when you take it with you.
        </p>

        <div role="group" aria-label="Citation format" className="mt-5 flex flex-wrap gap-2">
          {FORMATS.map((f) => {
            const Icon = FORMAT_ICONS[f.id];
            const on = f.id === format;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setFormat(f.id);
                  setStatus(null);
                }}
                className={`${SEGMENT_BASE} ${on ? SEGMENT_ON : SEGMENT_OFF}`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm font-normal text-zinc-600">{activeFormat.hint}</p>

        <p
          role="status"
          aria-live="polite"
          className="mt-5 border-l-2 border-amber-600 py-1 pl-3 text-sm font-normal leading-6 text-zinc-700"
        >
          {statusMessage}
        </p>

        <figure className="mt-5">
          <figcaption className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
            What a copy looks like right now — {FACTS[0].label}
          </figcaption>
          <pre className="mt-2 max-h-60 overflow-y-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-900 p-4 text-xs font-normal leading-6 text-zinc-100">
            {preview}
          </pre>
        </figure>
      </section>

      <section aria-labelledby="record-heading" className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-zinc-900 pb-3">
          <div className="min-w-0">
            <h2
              id="record-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              The record
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-zinc-600">
              Twelve facts a reporter has to get right, each with the date it was last checked and
              the person who will confirm it on the phone.
            </p>
          </div>
          <CopyButton
            label={`all twelve facts as ${activeFormat.name}`}
            tone="solid"
            state={stateOf("record-all")}
            onCopy={() =>
              void copy(
                "record-all",
                `all twelve facts as ${activeFormat.name}`,
                formatRecord(format),
              )
            }
          />
        </div>

        <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map((fact) => (
            <li key={fact.id} className="flex min-w-0 flex-col bg-white p-5">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                {fact.label}
              </h3>
              <p
                className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-zinc-900 tabular-nums"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                {fact.value}
              </p>
              <p className="mt-3 text-sm font-normal leading-6 text-zinc-600">{fact.detail}</p>
              <div className="mt-4 flex items-start gap-2 border-t border-zinc-100 pt-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                <p className="text-xs font-normal leading-5 text-zinc-600">
                  Verified{" "}
                  <time dateTime={fact.verifiedIso} className="font-medium text-zinc-900 tabular-nums">
                    {fact.verifiedOn}
                  </time>{" "}
                  by <span className="font-medium text-zinc-900">{fact.confirmedBy}</span>
                </p>
              </div>
              <div className="mt-auto flex justify-end pt-4">
                <CopyButton
                  label={fact.label}
                  state={stateOf(fact.id)}
                  onCopy={() => void copy(fact.id, fact.label, formatFact(fact, format))}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="style-heading" className="mt-14">
        <h2
          id="style-heading"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Write this, not this
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-zinc-600">
          Six errors account for almost every correction we have requested since 2023. They are
          printed here so you never have to ask.
        </p>
        <ul className="mt-6 divide-y divide-zinc-200 border-y border-zinc-200">
          {STYLE_RULES.map((rule) => (
            <li
              key={rule.id}
              className="grid gap-2 py-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)_minmax(0,1.4fr)] sm:items-baseline sm:gap-6"
            >
              <p className="flex min-w-0 items-baseline gap-2 text-base font-medium text-zinc-900">
                <Check className="h-4 w-4 shrink-0 translate-y-0.5 text-amber-700" aria-hidden="true" />
                <span>{rule.write}</span>
              </p>
              <p className="flex min-w-0 items-baseline gap-2 text-base font-normal text-zinc-600">
                <X className="h-4 w-4 shrink-0 translate-y-0.5 text-orange-800" aria-hidden="true" />
                <span className="line-through decoration-orange-800">{rule.notThis}</span>
              </p>
              <p className="min-w-0 text-sm font-normal leading-6 text-zinc-600">{rule.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="boilerplate-heading" className="mt-14">
        <h2
          id="boilerplate-heading"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Approved boilerplate
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-zinc-600">
          Three lengths, all three approved on {BOILERPLATE_APPROVED}. Pick the one that fits your
          hole in the page. None of them needs our sign-off before it runs.
        </p>

        <div
          role="group"
          aria-label="Boilerplate length"
          className="mt-5 flex flex-wrap gap-2"
        >
          {BOILERPLATES.map((bp) => {
            const on = bp.id === variant;
            return (
              <button
                key={bp.id}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setVariant(bp.id);
                  setStatus(null);
                }}
                className={`${SEGMENT_BASE} ${on ? SEGMENT_ON : SEGMENT_OFF}`}
              >
                <span>{bp.name}</span>
                <span className="tabular-nums">{wordCount(bp.text)} words</span>
              </button>
            );
          })}
        </div>

        <figure className="mt-5 rounded-xl border border-zinc-300 bg-white p-5 sm:p-7">
          <blockquote
            className="max-w-3xl text-lg font-normal leading-8 text-zinc-900 sm:text-xl sm:leading-9"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {boilerplate.text}
          </blockquote>
          <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
            <span className="min-w-0 text-sm font-normal leading-6 text-zinc-600">
              {boilerplate.fitFor}
            </span>
            <CopyButton
              label={`the ${boilerplate.name.toLowerCase()} boilerplate`}
              tone="solid"
              state={stateOf(`bp-${boilerplate.id}`)}
              onCopy={() =>
                void copy(
                  `bp-${boilerplate.id}`,
                  `the ${boilerplate.name.toLowerCase()} boilerplate`,
                  formatBoilerplate(boilerplate, format),
                )
              }
            />
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="marks-heading" className="mt-14">
        <h2
          id="marks-heading"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Mark and color
        </h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="min-w-0 rounded-xl border border-zinc-300 bg-white p-6">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 48 48" className="h-14 w-14 shrink-0" role="img" aria-label="Tolvan Systems mark">
                <rect width="48" height="48" rx="11" className="fill-zinc-900" />
                <path
                  d="M13 29 L24 15 L35 29"
                  className="stroke-amber-500"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path d="M13 35 H35" className="stroke-amber-500" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span
                className="text-3xl font-semibold tracking-[0.18em] text-zinc-900"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                TOLVAN
              </span>
            </div>
            <ul className="mt-6 space-y-2 text-sm font-normal leading-6 text-zinc-600">
              <li>Clear space around the lockup equals the height of the mark.</li>
              <li>The chevron never appears without the wordmark in press use.</li>
              <li>Do not place the lockup on a photograph, a gradient, or Signal Rust.</li>
            </ul>
          </div>

          <ul className="grid min-w-0 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
            {BRAND_COLORS.map((color) => (
              <li key={color.id} className="flex min-w-0 flex-col bg-white p-5">
                <span
                  className={`h-12 w-full rounded-md ring-1 ring-inset ring-zinc-300 ${color.swatch}`}
                  aria-hidden="true"
                />
                <h3 className="mt-3 text-base font-medium text-zinc-900">{color.name}</h3>
                <p className="mt-1 text-sm font-normal tracking-wide text-zinc-700 tabular-nums">
                  {color.hex}
                </p>
                <p className="mt-2 text-sm font-normal leading-6 text-zinc-600">{color.use}</p>
                <div className="mt-auto flex justify-end pt-4">
                  <CopyButton
                    label={`${color.name} ${color.hex}`}
                    state={stateOf(`color-${color.id}`)}
                    onCopy={() => void copy(`color-${color.id}`, `${color.name} ${color.hex}`, color.hex)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="contacts-heading" className="mt-14">
        <h2
          id="contacts-heading"
          className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-display-grotesk)" }}
        >
          Who confirms what
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-zinc-600">
          A fact without a person behind it is a rumor with better typography. These three answer for
          the record above. Full review {RECORD_REVIEWED}, next one {RECORD_NEXT}.
        </p>
        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {CONTACTS.map((contact) => (
            <li
              key={contact.id}
              className="flex min-w-0 flex-col rounded-xl border border-zinc-300 bg-white p-5"
            >
              <h3 className="text-lg font-medium text-zinc-900">{contact.name}</h3>
              <p className="mt-1 text-sm font-normal text-zinc-600">{contact.role}</p>
              <p className="mt-3 text-sm font-normal leading-6 text-zinc-600">{contact.covers}</p>
              <p className="mt-3 flex items-start gap-2 text-sm font-normal leading-6 text-zinc-700">
                <Mail className="mt-1 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                <a
                  href={`mailto:${contact.email}`}
                  className="break-all font-medium text-zinc-900 underline decoration-amber-600 decoration-2 underline-offset-4 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
                >
                  {contact.email}
                </a>
              </p>
              <p className="mt-2 text-xs font-normal leading-5 text-zinc-600 tabular-nums">
                Reply time: {contact.turnaround}
              </p>
              <div className="mt-auto flex justify-end pt-4">
                <CopyButton
                  label={`the address for ${contact.name}`}
                  state={stateOf(`contact-${contact.id}`)}
                  onCopy={() =>
                    void copy(`contact-${contact.id}`, `the address for ${contact.name}`, contact.email)
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {status && !status.ok ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-orange-800 bg-white p-4 shadow-lg sm:p-5">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="min-w-0 text-sm font-medium leading-6 text-zinc-900">
                This browser refused the clipboard. Select the text below and copy it by hand —{" "}
                {status.label}, as {activeFormat.name}.
              </p>
              <button
                type="button"
                onClick={() => setStatus(null)}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors duration-150 hover:border-zinc-900 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
              >
                <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Dismiss</span>
              </button>
            </div>
            <pre className="max-h-40 select-all overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-xs font-normal leading-6 text-zinc-800">
              {status.payload}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}
