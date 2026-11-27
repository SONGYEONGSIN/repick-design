'use client';

import Image from 'next/image';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import Reveal from './Reveal';
import { COLORS, PREVIEW_LISTINGS, type Listing } from './data';

function ListingCard({ listing, delay }: { listing: Listing; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className="flex h-full flex-col gap-4 rounded-2xl p-4"
        style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
      >
        <div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-xl"
          style={{ backgroundColor: COLORS.surfaceLine }}
        >
          <Image
            src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=640&q=80`}
            alt={`${listing.title}, ${listing.category.toLowerCase()} listing`}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-semibold" style={{ color: COLORS.fg }}>
            {listing.title}
          </p>
          <p className="text-[13px] font-normal" style={{ color: COLORS.muted }}>
            {listing.category}
          </p>
        </div>

        {/* Badge row — always visible at rest, never gated behind hover/focus,
            and never layered on top of the photo. */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="tabular-nums rounded-full px-2.5 py-1 text-[12px] font-semibold text-white"
            style={{ backgroundColor: COLORS.accentFill }}
          >
            {listing.matchPercent}% match
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{ color: COLORS.fg, border: `1px solid ${COLORS.surfaceLine}` }}
          >
            Grade {listing.conditionGrade}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{
              color: listing.verified ? COLORS.accentTint : COLORS.muted,
              border: `1px solid ${COLORS.surfaceLine}`,
            }}
          >
            {listing.verified ? (
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {listing.verified ? 'Verified seller' : 'Unverified seller'}
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-2 tabular-nums">
          <span className="text-[13px] font-normal line-through" style={{ color: COLORS.muted }}>
            ${listing.priceBefore}
          </span>
          <span className="text-[18px] font-extrabold" style={{ color: COLORS.fg }}>
            ${listing.priceAfter}
          </span>
          <span className="text-[13px] font-normal" style={{ color: COLORS.muted }}>
            vs. retail
          </span>
        </div>
      </article>
    </Reveal>
  );
}

export default function ProductPreview() {
  return (
    <section id="catalog" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-8 flex flex-col gap-3 sm:max-w-[560px]">
          <h2
            className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            Proof travels with every listing, not just the one in the orbit.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            Match, grade, seller verification and the discount against retail sit on the
            card — on a phone with no hover, on a laptop with no focus, at rest, always.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PREVIEW_LISTINGS.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
