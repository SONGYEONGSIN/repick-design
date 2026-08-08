import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { CHAPTERS, COMPANY_NAME, FOCUS_RING, HERO_STATS, PEOPLE } from "./data";
import PersonFlipCard from "./person-flip-card";
import ProofTabs from "./proof-tabs";
import ValuesToggle from "./values-toggle";

export const metadata: Metadata = {
  title: `About — ${COMPANY_NAME}`,
  description:
    "Millrace reconciles every invoice against every payment automatically, so a finance team's close finishes in days, not weeks.",
};

/**
 * Chaptered-narrative archetype: a numbered chapter spine (01–06) walks the reader from problem to
 * proof to people, deliberately not a milestone-year timeline and not a diagram synced to hover
 * state (both already used elsewhere in this catalog). Three wired interactions: the person
 * flip-cards (person-flip-card.tsx), the build-for/push-back-on values toggle (values-toggle.tsx),
 * and the proof-category button group (proof-tabs.tsx). Exactly three font-weight classes are used
 * across this whole route: font-normal, font-medium, font-semibold. No extra display font — every
 * heading stays on the default --font-sans (Pretendard) stack, weight and size carry hierarchy.
 */
export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-900">{COMPANY_NAME}</span>
          <nav aria-label="Chapters" className="hidden gap-5 sm:flex">
            {CHAPTERS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`rounded text-sm font-normal text-zinc-600 hover:text-emerald-800 ${FOCUS_RING}`}
              >
                {c.number}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">A story in six chapters</p>
          <h1 id="hero-heading" className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl">
            The close that used to take three weeks now takes eleven days.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-600">
            {COMPANY_NAME} matches every invoice against every payment automatically, and explains the
            ones it can&apos;t — so a finance team spends the close reviewing exceptions, not chasing PDFs.
          </p>
          <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-zinc-100 pt-8 sm:grid-cols-3">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <dd className="text-2xl font-semibold tabular-nums text-zinc-900">{stat.value}</dd>
                <dt className="mt-1 text-sm font-normal text-zinc-600">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Chapter 01 — The Bottleneck */}
        <section id="bottleneck" aria-labelledby="bottleneck-heading" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium tabular-nums text-emerald-700">{CHAPTERS[0].number}</p>
            <h2 id="bottleneck-heading" className="mt-2 text-2xl font-semibold text-zinc-900">
              {CHAPTERS[0].title}
            </h2>
            <p className="mt-4 text-base font-normal leading-relaxed text-zinc-700">
              Every finance team we talked to in our first year described the same week: two people,
              a stack of PDFs, and a spreadsheet that had to reconcile a bank statement against an ERP
              that had never agreed to speak the same language. The bottleneck wasn&apos;t effort. It
              was that reconciliation had never been treated as software — it was treated as a task a
              careful enough person could eventually finish by hand.
            </p>
          </div>
        </section>

        {/* Chapter 02 — The Turn */}
        <section id="turn" aria-labelledby="turn-heading" className="border-t border-zinc-100">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium tabular-nums text-emerald-700">{CHAPTERS[1].number}</p>
            <h2 id="turn-heading" className="mt-2 text-2xl font-semibold text-zinc-900">
              {CHAPTERS[1].title}
            </h2>
            <p className="mt-4 text-base font-normal leading-relaxed text-zinc-700">
              Dev had built matching pipelines before, at a payments processor moving far more line
              items than any single finance team ever would. The pipeline wasn&apos;t the hard part —
              the hard part nobody had built was the part that explains itself. A match a controller
              can&apos;t defend to an auditor isn&apos;t a match, it&apos;s a guess with good uptime.
              {COMPANY_NAME} started as a matcher that had to show its work on every line.
            </p>
          </div>
        </section>

        {/* Chapter 03 — Values */}
        <section id="values" aria-labelledby="values-heading" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium tabular-nums text-emerald-700">{CHAPTERS[2].number}</p>
            <h2 id="values-heading" className="mt-2 text-2xl font-semibold text-zinc-900">
              {CHAPTERS[2].title}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Four commitments, and the anti-pattern each one is a direct answer to. Toggle between
              them — the copy changes, not just the label.
            </p>
            <div className="mt-8">
              <ValuesToggle />
            </div>
          </div>
        </section>

        {/* Chapter 04 — Proof */}
        <section id="proof" aria-labelledby="proof-heading" className="border-t border-zinc-100">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium tabular-nums text-emerald-700">{CHAPTERS[3].number}</p>
            <h2 id="proof-heading" className="mt-2 text-2xl font-semibold text-zinc-900">
              {CHAPTERS[3].title}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Reliability, adoption, scale — three categories of the same ledger, one at a time.
            </p>
            <div className="mt-8">
              <ProofTabs />
            </div>
          </div>
        </section>

        {/* Chapter 05 — People */}
        <section id="people" aria-labelledby="people-heading" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium tabular-nums text-emerald-700">{CHAPTERS[4].number}</p>
            <h2 id="people-heading" className="mt-2 text-2xl font-semibold text-zinc-900">
              {CHAPTERS[4].title}
            </h2>
            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
              Six of the people building {COMPANY_NAME}. Press a card to see who they were before this.
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PEOPLE.map((person) => (
                <li key={person.id} className="min-w-0">
                  <PersonFlipCard person={person} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Chapter 06 — Where We're Headed */}
        <section id="headed" aria-labelledby="headed-heading" className="border-t border-zinc-100">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <p className="text-sm font-medium tabular-nums text-emerald-700">{CHAPTERS[5].number}</p>
            <h2 id="headed-heading" className="mt-2 text-2xl font-semibold text-zinc-900">
              {CHAPTERS[5].title}
            </h2>
            <p className="mt-4 text-base font-normal leading-relaxed text-zinc-700">
              340 finance teams close on {COMPANY_NAME} today. The next chapter is the same chapter as
              the first one: fewer things a controller has to take on faith. We&apos;re hiring people
              who&apos;d rather build the explanation than the illusion of one.
            </p>
            <a
              href="mailto:careers@millrace.example"
              className={`mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 motion-reduce:transition-none ${FOCUS_RING}`}
            >
              See open roles
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
