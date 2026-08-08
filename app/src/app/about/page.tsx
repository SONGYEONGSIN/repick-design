import type { Metadata } from "next";
import { ArrowRight, GitBranch, Mail, ShieldCheck } from "lucide-react";
import OrgBreakdown from "./org-breakdown";
import ValuesMasterDetail from "./values-master-detail";
import { FOCUS_RING, MILESTONES, PEOPLE, STATS } from "./data";

export const metadata: Metadata = {
  title: "About — Ordinal",
  description:
    "Ordinal turns a company's approval chains and compliance rules into software that runs them in the right sequence, with a record of who signed off and why.",
};

/**
 * Archetype: a hierarchical org breakdown for People (regroup toggle + tree-style expand/collapse,
 * not the flat click-expand pod list or the department-chip/search directory used elsewhere in this
 * catalogue) paired with a master-detail list for Values (a plain button list swapping a single
 * detail panel — explicitly not a tablist, not an accordion, not a carousel). Dark theme, blue
 * accent, --font-display-wide for display type only. Exactly three font-weight classes route-wide:
 * font-normal, font-semibold, font-bold.
 */
export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <span
            className="text-lg font-semibold tracking-tight text-zinc-50"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Ordinal
          </span>
          <a
            href="mailto:careers@ordinalhq.io"
            className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-50 hover:border-zinc-700 ${FOCUS_RING}`}
          >
            See open roles
            <Mail aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">About Ordinal</p>
          <h1
            id="hero-heading"
            className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Every process has a correct order. Ours enforces it.
          </h1>
          <p className="mt-6 max-w-xl text-lg font-normal leading-relaxed text-zinc-400">
            Ordinal turns a company&apos;s approval chains and compliance rules into software that
            runs them in the right sequence, every time, with a record of who signed off and why.
            No more policy binder nobody reads.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-zinc-800 pt-8 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-sm font-normal text-zinc-400">{s.label}</dt>
                <dd
                  className="mt-1 text-2xl font-bold tabular-nums text-zinc-50 sm:text-3xl"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* What we build — static, informational */}
        <section aria-labelledby="mission-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="mission-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              How the system stays in order
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Three things a compliance rule needs to actually hold, in the order we build them.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                  <GitBranch aria-hidden="true" className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-50">Define the chain</h3>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-400">
                  A workflow spec names every step, every approver, and every named exception before
                  it can be published.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                  <ShieldCheck aria-hidden="true" className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-50">Enforce the order</h3>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-400">
                  The engine runs the sequence itself — a step can&apos;t be skipped, only overridden
                  by name, on the record.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                  <ArrowRight aria-hidden="true" className="h-4.5 w-4.5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-50">Show the record</h3>
                <p className="mt-1.5 text-sm font-normal leading-relaxed text-zinc-400">
                  Every run gets a permanent audit page — the same one the requester, the approver,
                  and the auditor all read.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* People */}
        <section aria-labelledby="people-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="people-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              The {PEOPLE.length} people who build it
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Same team, two ways to slice it. Toggle the grouping, then open a node to see who&apos;s
              in it — the first one starts open.
            </p>
            <div className="mt-8">
              <OrgBreakdown />
            </div>
          </div>
        </section>

        {/* Values */}
        <section aria-labelledby="values-heading" className="border-t border-zinc-800 bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="values-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              What we actually believe
            </h2>
            <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-400">
              Five statements, numbered on purpose. Pick one to read the reasoning and the practice
              behind it.
            </p>
            <div className="mt-8">
              <ValuesMasterDetail />
            </div>
          </div>
        </section>

        {/* Milestones — static, non-interactive by design: four facts don't need a mechanism */}
        <section aria-labelledby="milestones-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="milestones-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              How we got here
            </h2>
            <ol className="mt-8 space-y-6 border-l border-zinc-800 pl-6">
              {MILESTONES.map((m) => (
                <li key={m.year} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-400" />
                  <span
                    className="text-sm font-semibold tabular-nums text-blue-400"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    {m.year}
                  </span>
                  <p className="mt-1 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="cta-heading" className="border-t border-zinc-800">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-16 sm:px-6">
            <h2 id="cta-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
              Want to see the org chart change shape?
            </h2>
            <a
              href="mailto:careers@ordinalhq.io"
              className={`inline-flex items-center gap-2 rounded-full bg-blue-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-blue-300 ${FOCUS_RING}`}
            >
              Email the team
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm font-normal text-zinc-400 sm:px-6">
          Copyright 2026 Ordinal, Inc.
        </div>
      </footer>
    </div>
  );
}
