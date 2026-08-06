import type { ComponentType } from "react";
import { ArrowRight, BookOpen, Handshake, ShieldCheck, Target } from "lucide-react";
import { VALUES } from "./data";
import { TeamDirectory } from "./team-directory";
import { OfficeLocations } from "./office-locations";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const VALUE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  evidence: Target,
  "slow-feature": ShieldCheck,
  "written-down": BookOpen,
  "default-trust": Handshake,
};

export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <p className="text-sm font-medium tracking-wide text-teal-700">
          About Tallwood
        </p>
        <h1
          className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-zinc-900 sm:text-5xl"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          One place to see, understand and act on what your systems are doing.
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-normal leading-relaxed text-zinc-700">
          Tallwood builds observability tooling for engineering teams who are tired of
          choosing between an alert that fires too late and one that pages someone for
          nothing. Founded in Boston in 2019, now{" "}
          <span className="tabular-nums font-medium text-zinc-900">55</span> people
          across four offices.
        </p>
      </section>

      {/* Team directory */}
      <section
        aria-labelledby="team-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <h2 id="team-heading" className="text-2xl font-bold text-zinc-900">
          Meet the team
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
          Filter by department or search by name and role — the list below updates
          together, so you never have to reconcile two different results.
        </p>
        <div className="mt-8">
          <TeamDirectory />
        </div>
      </section>

      {/* Offices */}
      <section
        aria-labelledby="offices-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <h2 id="offices-heading" className="text-2xl font-bold text-zinc-900">
          Where we work
        </h2>
        <p className="mt-2 max-w-2xl text-base font-normal leading-relaxed text-zinc-700">
          Four offices and a fully remote group of teammates who show up in the same
          planning cycles as everyone else.
        </p>
        <div className="mt-8">
          <OfficeLocations />
        </div>
      </section>

      {/* Values */}
      <section
        aria-labelledby="values-heading"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <h2 id="values-heading" className="text-2xl font-bold text-zinc-900">
          What we believe
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => {
            const Icon = VALUE_ICONS[value.id] ?? Target;
            return (
              <li
                key={value.id}
                className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-50">
                  <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-bold text-zinc-900">{value.title}</h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">{value.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Careers CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-zinc-900">
            We are hiring across every office
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-normal leading-relaxed text-zinc-700">
            If you would rather ship the dashboard that proves a fix worked than the one
            that just says it did, we would like to hear from you.
          </p>
          <a
            href="mailto:careers@tallwood.io"
            className={`mt-6 inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-800 ${FOCUS_RING}`}
          >
            View open roles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-sm text-zinc-600">careers@tallwood.io</p>
        </div>
      </section>
    </main>
  );
}
