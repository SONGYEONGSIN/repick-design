# Lens 1 (DNA/brief compliance) — auto-landing-r45

## Ranking
1. **c** — the only candidate whose entire live proof (price, match%, grade, verified badge, discount badge, savings handle) is visible at scroll 0 on *both* desktop and mobile, and its accent (lime) is the textbook case of the brief's "compute your own deviation" rule, executed correctly.
2. **a** — equally rigorous formula/token discipline and a correctly-wired live CTA, but the single most important proof number (net payout) is clipped below the fold on desktop and effectively absent on mobile at scroll 0.
3. **b** — same correct "device lives inside Hero" structure and the most careful two-tier accent implementation, but by default (no answers chosen) *zero* numeric proof is visible at scroll 0 on either breakpoint — worse fold compliance than a, even though its null-state CTA copy is the most honest of the three.

No candidate hard-fails any of the checked doctrines; this is a ranking on degree of compliance, not pass/fail.

## Per-candidate detail

### a — "Live Payout Receipt" (sky accent)

**Hero/fold rule**: The `Receipt` component (the product proof: item, grade badge, verified badge, 5 line items, net payout) is rendered *inside* `Hero.tsx` itself, in the same grid as the controls (`app/src/app/landing-evolve/r45/a/Hero.tsx:63-65`), not a separate section — structurally correct per the `r16/c` precedent in design-principles.md §Landing 구조 기본형. However, the screenshots show this isn't fully realized at scroll 0: `shots/a-1440.png` cuts off the "Shipping credit" and "Net payout" rows (the actual headline proof number is below the fold even on desktop), and `shots/a-390.png` shows only the controls (price slider, grade selector) at scroll 0 — the receipt card is entirely off-screen except a one-line "PAYOUT RECEIPT" header sliver. So while the device is correctly embedded in the Hero component, the specific number the brief cares about (the proof) does not actually clear the fold in either screenshot.

**Live-value-reaches-CTA**: Confirmed by live reference, not a literal. `page.tsx:15` computes `receipt = computeReceipt(price, gradeId)` and `page.tsx:58` passes `netPayout={receipt.netPayout}` into `ClosingCTA`; `ClosingCTA.tsx:13` interpolates `{formatUsd(netPayout)}` directly into the heading, and `ClosingCTA.tsx:16-17` copy explicitly says the figure "is read straight off the receipt you just built above." `shots/a-1440-s100.png` and `-390-s100.png` show `$75.66`, matching `computeReceipt(85, "excellent")`.

**Causal consistency**: `SocialProof.tsx:37-40` explicitly labels its three stats "historical totals, fixed at publish time — only the receipt in the section above moves," avoiding a blanket liveness claim. No contradiction found.

**Ghost-number contrast**: `ValueSplit.tsx:44-51` renders an `aria-hidden` "9%" ghost numeral using `GHOST_TEXT` = `text-[#6B6B78]` (`tokens.ts:41-46`), documented at 3.74:1 — this is literally the repo's own documented remedy cited in design-principles.md §Layout/밀도 for this exact background. The quote-mark ghost in `SocialProof.tsx:15` reuses the same token. Both render at ≥24px (clamp 6–9rem, and text-5xl), clearing the large-text 3:1 floor. Compliant.

**Accent tiers**: Single hue (sky), used sparingly — eyebrow/icons/links at `text-sky-400` (9.17:1 on BG per `tokens.ts:16-21`), button fill at `sky-700` with white text (5.94:1, `tokens.ts:25-26`), and the receipt's "Net payout" bar at `sky-400` fill with dark-ink text (`Receipt.tsx:173-184`, `ON_ACCENT_LARGE_TEXT`) — all computed and documented in `tokens.ts:16-28`. One deviation from the brief's literal "small text on fill → white" convention: `GradeSelector.tsx:38` uses `peer-checked:bg-sky-400 peer-checked:text-[#0B0B0F]` for small (`text-xs`) chip labels, i.e. dark ink rather than white on a filled accent at small size — but the candidate's own math shows this exact pair at 9.17:1 (`tokens.ts:19-20`, "dark ink on sky-400 fill … same pair, reversed"), clearing AA at every size, so the choice is sound even though the token file's own comment conservatively says to reserve it for "large/non-text only."

