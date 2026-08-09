import type { Metadata } from "next";
import { ArrowUpRight, ShieldCheck, Waypoints } from "lucide-react";
import AtlasClient from "./atlas-client";
import { API, ERRORS, FOCUS_RING, PRE_FLIGHT, RESOURCES, SDKS } from "./data";

export const metadata: Metadata = {
  title: "Developers — Wattline",
  description:
    "The Wattline object map: five resources, six relationships, and the first call for each of them. Read the model before you read the endpoint list.",
};

/**
 * Archetype: data-model map. The page's spine is a relationship graph, not an endpoint index —
 * because the first thing that decides whether you can build something on a charging API is not
 * which calls exist but how the vendor cut the world into objects. Choosing a node opens its whole
 * record (fields, endpoints, webhook events, edges) and following a line moves you to the object at
 * the other end, so the diagram is navigation rather than decoration.
 *
 * Deliberately not master-detail: the graph is the page's axis and spans the full width, selection
 * happens on the graph itself, and the record beneath it is a four-column spread that carries its
 * own traversal controls rather than a detail pane fed by a list. Three build routes light their
 * edges on the same map, which is what turns "here are the objects" into "here is what you can make".
 *
 * Dark theme, emerald accent, `--font-display-wide` on the h1 and the four section headings only;
 * body copy stays on `--font-sans`. Exactly three weight classes route-wide: font-normal,
 * font-semibold, font-bold. Copy is English throughout. No clock is read anywhere in the route.
 */
