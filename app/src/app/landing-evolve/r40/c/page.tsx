"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ArrowRight, ScanLine, ShieldCheck, Star, Tag } from "lucide-react";
import Reveal from "./Reveal";
import GradeMatrix from "./GradeMatrix";
import {
  CATEGORY_PHOTO,
  DEFAULT_SELECTION,
  HERO_SHOWCASE,
  MATRIX,
  type Category,
  type Tier,
} from "./data";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]";

const TESTIMONIALS = [
  {
    name: "D. Calloway",
    detail: "Sneakers, Like New",
    quote:
      "The grade matched what showed up at my door — no surprises, no renegotiating.",
  },
  {
    name: "R. Mbeki",
    detail: "Watches, Good",
    quote:
      "I picked Good on purpose and got a watch priced and graded exactly like one.",
  },
  {
    name: "S. Patel",
    detail: "Bags, Fair",
    quote:
      "Knowing the tier going in made the discount make sense instead of feeling random.",
  },
];

export default function Page() {
  const [selected, setSelected] = useState<{ tier: Tier; category: Category }>(
    DEFAULT_SELECTION,
  );
  const cell = MATRIX[selected.tier][selected.category];
  const matrixHeadingId = useId();

  function handleSelect(tier: Tier, category: Category) {
    setSelected({ tier, category });
  }

  return (
    <>
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-sky-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-white text-zinc-950">
        <header className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-6 sm:px-8">
          <p className="text-sm font-extrabold tracking-[-0.02em] text-zinc-950">
            repick
          </p>
          <a
            href="#matrix"
            className={`rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 ${FOCUS_RING}`}
          >
            Open the grade matrix
          </a>
        </header>

        <main id="main">
          {/* HERO — headline, subhead, CTA and proof cards all in one component */}
          <section className="mx-auto max-w-[1180px] px-4 pb-16 pt-6 sm:px-8 sm:pb-24">
            <p className="text-xs font-semibold tracking-[0.28em] text-sky-700">
              CONDITION-MATCHED RESALE
            </p>
            <h1 className="mt-4 max-w-[640px] text-[clamp(2.25rem,9vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950 lg:text-[clamp(3.5rem,5vw,4.75rem)]">
              Twelve cells. One exact match.
            </h1>
            <p className="mt-6 max-w-[480px] text-base font-normal leading-[1.6] text-zinc-600">
              Repick cross-references AI photo grading with seller verification
              across condition and category, so the listing you open already
              matches the tier you picked.
            </p>
            <a
              href="#matrix"
              className={`mt-8 inline-flex items-center gap-2 rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
            >
              Open the grade matrix
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {HERO_SHOWCASE.map(({ tier, category }) => {
                const item = MATRIX[tier][category].best;
                const photo = CATEGORY_PHOTO[category];
                return (
                  <div
                    key={`${tier}-${category}`}
                    className="rounded-2xl border border-zinc-200 bg-white p-4"
                  >
                    <div
                      className="relative overflow-hidden rounded-xl bg-zinc-100"
                      style={{ aspectRatio: "4 / 3" }}
                    >
                      <Image
                        src={`https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=800&q=80`}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 320px, 90vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950">
                          {item.name}
                        </p>
                        <p className="text-xs font-normal text-zinc-600">
                          {category}
                        </p>
                      </div>
                      <span className="rounded-full bg-sky-700 px-2.5 py-1 text-xs font-semibold text-white">
                        {item.match}% match
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                        {tier}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Verified
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                        &minus;{item.discount}% vs retail
                      </span>
                    </div>
                    <p className="mt-3 text-lg font-extrabold tabular-nums tracking-[-0.02em] text-zinc-950">
                      ${item.price}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* GRADE MATRIX — the core device */}
          <section
            id="matrix"
            className="border-t border-zinc-100 bg-zinc-50 px-4 py-16 sm:px-8 sm:py-24"
          >
            <div className="mx-auto max-w-[1180px]">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-sky-700">
                  GRADE MATRIX
                </p>
                <h2
                  id={matrixHeadingId}
                  className="mt-3 max-w-[560px] text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-zinc-950 sm:text-3xl"
                >
                  Choose a tier. Choose a category.
                </h2>
                <p className="mt-4 max-w-[480px] text-base font-normal leading-[1.6] text-zinc-600">
                  Every one of the twelve cells below holds its own best match,
                  drawn from live-graded inventory — tap one to see it, plus the
                  two closest alternatives.
                </p>
              </Reveal>
              <div className="mt-10">
                <GradeMatrix selected={selected} onSelect={handleSelect} />
              </div>
            </div>
          </section>

          {/* VALUE PROP — ties back into the live matrix selection */}
          <section className="px-4 py-16 sm:px-8 sm:py-24">
            <div className="mx-auto max-w-[1180px]">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-sky-700">
                  WHAT BACKS THE NUMBER
                </p>
                <h2 className="mt-3 max-w-[620px] text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-zinc-950 sm:text-3xl">
                  Behind your {selected.tier} {selected.category} match
                </h2>
              </Reveal>
              <Reveal className="mt-10 grid gap-8 sm:grid-cols-3" delay={0.05}>
                <div>
                  <ScanLine className="h-5 w-5 text-sky-700" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-zinc-950">
                    Computer-vision grading
                  </h3>
                  <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
                    Every photo across {cell.count} {selected.category} listings
                    in {selected.tier} condition is scored against reference
                    images. {cell.best.name} cleared {cell.best.match}%.
                  </p>
                </div>
                <div>
                  <ShieldCheck className="h-5 w-5 text-sky-700" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-zinc-950">
                    Verified seller history
                  </h3>
                  <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
                    This pick&apos;s seller status is {cell.best.seller} — cross-checked
                    against their past grading accuracy before the listing goes
                    live.
                  </p>
                </div>
                <div>
                  <Tag className="h-5 w-5 text-sky-700" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-semibold text-zinc-950">
                    Dynamic resale pricing
                  </h3>
                  <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
                    At ${cell.best.price}, this pick runs {cell.best.discount}%
                    under retail today, recalculated as condition and demand
                    shift.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          {/* SOCIAL PROOF */}
          <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-16 sm:px-8 sm:py-24">
            <div className="mx-auto max-w-[1180px]">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.28em] text-sky-700">
                  FROM RECENT BUYERS
                </p>
                <h2 className="mt-3 max-w-[560px] text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-zinc-950 sm:text-3xl">
                  What verified buyers noticed
                </h2>
              </Reveal>
              <Reveal className="mt-10 grid gap-4 sm:grid-cols-3" delay={0.05}>
                {TESTIMONIALS.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-2xl border border-zinc-200 bg-white p-5"
                  >
                    <div className="flex items-center gap-1" aria-hidden="true">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-sky-700 text-sky-700"
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-700">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="mt-3 text-xs font-semibold text-zinc-600">
                      {t.name} · {t.detail}
                    </p>
                  </div>
                ))}
              </Reveal>
            </div>
          </section>

          {/* CLOSING CTA — restates the live matrix selection, not a fixed number */}
          <section className="px-4 py-16 sm:px-8 sm:py-24">
            <div className="mx-auto max-w-[1180px]">
              <Reveal>
                <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-center sm:p-14">
                  <p className="text-sm font-normal text-zinc-600">
                    Your current pick
                  </p>
                  <h2 className="mt-2 text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-zinc-950">
                    {selected.tier} {selected.category} match: {cell.best.name} at{" "}
                    {cell.best.match}%
                  </h2>
                  <p className="mt-3 text-sm font-normal text-zinc-600">
                    ${cell.best.price} · &minus;{cell.best.discount}% vs retail ·{" "}
                    {cell.best.seller}
                  </p>
                  <a
                    href="#matrix"
                    className={`mt-8 inline-flex items-center gap-2 rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white ${FOCUS_RING}`}
                  >
                    Lock in this match
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