**Weights/display/English**: Exactly 400/600/800 observed throughout the files read; `DISPLAY` = `--font-display-grotesk`, Latin headline/figures only, never body (`tokens.ts:53-60`). All copy is English.

### b — "Match Reasoning Tree" (rose accent)

**Hero/fold rule**: `ReasoningTree` is rendered inside `Hero.tsx` (`app/src/app/landing-evolve/r45/b/Hero.tsx:43-46`, `lg:col-span-7`), same structural placement as the brief's precedent — correct in principle. In practice it fails the fold worse than a: `shots/b-1440.png` shows only "Start" and Q1 at scroll 0, with Q2 cut off and Q3 plus the leaf (the actual proof — sellers/days) entirely off-screen; `shots/b-390.png` shows Q1–Q3 prompts but the leaf result box is below the fold too. Because the default `Answers` state is `EMPTY_ANSWERS` (`data.ts:70`, no questions pre-answered), there is literally no computed proof number visible at scroll 0 on either breakpoint — a stricter failure of "증명만 폴드 안에 둔다" than a, which at least shows a populated (if partially clipped) receipt by default.

**Live-value-reaches-CTA**: Confirmed. `page.tsx:20` computes `match = computeMatch(answers)`, `page.tsx:57` passes `match={match}` to `ClosingCTA`, which at `ClosingCTA.tsx:17-19` interpolates `match.sellers`/`match.days` live when non-null. Notably, rather than ever substituting a fake/hardcoded number for the unanswered state, `ClosingCTA.tsx:36-43` renders distinct, honest copy ("No path lit yet — three questions stand between you and a match") — this is the cleanest avoidance of the "hardcoded literal pretending to be live" anti-pattern among the three candidates, directly on-point with the design-principles.md r13 anecdote about `Top match now 96%` being a dead literal.

**Causal consistency**: `ValueSplit.tsx:38-40` explicitly flags its ghost numeral (`TOTAL_PATHS` = 27) as "a fixed count of branches, not a live figure," and `SocialProof.tsx:45-47` states its three stats "do not move when you click the tree above." No contradiction.

**Ghost-number contrast**: `GHOST_TEXT` = `text-zinc-500` (`tokens.ts:38-41`), computed 4.07:1 against BG, used only at large sizes (`ValueSplit.tsx:45`, `SocialProof.tsx:21`, both ≥24px). Compliant.

**Accent tiers**: This candidate has the most precise two-tier execution of the three — full-saturation `#E11D48` reserved for fills/large text (white-on-fill computed 4.70:1, `tokens.ts:10-23`), and a derived lighter tint `#FB7185` (7.30:1) used for all small text/icons/focus rings (`tokens.ts:25-32`, `ACCENT_TEXT`), exactly matching design-principles.md's prescribed pattern ("소형 텍스트·아이콘·포커스 링: … 밝은 틴트를 파생").

**Weights/display/English**: 400/600/800 observed; `DISPLAY` = `--font-display-mono`, Latin headline only (`tokens.ts:47-49`). Body-width constants are derived from the repo's own 0.44em-per-glyph formula rather than `ch` (`tokens.ts:51-55`), correctly following the Spacing §-mandated method. All copy English.

### c — "Meet in the Middle" (lime accent)

**Hero/fold rule**: Best compliance of the three. `SavingsSplit` — the full live proof (both panels: repick price, strikethrough retail price, match% badge, grade+verified badges, discount badge, 3 secondary category prices, and the live "Save $X" drag handle) — is rendered directly inside `Hero.tsx` (`app/src/app/landing-evolve/r45/c/Hero.tsx:25-27`), and because `discount` defaults to `DISCOUNT_DEFAULT = 42` (`data.ts:8`) rather than an empty/null state, the device shows real computed numbers immediately. `shots/c-1440.png` and `shots/c-390.png` both confirm the entire interactive proof is visible without any scrolling, on desktop and mobile alike.

