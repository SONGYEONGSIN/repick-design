# DECISION — auto-landing-r48

Round 2 of this scheduled session's two requested back-to-back `/dash-evolve` invocations (unattended, 2026-11-05). Round 1 was `auto-native-r49` (winner c, "Seller Onboarding Checklist", clean 2:1), committed+pushed (`f907619`) before this round began.

## §0 Round budget
`node scripts/round-budget.mjs "2"` returned **N=1** again (0 unfilled `PAGE_TYPES`). Only 1 round runs per invocation per the skill's own rule — this invocation fulfills the scheduled task's 2nd requested round as a standalone call.

## §0 Agent-tool availability
Confirmed available — used for all 6 subagent dispatches (3 blind `general-purpose` designers, 3 blind `general-purpose` judges; this environment has no registered custom designer/comparator agent type). Not self-judged (`self_judged: false`).

## §0 Target selection
Target drawn uniformly over `[dash, landing]` — `native` excluded since round 1 of this session already drew it (per the skill's sequential-round rule: "이번 실행에서 이미 생성한 타입은 제외"). Draw landed on **landing**. Thursday — no native-cadence relevance (landing isn't subject to that rule anyway).

Round number: max existing `auto-landing-r*` + 1 → **r48**.

## §0 Reassign-queue consumption
`vault/00-principles/reassign-queue.md` "대기 중" had entry **#21** (`auto-landing-r47/c`, "Allocation Flow") pending for `target: landing`. Consumed as candidate **a** — the exact fix instruction from the queue entry (separate absolutely-positioned hit-box overlay with a fixed `min-h-6`/24px floor, decoupled from the diagram's own fluid vertical scale) was embedded verbatim in the designer's prompt. Per queue convention, only 1 entry consumed this round; candidates b and c were free assignments.

