# auto-dash-r65 — SCORES

Target: dash · round 1/1 (round-budget.mjs forced N=1 — see DECISION §0).

## Source hashes (frozen before judging)

| v | product | hash (pre-fix) | hash (post-fix, judged) |
|---|---|---|---|
| a | Tracewave (APM/tracing console) | `98666649b450a5675989095afe53b8514664e44b` | same (no 1-fix needed) |
| b | Harborwatch (content-moderation queue) | `d9b5218f43af5fbae25137dfb862926cef6d91a5` | same (no 1-fix needed) |
| c | Fulcrum (workforce/headcount planning) | `278b92531f2ccbf00db8773e3c87806fe4f04e25` | `ea5b5096557d2eef188ebcbb573bfc4d8f0b9bb6` (post 1-fix) |

## Hard gate (`node scripts/gate.mjs --target web --routes /dash-evolve/r65/<v>`)

| gate | a | b | c (1st pass) | c (2nd pass, post 1-fix) |
|---|---|---|---|---|
| route | pass | pass | pass | pass |
| types | 에러 0 | 에러 0 | 에러 0 | 에러 0 |
| static | 위반 0 | 위반 0 | 위반 0 | 위반 0 |
| lint | 위반 0 | 위반 0 | 위반 0 | 위반 0 |
| weights | 3종 (렌더 실측) | 3종 (렌더 실측) | 3종 (렌더 실측) | 3종 (렌더 실측) |
| sweep | 전 폭 오버플로 0 | 전 폭 오버플로 0 | 전 폭 오버플로 0 | 전 폭 오버플로 0 |
| focus | 0건 누락 | 0건 누락 | 0건 누락 | 0건 누락 |
| console | 26건 · 결함 0 | 26건 · 결함 0 | 26건 · 결함 0 | 26건 · 결함 0 |
| a11y | **100** | **100** | **FAIL** — `label-content-name-mismatch` | **100** |
| perf | 83 | 90 | 83 | 89 |
| **verdict** | **pass** | **pass** | **fail** | **pass** |

### c — 1-fix detail
Lighthouse (both mobile and desktop presets, extracted directly via `npx lighthouse --only-categories=accessibility`) flagged the same node on both presets:
`components/Topbar.tsx:95` — the account-menu `<button aria-label="Account menu">` wraps a visible `InitialsAvatar` rendering the literal text "PN" (`CURRENT_USER.initials`), which is not a substring of the accessible name "Account menu" — hard-fails `label-content-name-mismatch` (page-brief-core §2 absolute-ban list) regardless of score.

This is the exact catalog-documented pattern from the `auto-dash-r38/b` → `r39/a` reassignment archive: *"account/avatar menu buttons must not pair custom descriptive text with initials without including the initials literally, or must drop the custom label and let content supply the name."*

**Fix applied**: `aria-label="Account menu"` → `` aria-label={`${CURRENT_USER.initials} — Account menu`} `` (literal `"PN — Account menu"`), so the visible text is now a substring of the accessible name. No other change. Re-gated — clean 10/10, `a11y` 100, no new violations introduced (no style/behavior change, so 순위에 영향 없음 — this is a straightforward "규칙 위반 해소" 정제, not scored prior to this gate pass since c never reached judging in its first-pass state).

All three candidates survive to §4 JUDGE with 2+ survivors (all 3).
