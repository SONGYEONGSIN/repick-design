'use client';

import { useState, type ReactNode } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Clock,
  Quote,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import RegionMap from './RegionMap';
import StatsPanel from './StatsPanel';
import ProductCardRow from './ProductCardRow';
import Reveal from './Reveal';
import {
  DEFAULT_REGION_ID,
  REGIONS,
  TOTAL_ACTIVE_LISTINGS,
  TOTAL_VERIFIED_SELLERS,
  getRegion,
  type RegionId,
} from './data';

const BODY_COPY_CLASS = 'max-w-[520px] text-[17px] font-normal leading-[1.65] text-white/65';

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      'I listed a jacket on a Tuesday and had three AI-matched offers from Riverfront buyers before the weekend.',
    name: 'Maya R.',
    context: 'Riverfront seller',
  },
  {
    quote:
      'The condition grade matched what showed up in the mail almost exactly. That trust is why I keep buying here.',
    name: 'Theo K.',
    context: 'Garden Row buyer',
  },
  {
    quote:
      'Seller verification meant I never had to explain my track record twice. Buyers in Old Mill just saw the badge.',
    name: 'Priya N.',
    context: 'Old Mill seller',
  },
];

interface ValuePillar {
  icon: ReactNode;
  title: string;
  description: string;
}

const VALUE_PILLARS: readonly ValuePillar[] = [
  {
    icon: <BrainCircuit className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />,
    title: 'AI Matching',
    description:
      'Every listing is scored against what nearby buyers already saved, so matches ' +
      'show up ranked by fit, not just by price or posting date.',
  },
  {
    icon: <ScanLine className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />,
    title: 'Condition Grading',
    description:
      'Photos are graded against a fixed rubric — Excellent, Very Good, or Good — so ' +
      'the grade you read is the condition that arrives at your door.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />,
    title: 'Seller Verification',
    description:
      'Verified sellers pass an identity and history check once, then carry that badge ' +
      'into every neighborhood on the map, no re-explaining required.',
  },
];

function focusRing(extra = '') {
  return `focus-visible:text-white focus-visible:underline underline-offset-4 ${extra}`;
}

