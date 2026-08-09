import {
  ArrowRight,
  Ban,
  Clock,
  Eye,
  KeyRound,
  PenLine,
  Plug,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import GrantSheet from './GrantSheet';
import ResidencyPanel from './ResidencyPanel';
import { neverRequested, revocation, scopes } from './data';

const readScopes = scopes.filter((s) => s.access === 'read');
const writeScopes = scopes.filter((s) => s.access === 'write');
const approvalCount = scopes.filter((s) => s.adminApproval).length;

export const metadata = {
  title: 'Connect HubSpot — Tidemark',
  description:
    'Every HubSpot scope Tidemark requests, the feature each one keeps alive, how long the data survives, and how to take it back.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-zinc-50 font-[family-name:var(--font-sans)] text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-teal-700 text-white">
              <Plug className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="font-[family-name:var(--font-display-wide)] text-sm font-medium tracking-[0.16em]">
              TIDEMARK
            </span>
            <span className="hidden truncate text-sm text-zinc-500 sm:inline">
              Integrations / HubSpot
            </span>
          </div>
          <a
            href="#residency"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Security review pack
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-12 pb-9 md:px-8 md:pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-700">
          Access request · HubSpot
        </p>
        <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display-wide)] text-[2.15rem] font-medium leading-[1.08] tracking-tight md:text-[3.4rem]">
          Everything HubSpot hands over, itemised before you grant it.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 md:text-lg md:leading-8">
          Tidemark asks for five read scopes and three write scopes. Each one below is paired with
          the feature it keeps alive, the retention window it lives in, and the single revocation
          that ends it. Nothing here is behind a click.
        </p>
      </section>

      <section
        aria-labelledby="exchange-heading"
        className="mx-auto max-w-6xl px-5 pb-10 md:px-8"
      >
        <h2 id="exchange-heading" className="sr-only">
          What is exchanged
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-teal-700">
              <Eye className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-sm font-semibold">
                Leaves HubSpot — read only ({readScopes.length})
              </h3>
            </div>
            <ul className="mt-4 space-y-2">
              {readScopes.map((s) => (
                <li key={s.id} className="font-[family-name:var(--font-mono)] text-[13px] text-zinc-700">
                  {s.name}
                </li>
              ))}
            </ul>
          </article>

          <article className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-amber-800">
              <PenLine className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-sm font-semibold">
                Tidemark writes back ({writeScopes.length})
              </h3>
            </div>
            <ul className="mt-4 space-y-2">
              {writeScopes.map((s) => (
                <li key={s.id} className="font-[family-name:var(--font-mono)] text-[13px] text-zinc-700">
                  {s.name}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-zinc-600">
              Writes touch two Tidemark-owned properties and one timeline card. Deal amount, stage
              and close date stay read-only, always.
            </p>
          </article>

          <article className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-zinc-700">
              <Ban className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-sm font-semibold">Never requested ({neverRequested.length})</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {neverRequested.map((n) => (
                <li key={n.name} className="min-w-0">
                  <span className="font-[family-name:var(--font-mono)] text-[13px] text-zinc-500 line-through">
                    {n.name}
                  </span>
                  <span className="block text-[13px] leading-5 text-zinc-600">{n.reason}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 md:grid-cols-4">
          {[
            { k: '8', u: 'scopes in total', d: '5 read · 3 write' },
            { k: '13', u: 'months max retention', d: 'rolling, then dropped' },
            { k: String(approvalCount), u: 'need a Super Admin', d: 'flagged in the sheet' },
            { k: '60', u: 'seconds to revoke', d: 'token fails on next call' },
          ].map((stat) => (
            <div key={stat.u} className="min-w-0 bg-white px-5 py-4">
              <dt className="text-sm font-medium text-zinc-700">{stat.u}</dt>
              <dd className="mt-1 font-[family-name:var(--font-display-wide)] text-3xl font-medium tabular-nums text-zinc-900">
                {stat.k}
              </dd>
              <dd className="mt-1 text-[13px] text-zinc-600">{stat.d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <GrantSheet />

      <ResidencyPanel />

      <section
        aria-labelledby="revoke-heading"
        className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
      >
        <h2
          id="revoke-heading"
          className="font-[family-name:var(--font-display-wide)] text-2xl font-medium tracking-tight md:text-3xl"
        >
          Taking it back
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Revocation is a HubSpot-side action, so it does not depend on Tidemark staying reachable.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {revocation.map((r, i) => {
            const Icon = [KeyRound, Trash2, Clock][i];
            return (
              <article key={r.title} className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-teal-700" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-zinc-900">{r.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{r.detail}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium tabular-nums text-zinc-700">
                  <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {r.window}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
        <div className="rounded-2xl bg-teal-800 px-6 py-10 text-white md:px-10 md:py-12">
          <h2 className="max-w-2xl font-[family-name:var(--font-display-wide)] text-2xl font-medium leading-tight tracking-tight md:text-4xl">
            Start the connection with the list you just read.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-teal-50 md:text-base md:leading-7">
            HubSpot&rsquo;s consent screen shows the same scope names, in the same order. If a scope
            on that screen is not on this page, cancel and send it to us — that mismatch is a bug.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#grant-sheet"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-800 motion-reduce:transition-none"
            >
              Review the grant sheet
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
            <a
              href="#residency"
              className="inline-flex items-center gap-2 rounded-lg border border-teal-100 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-800 motion-reduce:transition-none"
            >
              Read the data map
            </a>
          </div>
        </div>
        <p className="mt-6 text-[13px] leading-6 text-zinc-600">
          Tidemark, Inc. · SOC 2 Type II · Data processed in eu-central-1 and us-east-1 ·
          Sub-processors listed in the review pack.
        </p>
      </section>
    </main>
  );
}
