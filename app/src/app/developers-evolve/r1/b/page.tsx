import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import ContractClient from "./contract-client";
import {
  CLAUSES,
  DEFAULT_INPUTS,
  FOCUS_RING,
  MAX_MB_PER_PART,
  MAX_PAGES_PER_PART,
  NEXT_SUNSET,
  REF_LABEL,
  daysFromRef,
  groupThousands,
  isoDate,
  resolve,
  unitUsd,
} from "./data";

export const metadata: Metadata = {
  title: "Tessera Extract API — the limits before the features",
  description:
    "Rate ceilings, quota and price, measured latency, the full error contract and every sunset date for the Tessera Extract API. Enter your volume once and every clause resolves to your numbers.",
};

/**
 * Archetype: the page is a contract, not a brochure.
 *
 * A developer deciding whether to adopt an API is not stopped by features. They are stopped by the
 * rate ceiling, the quota, the latency, the obligations each error places on their code, and the
 * date a version stops answering. So those are the whole page, in six numbered clauses, and the
 * masthead is a schedule of terms in force rather than a hero. Nothing here has to be uncovered:
 * every hard number renders at the default state, and the reader's inputs move the numbers rather
 * than reveal them.
 *
 * Deliberately not: a hero with one chart under it, a fixed side rail with a segmented toggle, a
 * master-detail browser, a search that narrows a list of endpoints, or a console stacked on a time
 * axis. The axis here is scale — how much you send — and the only slider on the page is a volume
 * ladder.
 *
 * Light ground, teal as the only accent, `--font-display-grotesk` on display type, body on
 * `--font-sans`, code on `--font-mono`. Exactly three weight classes route-wide: font-normal,
 * font-semibold, font-bold. Auxiliary text sits at zinc-600 or darker on every surface, because
 * half the surfaces here are zinc-50 or zinc-100 and zinc-500 is only safe on white.
 */
export default function DevelopersPage() {
  const base = resolve(DEFAULT_INPUTS);
  const sunsetDays = NEXT_SUNSET.sunset ? daysFromRef(NEXT_SUNSET.sunset) : 0;
  const sunsetDate = NEXT_SUNSET.sunset ? isoDate(NEXT_SUNSET.sunset) : "not announced";

  const terms = [
    {
      term: "Submission ceiling",
      value: `${base.plan.rps} req/s`,
      detail: `Sustained, per account, with a burst bucket of ${base.plan.burst}. Over it you get 429 and a Retry-After header.`,
    },
    {
      term: "Jobs in flight",
      value: `${base.plan.concurrent}`,
      detail:
        "The limit that binds first on almost every profile. Clause 1 turns it into documents a month.",
    },
    {
      term: "Included each month",
      value: `${groupThousands(base.plan.included)}`,
      detail: `Page-units on ${base.plan.name}, then ${unitUsd(base.plan.unit)} each. A page we cannot read bills at 40%.`,
    },
    {
      term: "Hard caps per document",
      value: `${MAX_PAGES_PER_PART} pp · ${MAX_MB_PER_PART} MB`,
      detail: "Past either one the API returns 413 and your code has to do the splitting.",
    },
    {
      term: "Next sunset",
      value: `${sunsetDays} days`,
      detail: `Version ${NEXT_SUNSET.id} stops answering on ${sunsetDate}. Announced dates have never moved.`,
    },
  ];

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className="text-lg font-bold tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Tessera
            </span>
            <span className="text-sm font-normal text-zinc-600">Extract API</span>
          </div>
          <a
            href="#clause-5"
            className={`inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition-colors duration-150 hover:border-teal-700 hover:text-teal-800 motion-reduce:transition-none ${FOCUS_RING}`}
          >
            <span className="tabular-nums">
              {NEXT_SUNSET.id} retires in {sunsetDays} days
            </span>
          </a>
        </div>
      </header>

      <main id="main">
        <section aria-labelledby="masthead-heading" className="border-b border-zinc-300">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-800">
              Tessera Extract API · terms in force · revised {REF_LABEL}
            </p>
            <h1
              id="masthead-heading"
              className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              The limits before the features.
            </h1>
            <div className="mt-6 grid max-w-4xl gap-x-10 gap-y-4 md:grid-cols-2">
              <p className="text-base font-normal leading-relaxed text-zinc-700">
                Tessera turns PDFs into ledger lines: supplier invoices, remittance advice, bank
                statements, loan files. What follows is not a feature tour. It is the set of numbers
                that can stop your integration.
              </p>
              <p className="text-base font-normal leading-relaxed text-zinc-700">
                The rate you may submit at, the concurrency that actually caps your throughput, what
                a page costs, how long extraction takes, what every error obliges your code to do,
                and the dates on which a version stops answering. Give us your volume once and all
                six clauses resolve to your numbers.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-zinc-300 pt-8 sm:grid-cols-2 lg:grid-cols-5">
              {terms.map((item) => (
                <div key={item.term} className="min-w-0">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                    {item.term}
                  </dt>
                  <dd
                    className="mt-2 break-words text-2xl font-bold tabular-nums text-zinc-900"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {item.value}
                  </dd>
                  <dd className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-700">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>

            <nav aria-label="Clauses" className="mt-10 border-t border-zinc-200 pt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
                Contents
              </p>
              <ol className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {CLAUSES.map((clause) => (
                  <li key={clause.id} className="min-w-0">
                    <a
                      href={`#${clause.id}`}
                      className={`inline-flex min-w-0 items-baseline gap-2 rounded text-sm font-normal text-zinc-800 underline decoration-zinc-300 underline-offset-4 transition-colors duration-150 hover:decoration-teal-700 hover:text-teal-800 motion-reduce:transition-none ${FOCUS_RING}`}
                    >
                      <span className="font-mono text-xs tabular-nums text-teal-800">
                        {clause.n}
                      </span>
                      <span className="min-w-0">{clause.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-5 inline-flex items-center gap-2 text-sm font-normal text-zinc-700">
                <ArrowDown aria-hidden="true" className="h-4 w-4 flex-none text-teal-700" />
                Every figure below already carries a default volume. Nothing is hidden behind a
                control.
              </p>
            </nav>
          </div>
        </section>

        <ContractClient />
      </main>

      <footer className="border-t border-zinc-300 bg-zinc-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-x-8 gap-y-4 px-4 py-10 sm:px-6">
          <p className="max-w-md text-sm font-normal leading-relaxed text-zinc-700">
            © 2026 Tessera Systems, Inc. This page is versioned with the API. Its figures were last
            revised on {REF_LABEL}, and every countdown on it is measured from that day.
          </p>
          <p className="max-w-sm text-sm font-normal leading-relaxed text-zinc-700">
            Nothing above needs a sales call. Keys are self-serve, test keys are free and capped at
            2 req/s and 500 page-units a month.
          </p>
        </div>
      </footer>
    </div>
  );
}
