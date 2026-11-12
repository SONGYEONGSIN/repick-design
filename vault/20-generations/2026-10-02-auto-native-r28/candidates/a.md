# auto-native-r28 — candidate a

## 1. Concept

**Appeal Your Suspension** (`AccountAppealScreen`) — a suspended repick user
files a written appeal against an account suspension: pick the reason that
matches their situation, write a substantive explanation, optionally attach
suggested evidence references, and submit for trust-and-safety review.

## 2. Render-check string

```
Appeal Your Suspension
```

This is the screen's `accessibilityRole="header"` main title, rendered
unconditionally in the default (empty-answers) state — real JSX text, not
backfilled after the fact.

## 3. Band form: blocked-workflow state machine

Files: `native/src/evolve/r28/a/AccountAppealScreen.tsx`, `data.ts`.

- **Gate inputs**: (a) a required single-select appeal reason
  (`APPEAL_GROUNDS`, 5 fixed options), (b) a written explanation that must
  clear `MIN_STATEMENT_CHARS = 120` (a real, meaningful minimum — not just
  "non-empty"), (c) optional evidence references (up to `MAX_EVIDENCE_REFS =
  3`, drawn in order from a fixed `EVIDENCE_LIBRARY` — they never gate the
  band).
- **Band states** (`deriveLane` in the screen file): `needGround` →
  `needDetail` → `ready` → `filed`. Each blocked state's band sentence names
  exactly what's missing ("Select the reason...", "Add N more characters...")
  and is recomputed, never a generic error.
- **Band tap always does something real, never a dead disabled control**:
  blocked states scroll to (and, for the explanation step, focus) the
  unfinished section; `ready` actually files the appeal (creates a
  deterministic reference and snapshots the answers); `filed` scrolls back
  to the top. There is no inert disabled button sitting with no explanation.
- **Live, continuously recomputed score** (technique 1): `computeCaseStrength`
  in `data.ts` is a pure function of the *same three inputs* the band gates
  on (ground picked, explanation length, evidence count) and renders as a
  live-updating "Case strength" meter (0–100, tiered label) above the form —
  it moves on every keystroke/selection, not just at submit time.
- **Auto-retraction on edit after submit** (technique 2): `isFiled` is
  derived every render as `filing !== null && sameAnswers(filing.snapshot,
  answers)` — there is no separate boolean that edits could leave stale.
  The instant any answer changes after filing, the comparison fails and the
  lane falls back through the normal `needGround`/`needDetail`/`ready`
  logic, with the band sentence explicitly saying the prior filing
  (by reference number) was withdrawn because the answers changed, before
  restating the current requirement or inviting a resubmit.

## 4. Accessibility / DNA checklist

- Exactly **one** `accessibilityLiveRegion="polite"` on the whole screen —
  the band's outer `View`. Exactly one `accessibilityRole="alert"` — the
  band's status sentence `Text`, which is the only element whose content
  actually changes meaning on a state transition.
- The live case-strength meter is **not** a second live region: it carries a
  plain (non-live) `accessibilityLabel` summarizing the score/tier, so a
  single edit that moves both the meter and the band message only fires one
  announcement.
- No `accessible={true}` on any wrapper that contains interactive children —
  the radiogroup container, the strength card, and the chip row are all
  plain `View`s with no `accessible` prop; their nested `Pressable`s stay
  independently reachable.
- Every `accessibilityHint` describes something the handler actually does:
  "Scrolls to the appeal reason selection", "Files your appeal for review by
  the trust and safety team" (sets real local state visibly reflected as the
  `filed` lane), "Scrolls back to the top of your filed appeal". Nothing
  promises an unsimulated side effect (no claimed emails, no claimed backend
  timing beyond what's shown on screen).
- Touch targets: ground rows (`minHeight: 44`), band button
  (`minHeight: 48`), add-reference button (`minHeight: 44`), chip-remove
  (`hitSlop: 10`). Visible pressed-state feedback (`opacity` changes) on
  every `Pressable`.
- Tokens only: all color/spacing/radius come from `tokens.color.*` /
  `tokens.space()` / `tokens.radius.*` (`../../../tokens` from this folder
  depth). No hardcoded hex. `accentBg` used only for the selected-ground row
  background (selection emphasis), never as a flood background.
- Determinism: no `Math.random`, `Date.now`, or bare `new Date()` anywhere.
  The mock appeal reference (`buildAppealReference`) is derived only from
  the chosen ground id and statement length. All copy is English-only.
- RN idioms: `View`/`Text`/`Pressable`/`SafeAreaView`/`StyleSheet.create`,
  `TextInput` for the one free-text field needed. The reason list (5 fixed
  items) and evidence chips (≤3) are mapped inline per the "short fixed
  list" carve-out — no oversized list needed a `FlatList` here.

## Brief gaps

① **No `FlatList` anywhere.** Every list on this screen (5 appeal reasons,
≤3 evidence chips, ≤5 evidence library entries) is short and fixed, which
GENERATION.md explicitly carves out as inline-`.map()`-safe. ② Decided this
rather than force a `FlatList` for a 3–5 item list, since a virtualized list
over 3 items adds no real benefit and the doc's own wording anticipates
exactly this case.

① **TextInput import**, not mentioned in GENERATION.md's RN-idiom import
line. ② The screen's gate explicitly requires free-text entry (a written
explanation with a minimum character count), which has no non-`TextInput`
RN equivalent — omitting it would make the described flow impossible to
build, so I treated it as an obviously-required primitive alongside the
doc's listed imports.

① **Band tap behavior while blocked** — I had the band, when tapped in a
blocked state, scroll to (and for the explanation step, focus) the
unfinished section rather than no-op. ② GENERATION.md §3 says a valid band
"(b) when pressed, moves to the next incomplete point" — I read this
literally as a navigation action the band performs on tap, which also avoids
the disabled-button-with-no-recourse anti-pattern the same section warns
against, and gives the always-tappable `Pressable` a real, honest effect in
every lane (matching the hint-honesty rule in §4).

① **Evidence is reference-by-label, not actual file upload.** "Add
reference" cycles through a fixed `EVIDENCE_LIBRARY` of plain-text
descriptions rather than opening a real attachment/camera flow. ②
GENERATION.md doesn't cover file pickers, and this environment has no real
filesystem/media-library API to back a genuine upload; a fake "upload"
button with an honest hint would have nothing truthful to say about where
the file goes. Modeling it as "reference this evidence" (a claim the user is
attesting to, reviewed manually) keeps every `accessibilityHint` on this
screen true to what the handler actually does, per the hint-honesty rule.

① **Mock appeal reference format** (`APL-<3-letter ground code>-<3-digit
length tag>`) is synthesized client-side from the two answers, not a
backend-assigned id. ② With no backend in this mock, GENERATION.md's
determinism rule (no randomness/clock) left me to either hardcode one static
reference (which would be identical across completely different appeals,
reading as broken) or derive it from the user's own inputs — I chose the
latter so two different appeals produce two different, but still
reproducible, references.
