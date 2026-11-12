'use client';

import { useState } from 'react';
import Hero from './Hero';
import ProductPreview from './ProductPreview';
import ValueSection from './ValueSection';
import SocialProof from './SocialProof';
import ClosingCta from './ClosingCta';
import { DEFAULT_RANGE } from './data';

export default function LandingPage() {
  const [minPrice, setMinPrice] = useState(DEFAULT_RANGE.min);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_RANGE.max);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-[14px] focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <span
          className="text-[18px] font-extrabold tracking-[-0.02em] text-zinc-900"
          style={{ fontFamily: 'var(--font-display-wide)' }}
        >
          Repick
        </span>
        <a
          href="#value"
          className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-zinc-600 transition-colors hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          How grading works
        </a>
      </header>

      <main id="main-content">
        <Hero
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinChange={setMinPrice}
          onMaxChange={setMaxPrice}
        />
        <ProductPreview />
        <ValueSection minPrice={minPrice} maxPrice={maxPrice} />
        <SocialProof />
        <ClosingCta minPrice={minPrice} maxPrice={maxPrice} />
      </main>

      <footer className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[13px] leading-[1.6] text-zinc-500">
          Repick. Every price shown against the comparable sales that actually happened.
        </p>
      </footer>
    </div>
  );
}
