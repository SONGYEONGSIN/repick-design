# auto-dash-r49 — SCORES

Source hash (post-1-fix, pre-judge, frozen state all 3 candidates were gated/screenshotted/judged against):
`61bb8836e2dbbd4bc4afa5a6b446d116cfa19fdc`
(`cat app/src/app/dash-evolve/r49/*/*.tsx app/src/app/dash-evolve/r49/*/*.ts | shasum`)

## Hard gate (`node scripts/gate.mjs --target web --routes /dash-evolve/r49/<v>`)

| Candidate | route | static | lint | weights | sweep | focus | console | a11y | perf | 1-fix used |
|---|---|---|---|---|---|---|---|---|---|---|
| a — Meridian | `/dash-evolve/r49/a` | 0 (after fix) | 0 | 3종 | 0 overflow | 0 missing | 0 defects | **100** | 56 | yes — `no-unlisted-font` (2x `fontFamily: DISPLAY_FACE` variable ref instead of inline `var(--font-display-grotesk)` literal; the static regex requires the literal immediately after `fontFamily:`) |
| b — Flowline | `/dash-evolve/r49/b` | 0 | 0 (after fix) | 3종 | 0 overflow | 0 missing | 0 defects | **100** | 63 | yes — `@typescript-eslint/no-unused-vars` (leftover `NAV` const from an earlier sidebar draft; this shell is deliberately rail-free) |
| c — Ledgerwell | `/dash-evolve/r49/c` | 0 | 0 (after fix) | 3종 | 0 overflow | 0 missing | 0 defects | **100** | 62 | yes — `react-hooks/exhaustive-deps` (`severityRank` object literal recreated in-component; hoisted to module scope `SEVERITY_RANK`) |

All three candidates survived the hard gate on their one allowed fix. No candidate dropped. All three a11y = 100/100 (real Lighthouse, `CHROME_PATH`+`PW_NO_SANDBOX=1` set, not `unavailable`). No blank frames in any of the 48 captured screenshots (16/candidate × 3).

## Judge panel — **self-judged (see DECISION.md §0 for full disclosure)**

No `Agent`/`Task`/`ListAgents`/any subagent-spawn tool was found in this session after exhaustive `ToolSearch` (multiple query variants, see DECISION.md §0). Per `/dash-evolve` §0-0's documented fallback (questions-queue Q47 disposition, 2026-08-30) and this exact repo's own repeated precedent for this failure mode (`auto-dash-r31`, `auto-dash-r48`, and this session's own round 1 `auto-landing-r41`), I proceeded rather than aborting as no-round, generating and judging all 3 candidates myself in three separately-reasoned passes. **This is not a blind independent panel.** `self_judged: true` in the ledger; excluded from `/dash-falsify` promotion per Q47/§3-1.

### Lens 1 — Brief/DNA compliance (dash-brief-v3 + page-brief-core + page-brief-repo)
**Ranking: c > a > b**
- **c** — full app shell (sidebar+topbar), and its decomposition tree satisfies the chart catalog's own accessibility requirement ("키보드 확장/축소, SR가 노드 값+%기여 낭독") directly in the primary surface, with zero gap between "what's shown" and "what's accessible."
- **a** — full app shell, headline always-visible value discipline, clean single-consumer pin correctly documented as the middle (not top) fan-out tier.
- **b** — **real compliance gap**: the brief's app-shell requirement ("좌측 사이드바 + 상단바") is listed under "완성도 기준 ... 전부 적용" (apply to all), not as a shell-variant-conditional item. Candidate b has no sidebar at all — confirmed this is a genuine design choice, not an oversight (the candidate note defends "rail-free" shell design), but checking the catalog precedent (`r46/a` "Threadline", `r46/b` "Relay" — this repo's two prior hero+inline-stats winners) shows **both kept the sidebar**; "rail-free" in their own notes meant no master-detail *entity-list* rail, not no app-shell sidebar. b's reading of its own shell category is broader than precedent supports.
- **Shared, non-differentiating gap (all 3 equally)**: none of the three candidates render a distinct "주요 액션 버튼" in the topbar itself (the brief's app-shell spec lists search+primary-action+notifications+avatar; all three have search+notifications+avatar but no primary action in the topbar — CSV export exists but lives inside each table card, not the header). Logged as this round's LEARN delta candidate below.

### Lens 2 — Commercial completeness (Mercury/Asana/n8n/Coinbase-level polish)
**Ranking: c > a > b**
- **c** — the kanban board + always-expanded tree + two live detail cards reads as the most feature-complete, "alive" product surface of the three; severity badges, owner avatars, and board counts all reconcile with the register table.
- **a** — clean, no empty states (case detail defaults to the highest-risk account, never a placeholder), CSV export and command palette both real and working.
- **b** — also real and working, but two minor completeness gaps: (1) the no-sidebar layout reads more like a single report page than a persistent ops console a team would live in all day — a real product gap for the reference tier (Mercury/Asana/n8n all have persistent section nav); (2) the Transitions table's "Share" column shows `100%` for New→Triage and In Progress→Resolved (each stage's only outgoing edge) — true but uninformative; a shipped product would likely suppress or special-case a single-destination share.

### Lens 3 — Structural / archetype differentiation
**Ranking: c > a > b**
- **c** reaches the catalog's own explicitly-named **top fan-out tier** ("다축 독립 스코프" — two independently-scoped persistent pins, neither resetting the other) — the single most heavily-documented differentiation axis in `dash-brief-v3` itself ("축의 서열이 생겼다: 전면 재계산 < 단일 축 부분 재계산 < 다축 독립 스코프").
- **a** and **b** both land at the clean, honestly-labeled middle tier (single-consumer pin) — correctly *not* overclaimed as top-tier in either candidate's own notes.
- On macro-shell freshness specifically: **a**'s 3-pane-market shell had *never* been paired with anything but a candlestick/price chart in this catalog across 5 prior attempts (`r20/b`, `r29/a`, `r35/a`, `r41/a`, `r42/a`, plus promoted `/dash/d52`, `/dash/d32`) — pairing it with a network graph instead is the freshest shell+chart combination of the three. **b**'s hero+inline-stats shell becomes a 3rd use in 6 rounds after this one (tied with **c**'s board/kanban, also becoming a 3rd use) — both less fresh than **a** on this specific axis, which is why **a** edges **b** here even though both introduce new chart types.
- Verified via `grep -rliE` across `app/src/app/dash-evolve/` and `app/src/app/dash/` (Q58 discipline) before writing any "first in this catalog" language into the candidate notes: network graph (a), process map (b) and decomposition tree (c) have all shipped before in this catalog's full archive (not catalog-first claims), but none of the three specific **shell+chart pairings** used this round collide with any prior round, round-mate, or promoted work.

### Aggregate
**3:0 for c ("Ledgerwell").** A clean sweep is the less common outcome in this catalog's own history (`curation-criteria` Q32: roughly 1 in 6 judged rounds land unanimous) but is not disallowed, and the three lenses converged here on genuinely distinct evidence (app-shell completeness / product-surface richness / fan-out-tier sophistication), not a single repeated argument. No tie-break mechanism was needed.
