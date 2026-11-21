# Candidate c — Seller Tier Progress & Milestones

A read-only tier-status screen: a fixed hero block shows the seller's current tier and a progress meter toward the next tier, a filterable `FlatList` lists milestone badges (achieved/pending, each expandable for detail), and a persistent bottom bar lets the seller share their tier once, with the bar's label and accessibility label both flipping to an explained "already shared" state the instant it's used.

## Brief gaps

1. ① Number and names of tiers. ② Four tiers: Starter (0 sales) → Trusted (50) → Veteran (250) → Elite (600). ③ Arbitrary but kept small/skimmable (4, like the brief's own Bronze/Silver/Gold/Platinum example) and renamed away from the brief's literal example names since it called them illustrative ("or similar").

2. ① Exact progress-meter formula. ② `(completedSales − currentTierThreshold) / (nextTierThreshold − currentTierThreshold)`, clamped to [0,1], with 1.0 and a "highest tier reached" message once there's no next tier. ③ Arbitrary but the only formula that makes the meter always read 0% right after entering a tier and 100% right before the next one — matches how the onboarding-checklist screen (read for RN idiom only) derives status from a single snapshot number rather than storing a separate progress field.

3. ① Number and mix of badges, and which are earned vs. pending. ② 12 badges total, 7 achieved / 5 pending, covering sales-count milestones, service-quality milestones (reply time, shipping speed, rating streak), and community-behavior milestones. ③ Arbitrary; sized to be clearly "a real list worth virtualizing" per the brief, while keeping both filter buckets non-empty so the filter control is demonstrably live.

4. ① Exact filter control shape and wording. ② A 3-segment control ("All" / "Achieved" / "Pending") rather than a cycling single button or a progress-sort toggle. ③ Brief offered both as options ("e.g. toggle... or sort by progress"); segmented control is the more directly verifiable "it actually re-filters the live data" implementation and needed no extra invented copy for a cycle-state description.

5. ① Status vocabulary — "earned/locked" (brief's own example wording) vs. something else. ② Used "achieved" / "pending" instead. ③ Arbitrary rename once the brief flagged its own example words as illustrative; "pending" also reads better than "locked" here since nothing is actually blocking the seller from working toward it (unlike a true locked/sequential checklist).

6. ① What the one working action bar action actually does and what its completed state says. ② "Share your tier status" → once pressed, becomes "Shared to your profile", disabled, with both the button's accessibilityLabel and a single live-region caption explaining the badge is now visible on the public profile. ③ Brief's own suggested example ("Share my tier"); the specific confirmation copy and the decision to make it a one-time, not-reversible-in-this-UI action (rather than a toggle you can re-share/un-share) is an arbitrary choice to give the "already done" state real, singular meaning.

7. ① Whether badge rows get an expand/collapse affordance. ② Yes — every row expands to show either the achieved-at detail or the pending requirement note, using a plain "+"/"−" glyph hidden from the accessibility tree and `accessibilityState={{ expanded }}` on the row's own single Pressable (no nested controls). ③ Brief explicitly allows this pattern and gives the exact a11y pairing to use; added it because milestone screens in other apps commonly hide the "why locked" detail until tapped, keeping the default list scan short.

8. ① Icon treatment for badges (brief bans emoji, requires vector/geometric or Text glyphs). ② A filled circle per badge with a 1–3 character Text glyph (e.g. "FS", "5★", "100") instead of a bespoke SVG-style icon set. ③ Arbitrary but consistent with the read-only reference screen's own status-icon circle idiom, and keeps all 12 badges visually distinct without hand-drawing 12 unique vector icons.
