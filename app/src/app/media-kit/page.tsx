import type { Metadata } from "next";
import { FileClock, Repeat, ShieldCheck } from "lucide-react";
import KitBody from "./KitBody";
import {
  COMPANY,
  CORRECTIONS_EMAIL,
  PRESS_URL,
  RECORD_NEXT,
  RECORD_REVIEWED,
  RECORD_REVIEWED_ISO,
} from "./data";

export const metadata: Metadata = {
  title: "Tolvan Systems — press record and media kit",
  description:
    "Twelve verified facts about Tolvan Systems, Inc., each with a check date and a named confirmer, ready to carry away as plain text, Markdown, or BibTeX.",
};

const STAMPS = [
  {
    id: "reviewed",
    icon: ShieldCheck,
    label: "Full review",
    value: RECORD_REVIEWED,
    note: "Every line below was re-checked against source documents on this date.",
  },
  {
    id: "next",
    icon: Repeat,
    label: "Next review",
    value: RECORD_NEXT,
    note: "Figures move between reviews only with a dated note attached.",
  },
  {
    id: "corrections",
    icon: FileClock,
    label: "Corrections",
    value: CORRECTIONS_EMAIL,
    note: "Send us the URL and the line. We answer within one business day.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-50 font-normal text-zinc-900">
      <div className="mx-auto w-full max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:px-10">
        <header>
          <div className="h-1 w-full rounded-full bg-amber-500" />
          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            <span>Press record</span>
            <span className="tabular-nums">Sheet 01 of 01</span>
            <span className="normal-case tracking-normal">{PRESS_URL}</span>
          </div>

          <h1
            className="mt-7 text-5xl font-semibold leading-[0.95] tracking-tight text-zinc-900 sm:text-7xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Tolvan Systems
          </h1>
          <p
            className="mt-3 text-xl font-medium tracking-tight text-amber-800 sm:text-2xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Media kit for people who have to get it right
          </p>
          <p className="mt-5 max-w-2xl text-base font-normal leading-7 text-zinc-700">
            A logo is easy to replace. A wrong founding year lives in the archive forever. So this
            kit leads with the facts a story can be wrong about — printed in full, dated, and signed
            by the person who will confirm them if you call.
          </p>

          <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
            {STAMPS.map((stamp) => {
              const Icon = stamp.icon;
              return (
                <li key={stamp.id} className="min-w-0 bg-white p-5">
                  <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-600">
                    <Icon className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                    <span>{stamp.label}</span>
                  </p>
                  <p className="mt-2 break-words text-lg font-medium text-zinc-900 tabular-nums">
                    {stamp.value}
                  </p>
                  <p className="mt-2 text-sm font-normal leading-6 text-zinc-600">{stamp.note}</p>
                </li>
              );
            })}
          </ul>
        </header>

        <KitBody />

        <footer className="mt-16 border-t-2 border-zinc-900 pt-6">
          <h2
            className="text-lg font-semibold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Citing the kit itself
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-normal leading-6 text-zinc-600">
            {COMPANY}, press record, reviewed {RECORD_REVIEWED_ISO}. Retrieved from {PRESS_URL}. If a
            figure here contradicts something we said elsewhere, this page is the one that is
            current — and {CORRECTIONS_EMAIL} wants to hear about the other one.
          </p>
          <p className="mt-4 text-xs font-normal uppercase tracking-[0.18em] text-zinc-600">
            {COMPANY} — Pittsburgh and Gothenburg
          </p>
        </footer>
      </div>
    </main>
  );
}
