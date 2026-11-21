import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ACCENT_FILL, FOCUS } from "./theme";
import { TOTAL_HOTSPOTS, confidenceFromFound } from "./hotspots";

/**
 * Closing copy is a live function of `found`, never a hardcoded
 * placeholder — it reads the same shared state the hero device writes to,
 * and reads correctly both before any interaction (0 found, 0%) and after.
 */
export default function ClosingCTA({ found }: { found: ReadonlySet<string> }) {
  const confidence = confidenceFromFound(found.size);
  const copy =
    found.size === 0
      ? "Every listing carries this same five-point scan before it ever reaches a buyer."
      : `You just confirmed ${found.size} of ${TOTAL_HOTSPOTS} markers yourself — that's a ${confidence}% confidence score on one sneaker. Every listing gets the same scan before it's yours to buy.`;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-[640px] text-[clamp(1.9rem,1.55rem+1.6vw,3.25rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-white">
          See the proof on every item you buy next.
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-base leading-[1.6] text-zinc-300">{copy}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/catalog"
            className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS}`}
            style={{ backgroundColor: ACCENT_FILL }}
          >
            Browse verified listings
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href="#value"
            className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-base font-semibold text-zinc-300 transition-colors hover:border-white/30 hover:text-white ${FOCUS}`}
          >
            See how grading works
          </a>
        </div>
      </div>
    </section>
  );
}
