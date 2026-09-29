# auto-dash-r32 — SCORES

Frozen-state hash (surviving candidates a+c, `.tsx`/`.ts` concatenated post-fix, `shasum`): `8dd56e3058693f678843fc1dac90201296cb873c`

Environment note: `a11y`/`perf` (Lighthouse) report `unavailable` for all candidates — no CDP path wired in this sandbox even with `PW_CHROMIUM_PATH`/`CHROME_PATH` set to the pre-installed Chromium. `page-brief-repo` §5 defines `unavailable` as pass (not hard fail); real a11y/perf were not machine-verified this round.

| candidate | route | pass | fix rounds | outcome |
|---|---|---|---|---|
| a — Tripwire (fraud signal-wall) | `/dash-evolve/r32/a` | ✅ | 1-fix (sweep: cell-overlap/table-overflow in the expanded panel's case-table, caused by an `sm:grid-cols-2` sub-grid halving its width — removed the split so the table always gets the panel's full width; re-gated clean) | survives to judging |
| b — Census (waffle ticket console) | `/dash-evolve/r32/b` | ❌ | 1-fix attempted (3 lint errors fixed — `set-state-in-effect` via render-time state-reset pattern, `prefer-const`, unused import; sweep `table-overflow` 154px persisted across all 12 tested desktop widths after the fix) → **re-failed, dropped per §3 "재실패 시 탈락"** | dropped, not judged |
| c — Loopback (returns process map) | `/dash-evolve/r32/c` | ✅ | clean first pass (10/10) | survives to judging |

## Candidate b — why it was dropped, and the real root cause (for `reassign-queue.md`)

The failing gate call bundled 4 violations: 3 real lint issues (fixed) and 1 sweep `table-overflow` (154px, identical across all 12 desktop widths 1264–1920). My first fix hypothesis — the slide-over drawer's `translate-x-full`-when-closed panel leaking into `document.scrollWidth` via its `fixed inset-0` ancestor lacking `overflow-hidden` — was wrong: adding `overflow-hidden` to that wrapper did not change the violation at all (identical 154px, identical width list).

A targeted Playwright snapshot at rest (fresh load, no interaction) showed **zero overflow** (`document.documentElement.scrollWidth === window.innerWidth`) — the slide-over panel was correctly parked off-screen. This means the violation only manifests after an **interactive state change** that sweep's browser session triggers as part of its combined sweep+focus pass (per `page-brief-core` §2, the focus gate opens states like command palettes/toggles to check focus in revealed states) — specifically, once a category is pinned and the slide-over opens with a real `TicketTable` inside it.

The likely actual mechanism: `ticket-table.tsx`'s `<table className="w-full min-w-[520px] ...">` sits inside the drawer panel (`sm:w-[460px]`, with `px-5` padding reducing usable width further), wrapped in its own local `relative overflow-x-auto` container — which should, in principle, contain the 520px table's overflow locally. Empirically it doesn't fully contain it once the drawer is actually open and interacted with. I did not get a second attempt to isolate the exact leak point (table→local-scroller→drawer-panel `overflow-y-auto`-without-explicit-`overflow-x`→outer wrapper) since the skill's 1-fix budget was already spent on the lint fixes + the (ineffective) outer-wrapper change.

**For a future reassignment**: don't rely on the table's local horizontal scroll inside a 460px-wide drawer at all — either (a) shrink `ticket-table.tsx`'s column set/widths so the table's real minimum comfortably fits within ~420px (drawer width minus padding) without needing `min-w-[520px]`, or (b) widen the drawer panel itself. Verify with an actual interactive Playwright trace (open the drawer via a real click, *then* read `document.documentElement.scrollWidth`) rather than a fresh-load snapshot, since the bug is invisible at rest.

Candidate b's concept (dominant 10×10 waffle + on-demand slide-over, area/proportion-as-value grid) and its selection-fanout design (pin vs. fully-local hover, verified structurally sound per its self-report) are otherwise intact — the failure is a narrow, well-isolated layout bug, not a defect in the form itself. Registered in `reassign-queue.md`.

## Gate detail (post-fix, surviving candidates)

| gate | a | c |
|---|---|---|
| route | pass | pass |
| types | 에러 0 | 에러 0 |
| static | 위반 0 | 위반 0 |
| lint | 위반 0 (clean after 1-fix) | 위반 0 |
| weights | 3종 (렌더 실측) | 3종 (렌더 실측) |
| sweep | 전 폭 오버플로 0 (after fix) | 전 폭 오버플로 0 |
| focus | 포커스 표시 0건 누락 | 포커스 표시 0건 누락 |
| console | 26건 · 결함 0 | 26건 · 결함 0 |
| a11y | unavailable (pass) | unavailable (pass) |
| perf | unavailable (pass) | unavailable (pass) |

2 candidates (a, c) survive to judging (§4) — normal 3-lens majority-vote judging applies (skill: "생존 후보 2개 이상일 때").
