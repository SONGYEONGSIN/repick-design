import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MagnifierDevice from "./MagnifierDevice";
import ProductCards from "./ProductCards";
import { ACCENT_FILL, ACCENT_TINT, FOCUS } from "./theme";
import { TOTAL_HOTSPOTS } from "./hotspots";

/**
 * Headline, subhead, CTA, the magnifier device (with its live counter and
 * confidence meter) and the product-preview cards all live in this one
 * section — nothing the device produces is pushed to a section below.
 *
 * Layout is a full-width stacked hero, not a side-by-side column split —
 * deliberately different from a `col-span-7` headline + `col-span-5`
 * proof-card row, since the device needs real width to be usable and a
 * narrow side column would cramp it.
 *
 * Body line length: the subhead sits in a 560px box at 18px desktop type.
 * Pretendard's average English character advance is ~0.44em, so
 * 560 ÷ (0.44 × 18) ≈ 70.7 characters per line — inside the ≤75 target.
 */
export default function Hero({
  found,
  onFound,
}: {
  found: ReadonlySet<string>;
  onFound: (id: string) => void;
}) {
  return (
    <section id="hero" className="border-b border-white/10 pb-20 pt-14 sm:pt-16 lg:pb-28 lg:pt-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[760px]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: ACCENT_TINT }}>
            Authenticity, in five spots
          </p>

          <h1 className="mt-5 text-[clamp(2.25rem,1.7rem+2.6vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white">
            Five spots separate real from replica.
          </h1>

          <p className="mt-5 text-base leading-[1.6] text-zinc-300 sm:text-lg" style={{ maxWidth: "560px" }}>
            Move the lens over the sneaker below. Every seam, stamp, and tag our
            graders check locks in the moment you land on it — then stays
            visible for good, no re-hovering required.
          </p>

          <div className="mt-8">
            <Link
              href="/catalog"
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS}`}
              style={{ backgroundColor: ACCENT_FILL }}
            >
              Browse verified listings
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div id="device" className="mt-14 lg:mt-16">
          <p className="text-sm font-semibold text-zinc-300">
            Try it: this exact sneaker has {TOTAL_HOTSPOTS} markers our graders check on every pair.
          </p>
          <div className="mt-5">
            <MagnifierDevice found={found} onFound={onFound} />
          </div>
        </div>

        <div id="listings" className="mt-16 lg:mt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            More listings, same proof
          </p>
          <div className="mt-4">
            <ProductCards />
          </div>
        </div>
      </div>
    </section>
  );
}
