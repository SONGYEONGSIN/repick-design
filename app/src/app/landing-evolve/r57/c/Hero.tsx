"use client";

import PersonaSelect from "./PersonaSelect";
import StageTimeline from "./StageTimeline";
import ListingCard from "./ListingCard";
import { HERO_LISTING_ID, listingById, personaById, type PersonaId } from "./data";
import { BODY_16, CAPTION, DISPLAY, Eyebrow, PrimaryButton } from "./ui";

type Props = {
  personaId: PersonaId;
  onChangePersona: (id: PersonaId) => void;
};

/**
 * Hero: asymmetric left-aligned headline + subhead + single CTA on the left, the manipulation
 * device (persona select, read close to the headline) and its live output (the compact stage
 * timeline) plus the full four-badge product proof (one ListingCard) on the right -- all of it is
 * a literal descendant of this component, never a sibling section, and all of it carries real,
 * non-zero data by default (the "regular-seller" persona, not an empty state). On mobile this
 * grid stacks into one column in DOM order: headline/subhead/CTA first, device and proof second,
 * so the headline is never pushed off the first screen.
 */
export default function Hero({ personaId, onChangePersona }: Props) {
  const persona = personaById(personaId);
  const heroListing = listingById(HERO_LISTING_ID);

  return (
    <section className="border-b border-zinc-800 px-5 pt-14 pb-14 sm:px-8 lg:px-12 lg:pt-20 lg:pb-16">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left: headline, subhead, persona select, single CTA */}
          <div className="min-w-0 lg:col-span-5">
            <Eyebrow>Sell on repick</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2.1rem,6vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.02em] text-zinc-50"
              style={DISPLAY}
            >
              Know how long your sale takes, before you list it.
            </h1>
            <p className={`mt-6 ${BODY_16}`}>
              Every seller moves through the same four stages, but not at the same speed. Pick the
              seller you are, and the timeline recomputes real days for your exact path.
            </p>

            <div className="mt-7">
              <p className={CAPTION} style={{ color: "#A1A1AA" }}>
                Seller persona
              </p>
              <div className="mt-2.5">
                <PersonaSelect value={personaId} onChange={onChangePersona} id="hero-persona" />
              </div>
              <p className="mt-3 max-w-[400px] text-[13px] font-normal leading-[1.6] text-zinc-400">
                {persona.blurb}
              </p>
            </div>

            <div className="mt-8">
              <PrimaryButton href="#timeline">See the full timeline</PrimaryButton>
            </div>
          </div>

          {/* Right: the live device (compact timeline) + the full product proof (one listing card) */}
          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-2xl border border-zinc-800 p-5 sm:p-6" style={{ backgroundColor: "#12141A" }}>
              <p className={CAPTION} style={{ color: "#A1A1AA" }}>
                {persona.label} — selling-journey timeline
              </p>
              <div className="mt-4">
                <StageTimeline personaId={personaId} variant="compact" />
              </div>
            </div>

            <div className="mt-5">
              <p className={`${CAPTION} mb-2.5`} style={{ color: "#A1A1AA" }}>
                A live listing on repick · not tied to the persona above
              </p>
              <div className="max-w-[420px]">
                <ListingCard listing={heroListing} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
