# auto-landing-r29 — SCORES

Target: landing · Round: auto-landing-r29 · Date: 2026-10-01
Frozen-source hash (all 3 candidates, pre-gate): `72d7a1ed302e29b729db65076be65e54b6266444`

## Hard gate — pass 1

| Candidate | result |
|---|---|
| a (Caliper — slider→leaderboard) | lint error 1 (`react-hooks/refs`, `ui.tsx:88` — reading `prevOrderRef.current` inside a `useMemo` callback) | **1-fix** |
| b (Gatelist — toggle→gate-chain) | **clean pass, no violations** |
| c (repick — match constellation) | sweep `cell-overlap` ×4 at 390px (fallback match-table: "Match %"↔"Why this match" by 2px; "Condition"↔product-name ×3 rows by 4px) | **1-fix** |

## Hard gate — pass 2 (1-fix)

| Candidate | result |
|---|---|
| a | **PASS.** Moved the rank-delta diff computation out of `useMemo` (ref read during render) into a `useEffect` + `useState`, preserving the documented first-paint-all-zero-deltas behavior. Re-gate: lint 0, all gates pass. |
| c | **PASS.** Re-balanced `<colgroup>` percentages (Need 19→22%, Listing 33→28%, Why 32→34%), switched shrink-to-fit buttons to `w-full whitespace-normal break-words` so overflow wraps instead of spilling into the neighbor column. Re-gate: sweep 0 overflow, all gates pass. |

All three candidates survive — no drops this round.

## Screenshots

48 frames (16×3), 0 blank. All three candidates scroll at every width (full 5-section landing pages, unlike dash's viewport-locked shells).

## Judge panel (3 survivors: a, b, c)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| 1 — brief/DNA compliance | **a** | b | c |
| 2 — commercial polish | **b** | a | c |
| 3 — archetype differentiation | **c** | b | a |

**Complete 3-way split on 1st place** — each lens picked a different candidate. Per `curation-criteria.md` "3파전 동률 tie-break 예외" (2026-07-25): default is brief-lens (lens1) priority, UNLESS the archetype lens (lens3) ranked lens1's top pick **dead last**, in which case that candidate is excluded and lens1's preference is re-applied among the remaining two.

- Lens1's top pick: **a**.
- Lens3 ranked **a dead last (3rd)** — exclusion condition holds.
- Re-applying lens1's ranking among the remaining {b, c}: lens1 ranked b (2nd overall) above c (3rd overall).
- **Winner: b.**

This is the same tie-break mechanism applied in `auto-native-r27` (where the exclusion condition did NOT hold and the default lens1-priority applied directly) — this round is the first time in recent history the exclusion condition itself fires.

## Winner: b (Gatelist)

- Lens1: zero violations found.
- Lens2: ranked b 1st, with one minor cosmetic ding (three consecutive identical "remain" counts in the gate-chain table read as "three gates doing nothing" at a glance, though the underlying logic — inactive gates carry the previous count forward — is correct and documented).
- Lens3: ranked b 2nd, no rule violations, only a cross-candidate copy-template observation (see LEARN below) implicating b and a jointly, not a disqualifying issue for either.

**No §3-1 post-judgment fix needed** — no lens identified an unresolved rule violation in b.

## Variety axes (winner b)

`{ "theme": "light", "accent": "green", "face": "wide" }` — per this round's free assignment (no banList constraints; landing banList was empty for all three axes going into this round).
