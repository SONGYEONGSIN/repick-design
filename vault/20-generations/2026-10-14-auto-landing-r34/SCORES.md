# auto-landing-r34 — SCORES

## Hard gate (`node scripts/gate.mjs --target web --routes /landing-evolve/r34/<v>`)

| candidate | 1st pass | fix | 2nd pass |
|---|---|---|---|
| a (Match-Weight Reorder) | a11y 96 (`target-size` — ChevronUp/ChevronDown reorder buttons, 16px icon + 2px padding = ~20px, below the 24x24 floor) | added `flex min-h-6 min-w-6 items-center justify-center` to both buttons | **clean** (a11y 100, all gates pass) |
| b (Unlock Your Savings) | **clean on first attempt** (a11y 100) | — | — |
| c (Seller Payout Simulator) | lint 1 error (`react-hooks/set-state-in-effect`, `Reveal.tsx:29`) + sweep `page-overflow` 148px @390px | lint: replaced `useEffect(() => setMounted(true))` with the proven `useSyncExternalStore`-based `useMounted()` hook (copied pattern from candidate a's own `useMounted.ts`, which cleared the same gate cleanly). sweep: added `min-w-0` to the grid-item wrapper feeding the table's `overflow-x-auto` container, since grid items default to `min-width: auto` (= their content's min-content size), which was forcing the grid track itself wide enough to fit the table's `min-w-[480px]` | lint: **resolved**. sweep: **re-failed**, reduced from 148px to 127px but not eliminated |

### Candidate c — root cause of the sweep re-failure (for the record / reassign-queue)
After the `min-w-0` fix, the table's own local scroll container (`<div class="overflow-x-auto">`, `clientWidth: 316px`) is correctly sized and *does* locally scroll the table (`scrollWidth: 480px`), confirmed via computed styles. But `document.documentElement.scrollWidth` (what `sweep`'s `page-overflow` check reads) still read 517px — a genuine Chromium quirk: a plain `overflow-x: auto`/`hidden` container does **not** by itself isolate a wide descendant's layout box from contributing to the *document's* `scrollWidth`, even though it correctly clips/scrolls the *visual* content and correctly reports its own `scrollWidth`/`clientWidth`. Verified empirically:
- `overflow: hidden !important` on the wrapper: `document.documentElement.scrollWidth` **unchanged** (still 517).
- `contain: layout` added to the same wrapper: `document.documentElement.scrollWidth` **drops to 390** (table's own local scroll still works, `div.scrollWidth` stays 480 > `clientWidth` 316).
- Confirmed root is the `<table class="min-w-[480px]">` specifically (hiding it via `display:none` alone also brings `document.documentElement.scrollWidth` to 390).

**Prescribed fix for reassignment** (two independently-sufficient options, pick one): (a) add `contain: layout` (or `className="... [contain:layout]"` in Tailwind arbitrary-property form, or the `contain-layout` utility if this Tailwind version ships one) to the `overflow-x-auto` wrapper div — minimal, one line, verified to work. (b) drop the `min-w-[480px]` + local-horizontal-scroll pattern entirely and use `table-fixed` + `<colgroup>` percentage columns instead (this repo's own established convention for dash data tables per `page-brief-core` §4 — "데스크톱 테이블 가로 스크롤바 금지 — `min-w` 강제 대신 `table-fixed` + % 열 배분"), letting the 6 columns compress to fit 390px instead of relying on scroll. Option (a) is the smaller/safer patch since it preserves the candidate's existing visual design; option (b) is more aligned with repo convention for dash but this is a landing page, where the brief doesn't explicitly ban local mobile table scroll, so (a) is likely preferable — defer to the next designer's judgment.

Per skill §3, this is a genuine re-failure after the one permitted fix-and-regate cycle → **candidate c dropped**, not carried to judging. Logged to `reassign-queue.md`.

## Post-judgment refinement (§3-1) on winner a

Lens 1 (the dissenting lens) found a's interaction count fell short of the brief's explicit "minimum
4 distinct interactions" floor — grepped a's files and found only 3: the reorder device (drag +
up/down buttons, same mechanism), scroll-triggered `Reveal`, and the live re-sorting product grid
(itself a consequence of the device, not independently counted). This is a mechanical brief-compliance
gap, not a matter of taste that lens2/lens3 weighed in their winning rationale.

Fix: added a `<details>/<summary>` disclosure to each compact (Hero) product card, revealing the
existing `reasoningByLeadChip` text that was previously only shown in the separate expanded
Product Preview cards. Purely additive — no change to ranking math, data, or anything lens2/lens3
cited. Re-gated clean (10/10, a11y 100, 0 violations). Ranking not recalculated, per skill §3-1.