export default function DevelopersPage() {
  const fieldTotal = RESOURCES.reduce((sum, r) => sum + r.fields.length, 0);
  const eventTotal = RESOURCES.reduce((sum, r) => sum + r.events.length, 0);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-900 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
          <span
            className="text-lg font-bold tracking-tight text-zinc-50"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            {API.brand}
          </span>
          <nav aria-label="Developer resources" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={`${API.docsUrl}/reference`}
              className={`rounded text-sm font-normal text-zinc-300 hover:text-emerald-400 ${FOCUS_RING}`}
            >
              Reference
            </a>
            <a
              href={API.changelogUrl}
              className={`rounded text-sm font-normal text-zinc-300 hover:text-emerald-400 ${FOCUS_RING}`}
            >
              Changelog
            </a>
            <a
              href={API.statusUrl}
              className={`inline-flex items-center gap-1.5 rounded text-sm font-normal text-zinc-300 hover:text-emerald-400 ${FOCUS_RING}`}
            >
              Status
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
            <a
              href={`${API.docsUrl}/keys`}
              className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-emerald-400 ${FOCUS_RING}`}
            >
              Get a test key
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Opening band. States what the API is, what the key looks like and where the base URL
            points, before any interaction — the three facts a developer checks before reading on. */}
        <section aria-labelledby="page-heading" className="border-b border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pt-20">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              <Waypoints aria-hidden="true" className="h-4 w-4" />
              Developers
            </p>
            <h1
              id="page-heading"
              className="mt-4 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Learn the objects, and the endpoints stop being a list.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-300">
              {API.brand} is {API.tagline}: sites, plugs, charges, prices and the monthly bill they
              add up to. There are{" "}
              <span className="font-semibold tabular-nums text-zinc-50">{RESOURCES.length}</span>{" "}
              resources in total,{" "}
              <span className="font-semibold tabular-nums text-zinc-50">{fieldTotal}</span> fields and{" "}
              <span className="font-semibold tabular-nums text-zinc-50">{eventTotal}</span> webhook
              events. Small enough to hold in your head — so this page shows you the whole model
              rather than a search box over it.
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 border-t border-zinc-800 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-w-0">
                <dt className="text-sm font-semibold text-zinc-400">Base URL</dt>
                <dd className="mt-1.5 break-all font-mono text-sm font-normal text-emerald-400">{API.baseUrl}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm font-semibold text-zinc-400">Auth</dt>
                <dd className="mt-1.5 break-all font-mono text-sm font-normal text-emerald-400">
                  Bearer {API.keyPrefix}…
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm font-semibold text-zinc-400">Version header</dt>
                <dd className="mt-1.5 break-all font-mono text-sm font-normal tabular-nums text-emerald-400">
                  {API.version}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm font-semibold text-zinc-400">Sandbox</dt>
                <dd className="mt-1.5 break-all font-mono text-sm font-normal text-emerald-400">
                  {API.sandboxPrefix}… · no card
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* The atlas: map, build routes, open record, first call. Shared selection state. */}
        <AtlasClient />

        {/* What has to be true before the first request leaves your machine. */}
        <section aria-labelledby="preflight-heading" className="border-b border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2
              id="preflight-heading"
              className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Four things to get right before the first request
            </h2>
            <dl className="mt-8 grid gap-6 md:grid-cols-2">
              {PRE_FLIGHT.map((item) => (
                <div key={item.term} className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <dt className="flex items-start gap-2.5 text-base font-semibold text-zinc-50">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-emerald-400" />
                    <span className="min-w-0">{item.term}</span>
                  </dt>
                  <dd className="mt-2 pl-[1.625rem] text-sm font-normal leading-relaxed text-zinc-300">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The failures a real integration meets in week one, written before they happen. */}
        <section aria-labelledby="errors-heading" className="border-b border-zinc-800 bg-zinc-900">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2
              id="errors-heading"
              className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              The four errors you will actually hit
            </h2>
            <table className="mt-8 w-full table-fixed border-collapse text-left">
              <caption className="pb-4 text-left text-sm font-normal leading-relaxed text-zinc-400">
                Every error body carries a machine-readable <span className="font-mono">code</span>, a
                human sentence, and a <span className="font-mono">request_id</span> that support can
                look up. Branch on the code, never on the sentence.
              </caption>
              <thead>
                <tr className="border-b border-zinc-700">
                  <th scope="col" className="w-[26%] py-3 pr-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    Status · code
                  </th>
                  <th scope="col" className="w-[37%] px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    What it means
                  </th>
                  <th scope="col" className="w-[37%] py-3 pl-3 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                    What to do
                  </th>
                </tr>
              </thead>
              <tbody>
                {ERRORS.map((row) => (
                  <tr key={row.code} className="border-b border-zinc-800 align-top">
                    <th scope="row" className="break-words py-4 pr-3 font-normal">
                      <span className="block font-mono text-sm font-semibold tabular-nums text-emerald-400">
                        {row.status}
                      </span>
                      <span className="mt-1 block break-words font-mono text-sm font-normal text-zinc-100">
                        {row.code}
                      </span>
                    </th>
                    <td className="break-words px-3 py-4 text-sm font-normal leading-relaxed text-zinc-300">
                      {row.means}
                    </td>
                    <td className="break-words py-4 pl-3 text-sm font-normal leading-relaxed text-zinc-300">
                      {row.fix}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Ways out of this page and into a codebase. */}
        <section aria-labelledby="sdk-heading" className="border-b border-zinc-800">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2
              id="sdk-heading"
              className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Clients, and the spec they are generated from
            </h2>
            <p className="mt-4 max-w-2xl text-base font-normal leading-relaxed text-zinc-300">
              All three clients are generated from the same OpenAPI document, so a field that exists
              here exists in every language on the day it ships. If yours is missing, the document is
              the contract — generate from it.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SDKS.map((sdk) => (
                <li key={sdk.name} className="min-w-0">
                  <a
                    href={sdk.href}
                    className={`block h-full rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-150 hover:border-emerald-400 motion-reduce:transition-none ${FOCUS_RING}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-zinc-50">{sdk.name}</span>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 flex-none text-emerald-400" />
                    </span>
                    <span className="mt-2 block break-all font-mono text-sm font-normal text-zinc-400">
                      {sdk.install}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <p className="text-sm font-normal text-zinc-400">
            &copy; 2026 {API.brand} Networks. Charging infrastructure, as an API.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={API.openApiUrl} className={`rounded text-sm font-normal text-zinc-400 hover:text-emerald-400 ${FOCUS_RING}`}>
              OpenAPI document
            </a>
            <a href={`${API.docsUrl}/support`} className={`rounded text-sm font-normal text-zinc-400 hover:text-emerald-400 ${FOCUS_RING}`}>
              Developer support
            </a>
            <a href="#main" className={`rounded text-sm font-normal text-zinc-400 hover:text-emerald-400 ${FOCUS_RING}`}>
              Back to the top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
