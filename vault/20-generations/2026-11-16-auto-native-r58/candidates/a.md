# Candidate a — Search Preset Priority

Check string: "Search Preset Priority"

A buyer who has saved several named search presets ("Under $50, Like New",
"Nearby Pickup Only", "Designer Outerwear"...) needs a way to say which one
wins when a single new listing matches more than one of them, so the right
notification copy and urgency get attached. This screen turns that into an
explicit, rank-ordered list: six presets, each row showing its name, a
one-line plain-English summary of its filter criteria, and a live count of
listings it currently matches, with up/down arrow controls (no drag gesture)
to move a preset higher or lower in priority. The screen tracks a `savedOrder`
baseline and a `workingOrder` the buyer is actively rearranging; a bottom band
is entirely absent while the two match, and appears the instant they diverge
with a real "Save priority order" action and a "Reset" affordance, derived
from one comparison of the two id arrays rather than a separately-tracked
dirty flag. This is a new interaction mechanic for the gallery — no prior
round implements ranked list reordering via discrete up/down taps.

## Brief gaps

- ① How many presets to show, and whether any preset data (name, criteria
  summary, match count) is fixed or would plausibly come from a server.
  ② Six presets, each with a hand-written filter summary and a fixed
  deterministic match count (4–21), all defined in `data.ts` as a
  `Record<PresetId, SearchPreset>` keyed by id, with the ordering kept as a
  *separate* array of ids rather than baked into the record.
  ③ General convention: keeping unordered attribute data and ordering
  concerns in separate shapes is what makes `savedOrder`/`workingOrder`
  comparable by simple array-of-ids equality, which the brief explicitly asks
  for ("deep-equal by id sequence").

- ① Whether disabled up/down arrows should be visually dimmed via `opacity`
  (RN's usual disabled-button idiom) or restyled some other way, since the
  brief only requires an accessible reason, not a specific visual treatment.
  ② Kept full opacity but recolored the glyph itself to `tokens.color.border`
  (the same muted tone used for dividers) rather than dimming the whole
  44×44 touch target, so the disabled state reads clearly without implying
  the row itself is unavailable.
  ③ Arbitrary choice, made to keep the row's other info (name, summary,
  match count) at full legibility even for the top/bottom row, since the
  opacity in RN's `Pressable` would otherwise fade the whole subtree if
  wired through `style` at the row level.

- ① What exactly should be announced in the single `accessibilityRole="alert"`
  text when the band appears (the brief says "the transition announced via
  the live-region rule" but doesn't give copy).
  ② "Priority order changed. Save to apply it, or reset to revert." — stated
  as one sentence naming both available next actions, matching the pattern
  used for blocked-workflow bands elsewhere in the brief ("why progress is
  blocked" + what resolves it), adapted to a non-blocking dirty-diff context
  (nothing is actually blocked here — the sentence instead states what
  changed and what the two band actions do).
  ③ General convention from section 3 of the brief (state-machine bands
  "state... why... AND jump to the next point"), adapted since this band
  form is dirty-diff, not state-machine, so there is no "next unresolved
  point" — only a diff to resolve.

- ① Whether to show any post-save confirmation (e.g. a transient "Saved"
  toast) once `savedOrder` snaps to `workingOrder` and the band disappears.
  ② No confirmation surface — the band's disappearance (clean state, no
  visible band at all) is itself the full signal that the save succeeded,
  with no secondary element.
  ③ Arbitrary choice, made to respect the brief's explicit instruction that
  only one live region may exist on the screen; adding a second transient
  banner for the "just saved" moment would have required either reusing the
  same live-region container in a way not described by the brief, or adding
  a second one, which the brief forbids outright.
