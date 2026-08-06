import type { Metadata } from "next";
import { Globe2, Mail, ShieldCheck, Sparkles, Users } from "lucide-react";
import FaqAccordion from "./faq-accordion";
import RolesDirectory from "./roles-directory";
import { COMP_BANDS, DEPARTMENTS, FAQS, FOCUS_RING } from "./data";

export const metadata: Metadata = {
  title: "Careers — Northlane",
  description:
    "Northlane gives logistics and operations teams one live view of every shipment, from dock to doorstep. See open roles, how we hire, and our published compensation bands.",
};

const TOTAL_OPEN_ROLES = DEPARTMENTS.reduce((sum, d) => sum + d.roles.length, 0);

/**
 * Hiring-process FAQ accordion + department-grouped roles + transparent comp bands archetype.
 * Fixed light theme (no dark: variants), fuchsia-600 as the single always-visible accent, no
 * display typeface — everything sits on the body sans. Exactly three font-weight classes are used
 * across this whole route: font-medium, font-semibold, font-bold (counted in this file,
 * faq-accordion.tsx and roles-directory.tsx together).
 *
 * Three wired interactions: (1) FAQAccordion's single-open question list, (2) RolesDirectory's
 * per-department expand/collapse, (3) RolesDirectory's expand-all/collapse-all control derived
 * from the same state. The compensation table below is intentionally static — correct, typeset
 * numbers rather than another toggle.
 */
export default function CareersPage() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-base font-semibold tracking-tight text-zinc-900">Northlane</span>
          <a
            href="#contact"
            className={`rounded-md px-3 py-1.5 text-sm font-medium text-fuchsia-700 hover:bg-fuchsia-50 ${FOCUS_RING}`}
          >
            Contact recruiting
          </a>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-5xl px-4 pb-14 pt-16 sm:px-6 sm:pt-20">
          <p className="text-sm font-medium uppercase tracking-wide text-fuchsia-600">Careers</p>
          <h1 id="hero-heading" className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Help operations teams see every shipment before it becomes a problem.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-600">
            Northlane gives logistics and operations teams one live view of every shipment, from dock to
            doorstep, so delays get caught before customers do. We&apos;re a small, fully remote team, and we
            hire slowly on purpose.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-zinc-200 pt-8 sm:grid-cols-4">
            <div>
              <dt className="text-sm text-zinc-600">People</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">38</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-600">Countries</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">9</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-600">Founded</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">2019</dd>
            </div>
            <div>
              <dt className="text-sm text-zinc-600">Open roles</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">{TOTAL_OPEN_ROLES}</dd>
            </div>
          </dl>
        </section>

        {/* Why here — short value strip, static, no interaction needed */}
        <section aria-labelledby="values-heading" className="border-y border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h2 id="values-heading" className="sr-only">
              What it&apos;s like to work here
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="flex gap-3">
                <Globe2 aria-hidden="true" className="h-5 w-5 shrink-0 text-fuchsia-600" />
                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-900">Remote since day one.</span> Nine countries, one
                  team, no headquarters city to relocate near.
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck aria-hidden="true" className="h-5 w-5 shrink-0 text-fuchsia-600" />
                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-900">Published pay bands.</span> Every level has a
                  public range — see the table below, not a private spreadsheet.
                </p>
              </div>
              <div className="flex gap-3">
                <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-fuchsia-600" />
                <p className="text-sm text-zinc-600">
                  <span className="font-medium text-zinc-900">Small on purpose.</span> 38 people supporting
                  customers who move physical goods — every hire changes the shape of the team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How we hire */}
        <section aria-labelledby="hiring-heading" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 id="hiring-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
            How we hire
          </h2>
          <p className="mt-2 text-zinc-600">
            The questions we&apos;re asked most, answered plainly. Select a question to expand it.
          </p>
          <div className="mt-8">
            <FaqAccordion items={FAQS} />
          </div>
        </section>

        {/* Open roles */}
        <section aria-labelledby="roles-heading" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="roles-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
                  Open roles
                </h2>
                <p className="mt-2 text-zinc-600">
                  Grouped by department. Select a department to see its roles.
                </p>
              </div>
              <Users aria-hidden="true" className="hidden h-8 w-8 shrink-0 text-fuchsia-200 sm:block" />
            </div>
            <div className="mt-8">
              <RolesDirectory departments={DEPARTMENTS} />
            </div>
          </div>
        </section>

        {/* Compensation transparency */}
        <section aria-labelledby="comp-heading" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 id="comp-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
            Compensation transparency
          </h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Base salary and equity are set by level, shown here for US-based hires. Non-US bands are
            adjusted to local market rate and stated in every written offer.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <caption className="sr-only">Compensation bands by level, including base salary and equity ranges</caption>
              <thead>
                <tr className="border-b border-zinc-300">
                  <th scope="col" className="w-[30%] py-3 pr-4 font-semibold text-zinc-900">
                    Level
                  </th>
                  <th scope="col" className="w-[32%] py-3 pr-4 font-semibold text-zinc-900">
                    Example tracks
                  </th>
                  <th scope="col" className="w-[22%] py-3 pr-4 font-semibold text-zinc-900">
                    Base salary (USD)
                  </th>
                  <th scope="col" className="w-[16%] py-3 font-semibold text-zinc-900">
                    Equity
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMP_BANDS.map((band) => (
                  <tr key={band.level} className="border-b border-zinc-200">
                    <th scope="row" className="py-3 pr-4 font-medium text-zinc-900">
                      {band.level}
                    </th>
                    <td className="py-3 pr-4 text-zinc-600">{band.track}</td>
                    <td className="py-3 pr-4 tabular-nums text-zinc-900">{band.base}</td>
                    <td className="py-3 tabular-nums text-zinc-600">{band.equity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-zinc-200">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-zinc-900">Northlane</p>
              <p className="mt-1 text-sm text-zinc-600">
                Questions about a role, accommodations, or the process above? Reach the recruiting team
                directly.
              </p>
            </div>
            <a
              href="mailto:careers@northlane.io"
              className={`inline-flex items-center gap-2 rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:border-fuchsia-300 hover:text-fuchsia-700 ${FOCUS_RING}`}
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              careers@northlane.io
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