## §1 RETRIEVE
Read in full: `design-principles.md` (landing profile — BRIEF), `page-brief-core.md` (core, read every round regardless of target), `page-brief-repo.md` (web-target-only, language/font/build-command bindings), `curation-criteria.md`, `colors.catalog.md`, `motion.catalog.md`, `ux-guidelines.catalog.md` (web/both sections — reused from round 1's read), `landing-deltas-provisional.jsonl` (81 entries, r1-r47 — summarized, established doctrines extracted), last 5 `auto-landing-r*` ledger entries (r43-r47), and `reassign-queue.md` landing entries.

`node scripts/catalog-variety.mjs` run — overall catalog theme/accent/face distribution reviewed (65 works: dark 36/light 29; accent led by amber/teal 8 each; face led by Pretendard 29). Per `design-principles.md`'s own stated practice, the actionable diversity signal is the **last-winners' consecutive-streak / last-2-winners'-face** rule, not the raw overall distribution: last 3 landing winners (r45 dark/lime/none, r46 dark/sky/grotesk, r47 light/amber/mono) showed no consecutive-theme streak and no repeated accent, but the last 2 winners' display faces (grotesk, mono) were excluded this round per the stated "최소한 직전 2라운드 승자가 쓴 활자는 제외" rule — leaving only `--font-display-wide` and "no display face" available; assigned accordingly (a=wide [preserved from its reassignment], b/c=none).

**Dedup survey**: delegated to a research-only `fork` sub-agent (per this project's own established pattern for landing RETRIEVE, e.g. `r46`'s precedent) to survey all 21 production `(marketing)/v6-v26` pages plus all `landing-evolve/r23-r47` candidates (23 round-dirs) and classify every device by input-axis × output-axis (per `design-principles.md`'s own "Q6 판정" framework). The fork confirmed "Priority Ranking Composer" (an initially-considered device) was saturated (4+ prior instances: `v11`, `v22`, `r25/c`, `r34/a`, `r40/a`) and confirmed "Time Window Retention Curve" (reframed as "Time Window Trend Curve" to avoid a secondary thematic collision with `r25/a`) as novel. **The orchestrator then substituted a third device, "Trade Path Simulator," for the now-rejected slot without re-running the dedup check against that specific substitute** — this gap and its consequence are detailed below (§4, new `questions-queue.md` Q75).

## §2 GENERATE
3 candidates:
- **a** — "Sorting Yield" (reassignment #21, Sankey-style flow diagram, light/rose/`--font-display-wide`, hit-box fix instruction applied verbatim).
- **b** — "Trade Path Simulator" (2-step branching decision tree → lit path + compounding payout/days-to-cash, dark/blue/no display face).
- **c** — "Sell-Through Window" (dual-handle time-range selector → live-clipped trend chart + headline days-to-sell stat, light/emerald/no display face).

Each designer received the full assembled brief (DNA, color-contrast-usage rules with the corrected white-vs-dark-ink-on-accent-fill direction, typography, accessibility including the dead-focus-idiom warning, the 0.44em body-width constant, the full landing structure skeleton with the hero-fold and causal-persistence-to-CTA rules spelled out in detail, forbidden list, machine-checked hard rules) **in the prompt body itself**, not file paths, per this project's established "designer reads the assembled brief, not links" lesson. Designer a additionally received the original `r47/c` implementation path as a read-only reference (explicitly instructed not to edit it, build fresh in a new folder) plus the exact root-cause/fix-pattern explanation.

Freeze hash (`cat landing-evolve/r48/*/*.tsx landing-evolve/r48/*/*.ts | shasum`): **`9b47eb480347b27d4638d8a0a0fc5bd1973a5388`** — unchanged from registration through gate through screenshot capture through judging (re-verified after gate).

## §3 HARD GATE
Dev server started fresh at `:3100` (first run in this container's continuation of the session). `node scripts/gate.mjs --target web --routes /landing-evolve/r48/a /landing-evolve/r48/b /landing-evolve/r48/c`: **10/10 clean on the first attempt** — `pass: true`, `violations: []` (route/types/static/lint/weights-3종/sweep/focus/console/a11y-100/perf-67). Zero candidates used their 1-fix. Full table in `SCORES.md`.

## §4 JUDGE
48 screenshots (4 widths × 4 scroll points × 3 candidates) via `scripts/capture-shots.mjs`, zero blanks, zero capture errors. Orchestrator visually spot-checked the 1440px scroll-0 frames before dispatch — all 3 render real, distinct, non-blank content.

**Environment artifact noted and excluded from judging**: all 3 candidates use `images.unsplash.com` product photos, which render as empty/gray boxes in this sandbox (outbound network to that host confirmed blocked via `curl`, connection failure). This is a documented prior-session artifact (`questions-queue.md` Q49), not a candidate defect, applies uniformly to all 3 — all 3 judge prompts explicitly instructed not to penalize any candidate for this.

3-lens blind panel (3 independent `general-purpose` Agent-tool subagents, no cross-lens visibility, `candidates/*.md` withheld from all 3, each given a curated 4-frame-per-candidate budget — 1440 scroll-0, 1440 mid-scroll, 1440 late-scroll, 390 scroll-0 — plus full source access):

| lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — brief/DNA compliance | **c** | b | a |
| lens2 — commercial completeness | **c** | b | a |
| lens3 — differentiation | **c** | a | b |

**Unanimous 3-0 for c.** No tie-break needed. **WINNER: c — "Sell-Through Window"**.

Full per-lens reasoning and evidence: see `SCORES.md` (condensed) and this session's conversation log for the complete verbatim subagent reports.

### Major finding — non-winner b, reassignment of unverified novelty claim (new `questions-queue.md` Q75)
Lens3's mandatory independent per-candidate catalog search found that candidate b ("Trade Path Simulator") structurally duplicates `landing-evolve/r45/b` ("Match Reasoning Tree": `ReasoningTree.tsx`+`LitLine.tsx`) under this project's own input-axis × output-axis framework — sequential multi-level single-choice tree traversal → animated lit-path diagram + one resolved terminal value — despite different domain copy (buyer match-reasoning vs. seller trade-path) and minor mechanic differences (3-level hard-locked vs. 2-level always-visible-dim).

**Root cause**: the pre-GENERATE dedup research fork verified 2 device candidates; one was rejected as saturated and the orchestrator substituted a replacement device **on the spot, without re-running the dedup check against that specific substitute**. This is a new instance of the same failure class as `questions-queue.md` Q58 (dash) and Q66 (landing) — a dedup survey's findings going stale relative to what actually gets assigned. New entry **Q75** filed documenting this, disposition: record only, no skill/brief edit this round (consistent with the no-canon-edit invariant and this project's "don't promote on a single instance" discipline).

This did not require re-judging or invalidate anything — lens3 caught it within its normal blind-panel mandate (verify novelty claims independently, don't trust labels), and all 3 lenses independently placed c 1st regardless, so b's loss is overdetermined and not contingent on this one finding.

### Other non-winner findings (recorded, not queued — both non-winners passed the hard gate clean 10/10; per this project's established disposition, pure judgment-stage losses are not reassign-queue candidates even when a real bug or collision is found)
- **a**: hero-fold proof is device-only (Sankey diagram), the actual 4-badge product-preview cards are a sibling section not visible until ~35% scroll (lens1); 390px band-label crowding from fixed-12px HTML sized against a viewBox percentage, visible by default (lens2); minor grammar nit ("a 89%"→"an 89%").
- **b**: hero proof has only 3/4 badge types (no discount%) (lens1); the below-fold "Four listings your estimated payout could cover" static product list is not gated against the live payout, so after clicking to a lower-payout path the page can show an unaffordable item as affordable — a real, verified, interaction-triggered contradiction of its own "nothing is estimated after the fact" copy (lens2).

No post-judgment §3-1 fix needed on winner c — zero defects/violations cited against it by any lens; freeze hash unchanged throughout.

## §5 LEARN
1 new L1 delta appended to `landing-deltas-provisional.jsonl` (confidence: medium — single round, but independently corroborated by lens1 and lens2 reaching the same 1-2-3 order via different criteria), round `auto-landing-r48`, variant `c`: sharpens the existing hero-fold product-proof doctrine (established `r16`, refined `r45`/`r46`) — graded by **product-card badge completeness** (how many of match%/grade/verified/discount are present and visible without scrolling), not merely whether *some* live device/proof is inside the Hero component.

## §6 지식 정제 게이트
No existing provisional delta makes a matching reproduction claim for this round's delta — it's a refinement of an already-well-established L2/L3-adjacent doctrine (hero-fold rule has multiple prior L2 entries: `r16`, `r45`, `r46`), but this specific "badge-completeness grading" angle is new, so **no promotion to L2 this round** (single instance of this specific angle, consistent with the 2-3-round reproduction bar). `questions-queue.md` Q75 filed (see §4) — disposition: record only.

## §7 Canon / invariant confirmation
`vault/00-principles/design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, `dash-brief-v3.md`, all type profiles, the `/dash` gallery, `/v1`-`/v5`, and the production `(marketing)/v6`-`v26` catalog — **fully untouched**. `landing-deltas-provisional.jsonl` — append-only (1 new entry). `questions-queue.md` — append-only (1 new entry, Q75). `reassign-queue.md` — append-only edit (#21 moved from "대기 중" to "아카이브," not a canon edit). No commits to `main` — all work on `evolve/dash`.

**This completes both of this scheduled session's two requested rounds** — round 1 = `auto-native-r49` (winner c, "Seller Onboarding Checklist," clean 2:1), round 2 = `auto-landing-r48` (winner c, "Sell-Through Window," unanimous 3-0). 0 candidates dropped at hard gate across either round, 0 no-winner rounds, canon fully unchanged throughout both.