export default function LandingPage() {
  const [selectedId, setSelectedId] = useState<RegionId>(DEFAULT_REGION_ID);
  const [previewId, setPreviewId] = useState<RegionId | null>(null);

  const selectedRegion = getRegion(selectedId);
  const statsRegion = getRegion(previewId ?? selectedId);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <a
        href="#hero-heading"
        className="absolute left-2 top-2 -translate-y-16 rounded-md bg-[#3B82F6] px-3 py-2 text-sm font-medium text-[#0B0B0F] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <span
            className="text-lg font-semibold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            repick
          </span>
          <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
            <a href="#how-it-works" className={`text-sm font-medium text-white/70 hover:text-white ${focusRing()}`}>
              How it works
            </a>
            <a href="#proof" className={`text-sm font-medium text-white/70 hover:text-white ${focusRing()}`}>
              Sellers
            </a>
            <a href="#join" className={`text-sm font-medium text-white/70 hover:text-white ${focusRing()}`}>
              Join
            </a>
          </nav>
          <a
            href="#join"
            className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-[#0B0B0F] transition-colors hover:bg-[#2F6FE0] focus-visible:bg-[#2F6FE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            List an item
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-10 lg:pt-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#3B82F6]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  AI-matched resale, block by block
                </span>
                <h1
                  id="hero-heading"
                  className="mt-4 text-[clamp(2.25rem,9vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-white sm:text-[clamp(2.75rem,6vw,3.75rem)] lg:text-[clamp(3.25rem,4vw,5rem)]"
                  style={{ fontFamily: 'var(--font-display-mono)' }}
                >
                  Every neighborhood resells differently. Now you can see it.
                </h1>
                <p className={`mt-5 ${BODY_COPY_CLASS}`}>
                  Click any district on the map to see live resale activity —
                  active listings, average price, and AI-verified sellers
                  nearby, updated as you explore.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#join"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-medium text-[#0B0B0F] transition-colors hover:bg-[#2F6FE0] focus-visible:bg-[#2F6FE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    List your first item
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-white/35 focus-visible:border-white/70 focus-visible:bg-white/5"
                  >
                    See how matching works
                  </a>
                </div>

                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-white/60">
                  <li className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#3B82F6]" aria-hidden="true" />
                    Bank-grade seller verification
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ScanLine className="h-4 w-4 text-[#3B82F6]" aria-hidden="true" />
                    Every item AI-graded for condition
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#3B82F6]" aria-hidden="true" />
                    Most listings go live in under 10 minutes
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <RegionMap
                  regions={REGIONS}
                  selectedId={selectedId}
                  previewId={previewId}
                  onSelect={setSelectedId}
                  onPreview={setPreviewId}
                />
                <StatsPanel region={statsRegion} />
              </div>
            </div>

            <div className="mt-14">
              <ProductCardRow region={selectedRegion} />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <h2
              className="text-2xl font-semibold text-white sm:text-3xl"
              style={{ fontFamily: 'var(--font-display-mono)' }}
            >
              Three systems, one listing.
            </h2>
            <p className={`mt-3 ${BODY_COPY_CLASS}`}>
              Every item that goes live on repick passes through the same
              three checks, whichever neighborhood it is listed from.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {VALUE_PILLARS.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 0.08}>
                  <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10">
                      {pillar.icon}
                    </div>
                    <h3 className="text-base font-semibold text-white">{pillar.title}</h3>
                    <p className="mt-2 max-w-[320px] text-sm font-normal leading-[1.6] text-white/60">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2
                className="text-2xl font-semibold text-white sm:text-3xl"
                style={{ fontFamily: 'var(--font-display-mono)' }}
              >
                Already moving, city-wide.
              </h2>
              <p className="inline-flex items-center gap-2 text-sm font-medium text-white/60">
                <Users className="h-4 w-4 text-[#3B82F6]" aria-hidden="true" />
                {TOTAL_ACTIVE_LISTINGS.toLocaleString('en-US')} active listings and{' '}
                {TOTAL_VERIFIED_SELLERS.toLocaleString('en-US')} AI-verified sellers
                across repick&apos;s 6 neighborhoods right now.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {TESTIMONIALS.map((testimonial, index) => (
                <Reveal key={testimonial.name} delay={index * 0.08}>
                  <figure className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-6">
                    <Quote className="h-5 w-5 text-[#3B82F6]" aria-hidden="true" />
                    <blockquote className="mt-3 max-w-[320px] text-sm font-normal leading-[1.6] text-white/75">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-4 text-xs font-medium text-white/50">
                      {testimonial.name} &middot; {testimonial.context}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-[#3B82F6]/25 bg-[#3B82F6]/[0.06] p-8 sm:flex-row sm:items-end sm:p-12">
              <div>
                <h2
                  className="text-3xl font-semibold text-white sm:text-4xl"
                  style={{ fontFamily: 'var(--font-display-mono)' }}
                >
                  {selectedRegion.name} sellers are already live.
                </h2>
                <p className={`mt-4 ${BODY_COPY_CLASS}`}>
                  List your first item in minutes — our AI grades condition
                  and matches buyers in {selectedRegion.name} automatically.
                  Already {selectedRegion.stats.verifiedSellers} verified
                  sellers are trading nearby.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-3 text-sm font-medium text-[#0B0B0F] transition-colors hover:bg-[#2F6FE0] focus-visible:bg-[#2F6FE0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  List your first item
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a
                  href="#hero-heading"
                  className="text-sm font-medium text-white/70 hover:text-white focus-visible:text-white focus-visible:underline"
                >
                  Browse {selectedRegion.name} listings
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span
            className="text-sm font-semibold text-white"
            style={{ fontFamily: 'var(--font-display-mono)' }}
          >
            repick
          </span>
          <p className="text-xs font-normal text-white/45">
            &copy; 2026 repick. AI-matched, condition-graded, seller-verified resale.
          </p>
        </div>
      </footer>
    </div>
  );
}
