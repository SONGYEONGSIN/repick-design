import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Ban,
  CheckCircle2,
  Clock3,
  KeyRound,
  Plug,
  ShieldAlert,
} from "lucide-react";

import { FIELD_ROWS, type Direction } from "./data";
import { RunLedger } from "./run-ledger-client";
import { PrecedenceTable } from "./precedence-client";
import { WaitingQueue } from "./waiting-client";

/**
 * integration / r1 / b — "The HubSpot connection"
 *
 * Archetype: sync-state and failure-recovery first. Not a "connect this app" pitch —
 * this is the page the person who already connected it opens on a bad Tuesday.
 * Four self-complete strata: what crosses (zero-interaction proof), the last six runs,
 * who wins a conflict, and what is waiting on a human.
 *
 * dark ground / orange accent / --font-display-grotesk on display type / body --font-sans.
 * Weights used: normal, medium, semibold (3).
 */

const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;

function DirectionCell({ direction }: { direction: Direction }) {
  const map = {
    both: { Icon: ArrowRightLeft, label: "Both ways", tone: "text-orange-300" },
    toKestrel: { Icon: ArrowRight, label: "HubSpot to Kestrel", tone: "text-zinc-200" },
    toHubspot: { Icon: ArrowLeft, label: "Kestrel to HubSpot", tone: "text-zinc-200" },
    blocked: { Icon: Ban, label: "Does not cross", tone: "text-rose-300" },
  } as const;
  const { Icon, label, tone } = map[direction];
  return (
    <span className={`relative flex items-start gap-1.5 ${tone}`}>
      <Icon aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      <span className="font-medium">{label}</span>
    </span>
  );
}

