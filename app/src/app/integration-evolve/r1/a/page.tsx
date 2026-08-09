import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { BLOCKED, CONNECTION, FIELD_ROWS, SUMMARY } from './data';
import FieldMap from './FieldMap';
import BlockedList from './BlockedList';

export const metadata: Metadata = {
  title: 'Salesforce to Tessera, connection detail',
  description:
    'What the Salesforce connection carries into Tessera, what it changes on the way, and what it leaves behind.',
};

const META = [
  { term: 'Direction', detail: CONNECTION.direction },
  { term: 'Runs', detail: CONNECTION.cadence },
  { term: 'Objects', detail: CONNECTION.objects },
  { term: 'Source org', detail: CONNECTION.org },
];

export default function Page() {
  return (
    <main
      className="min-h-screen bg-white text-zinc-900"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <header>
          <p
            className="text-xs uppercase tracking-[0.2em] text-violet-700"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            Integration detail
          </p>

          <h1
            className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-3xl leading-tight tracking-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            <span className="font-medium">Salesforce</span>
            <ArrowRight aria-hidden="true" className="size-6 shrink-0 text-violet-600 md:size-9" />
            <span className="font-medium text-violet-700">Tessera</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-700">
            Nine Salesforce fields land in Tessera every fifteen minutes. Six of them change shape on the
            way, and six more things stay behind. Everything below is the same connection, read from the
            schema on 2026-08-09.
          </p>

          <p className="mt-5 inline-flex items-center gap-2 rounded-md bg-violet-50 px-3 py-1.5 text-sm text-violet-900">
            <span className="size-2 rounded-full bg-violet-600" aria-hidden="true" />
            Live since 2026-06-02, last run finished 14:02 UTC
          </p>

          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
            {META.map((item) => (
              <div key={item.term} className="min-w-0 bg-white p-4">
                <dt className="text-xs uppercase tracking-wider text-zinc-600">{item.term}</dt>
                <dd className="mt-2 break-words text-sm leading-6 text-zinc-800">{item.detail}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SUMMARY.map((stat) => (
              <li key={stat.label} className="min-w-0 border-t-2 border-violet-600 pt-3">
                <p
                  className="text-3xl tabular-nums leading-none text-zinc-900"
                  style={{ fontFamily: 'var(--font-display-mono)' }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-700">{stat.label}</p>
              </li>
            ))}
          </ul>
        </header>

        <FieldMap rows={FIELD_ROWS} />

        <BlockedList items={BLOCKED} />

        <footer className="mt-14 border-t border-zinc-200 pt-6">
          <p className="max-w-3xl text-sm leading-6 text-zinc-600">
            {CONNECTION.schemaRead}. Sample values come from one Opportunity read at 14:02 UTC the same
            day. Field switches and conversion choices on this page describe the connection only, and take
            effect on the next run.
          </p>
        </footer>
      </div>
    </main>
  );
}
