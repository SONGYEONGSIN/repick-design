import type { Metadata } from "next";
import { ArrowUpRight, KeyRound, Terminal, Webhook } from "lucide-react";
import Console from "./console";
import { FOCUS_RING, VERSION_PIN } from "./data";

export const metadata: Metadata = {
  title: "Bollard — Freight API for developers",
  description:
    "Rate a parcel, book the label, handle the webhook. A live three-call transcript: change a parameter and every request line and response field it drives changes with it.",
};

/**
 * Archetype: executable first call. The page opens on a working request/response pair rather than on
 * a headline — the proof of what this API is sits above the fold in its resting state, and the four
 * controls above it re-run the arithmetic instead of revealing anything hidden.
 *
 * The differentiating move is the gutter. Every line in every pane declares which parameter produced
 * it (LNE / WGT / SVC / INS / SUM / CHN), so the question a developer actually has — "which input
 * moves which output" — is answered by looking, and answered louder when a parameter is traced.
 *
 * Deliberately none of: hero + one visualisation, fixed side rail + segmented toggle, master-detail,
 * a searchable endpoint list, or a time-of-day simulator. The endpoint table below is a scope bound,
 * not a browsing surface: it has no search, no filter, and never becomes the page's spine.
 *
 * Dark theme, cyan accent, --font-display-mono for display type, exactly three weights route-wide
 * (font-normal / font-semibold / font-bold).
 */

const ENDPOINTS: { method: string; path: string; purpose: string; repeat: string }[] = [
  {
    method: "POST",
    path: "/v1/rates",
    purpose: "Price one parcel on one lane. Every surcharge is itemised, never rolled into a single figure.",
    repeat: "Safe — same body, same rate",
  },
  {
    method: "POST",
    path: "/v1/shipments",
    purpose: "Buy a rate and queue a label. Takes an Idempotency-Key so a retry cannot double-book.",
    repeat: "Idempotency-Key, 24h",
  },
  {
    method: "GET",
    path: "/v1/shipments/{id}",
    purpose: "Status, tracking code and label URL for one shipment.",
    repeat: "Safe",
  },
  {
    method: "POST",
    path: "/v1/shipments/{id}/void",
    purpose: "Cancel a label before handover and reverse the charge.",
    repeat: "Safe after the first call",
  },
  {
    method: "GET",
    path: "/v1/lanes",
    purpose: "All 412 lanes with weight caps, cutoffs, carriers and which ones sell priority.",
    repeat: "Safe",
  },
  {
    method: "GET",
    path: "/v1/events",
    purpose: "Replay any webhook event from the last 30 days, in delivery order.",
    repeat: "Safe",
  },
];

const FAILURES: { status: string; code: string; meaning: string }[] = [
  { status: "422", code: "parcel_over_limit", meaning: "The parcel is heavier than the lane carries. The body names the cap." },
  { status: "422", code: "service_not_on_lane", meaning: "That service is not sold here. The body lists what is." },
  { status: "404", code: "rate_expired", meaning: "A rate is quotable for 900 seconds. Re-rate and book again." },
  { status: "409", code: "already_booked", meaning: "This Idempotency-Key bought a shipment already. The original is returned." },
  { status: "429", code: "rate_limited", meaning: "Over 20 requests a second sustained. Retry-After is always set." },
  { status: "503", code: "carrier_timeout", meaning: "The carrier did not answer. Safe to retry — nothing was booked." },
];