const HEADLINE_FACTS = [
  { label: "Records in scope", value: "8,412", note: "contacts, companies, deals" },
  { label: "Fields crossing", value: "11 of 17", note: "6 stay put on purpose" },
  { label: "Last clean run", value: "#4416", note: "14:15 to 14:21 UTC" },
  { label: "Waiting on a person", value: "3", note: "nothing retries these for you" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-950 font-normal text-zinc-100 antialiased">
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <header className="border-b border-zinc-800 pb-10">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
            <Plug aria-hidden className="size-3.5" />
            Connections / HubSpot
          </p>

          <h1
            className="mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
            style={DISPLAY}
          >
            The HubSpot connection
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            Two-way sync between your HubSpot portal{" "}
            <span className="font-medium text-zinc-100">(24-1180-77)</span> and Kestrel Billing.
            Runs every 15 minutes. It is not a copy of HubSpot — it moves eleven fields and
            deliberately refuses six.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-medium text-amber-200">
              <AlertTriangle aria-hidden className="size-4" />
              Degraded since run #4413
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-400">
              <Clock3 aria-hidden className="size-4" />
              Next run starts when #4417 finishes retrying
            </span>
            <a
              href="#waiting"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-orange-300 underline decoration-orange-400/40 underline-offset-4 hover:decoration-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Jump to the 3 records waiting on you
              <ArrowRight aria-hidden className="size-3.5" />
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 lg:grid-cols-4">
            {HEADLINE_FACTS.map((fact) => (
              <div key={fact.label} className="min-w-0 bg-zinc-950 px-4 py-4">
                <dt className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {fact.label}
                </dt>
                <dd
                  className="mt-2 text-2xl font-semibold tabular-nums text-zinc-50"
                  style={DISPLAY}
                >
                  {fact.value}
                </dd>
                <p className="mt-1 text-xs text-zinc-400">{fact.note}</p>
              </div>
            ))}
          </dl>
        </header>

        {/* Strata 1 — the proof, readable with no interaction at all. */}
        <section aria-labelledby="crossing-heading" className="pt-12">
          <h2
            id="crossing-heading"
            className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl"
            style={DISPLAY}
          >
            What crosses, and what stays put
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            Every field either has a rule or a reason it has none. The six refusals are the part
            people find out about three weeks in, so they are listed first-class, not in a footnote.
          </p>

          <div className="relative mt-6 overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full table-fixed border-collapse text-xs sm:text-sm">
              <caption className="sr-only">
                Field mapping between HubSpot and Kestrel Billing, including the six fields that do
                not cross and why.
              </caption>
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[22%]" />
                <col className="w-[24%]" />
                <col className="w-[30%]" />
              </colgroup>
              <thead>
                <tr className="bg-zinc-900">
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 sm:px-4"
                  >
                    HubSpot field
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 sm:px-4"
                  >
                    Direction
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 sm:px-4"
                  >
                    Kestrel field
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400 sm:px-4"
                  >
                    What actually happens
                  </th>
                </tr>
              </thead>
              <tbody>
                {FIELD_ROWS.map((row) => {
                  const blocked = row.direction === "blocked";
                  return (
                    <tr
                      key={`${row.hubspot}::${row.kestrel}`}
                      className={`border-t border-zinc-800 align-top ${
                        blocked ? "bg-rose-950/20" : ""
                      }`}
                    >
                      <th
                        scope="row"
                        className="break-words px-3 py-3 text-left font-mono text-xs font-medium text-zinc-100 sm:px-4"
                      >
                        {row.hubspot}
                      </th>
                      <td className="relative px-3 py-3 sm:px-4">
                        <DirectionCell direction={row.direction} />
                      </td>
                      <td
                        className={`break-words px-3 py-3 sm:px-4 ${
                          blocked
                            ? "text-zinc-400"
                            : "font-mono text-xs font-normal text-zinc-200"
                        }`}
                      >
                        {row.kestrel}
                      </td>
                      <td className="px-3 py-3 leading-relaxed text-zinc-300 sm:px-4">
                        {row.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 flex items-start gap-2 text-xs text-zinc-400">
            <ShieldAlert aria-hidden className="mt-0.5 size-3.5 shrink-0 text-zinc-400" />
            Card numbers and bank details never leave Kestrel, with or without this connection. That
            refusal is not configurable.
          </p>
        </section>

        {/* Strata 2 — runs. Each row carries its own verdict. */}
        <section aria-labelledby="runs-heading" className="pt-14">
          <h2
            id="runs-heading"
            className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl"
            style={DISPLAY}
          >
            The last six runs
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            A run is a window, a direction, two counts and a verdict. Open a run only if you want
            the rejected records by name — the row already tells you whether you need to.
          </p>
          <RunLedger />
        </section>

        {/* Strata 3 — precedence. */}
        <section aria-labelledby="precedence-heading" className="pt-14">
          <h2
            id="precedence-heading"
            className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl"
            style={DISPLAY}
          >
            Who wins when both sides changed
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            Four fields are edited on both sides often enough to collide. Flip one to see the value
            that would survive and what it drags with it. Flipping a rule here changes that field
            only.
          </p>
          <PrecedenceTable />
        </section>

        {/* Strata 4 — the human queue. */}
        <section aria-labelledby="waiting-heading" className="scroll-mt-8 pt-14" id="waiting">
          <h2
            id="waiting-heading"
            className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl"
            style={DISPLAY}
          >
            Waiting on a person
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
            Retries are automatic for timeouts and rate limits. These five are not retryable —
            something is missing, ambiguous, or out of scope. Pick the ones you have fixed at the
            source and hand them back to the next run.
          </p>
          <WaitingQueue />
        </section>

        <section aria-labelledby="teardown-heading" className="pt-14">
          <h2
            id="teardown-heading"
            className="text-lg font-semibold tracking-tight text-zinc-50"
            style={DISPLAY}
          >
            If you disconnect
          </h2>
          <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 sm:grid-cols-3">
            <li className="min-w-0 bg-zinc-950 px-4 py-4">
              <p className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <CheckCircle2 aria-hidden className="size-4 text-emerald-300" />
                Stays
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                Everything already written stays written on both sides. Nothing is rolled back.
              </p>
            </li>
            <li className="min-w-0 bg-zinc-950 px-4 py-4">
              <p className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <Ban aria-hidden className="size-4 text-rose-300" />
                Stops
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                Deal stages stop tracking subscription status within the hour. HubSpot will quietly
                go stale rather than show an error.
              </p>
            </li>
            <li className="min-w-0 bg-zinc-950 px-4 py-4">
              <p className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <KeyRound aria-hidden className="size-4 text-orange-300" />
                Expires
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                The OAuth grant is revoked immediately; reconnecting later re-reads all 8,412
                records once, which takes about 40 minutes.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
