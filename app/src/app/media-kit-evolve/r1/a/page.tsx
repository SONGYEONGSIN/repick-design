import type { Metadata } from 'next'
import { ArrowUpRight, Ban, Mail } from 'lucide-react'

import { MediaKitStage } from './MediaKitStage'
import { MISUSES } from './data'
import { MisuseArt } from './marks'

export const metadata: Metadata = {
  title: 'Halyard — Media Kit',
  description:
    'Drawn assets, approved surfaces and reproduction rules for the Halyard identity. Built for press, partners and designers.',
}

const KIT_META = [
  { id: 'version', label: 'Kit version', value: '4.2' },
  { id: 'published', label: 'Published', value: '12 Mar 2026' },
  { id: 'files', label: 'Files in archive', value: '18' },
  { id: 'licence', label: 'Licence', value: 'Reproduce, do not alter' },
]

export default function MediaKitPage() {
  return (
    <main className="min-h-screen bg-white font-normal text-zinc-900">
      <header className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <p
            className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-600"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Press and partner resources
          </p>
          <h1
            className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-tight text-zinc-900 md:text-7xl"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            Halyard Media Kit
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-zinc-600">
            Halyard builds rigging and load-monitoring hardware for offshore crews. This page exists so that anyone
            placing our identity into their own layout can reproduce it exactly: every drawn asset, the surfaces it is
            cleared for, and the six ways it must never be used.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-4">
            {KIT_META.map((item) => (
              <div key={item.id} className="min-w-0 bg-white p-4">
                <dt className="text-xs font-normal uppercase tracking-[0.16em] text-zinc-600">{item.label}</dt>
                <dd className="mt-2 text-sm font-medium tabular-nums text-zinc-900">{item.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#manifest"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Go to the asset manifest
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <MediaKitStage />

      <section aria-labelledby="type-h" className="border-b border-zinc-200">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10 md:py-20">
          <h2
            id="type-h"
            className="text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            Typeface
          </h2>
          <p className="mt-3 max-w-2xl font-normal text-zinc-600">
            Three faces, three jobs. The wordmark is drawn artwork and is never set live in any of them.
          </p>

          <ul className="mt-8 grid gap-4 lg:grid-cols-3">
            <li className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p
                className="truncate text-3xl font-medium text-zinc-900"
                style={{ fontFamily: 'var(--font-display-wide)' }}
              >
                Rigging the line
              </p>
              <h3 className="mt-6 text-base font-semibold text-zinc-900">Halyard Display Wide</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="font-normal text-zinc-600">Weights</dt>
                  <dd className="font-medium tabular-nums text-zinc-900">500, 600</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-normal text-zinc-600">Use for</dt>
                  <dd className="text-right font-medium text-zinc-900">Headlines over 32 px</dd>
                </div>
              </dl>
              <p className="mt-4 font-normal text-sm text-zinc-600">Latin only. Never set body copy in it.</p>
            </li>

            <li className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-3xl font-normal text-zinc-900" style={{ fontFamily: 'var(--font-sans)' }}>
                Set it, then hold it.
              </p>
              <h3 className="mt-6 text-base font-semibold text-zinc-900">Halyard Text</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="font-normal text-zinc-600">Weights</dt>
                  <dd className="font-medium tabular-nums text-zinc-900">400, 500</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-normal text-zinc-600">Use for</dt>
                  <dd className="text-right font-medium text-zinc-900">Body, tables, labels</dd>
                </div>
              </dl>
              <p className="mt-4 font-normal text-sm text-zinc-600">
                The only face cleared for running text at any size.
              </p>
            </li>

            <li className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-6">
              <p
                className="truncate text-2xl font-normal tabular-nums text-zinc-900"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                halyard-symbol.svg
              </p>
              <h3 className="mt-6 text-base font-semibold text-zinc-900">Halyard Mono</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="font-normal text-zinc-600">Weights</dt>
                  <dd className="font-medium tabular-nums text-zinc-900">400, 500</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-normal text-zinc-600">Use for</dt>
                  <dd className="text-right font-medium text-zinc-900">File names, hex, sizes</dd>
                </div>
              </dl>
              <p className="mt-4 font-normal text-sm text-zinc-600">
                Every figure on this page that names a file or a size is set in it.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="misuse-h" className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10 md:py-20">
          <h2
            id="misuse-h"
            className="text-3xl font-medium tracking-tight text-zinc-900 md:text-4xl"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            Six ways to get it wrong
          </h2>
          <p className="mt-3 max-w-2xl font-normal text-zinc-600">
            Each of these has reached print at least once. They are drawn here so the failure is recognisable before it
            ships, not after.
          </p>

          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {MISUSES.map((item) => (
              <li key={item.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200">
                <div className="border-b border-zinc-200 bg-white p-5">
                  <MisuseArt kind={item.kind} />
                </div>
                <div className="min-w-0 bg-white p-5">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-900">
                    <Ban className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Don&apos;t
                  </p>
                  <h3 className="mt-3 text-base font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-600">{item.rule}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 max-w-xl">
              <h2
                className="text-2xl font-medium tracking-tight text-zinc-900"
                style={{ fontFamily: 'var(--font-display-wide)' }}
              >
                Need something that is not here
              </h2>
              <p className="mt-3 font-normal text-zinc-600">
                Product photography, executive portraits, animated end-cards and localised wordmarks are held outside
                this archive. Ask and you will get them within one working day, along with the caption text we prefer.
              </p>
            </div>
            <div className="min-w-0">
              <a
                href="mailto:press@halyard.co"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors duration-150 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                press@halyard.co
              </a>
              <p className="mt-4 max-w-xs text-sm font-normal text-zinc-600">
                Halyard Marine Systems, Aberdeen. Assets may be reproduced unaltered in editorial and partner contexts.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
