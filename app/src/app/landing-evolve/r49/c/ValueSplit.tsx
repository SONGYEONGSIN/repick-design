"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Radar, SlidersHorizontal } from "lucide-react";
import Reveal from "./Reveal";
import { coverageSentence, AREA_RADIUS_MILES, type Category, type CoverageResult } from "./data";
import { EYEBROW, GHOST_TEXT, HEADLINE_FONT, MUTED_TEXT } from "./tokens";
import { useMounted } from "./useMounted";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function ValueSplit({ coverage, categoryFilter }: { coverage: CoverageResult; categoryFilter: Category | null }) {
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();
  const parallaxOn = mounted && !reduceMotion;

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  const features = [
    {
      icon: SlidersHorizontal,
      title: "One pin, every surface",
      body:
        "The live panel, the aggregate stat above the field, and each product card's “accepted near you” line all read the same selected point -- nothing here recomputes on a delay or waits for a page reload.",
    },
    {
      icon: Radar,
      title: `Fixed ${AREA_RADIUS_MILES} mi radius, every point`,
      body:
        "Coverage is measured the same way from whichever pin you pick -- the radius never grows for a busier point or shrinks for a quiet one, so the count you see is comparable across the network.",
    },
    {
      icon: MapPin,
      title: "The sentence moves with you",
      body: `Right now: ${coverageSentence(coverage, categoryFilter)}`,
    },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-[#E7E3E3] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="relative grid grid-cols-1 gap-y-6 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-6">
            <p className={`${EYEBROW} text-[#BE123C]`}>How the field is read</p>
            <h2 style={HEADLINE_FONT} className="mt-3 max-w-[480px] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#171717] sm:text-4xl">
              The pin moves. The math underneath doesn&rsquo;t.
            </h2>
            <p className={`mt-4 max-w-[492px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Three fixed rules sit behind the field above. Only the point you select changes --
              the seven locations and the radius that measures between them never do.
            </p>
          </Reveal>

          <div aria-hidden="true" className="pointer-events-none hidden select-none items-start justify-end lg:col-span-6 lg:flex">
            {parallaxOn ? (
              <motion.span
                style={{ y: ghostY, fontFamily: "var(--font-display-wide)" }}
                className={`font-extrabold leading-none tracking-[-0.02em] ${GHOST_TEXT}`}
              >
                <span style={{ fontSize: "clamp(5rem,9vw,8rem)" }}>{AREA_RADIUS_MILES}mi</span>
              </motion.span>
            ) : (
              <span
                style={{ fontFamily: "var(--font-display-wide)", fontSize: "clamp(5rem,9vw,8rem)" }}
                className={`font-extrabold leading-none tracking-[-0.02em] ${GHOST_TEXT}`}
              >
                {AREA_RADIUS_MILES}mi
              </span>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={i * 0.08} className="h-full min-w-0">
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#E7E3E3] bg-white p-5">
                  <Icon className="h-5 w-5 text-[#BE123C]" aria-hidden="true" />
                  <h3 className="text-base font-extrabold leading-[1.2] text-[#171717]">{f.title}</h3>
                  <p className={`max-w-[300px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>{f.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
