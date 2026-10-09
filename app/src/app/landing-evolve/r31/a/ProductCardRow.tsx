'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BadgeCheck, ChevronDown, ShieldAlert, Sparkles } from 'lucide-react';
import type { ProductListing, Region } from './data';

interface ProductCardRowProps {
  region: Region;
}

function discountPercent(listing: ProductListing): number {
  return Math.round((1 - listing.price / listing.originalPrice) * 100);
}

function ProductCard({ listing, index }: { listing: ProductListing; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = `match-reason-${listing.title.replace(/\s+/g, '-').toLowerCase()}-${index}`;

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="relative aspect-[4/5] w-full bg-[#1A1C22]">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=480&h=600&q=70`}
          alt={`${listing.title}, secondhand, ${listing.grade.toLowerCase()} condition`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 320px"
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-sm font-semibold text-white">{listing.title}</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span
              className="text-base font-semibold text-white"
              style={{ fontFamily: 'var(--font-display-mono)' }}
            >
              ${listing.price}
            </span>
            <span className="text-sm font-normal text-white/40 line-through">
              ${listing.originalPrice}
            </span>
            <span className="text-xs font-medium text-[#3B82F6]">
              &minus;{discountPercent(listing)}%
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/15 px-2 py-1 text-[11px] font-medium text-white">
            {listing.matchPercent}% match
          </span>
          <span className="rounded-full border border-white/15 px-2 py-1 text-[11px] font-medium text-white/80">
            {listing.grade}
          </span>
          {listing.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-1 text-[11px] font-medium text-white/80">
              <BadgeCheck className="h-3 w-3 text-[#3B82F6]" aria-hidden="true" />
              Verified seller
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-[11px] font-medium text-white/50">
              <ShieldAlert className="h-3 w-3" aria-hidden="true" />
              Verification pending
            </span>
          )}
        </div>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className="mt-auto flex items-center gap-1.5 self-start rounded-md text-xs font-medium text-white/60 transition-colors hover:text-white focus-visible:text-white focus-visible:underline"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" aria-hidden="true" />
          Why this match?
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        <p
          id={panelId}
          hidden={!expanded}
          className="text-xs font-normal leading-relaxed text-white/60"
        >
          {listing.matchReason}.
        </p>
      </div>
    </li>
  );
}

export default function ProductCardRow({ region }: ProductCardRowProps) {
  return (
    <div>
      <p className="text-sm font-medium text-white/55">
        Live finds in {region.stats.topCategory.toLowerCase()} near {region.name}
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {region.listings.map((listing, index) => (
          <ProductCard key={listing.title} listing={listing} index={index} />
        ))}
      </ul>
    </div>
  );
}
