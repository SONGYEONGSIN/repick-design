'use client';

import { useState } from 'react';
import { Database, EyeOff, Server } from 'lucide-react';

import { residency } from './data';

const icons = { stored: Database, transit: Server, never: EyeOff };

export default function ResidencyPanel() {
  const [active, setActive] = useState(residency[0].id);
  const tab = residency.find((t) => t.id === active) ?? residency[0];

  return (
    <section
      id="residency"
      aria-labelledby="residency-heading"
      className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16"
    >
      <div className="border-t border-zinc-200 pt-10">
        <h2
          id="residency-heading"
          className="font-[family-name:var(--font-display-wide)] text-2xl font-medium tracking-tight md:text-3xl"
        >
          Where the data actually sits
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
          Granting a scope is a question about storage, not just access. These three lists are the
          answer a security reviewer usually has to ask for.
        </p>

        <div
          role="tablist"
          aria-label="Data residency categories"
          className="mt-6 inline-flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1"
        >
          {residency.map((t) => {
            const Icon = icons[t.id as keyof typeof icons];
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                onClick={() => setActive(t.id)}
                className={`inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none ${
                  selected
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          className="mt-5 rounded-xl border border-zinc-200 bg-white p-5 md:p-6"
        >
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">{tab.blurb}</p>
          <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {tab.rows.map((row) => (
              <li key={row.item} className="min-w-0 border-t border-zinc-200 pt-4">
                <h3 className="text-sm font-semibold text-zinc-900">{row.item}</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-zinc-600">{row.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