**Live-value-reaches-CTA**: Confirmed. `page.tsx:51` passes `discount={discount}` into `ClosingCTA`, which at `ClosingCTA.tsx:8-9` recomputes `repickPrice`/`savingsAmount` from that live prop (not a literal) and interpolates them at `ClosingCTA.tsx:16-18`. `shots/c-1440-s100.png`/`c-390-s100.png` show "$278 … $202 gap," matching `repickPrice(480,42)=278` and `savingsAmount=202`.

**Causal consistency**: `ClosingCTA.tsx:21-23` explicitly distinguishes the live figure from "the buyer quotes and the closed sale above," which "are historical and don't move with it" — and `SocialProof.tsx:8-10` computes `CLOSED_SALE`'s own discount independently from its own two fixed numbers, "never from the shared discount state," with an explicit comment guarding against exactly the contradiction the brief warns about. `ValueSplit.tsx:21-24` ("The gap doesn't reset at the fold") directly paraphrases the brief's own doctrine. This is the most self-aware causal-consistency handling of the three.

**Ghost-number contrast**: `GHOST_TEXT` = `text-zinc-500`, 4.07:1 documented (`tokens.ts:31`), used at ≥24px (`ValueSplit.tsx:44-50`, `SocialProof.tsx:21`). Compliant.

**Accent tiers**: This is the clearest real-world instance of design-principles.md's "accent 계열은 자유다 … 계산해 기록" clause. `tokens.ts:16-23` computes, for the lime-500 fill specifically, that white-on-fill is 1.98:1 (fails even the 3:1 floor) and documents the required override to dark-ink text (9.93:1) for every filled surface — `ON_ACCENT_FILL_TEXT`, used consistently at `SavingsSplit.tsx:156-159` (match badge, small text) and `SavingsSplit.tsx:209-213` (drag handle, small text) and the header CTA (`page.tsx:40`). Small text/icons elsewhere use the lighter tint `#BEF264` directly on BG (15.04:1, `tokens.ts:24`), matching the tier pattern. This is exactly the documented-deviation process the brief asks for, done correctly.

**Weights/display/English**: 400/600/800 observed. Zero display faces — a documented, brief-valid choice (`tokens.ts:41-44`, "catalog treats '0 display faces' as a valid outcome"); headline uses plain `font-extrabold` Pretendard. All copy English.

**Minor non-doctrine note**: `SavingsSplit.tsx:113` marks the large "{discount}%" readout `aria-hidden="true"`, hiding a plainly-informative live number from assistive tech (redundant with the slider's own `aria-valuetext` at `SavingsSplit.tsx:202`, but still a slightly unusual choice). This isn't a contrast violation (the text itself is fully legible) and isn't one of the doctrines this lens was asked to check, so it isn't scored, but it's worth a second lens's attention if robustness/a11y scoring looks at `aria-hidden` usage more broadly than color-contrast.

## Unchecked scope
- No `lint`/`tsc`/`route`/`console`/`a11y`/`perf` gate output was read — this lens judged source + screenshots only, not hard-gate results, which the brief says run separately.
- Did not view the ValueSplit/SocialProof mid-scroll sections in any candidate's screenshots directly (only scroll-0 and fully-scrolled `-s100` shots were provided); ghost-number and accent-fill contrast in those sections was verified from the documented hex math in each `tokens.ts`, not from pixel-level screenshot inspection.
- Did not interact with any candidate live (no clicking through b's quiz, dragging a's slider/c's divider, or expanding "show the math"/"why this grade deducts") — all interaction-state claims (e.g. b's answered-state CTA copy, a's expandable deduction detail) are verified from source code only, not rendered screenshots of those states.
- Did not exhaustively grep every file in each candidate's folder for stray `font-bold`/`font-medium` classes, non-English strings, or `<img>`/`unoptimized` usage beyond the files explicitly read (page.tsx, Hero, ClosingCTA, tokens, data, and the primary interactive-device component per candidate); weight-count and English-only conclusions are based on that sampled read, not a full-repo static scan.
- Did not check keyboard/focus-visible behavior beyond reading the `FOCUS_RING` token definitions and their application sites in the files read — did not Tab through any candidate.
- Did not compare any candidate against prior rounds' catalog for the "diversity avoidance" axis (accent-hue reuse across the broader catalog) — only this round's three candidates were compared against each other and against design-principles.md.
