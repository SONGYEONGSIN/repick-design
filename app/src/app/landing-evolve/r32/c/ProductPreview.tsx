'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Shirt, Footprints, ShoppingBag, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import Reveal from './Reveal';
import CategoryArt from './CategoryArt';
import { CATEGORIES, FEATURED_LISTINGS, type Category } from './data';

const CATEGORY_ICON: Record<Category, LucideIcon> = {
  Outerwear: Shirt,
  Footwear: Footprints,
  Bags: ShoppingBag,
};

export default function ProductPreview() {
  const [filter, setFilter] = useState<'All' | Category>('All');
  const visible =
    filter === 'All' ? FEATURED_LISTINGS : FEATURED_LISTINGS.filter((l) => l.category === filter);

  return (
    <section id="preview" className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[560px]">
          <h2 className="text-3xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-4xl">
            Every card carries its own proof.
          </h2>
          <p className="mt-3 text-base leading-[1.6] text-zinc-600">
            An AI match reasoning tag, a condition grade, a seller verification
            badge, and the exact before/after discount — on every listing, not
            just the featured ones.
          </p>
        </div>
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = cat === filter;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(cat)}
                className={
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4d7c0f] ' +
                  (active ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200')
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((listing) => {
            const Icon = CATEGORY_ICON[listing.category];
            return (
              <article
                key={listing.id}
                className="flex min-w-0 flex-col rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <CategoryArt icon={Icon} label={`${listing.category} listing photo placeholder`} />

                <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-[#4d7c0f]">
                  <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" />
                  {listing.matchPercent}% match
                </span>

                <h3 className="mt-3 text-base font-extrabold tracking-[-0.02em] text-zinc-900">
                  {listing.name}
                </h3>
                <p className="mt-1 text-sm leading-[1.6] text-zinc-500">{listing.reasoning}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                    Grade {listing.grade}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                    {listing.verified ? (
                      <>
                        <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                        Verified seller
                      </>
                    ) : (
                      <>
                        <UserRound size={12} strokeWidth={2.5} aria-hidden="true" />
                        New seller
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-mono text-base font-extrabold tabular-nums text-zinc-900">
                    ${listing.salePrice}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-zinc-500 line-through">
                    ${listing.originalPrice}
                  </span>
                  <span className="ml-auto rounded-full bg-[#84cc16] px-2 py-0.5 text-xs font-semibold tabular-nums text-zinc-900">
                    -{listing.discountPercent}%
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
