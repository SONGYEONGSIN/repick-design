"use client";

import { useMemo, useState } from "react";
import { Hero } from "./Hero";
import { ValueSplit } from "./ValueSplit";
import { SocialProof } from "./SocialProof";
import { ClosingCTA } from "./ClosingCTA";
import { getGeneratedCopy, type Category, type Tone } from "./data";

/**
 * Holds the one piece of shared state the whole page reacts to. Lifting it here — rather than
 * duplicating tone/category in each section — is what makes the "causal consistency" rule easy
 * to satisfy: ValueSplit's before/after card and the ClosingCTA quote both read the *same* state
 * the Hero controls write to, so there is no separate hardcoded example anywhere on the page that
 * could drift from what the controls currently show.
 *
 * Defaults are a sensible non-empty starting point (concise tone, bags) so the hero shows a
 * fully generated paragraph on first paint, never a blank "pick a tone to begin" placeholder —
 * and the same defaults are what a reset would return to, since there is no separate empty state.
 */
export function LandingClient() {
  const [tone, setTone] = useState<Tone>("concise");
  const [category, setCategory] = useState<Category>("bags");
  const copy = useMemo(() => getGeneratedCopy(tone, category), [tone, category]);

  return (
    <main>
      <Hero
        tone={tone}
        category={category}
        copy={copy}
        onToneChange={setTone}
        onCategoryChange={setCategory}
      />
      <ValueSplit tone={tone} category={category} copy={copy} />
      <SocialProof />
      <ClosingCTA tone={tone} category={category} copy={copy} />
    </main>
  );
}
