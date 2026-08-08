"use client";

import { useState } from "react";
import { Magnet } from "lucide-react";
import NextSection from "./next-section";
import PillarStrip from "./pillar-strip";
import PrinciplesSection from "./principles-section";
import RecordSection from "./record-section";
import TeamSection from "./team-section";
import {
  BRAND,
  CURRENT_YEAR,
  DISPLAY,
  FOCUS_PAGE,
  FOUNDED_YEAR,
  HEADCOUNT,
  MILESTONES,
  PLACES,
  cx,
  formatValue,
  member,
  pillar,
  principleFor,
  type PillarId,
} from "./data";

const SHELL = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const SKIP =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-lime-800 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-900 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50";

const NAV = [
  { href: "#record", label: "Record" },
  { href: "#principles", label: "Principles" },
  { href: "#people", label: "People" },
  { href: "#next", label: "Next" },
];

/**
 * Ferrous, told to a prospective customer who clicked "About" while deciding whether to trust us.
 *
 * One piece of state runs the page: which of the four measures the reader is tracking. It is not a
 * filter and it hides nothing — everything on the page is present at every setting. What it does is
 * hold a single thread taut through four sections that would otherwise be four separate brochures:
 *
 *   hero        the figure, and the name of the person answerable for it
 *   record      that figure as it read at the end of each of six years, beside who moved it
 *   principles  the rule that produces it, and the refusal that rule costs us
 *   people      the card of the person who holds it
 *
 * That is the difference between this and a personal profile page. A profile can stack one subject's
 * statistics in a fixed band and be done; an organisation has to say *which* of its people each claim
 * belongs to, or the claim belongs to nobody. So the measures here are a control rather than a
 * banner, and every section they reach through names a different person.
 */
export default function AboutClient() {
  const [selected, setSelected] = useState<PillarId>("disputed");

  const measure = pillar(selected);
  const owner = member(measure.owner);
  const rule = principleFor(selected);
  const origin = MILESTONES[0];

  const linkage = `${measure.label} stands at ${formatValue(measure, measure.value)}. ${owner.name}, ${
    owner.role
  }, is answerable for it, under the rule: ${rule.does} At the end of ${origin.year} it read ${formatValue(
    measure,
    origin.readings[selected],
  )}.`;

  return (
    <div className="flex min-h-dvh flex-col bg-stone-50 text-stone-900">
      <a href="#main" className={SKIP}>
        Skip to the main content
      </a>

      <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className={cx(SHELL, "flex items-center gap-4 py-3")}>
          <span className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-stone-300 bg-white text-lime-800"
            >
              <Magnet className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-stone-900" style={DISPLAY}>
              {BRAND}
            </span>
          </span>

          <nav aria-label="Sections of this page" className="ml-auto hidden items-center gap-5 sm:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cx("rounded text-sm font-medium text-stone-600 hover:text-stone-900", FOCUS_PAGE)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        <section aria-labelledby="page-title" className="pt-12 pb-14 sm:pt-16 sm:pb-20">
          <div className={SHELL}>
            <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-lime-800 uppercase">
              <span aria-hidden="true" className="h-px w-8 flex-none bg-lime-700" />
              About {BRAND}
            </p>

            <h1
              id="page-title"
              className="mt-5 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance text-stone-900 sm:text-4xl lg:text-5xl"
              style={DISPLAY}
            >
              A used listing, read the way a careful person reads it.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed font-normal text-stone-600 sm:text-lg">
              {BRAND} is a resale marketplace where nothing is listed until it has been graded. The
              grade is written against a rubric we publish, checked by a person whenever the model is
              unsure, and owned by someone whose name is on this page.
            </p>

            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-normal text-stone-600">
              <span>{PLACES}</span>
              <span aria-hidden="true">&middot;</span>
              <span className="tabular-nums">
                Trading since {FOUNDED_YEAR}, {CURRENT_YEAR - FOUNDED_YEAR} years
              </span>
              <span aria-hidden="true">&middot;</span>
              <span className="tabular-nums">{HEADCOUNT} people</span>
            </p>

            <h2 className="mt-10 text-sm font-medium tracking-[0.16em] text-stone-600 uppercase">
              How proven it is, at the end of {CURRENT_YEAR}
            </h2>

            <div className="mt-4">
              <PillarStrip selected={selected} onSelect={setSelected} />
            </div>

            <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
              <p className="text-xs font-medium tracking-[0.16em] text-stone-600 uppercase">
                From the number to the person
              </p>
              <p
                role="status"
                className="mt-2 max-w-3xl text-base leading-relaxed font-normal text-stone-900"
              >
                {linkage}
              </p>
              <p className="mt-3 text-sm leading-relaxed font-normal text-stone-600">
                Select any of the four above and the rest of this page follows it: the history redraws,
                the rule that produces it is marked, and so is the card of the person who holds it.
              </p>
            </div>
          </div>
        </section>

        <RecordSection selected={selected} />
        <PrinciplesSection selected={selected} />
        <TeamSection selected={selected} />
        <NextSection />
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className={cx(SHELL, "py-6 text-xs leading-relaxed font-normal text-stone-600")}>
          &copy; {CURRENT_YEAR} {BRAND} B.V., {PLACES}. Figures on this page cover completed
          transactions on the {BRAND} marketplace from {FOUNDED_YEAR} to {CURRENT_YEAR} and are
          reviewed once a year by an independent assessor. Grades describe condition, not authenticity
          of ownership.
        </div>
      </footer>
    </div>
  );
}
