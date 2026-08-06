import type { Metadata } from "next";
import { ArrowRight, Quote } from "lucide-react";
import AvatarMonogram from "./avatar-monogram";
import MilestoneTimeline from "./milestone-timeline";
import ScrollSpyNav from "./scroll-spy-nav";
import ValuesGrid from "./values-grid";
import { FOCUS_RING, TEAM } from "./data";

export const metadata: Metadata = {
  title: "About — Portage",
  description:
    "Portage builds the operations software that lets small manufacturers run fulfillment without hiring a full logistics department.",
};

/**
 * Founder narrative + milestone timeline archetype: single-column editorial scroll, no sidebar
 * rail. Three wired interactions live in the imported client components: milestone expand/collapse
 * (milestone-timeline.tsx), the values category filter (values-grid.tsx), and scroll-spy nav
 * highlighting (scroll-spy-nav.tsx). Exactly three font-weight classes are used across this whole
 * route: font-normal, font-semibold, font-black.
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

      <ScrollSpyNav />

      <main id="main">
        {/* Hero */}
        <section
          id="mission"
          aria-labelledby="mission-heading"
          className="mx-auto max-w-5xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">About Portage</p>
          <h1
            id="mission-heading"
            className="mt-4 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Small manufacturers shouldn&apos;t need a logistics department to ship like one.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-600">
            Portage is the operations layer that sits between a factory floor and the carriers,
            warehouses, and marketplaces it ships through — so a five-person team can run fulfillment
            the way a fifty-person team would, without hiring the other forty-five people.
          </p>
        </section>

        {/* Founder's letter */}
        <section id="letter" aria-labelledby="letter-heading" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 id="letter-heading" className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              From our co-founder
            </h2>
            <div className="mt-6 max-w-3xl">
              <Quote aria-hidden="true" className="h-8 w-8 text-amber-300" />
              <blockquote className="mt-4 text-2xl font-semibold leading-snug text-zinc-900 sm:text-3xl">
                We didn&apos;t start Portage because we loved logistics. We started it because we
                watched a friend&apos;s kitchenware business nearly fail during its best sales quarter
                — not from lack of demand, but because nobody could tell her which of six
                spreadsheets was the current one. Software should absorb that kind of chaos, not
                require a department to manage it.
              </blockquote>
              <p className="mt-5 font-normal text-zinc-600">
                <span className="font-semibold text-zinc-900">Mara Voss</span> — Co-founder &amp; CEO,
                Portage
              </p>
            </div>
          </div>
        </section>

        {/* Milestone timeline */}
        <section id="timeline" aria-labelledby="timeline-heading" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2
            id="timeline-heading"
            className="text-2xl font-black tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Company timeline
          </h2>
          <p className="mt-2 max-w-prose font-normal text-zinc-600">
            Eight years, six moments that changed how the product works. Select a year to read the
            story behind it.
          </p>
          <div className="mt-10">
            <MilestoneTimeline />
          </div>
        </section>

        {/* Values */}
        <section id="values" aria-labelledby="values-heading" className="border-t border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2
              id="values-heading"
              className="text-2xl font-black tracking-tight text-zinc-900"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              What we optimize for
            </h2>
            <p className="mt-2 max-w-prose font-normal text-zinc-600">
              Four working rules, filed under the teams that lean on them hardest. Filter to see how
              they group.
            </p>
            <div className="mt-8">
              <ValuesGrid />
            </div>
          </div>
        </section>

        {/* Team highlights */}
        <section id="team" aria-labelledby="team-heading" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2
            id="team-heading"
            className="text-2xl font-black tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            The team behind it
          </h2>
          <p className="mt-2 max-w-prose font-normal text-zinc-600">
            Five of the roughly forty people at Portage today, spanning three time zones.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
            {TEAM.map((member) => (
              <li key={member.name} className="min-w-0">
                <AvatarMonogram
                  name={member.name}
                  initials={member.initials}
                  accent={member.accent}
                  className="aspect-square w-full rounded-xl bg-zinc-100"
                />
                <p className="mt-3 font-semibold text-zinc-900">{member.name}</p>
                <p className="text-sm font-normal text-zinc-600">{member.role}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Careers CTA */}
        <section id="careers" aria-labelledby="careers-heading" className="border-t border-amber-100 bg-amber-50">
          <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="max-w-xl">
              <h2
                id="careers-heading"
                className="text-2xl font-black tracking-tight text-zinc-900"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                We&apos;re hiring across engineering, support, and operations.
              </h2>
              <p className="mt-2 font-normal text-zinc-600">
                Portage is a distributed team of about forty, with open roles in Ohio, Lisbon, and
                remote.
              </p>
            </div>
            <a
              href="mailto:careers@portage.example"
              className={`inline-flex flex-shrink-0 items-center gap-2 rounded-md bg-amber-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-amber-800 ${FOCUS_RING}`}
            >
              View open roles
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
