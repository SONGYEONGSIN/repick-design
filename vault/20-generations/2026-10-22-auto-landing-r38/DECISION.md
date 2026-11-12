# DECISION — auto-landing-r38

Target: landing. Round budget: `node scripts/round-budget.mjs 2` → **1** (미채움 PAGE_TYPES 큐 0종 — 18/18 types already catalogued, so `N≥2`'s coverage rationale no longer applies). Called with the intended N=2 for this scheduled run, but the script forced N=1 and that is logged here per skill §0-0-1 as required when the caller's N is reduced.

Target selection: `PAGE_TYPES` unfilled-type check → 0 unfilled → uniform random among `[dash, landing, native]` → **landing**. Not a Monday (2026-10-22 is UTC Thursday), so the native weekly-cycle override did not apply.

Round number: `auto-landing-r38` (max existing `auto-landing-r*` + 1).

Agent-availability check (§0-0): confirmed — Agent tool present, used for 3 independent designer dispatches and 3 independent judge-lens dispatches. No `self_judged` deviation to disclose.

Reassign-queue (§1): "대기 중" section empty for `landing` at RETRIEVE time — no reassignment consumed this round.

SHA-1 of frozen candidate sources (concatenated `.tsx`+`.ts`, a+b+c), taken before hard-gate and unchanged through judging: `6b3a274185232a0f60199fe37bb39ccbe85a2da2`.

## Hard gate

All three candidates passed 1차 하드게이트 전 항목 클린 — **1-fix 불요**. Full table in `SCORES.md`. No `blockedBy` cross-candidate failures (web target, routes are isolated per candidate).

## Infrastructure note — sandboxed-environment artifact (not a candidate defect)

Mid-judging, LENS 2 initially penalized candidate **b** for appearing to have broken/blank product photography in its screenshots. I verified independently (`curl` against this session's egress proxy) that `images.unsplash.com` is blocked at the network-policy layer of this specific sandboxed execution environment (403 "host is not allowed for this session" — the same blanket policy also blocks `cdn.jsdelivr.net`, `www.google.com`, and other non-allowlisted hosts; it is a fixed environment policy set when this session's container was created, not something any candidate's code caused or could avoid). `page-brief-core.md` §3 and `scripts/dash-static-check.mjs` both explicitly endorse fixed-ID `images.unsplash.com/photo-<id>` hotlinking as a compliant, controlled-content pattern already used throughout this catalog — candidate b's use of it was not itself a mistake, and in a normal (non-sandboxed) deployment those photos render.

I sent a correction to all three judge-lens agents before they finalized. Lens 2 (whose verdict actually rested on this) revised its ranking from `a > b > c` to `b > a > c` once corrected. Lenses 1 and 3 confirmed their own verdicts never relied on image-render fidelity (lens 1's findings against `b` were source/DOM-structural — a gradient scrim and a top-left absolute badge-over-photo pattern — not about whether the photo pixels loaded; lens 3's novelty judgment was based on device mechanics, not photo rendering) and reported no change needed. This is logged per this catalog's own repeated lesson ("계측이 틀리면 그 위에 쌓은 서사도 틀린다" — if an instrument is wrong, the narrative built on it is wrong too): the correction was applied before any lens's output was treated as final, not after.

## Judge panel (3 lenses, blind, parallel)

Frames given: `<v>-1440.png` (scroll 0) · `<v>-1440-s35.png` · `<v>-1440-s70.png` · `<v>-1440-s100.png` · `<v>-390.png` (mobile, scroll 0), plus full source read access and each candidate's `candidates/<v>.md` writeup.

### Lens 1 — brief/DNA compliance: **a > c > b**

All three pass every zero-tolerance mechanical check identically (English-only copy confirmed via Hangul grep — zero hits in all three; no broken `font-[var(...)]` bracket bug; exactly 3 rendered weights; no badge-on-photo for the four named proof badges; manipulation-survives-to-closing-CTA doctrine satisfied literally by all three CTA button labels; ≥4 substantive interactions; single h1; no raw `<img>`/serif/blueprint ornament).

What separated them:
- **a** — cleanest, no anti-slop findings. Proof-card row and device both inside Hero's own grid. Full site shell (skip-link, sticky header/nav, footer). Rose accent contrast math thorough. Self-corrected a `width`-animation to `transform:scaleX` before finalizing. Weakness: like b, its Hero's 3-card proof row is not visible without scrolling at 1440×900.
- **c** — only candidate whose hero fold shows a proof card without scrolling at 1440×900 (literal "스크롤 없이 보여야" compliance), but only 1 card inside Hero (richer 3-card row lives in a separate section below) — a shortfall against "매물 병렬 카드"(plural) wording vs. a/b. Strongest a11y craft (separated continuous `aria-valuetext` from stage-crossing-only `aria-live` announcements; dodged the `dl`/`dt`/`dd` nesting trap by using a real `<table>`; contained mobile table scroll). Starts at playhead=0 (0% trust, all rows "Pending") — a literal instance of the exact failure mode `design-principles.md` warns against, rescued architecturally by the always-full `ProofStrip` card beneath it, but undocumented why an empty default was chosen over a primed one.
- **b** — strong engineering (reveal=50 default specifically chosen in source to avoid an empty first paint — the best-reasoned handling of this concern among the three), but 2 real anti-slop-adjacent findings: a gradient scrim on the device photo (`SplitDevice.tsx:134-138`, the only gradient use found across all three) and a "Live AI read" pill absolutely positioned top-left directly on the photo (`SplitDevice.tsx:183-188` — not one of the 4 named proof badges, so not a strict violation, but reproduces exactly the risk pattern the badge-placement rule exists to prevent). Also the only candidate with no header/nav/skip-link.

Unseen scope: did not check 1280/1366/1600/1920 widths (relied on the automated sweep) or 390px at scroll 70/100%; did not execute the app or interact with sliders/radiogroups; spot-checked but did not script-verify all WCAG contrast claims.

### Lens 2 — commercial polish (Linear/Stripe/Vercel benchmark): **b > a > c** (revised from `a > b > c` after the sandbox-image correction above)

- **b** — 1st (post-correction). Confident dark teal/cyan theme, richest mechanism (two real input axes — listing tabset + continuous drag-divider — over real photography with hand-placed annotation boxes, not evenly-spaced filler), non-trivial reveal=50 default (76% confidence, one flagged box, by default), most dramatic/specific closing CTA and social-proof copy.
- **a** — 2nd. Most disciplined visual craft, genuine radiogroup device, deliberate non-trivial default tier, most literal end-to-end CTA threading. Caps out below b because its flat SVG/icon product art (a safe, principled choice to avoid load-failure risk) is a less persuasive demonstration of "AI reads your actual item" than b's real-photo-plus-live-overlay device.
- **c** — 3rd, unchanged by the correction (c also uses flat SVG art, not photography — the correction doesn't touch it). Weakest finish-line: playhead defaults to 0, every captured frame at both widths shows "0% trust accumulated" and a closing CTA literally reading "View graded listings — 0% traced" — the least persuasive number the device can produce, for the default no-interaction visitor experience that is what the screenshots actually show.

Unseen scope: never saw b's real photos render (sandbox-blocked both before and after correction) — its assessment of actual photo/UI integration quality is inferred from source structure and the repo's own endorsement of the pattern, not empirical confirmation; did not literally drag/scrub any device (all three devices' interactive state is static across the provided scroll-reveal frames); did not re-examine 1280/1920px frames in the revision pass.

### Lens 3 — form/archetype differentiation: **c > b > a**

All three clear the re-skin test — no candidate reproduces an existing archive (input×output) pair; this is not a no-winner case.
- **a** ("single-select ordered-tier radiogroup → segmented comparison bar") — genuinely new, no matching pair found (only unrelated native-round tier-ish hits). Ranked 3rd because its input space is the least dynamic (discrete click vs. continuous drag/scrub) and its output (tick-marked comparison bar) is closest in spirit to the catalog's already-common duel/comparison-strip devices, even though the specific shape is unprecedented. Most independently executed of the three — zero macro-grid/accent-hex/headline-template overlap with b or c.
- **b** ("drag-divider × listing-tabset dual input → continuously re-based confidence/price/annotation-reveal") — genuinely new; confirmed distinct from `r37/c`'s circular-magnifier-over-one-fixed-illustration (b uses a full-frame divider over 4 real photos with continuous, re-basing confidence vs. r37/c's monotonic 5-hotspot found-count). Ranked 2nd: before/after drag-reveal is a familiar generic web pattern outside this catalog even though absent from it internally, and b sits in the densest convergence cluster with c (see below).
- **c** ("continuous 1D scrub over a strictly-ordered timeline → itemized running-subtotal ledger table") — genuinely new and the cleanest case: confirmed distinct from `r37/b`'s any-order click-chain-with-snapping-progress-ring (c's input is continuous/ordered, not discrete/any-order; its output interpolates mid-stage into a real receipt table, not a snapping score). Ranked 1st as the most structurally unprecedented on both input and output axes.

**New convergence observation** (logged to delta, see §5): b and c — despite genuinely distinct devices — independently landed on the identical `lg:grid-cols-12` 5/7 hero split with the same bordered-wrapper pattern, the identical accent hex `#0E7490` via the identical "tried 600, failed AA, stepped to 700" reasoning, and near-identical two-clause imperative headline templates ("Drag the ___. / Watch ___ ___."). Zero convergent-phrase recurrence otherwise (`"Each card carries its own evidence"`/`"Every card carries its own proof"`/`"Browse verified listings"` all grepped clean across all 3 candidates). Does not disqualify either candidate's device-level novelty; factors into the relative ranking only.

Unseen scope: did not read full device-component source for Ladder/SplitDevice/ScrubLedger line-by-line (focused on Hero for grid-skeleton verification + writeups + screenshots); did not run the pages live; used targeted keyword greps across all ~37 landing rounds rather than reading all ~111 prior writeups exhaustively; did not check scroll states beyond 0/70/100% desktop and 0% mobile; did not re-verify contrast/font-weight claims (outside this lens's mandate, already covered by the automated gate).

## Aggregation

1st-place votes: **a=1 (lens1) · b=1 (lens2) · c=1 (lens3)** — a complete 3-way split, no simple majority.

Tie-break applied per `curation-criteria.md` "주간 반증 판정 기준" ②: *완전 동률 시 brief 렌즈 우선을 유지하되, archetype 렌즈가 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief 1위 재적용* (on a complete tie, the brief-compliance lens's pick wins by default — UNLESS the differentiation lens explicitly ranked that pick last, in which case it is excluded and the brief lens's next-highest remaining pick applies).

- Brief lens (lens1) pick: **a**.
- Differentiation lens (lens3) ranking: `c > b > a` — **lens3 explicitly ranked a last (최하위)**. Exception triggers.
- a is excluded. Lens1's next-highest pick among the remaining {b, c}, per its own stated order `a > c > b`, is **c**.

## WINNER: c — "The Clock"

Continuous horizontal scrub timeline (native `<input type="range">`) over a 6-stage strictly-chronological item lifecycle, driving a live, mid-stage-interpolating "trust accumulation" value and an itemized receipt/ledger `<table>` that fills proportionally as the playhead advances — threaded to the Hero stat, the Value section, and the closing CTA's own text/button label.

No §3-1 "정제 조치" (post-judgment rule-violation fix) required for the winner — none of the three lenses found a hard-gate-adjacent rule violation on candidate c specifically; its cited weaknesses (single proof card vs. plural, zero-state default) are completeness/polish judgment calls already weighed into the ranking, not rule violations to fix before promotion. Candidates a and b remain in their routes, unpromoted; b's two source-level findings (gradient scrim, top-left photo badge) are noted here for future reference but are not disqualifying and are not this round's job to fix (no reassignment is warranted — both were judged competitively, not gate-failed).

## Variety axes (recorded to ledger)
theme: light (two embedded dark instrument panels) · accent: cyan `#0E7490` · face: `--font-display-mono`.
