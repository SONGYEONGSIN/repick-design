"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import InspectorDevice from "./InspectorDevice";
import InspectorFindings from "./InspectorFindings";
import ProductGrid from "./ProductGrid";
import { DEFAULT_ACTIVE, DISPLAY, FOCUS_RING, cx, type LayerId } from "./data";

/**
 * Hero fold. Headline/subhead/CTA, the layer-toggle device and the four mandatory product cards all
 * render in this one section — no scroll needed to reach any of them, at both 1440px and 390px.
 *
 * The four pieces below (text, device, cards, findings) are direct children of one responsive grid
 * rather than nested columns, specifically so their *order* can differ by breakpoint without
 * duplicating state: on a phone, the very limited fold height goes to the device and the mandatory
 * cards first, and the finding-text elaboration (a bonus proof surface beyond the required verdict
 * badge + confidence bar) follows after the cards instead of pushing them below the fold. From the
 * `lg` breakpoint up there is room for all four in the brief's original two-column shape.
 */
export default function HeroSection() {
  const [active, setActive] = useState<LayerId[]>(DEFAULT_ACTIVE);

  function toggle(id: LayerId) {
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <section aria-labelledby="hero-title" className="pt-8 pb-14 sm:pt-10 md:pt-12 md:pb-20">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10">
          {/* 1 — headline / subhead / CTA */}
          <div className="order-1 min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#A1A1AA] sm:text-xs">
              repick · AI layer inspector
            </p>
            <h1
              id="hero-title"
              style={DISPLAY}
              className="mt-3 text-[clamp(1.6rem,4.6vw,3.1rem)] font-bold leading-[1.05] tracking-[-0.01em] text-white"
            >
              See what the AI sees before you buy.
            </h1>
            <p className="mt-2.5 max-w-[46ch] text-[0.9rem] font-normal leading-[1.5] text-[#A1A1AA] sm:mt-3 sm:text-base sm:leading-[1.6]">
              Toggle the layers on the coat below — the verdict, the confidence bar and the
              highlighted region all recompute live.
            </p>
            <a
              href="#picks"
              className={cx(
                "mt-3.5 inline-flex w-fit items-center gap-2 rounded-full bg-[#6E56CF] px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none sm:mt-4",
                FOCUS_RING,
              )}
            >
              See tonight&rsquo;s inspected picks
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          {/* 2 — the toggle device itself: chips, photo, verdict + confidence bar */}
          <div className="order-2 min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-2">
            <InspectorDevice active={active} onToggle={toggle} />
          </div>

          {/* 3 — the four mandatory product cards */}
          <div className="order-3 min-w-0 lg:col-span-7 lg:col-start-6 lg:row-span-3 lg:row-start-1">
            <div className="mb-3 flex items-baseline justify-between gap-3 lg:mb-4">
              <h2 className="text-sm font-semibold tracking-[-0.01em] text-white sm:text-base">
                Four listings, fully tagged at rest
              </h2>
              <span className="hidden shrink-0 text-[0.7rem] font-normal text-[#A1A1AA] sm:inline">
                No hover required
              </span>
            </div>
            <ProductGrid />
          </div>

          {/* 4 — finding text, one line per active layer (see InspectorFindings for why it is its
              own grid item instead of living inside the device). */}
          <div className="order-4 min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-3">
            <InspectorFindings active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
