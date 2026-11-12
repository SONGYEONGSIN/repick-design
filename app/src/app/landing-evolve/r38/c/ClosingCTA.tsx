import { CONTAINER, ACCENT_FILL, FOCUS_DARK, MUTED_ON_DARK } from "./theme";
import { Eyebrow } from "./ui";

/**
 * Closing CTA — the same `trustTotal(playhead)` value threaded through the
 * Hero and Value section is cited here too, in both the headline and the
 * button label itself, so the page never "goes dead" at the finish line.
 * Reads sensibly at every value: at 0% it reads as an honest starting
 * point ("0% of the trust chain, traced by you"), not a broken sentence.
 */
export default function ClosingCTA({ trustRounded }: { trustRounded: number }) {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#0B0B0F" }}>
      <div className={CONTAINER}>
        <Eyebrow tone="dark">YOUR OWN SCRUB, YOUR OWN NUMBER</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,1.4rem+1.3vw,2.75rem)] font-extrabold leading-[1.1] text-white">
          <span className="font-mono tabular-nums">{trustRounded}%</span> of the trust chain, traced by you.
        </h2>
        <p className="mt-5 max-w-[520px] text-base font-normal leading-[1.6]" style={{ color: MUTED_ON_DARK }}>
          Drag the scrubber above through all six stages and watch the ledger close completely, or
          jump straight to listings that have already run the full distance.
        </p>
        <div className="mt-8">
          <a
            href="#product-preview"
            className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 motion-reduce:transition-none ${FOCUS_DARK}`}
            style={{ backgroundColor: ACCENT_FILL }}
          >
            View graded listings — {trustRounded}% traced
          </a>
        </div>
      </div>
    </section>
  );
}
