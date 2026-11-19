import { formatDuration, personaById, stageLabel, totalDays, type PersonaId } from "./data";
import { DISPLAY, Eyebrow, PrimaryButton, Reveal, SectionFolio } from "./ui";

/**
 * Closing CTA. Both cited figures (`totalDays`, the payout stage via `stageLabel`) are computed
 * from the SAME persona the hero's segmented control set and the SAME data.ts functions
 * StageTimeline and ValueSplit already used -- this is a restatement, not a second number.
 */
export default function ClosingCta({ personaId }: { personaId: PersonaId }) {
  const persona = personaById(personaId);
  const total = formatDuration(totalDays(personaId));
  const payout = stageLabel(personaId, "payout");

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <SectionFolio n="05" />
          </div>
          <div className="mt-4 max-w-[640px]">
            <Eyebrow tone="bright">Ready as a {persona.label.toLowerCase()}</Eyebrow>
            <h2
              className="mt-4 text-[clamp(1.9rem,4.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.02em] text-zinc-50"
              style={DISPLAY}
            >
              Your path: <span className="tabular-nums">{total}</span> total,{" "}
              <span className="tabular-nums">{payout.toLowerCase()}</span>.
            </h2>
            <p className="mt-5 max-w-[492px] text-[16px] font-normal leading-[1.6] text-zinc-300">
              That's the real timeline for a {persona.label.toLowerCase()} on repick right now —
              listing through payout, not a marketing estimate. Switch the persona at the top of
              the page any time to see your own path recompute.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryButton href="#hero-persona">Pick your persona</PrimaryButton>
              <a
                href="#timeline"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-[13px] font-semibold text-zinc-200 transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]"
              >
                Review the full timeline
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
