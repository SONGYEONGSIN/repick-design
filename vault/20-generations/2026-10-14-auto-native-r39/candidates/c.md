# Candidate c — Two-Factor Backup Codes

## Concept

An account-security screen that shows the user's 8 fixed one-time 2FA backup codes laid out in a 2-column, fixed-size, wrapped grid of plain `View`s (not a `FlatList`) so every code cell is equally sized and scannable regardless of used/unused state, each cell pairing a letter-spaced monospace-feeling code with an explicit "Available"/"Used" status pill (never color alone); below the grid sits a single global destructive action, "Regenerate Codes," rendered as a bottom band that — instead of spawning a native `Alert` — transforms itself in place inside one `accessibilityLiveRegion="polite"` container: pressing it swaps the band's own content to an inline confirmation prompt (`accessibilityRole="alert"`) with Cancel/Confirm buttons, and pressing Confirm invalidates all 8 codes at once, swaps the grid to a disjoint fixed "regenerated" code set (all unused), and swaps the band again to a "codes regenerated" result (also `accessibilityRole="alert"`, same single live region) with a Done button that returns the band to its idle state.

## Render-check string

Two-Factor Backup Codes

## 브리프에 없던 것 (What the brief didn't specify)

1. ① How many of the 8 codes should be marked "used" in the fixed dummy data, and which specific indices.
   ② Marked exactly 3 of the 8 (codes 2, 4, and 7 in the array) as `used: true`, the rest `false`.
   ③ Arbitrary but deliberate: enough used codes to prove the grid actually renders a mixed state (not all-unused, which would make the used-state styling untestable), while keeping a clear majority (5 of 8) still available, matching how a real account mid-lifecycle would look.

2. ① Whether the grid cells themselves should be individually interactive (e.g. tap a code to copy it) or purely informational.
   ② Made every `CodeCell` a non-interactive, non-`Pressable` `View` — no per-code tap action at all.
   ③ The brief frames "Regenerate Codes" as the screen's one and only action and explicitly warns the destructive band is "GLOBAL (not per-row/per-code)"; adding a silent copy-to-clipboard affordance per cell would invent an unstated side effect and complicate the "leaf-only `accessible`" a11y rule for no requirement in the brief. Keeping cells static also sidesteps the "≥44×44pt only if individually interactive" clause cleanly, since there's nothing to size.

3. ① What happens to the band immediately after a successful regenerate — does it just flash a toast and auto-revert, or sit in a distinct state requiring user action?
   ② Introduced a third band phase, `justRegenerated`, that holds the "All 8 codes regenerated..." alert text plus an explicit "Done" button the user must press to return the band to its idle "Regenerate Codes" state.
   ③ The brief explicitly requires the regenerated state to be clearly shown and announced via the live region, but nothing says it should silently time out (and the house style in this codebase's other destructive-confirm bands, per the GENERATION.md principle, favors explicit user-driven transitions over timers, which also avoids an un-cancelable `setTimeout` interacting badly with fast re-renders).

4. ① Exact code format/alphabet for the 8 backup codes (brief only says "8 fixed alphanumeric codes, monospaced").
   ② Used an 8-character format split as `XXXX-XXXX` with uppercase letters and digits (e.g. `7F3K-9QPL`), and made the post-regenerate set fully disjoint in value from the original set.
   ③ The hyphenated 4-4 grouping is a common real-world backup-code convention (easier to read/transcribe than an unbroken 8-char string) and keeping the two sets disjoint makes the "previous codes are now invalid, here are new ones" swap visually self-evident in a deterministic render rather than relying on a separate "invalidated" flag the brief didn't ask for.

5. ① Whether the monospaced look should come from an actual monospace font family or just letter-spacing/weight, per the brief's own "if alphanumeric, use letter-spacing/weight instead" allowance.
   ② Did both: applied `letterSpacing: 1.5` + `fontWeight: "600"` universally, and additionally layered a `Platform.select` monospace font family (`Menlo` on iOS, `monospace` on Android) as a progressive enhancement.
   ③ The brief explicitly offers letter-spacing/weight as the baseline-safe choice for alphanumeric codes (since `tabular-nums` only helps numeric content), so that's the guaranteed-correct part; the platform monospace font is layered on top only as a nicety since both platforms ship a monospace family out of the box with no new dependency or asset.
