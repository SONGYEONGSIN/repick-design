'use client';

import { useState } from 'react';
import { Ban, Minus, Plus } from 'lucide-react';
import type { BlockedItem } from './data';

export default function BlockedList({ items }: { items: BlockedItem[] }) {
  const [opened, setOpened] = useState<string[]>([]);

  const toggle = (id: string) =>
    setOpened((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  return (
    <section aria-labelledby="blocked-heading" className="mt-16">
      <h2
        id="blocked-heading"
        className="text-xl font-semibold tracking-tight md:text-2xl"
        style={{ fontFamily: 'var(--font-display-mono)' }}
      >
        What this connection does not move
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
        Six things stay in Salesforce. Each one is a decision rather than an oversight, so the reason sits
        next to it. Open an item for the full argument and what to do instead.
      </p>

      <ul className="mt-6 divide-y divide-zinc-200 border-y border-zinc-200">
        {items.map((item) => {
          const isOpen = opened.includes(item.id);
          const panelId = `blocked-why-${item.id}`;

          return (
            <li key={item.id} className="py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-start gap-2 text-base leading-6 text-zinc-900">
                    <Ban aria-hidden="true" className="mt-1 size-4 shrink-0 text-violet-700" />
                    <span className="min-w-0 break-words font-medium">{item.name}</span>
                  </h3>
                  <p className="mt-1 pl-6 text-xs leading-5 text-zinc-600">{item.origin}</p>
                  <p className="mt-2 max-w-2xl pl-6 text-sm leading-6 text-zinc-800">{item.reason}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-label={`Why ${item.name} stays in Salesforce`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-800 transition-colors hover:border-violet-400 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  {isOpen ? (
                    <Minus aria-hidden="true" className="size-4 text-violet-700" />
                  ) : (
                    <Plus aria-hidden="true" className="size-4 text-violet-700" />
                  )}
                  {isOpen ? 'Close' : 'Why'}
                </button>
              </div>

              <div id={panelId} hidden={!isOpen} className="mt-4 pl-6">
                <p className="max-w-2xl text-sm leading-6 text-zinc-700">{item.detail}</p>
                <p className="mt-3 max-w-2xl rounded-md bg-violet-50 px-3 py-2.5 text-sm leading-6 text-violet-900">
                  <span className="font-medium">Instead: </span>
                  {item.instead}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