export default function DevelopersPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100 [color-scheme:dark]">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
          <div className="flex items-baseline gap-3">
            <span
              className="text-lg font-bold tracking-tight text-zinc-100"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              bollard
            </span>
            <span className="text-sm font-normal text-zinc-400">Freight rating and booking API</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span
              className="rounded-md border border-zinc-700 px-2 py-1 text-xs font-normal tabular-nums text-zinc-400"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Bollard-Version: {VERSION_PIN}
            </span>
            <a
              href="#surface"
              className={`rounded font-semibold text-zinc-300 underline-offset-4 hover:text-cyan-300 hover:underline ${FOCUS_RING}`}
            >
              Reference
            </a>
            <a
              href="#start"
              className={`rounded font-semibold text-zinc-300 underline-offset-4 hover:text-cyan-300 hover:underline ${FOCUS_RING}`}
            >
              Get a key
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* The console is first and it is the page. Everything below it exists to bound scope. */}
        <section aria-labelledby="console-heading">
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400">
              Freight API · v1
            </p>
            <h1
              id="console-heading"
              className="mt-3 max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight text-zinc-100 sm:text-4xl"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Three calls is the whole integration.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-normal leading-relaxed text-zinc-300 sm:text-lg">
              Rate a parcel, buy the label, handle the webhook that carries it. The transcript below is the
              real shape of all three — and it is live: move any control and the request lines and the
              response fields change together, from the same arithmetic our sandbox runs.
            </p>
            <p className="mt-3 max-w-2xl text-sm font-normal leading-relaxed text-zinc-400">
              Every line is tagged in the gutter with the parameter that produced it, so you can see which
              input owns which output before you write a line of code.
            </p>
          </div>

          <Console />
        </section>

        {/* Scope proof. A table, not a browser: no search, no filter, no sorting. */}
        <section aria-labelledby="surface-heading" id="surface" className="border-t border-zinc-800 bg-zinc-900/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2
              id="surface-heading"
              className="text-2xl font-bold tracking-tight text-zinc-100"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              The rest of the surface
            </h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
              Six endpoints, and you have seen half of them above. If what you are building needs something
              that is not on this list, it is not in this API — that is the fastest honest answer we can give
              you.
            </p>

            <div className="relative mt-8 overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full min-w-[44rem] table-fixed border-collapse text-left text-sm">
                <caption className="border-b border-zinc-800 px-4 py-3 text-left text-sm font-normal text-zinc-400">
                  Public v1 endpoints. Retry column says what happens when the same call is sent twice.
                </caption>
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900">
                    <th scope="col" className="w-[9%] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Verb
                    </th>
                    <th scope="col" className="w-[26%] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Path
                    </th>
                    <th scope="col" className="w-[43%] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      What it does
                    </th>
                    <th scope="col" className="w-[22%] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Sent twice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map((endpoint) => (
                    <tr key={endpoint.path} className="border-b border-zinc-800 last:border-b-0">
                      <td className="px-4 py-3 align-top font-mono text-xs font-semibold text-cyan-300">
                        {endpoint.method}
                      </td>
                      <th
                        scope="row"
                        className="px-4 py-3 align-top font-mono text-xs font-normal text-zinc-100"
                      >
                        {endpoint.path}
                      </th>
                      <td className="px-4 py-3 align-top font-normal leading-relaxed text-zinc-300">
                        {endpoint.purpose}
                      </td>
                      <td className="px-4 py-3 align-top font-normal text-zinc-400">{endpoint.repeat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Failure shapes and limits — the second half of "can I build this on top of it". */}
        <section aria-labelledby="limits-heading" className="border-t border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2
              id="limits-heading"
              className="text-2xl font-bold tracking-tight text-zinc-100"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              What it does when things go wrong
            </h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
              You can reproduce the first two of these in the console above by moving a control. The rest
              behave the same way: one machine-readable code, one human sentence, and the parameter at fault
              named in the body.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 lg:col-span-2">
                <h3 className="text-base font-semibold text-zinc-100">Errors you will actually hit</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {FAILURES.map((failure) => (
                    <li key={failure.code} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="rounded border border-zinc-700 px-1.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-cyan-300">
                        {failure.status}
                      </span>
                      <code className="font-mono text-sm font-semibold text-zinc-100">{failure.code}</code>
                      <span className="min-w-0 flex-1 text-sm font-normal leading-relaxed text-zinc-400">
                        {failure.meaning}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex min-w-0 flex-col gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                  <h3 className="text-base font-semibold text-zinc-100">Limits</h3>
                  <ul className="mt-3 flex flex-col gap-2 text-sm font-normal leading-relaxed text-zinc-400">
                    <li>
                      <span className="tabular-nums text-zinc-100">100</span> requests a second in burst,{" "}
                      <span className="tabular-nums text-zinc-100">20</span> sustained, per key.
                    </li>
                    <li>
                      A rate is quotable for <span className="tabular-nums text-zinc-100">900</span> seconds.
                    </li>
                    <li>
                      Idempotency keys are remembered for{" "}
                      <span className="tabular-nums text-zinc-100">24</span> hours.
                    </li>
                    <li>
                      Sandbox and production differ in exactly two ways: labels are watermarked and carriers
                      are simulated.
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-100">
                    <Webhook aria-hidden="true" className="h-4 w-4 flex-none text-cyan-400" />
                    Webhook delivery
                  </h3>
                  <p className="mt-3 text-sm font-normal leading-relaxed text-zinc-400">
                    Retries at <span className="tabular-nums text-zinc-100">5s</span>,{" "}
                    <span className="tabular-nums text-zinc-100">30s</span>,{" "}
                    <span className="tabular-nums text-zinc-100">2m</span>,{" "}
                    <span className="tabular-nums text-zinc-100">10m</span>,{" "}
                    <span className="tabular-nums text-zinc-100">1h</span>, then hourly for a day. Signatures
                    are HMAC-SHA256 over the raw body — verify before you parse.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* First call, for real. Three lines, no sales step. */}
        <section aria-labelledby="start-heading" id="start" className="border-t border-zinc-800 bg-zinc-900/40">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <h2
              id="start-heading"
              className="text-2xl font-bold tracking-tight text-zinc-100"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Make the call yourself
            </h2>
            <p className="mt-3 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
              Sandbox keys are self-serve. No card, no call, no waiting on an account manager to enable a
              lane.
            </p>

            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              <li className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <KeyRound aria-hidden="true" className="h-4 w-4 flex-none text-cyan-400" />
                  <span className="tabular-nums">1.</span> Take a key
                </h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-400">
                  Sign in with GitHub and a sandbox key is on screen. It is the same key used in the console
                  above.
                </p>
              </li>
              <li className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <Terminal aria-hidden="true" className="h-4 w-4 flex-none text-cyan-400" />
                  <span className="tabular-nums">2.</span> Install, or do not
                </h3>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs leading-6 text-zinc-300">
                  <code>
                    {"npm i @bollard/node\npip install bollard\n# or just curl the endpoint"}
                  </code>
                </pre>
              </li>
              <li className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <Webhook aria-hidden="true" className="h-4 w-4 flex-none text-cyan-400" />
                  <span className="tabular-nums">3.</span> Catch the webhook
                </h3>
                <pre className="mt-3 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs leading-6 text-zinc-300">
                  <code>{"bollard listen \\\n  --forward localhost:3000"}</code>
                </pre>
              </li>
            </ol>

            <p className="mt-8">
              <a
                href="#console-heading"
                className={`inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 ${FOCUS_RING}`}
              >
                Back to the transcript
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 flex-none" />
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm font-normal text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Bollard Freight, Inc.</span>
          <span>
            Responses on this page are computed fixtures, not live traffic — same inputs, same bytes, every
            time.
          </span>
        </div>
      </footer>
    </div>
  );
}
