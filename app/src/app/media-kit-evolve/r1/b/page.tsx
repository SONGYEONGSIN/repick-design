import { ArrowUpRight, Palette, Ruler, ScanLine, Type } from 'lucide-react';
import { CompareBand } from './CompareBand';
import { Mark } from './Mark';
import { GEOMETRY, PALETTE, RULES, TYPE_SPEC } from './data';

const FACTS = [
  { value: '4', label: 'Rules that bind' },
  { value: '12', label: 'Documented misuses' },
  { value: '0.5x', label: 'Clear space, every side' },
];

export default function MediaKitPage() {
  const totalCases = RULES.reduce((sum, rule) => sum + rule.cases.length, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <header className="border-b border-zinc-800 pb-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-3 text-lime-300">
              <Mark size={40} />
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display-mono)' }}
              >
                repick
              </span>
            </div>
            <p
              className="text-xs font-medium uppercase tracking-[0.25em] tabular-nums text-zinc-400"
              style={{ fontFamily: 'var(--font-display-mono)' }}
            >
              Media kit / rev 2.1
            </p>
          </div>

          <h1
            className="mt-10 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-zinc-50 sm:text-6xl"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            Take the mark.
            <span className="block text-lime-300">Take it correctly.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base font-normal leading-7 text-zinc-300">
            Everything a newsroom, a partner or a conference deck needs to reproduce us sits below,
            drawn from the source geometry rather than screenshotted from a page. The rules are not
            written as prose you skim — each one is a specimen with the wrong version rendered beside
            the right one. Drag the seam to push one over the other.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
            {FACTS.map((fact) => (
              <div key={fact.label} className="min-w-0 border-l border-zinc-800 pl-4">
                <dt className="text-sm font-normal text-zinc-400">{fact.label}</dt>
                <dd
                  className="mt-1 text-3xl font-bold tabular-nums text-zinc-50"
                  style={{ fontFamily: 'var(--font-display-mono)' }}
                >
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <section className="pt-14" aria-labelledby="rules-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="rules-heading"
              className="text-xl font-bold tracking-tight text-zinc-50"
              style={{ fontFamily: 'var(--font-display-mono)' }}
            >
              Wrong on one side, right on the other
            </h2>
            <p className="flex items-center gap-2 text-sm font-normal tabular-nums text-zinc-400">
              <ScanLine className="h-4 w-4 text-lime-300" aria-hidden="true" />
              {totalCases} specimens. Drag the seam, or focus it and use the arrow keys.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-14">
            {RULES.map((rule) => (
              <CompareBand key={rule.id} rule={rule} />
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-zinc-800 pt-14" aria-labelledby="spec-heading">
          <h2
            id="spec-heading"
            className="text-xl font-bold tracking-tight text-zinc-50"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            The values you copy
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-normal leading-6 text-zinc-300">
            No archive to unzip. The mark is a 64-unit vector, the palette is four inks, and the type
            is one display face over one text face. Copy the numbers straight from this page.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <Palette className="h-4 w-4 text-lime-300" aria-hidden="true" />
                Palette
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {PALETTE.map((colour) => (
                  <li key={colour.hex} className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`h-8 w-8 shrink-0 rounded-md border border-zinc-700 ${colour.swatch}`}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-zinc-100">{colour.name}</span>
                      <span className="block font-mono text-xs font-normal tabular-nums text-zinc-400">
                        {colour.hex} — {colour.use}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <Ruler className="h-4 w-4 text-lime-300" aria-hidden="true" />
                Geometry
              </h3>
              <dl className="mt-4 flex flex-col gap-2">
                {GEOMETRY.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-3">
                    <dt className="text-sm font-normal text-zinc-400">{row.label}</dt>
                    <dd className="font-mono text-sm font-medium tabular-nums text-zinc-100">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <Type className="h-4 w-4 text-lime-300" aria-hidden="true" />
                Type
              </h3>
              <dl className="mt-4 flex flex-col gap-2">
                {TYPE_SPEC.map((row) => (
                  <div key={row.label} className="min-w-0">
                    <dt className="text-sm font-normal text-zinc-400">{row.label}</dt>
                    <dd className="truncate font-mono text-sm font-medium tabular-nums text-zinc-100">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <ScanLine className="h-4 w-4 text-lime-300" aria-hidden="true" />
                Clear space
              </h3>
              <div className="mt-4 flex items-center justify-center rounded-xl border border-dashed border-zinc-600 p-6">
                <span className="inline-flex text-lime-300 ring-1 ring-zinc-600">
                  <Mark size={48} />
                </span>
              </div>
              <p className="mt-3 text-xs font-normal leading-5 text-zinc-400">
                Solid frame: the bounding box. Dashed frame: the untouchable band, half a mark
                height on every side.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-800 pt-8">
          <p className="max-w-xl text-sm font-normal leading-6 text-zinc-400">
            Reproducing the mark outside these rules needs written permission. Anything on this page
            you may use as-is for editorial coverage.
          </p>
          <a
            href="mailto:press@repick.design"
            className="inline-flex items-center gap-2 rounded-full border border-lime-300 px-4 py-2 text-sm font-medium text-lime-300 transition-colors duration-150 hover:bg-lime-300 hover:text-zinc-950 motion-reduce:transition-none"
          >
            press@repick.design
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </footer>
      </main>
    </div>
  );
}
